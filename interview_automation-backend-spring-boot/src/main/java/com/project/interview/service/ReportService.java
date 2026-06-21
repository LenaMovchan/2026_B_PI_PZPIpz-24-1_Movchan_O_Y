package com.project.interview.service;

import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.project.interview.dtos.statistic.CandidateAverageDto;
import com.project.interview.dtos.statistic.InterviewReportDto;
import com.project.interview.dtos.statistic.QuestionGradeDto;
import com.project.interview.dtos.statistic.TechnicalLevelReportDto;
import com.project.interview.entity.InterviewEntity;
import com.project.interview.entity.InterviewQuestionEntity;
import com.project.interview.enumeration.InterviewStatus;
import com.project.interview.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
@Service
@RequiredArgsConstructor
public class ReportService {

    private final InterviewRepository interviewRepository;

    /**
     * Збір даних для звіту з бази даних
     */
    @Transactional(readOnly = true)
    public InterviewReportDto getReportData(Long interviewId) {
        // Пошук інтерв'ю в БД
        InterviewEntity interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Інтерв'ю не знайдено"));

        // ВИПРАВЛЕНО: Мапимо питання та оцінки безпосередньо з InterviewQuestionEntity
        List<QuestionGradeDto> questions = interview.getQuestions().stream()
                .map(q -> new QuestionGradeDto(
                        q.getQuestion(), // Беремо текст питання прямо з об'єкта q
                        q.getGrade()     // Беремо оцінку прямо з об'єкта q
                ))
                .collect(Collectors.toList());

        // Обчислення середнього балу
        double average = questions.stream()
                .mapToInt(QuestionGradeDto::getGrade)
                .average()
                .orElse(0.0);

        // Формування DTO для звіту
        return InterviewReportDto.builder()
                .interviewTitle(interview.getTitle())
                .candidateName(interview.getSearcher().getFirstname() + " " + interview.getSearcher().getLastname())
                .interviewerName(interview.getInterviewer().getFirstname() + " " + interview.getInterviewer().getLastname())
                .feedback(interview.getFeedback() != null ? interview.getFeedback() : "Відгук відсутній")
                .questions(questions)
                .averageGrade(average)
                .build();
    }

    /**
     * Генерація PDF файлу
     */
    public byte[] generateInterviewReport(InterviewReportDto reportData) throws Exception {
        // 1. Створюємо потік
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();

        // 2. Зв'язуємо writer з документом та потоком
        PdfWriter writer = PdfWriter.getInstance(document, out);

        // ВАЖЛИВО: Шрифт. Якщо розробка йде на Linux (або в Docker),
        // шлях c:/Windows/... видасть помилку.
        BaseFont bf = BaseFont.createFont("c:/Windows/Fonts/arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        Font fontNormal = new Font(bf, 12);
        Font fontBold = new Font(bf, 12, Font.BOLD);
        Font fontTitle = new Font(bf, 18, Font.BOLD);

        document.open();

        // Додавання контенту
        Paragraph title = new Paragraph("ЗВІТ З РЕЗУЛЬТАТАМИ СПІВБЕСІДИ", fontTitle);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" "));

        document.add(new Paragraph("Кандидат: " + reportData.getCandidateName(), fontNormal));
        document.add(new Paragraph("Інтерв'юер: " + reportData.getInterviewerName(), fontNormal));
        document.add(new Paragraph("Тема: " + reportData.getInterviewTitle(), fontNormal));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.addCell(new Phrase("Запитання", fontBold));
        table.addCell(new Phrase("Оцінка", fontBold));

        for (QuestionGradeDto q : reportData.getQuestions()) {
            table.addCell(new Phrase(q.getQuestion(), fontNormal));
            table.addCell(new Phrase(String.valueOf(q.getGrade()), fontNormal));
        }
        document.add(table);

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Середній бал: " + String.format("%.2f", reportData.getAverageGrade()), fontBold));
        document.add(new Paragraph("Коментар інтерв'юера: " + reportData.getFeedback(), fontNormal));

        document.add(new Paragraph(" "));
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"));
        Paragraph footer = new Paragraph("Дата формування звіту: " + now, fontNormal);
        footer.setAlignment(Element.ALIGN_RIGHT);
        document.add(footer);

        // 3. ЗАКРИВАЄМО ДОКУМЕНТ ПЕРЕД ТИМ ЯК БРАТИ МАСИВ БАЙТІВ
        document.close();
        writer.close(); // Також закриваємо writer

        // Тепер потік містить ПОВНИЙ і валідний PDF файл
        return out.toByteArray();
    }

    public byte[] generateTechnicalLevelExcelReport(TechnicalLevelReportDto data) throws Exception {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Technical Level Report");

            // Стилі
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 14);
            headerStyle.setFont(headerFont);

            // 1. ЗАГОЛОВОЧНА ЧАСТИНА
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("АНАЛІТИЧНИЙ ЗВІТ ПРО ТЕХНІЧНИЙ РІВЕНЬ КАНДИДАТІВ");
            titleCell.setCellStyle(headerStyle);

            Row periodRow = sheet.createRow(1);
            periodRow.createCell(0).setCellValue("Період: " + data.getPeriod());

            // 2. ЗМІСТОВНА ЧАСТИНА (Таблиця кандидатів)
            Row tableHeader = sheet.createRow(3);
            String[] columns = {"Кандидат", "Інтерв'ю", "Середній бал"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = tableHeader.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 4;
            for (CandidateAverageDto candidate : data.getCandidates()) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(candidate.getFullName());
                row.createCell(1).setCellValue(candidate.getInterviewTitle());
                row.createCell(2).setCellValue(candidate.getAverageGrade());
            }

            // 3. АНАЛІТИКА (Труднощі)
            rowIdx += 2;
            Row hardRow = sheet.createRow(rowIdx++);
            hardRow.createCell(0).setCellValue("Навички, що викликали найбільші труднощі (min бали):");
            hardRow.createCell(1).setCellValue(String.join(", ", data.getHardestSkills()));

            Row easyRow = sheet.createRow(rowIdx++);
            easyRow.createCell(0).setCellValue("Навички з найкращими результатами (max бали):");
            easyRow.createCell(1).setCellValue(String.join(", ", data.getEasiestSkills()));

            // 4. ЗАКЛЮЧНА ЧАСТИНА
            rowIdx += 2;
            Row footerRow = sheet.createRow(rowIdx);
            footerRow.createCell(0).setCellValue("Дата формування: " +
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")));

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);
            sheet.autoSizeColumn(2);

            workbook.write(out);
            workbook.close();
            return out.toByteArray();
        }
    }

    @Transactional(readOnly = true)
    public TechnicalLevelReportDto getTechnicalLevelData(LocalDate from, LocalDate to) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(LocalTime.MAX);

        // 1. Отримуємо всі завершені інтерв'ю за період
        List<InterviewEntity> interviews = interviewRepository.findAllByStatusAndEndDateTimeBetween(
                InterviewStatus.COMPLETED, start, end);

        // 2. Формуємо список кандидатів та їхніх середніх балів
        List<CandidateAverageDto> candidates = interviews.stream().map(interview -> {
            double avg = interview.getQuestions().stream()
                    .mapToInt(InterviewQuestionEntity::getGrade)
                    .average()
                    .orElse(0.0);

            String fullName = interview.getSearcher().getFirstname() + " " + interview.getSearcher().getLastname();

            return new CandidateAverageDto(fullName, avg, interview.getTitle());
        }).collect(Collectors.toList());

        // 3. Знаходимо найважчі та найлегші навички
        // Збираємо всі оцінки по навичках в одну мапу: Назва -> Список оцінок
        Map<String, List<Integer>> skillGrades = interviews.stream()
                .flatMap(i -> i.getQuestions().stream())
                .collect(Collectors.groupingBy(
                        q -> q.getSkill().getName(),
                        Collectors.mapping(InterviewQuestionEntity::getGrade, Collectors.toList())
                ));

        // Рахуємо середній бал для кожної навички
        Map<String, Double> skillAverages = skillGrades.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue().stream().mapToInt(Integer::intValue).average().orElse(0.0)
                ));

        // Сортуємо: 3 навички з найменшим балом (найважчі)
        List<String> hardestSkills = skillAverages.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // Сортуємо: 3 навички з найбільшим балом (найлегші)
        List<String> easiestSkills = skillAverages.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return TechnicalLevelReportDto.builder()
                .candidates(candidates)
                .hardestSkills(hardestSkills)
                .easiestSkills(easiestSkills)
                .period(from.toString() + " - " + to.toString())
                .build();
    }
}
