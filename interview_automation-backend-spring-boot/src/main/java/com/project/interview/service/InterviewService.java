package com.project.interview.service;

import com.project.interview.dtos.InterviewResultsDto;
import com.project.interview.dtos.QuestionScoreDto;
import com.project.interview.dtos.interview.*;
import com.project.interview.dtos.question.InterviewQuestionGradeRequestDto;
import com.project.interview.dtos.question.InterviewQuestionGradeResponseDto;
import com.project.interview.dtos.question.InterviewQuestionRequestDto;
import com.project.interview.dtos.question.InterviewQuestionResponseDto;
import com.project.interview.dtos.statistic.*;
import com.project.interview.entity.*;
import com.project.interview.enumeration.InterviewStatus;
import com.project.interview.enumeration.UserRole;
//import com.project.interview.feature.GeminiService;
import com.project.interview.mapper.InterviewMapper;
import com.project.interview.mapper.InterviewQuestionMapper;
import com.project.interview.mapper.InterviewerQuestionMapper;
import com.project.interview.repository.InterviewQuestionRepository;
import com.project.interview.repository.InterviewRepository;
import com.project.interview.repository.InterviewerQuestionRepository;
import com.project.interview.repository.SkillRepository;
import com.project.interview.security.oauth2.model.AuthDetails;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InterviewService {

    final InterviewRepository interviewRepository;
    final InterviewQuestionRepository interviewQuestionRepository;
    final InterviewerQuestionRepository interviewerQuestionRepository;
    final SkillRepository skillRepository;
    final UserService userService;
    final UserDetailsService userDetailsService;
    final InterviewMapper interviewMapper;
    final InterviewerQuestionMapper interviewerQuestionMapper;
    final InterviewQuestionMapper interviewQuestionMapper;
//    final GeminiService geminiService;

    public InterviewResultsDto getInterviewResults(Long interviewId) {
        Optional<InterviewEntity> optionalInterviewEntity = interviewRepository.findById(interviewId);
        if (optionalInterviewEntity.isPresent()) {
            InterviewEntity interviewEntity = optionalInterviewEntity.get();
            List<InterviewQuestionEntity> questions = interviewQuestionRepository.findByInterviewId(interviewId);
            String feedback = interviewEntity.getFeedback();

            List<QuestionScoreDto> questionScores = interviewQuestionMapper.toScoreDtoList(questions);
            return new InterviewResultsDto(questionScores, feedback);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview not found");
        }
    }

    public InterviewFullDto getInterviewById(Long interviewId) {
        InterviewEntity interviewEntity = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview not found"));
        List<QuestionScoreDto> questionScores = interviewQuestionMapper.toScoreDtoList(interviewEntity.getQuestions());
        return interviewMapper.toFullDto(interviewEntity, questionScores);
    }

    public InterviewDto createInterview(AuthDetails authDetails, InterviewCreationDto interviewCreationDto) {
        InterviewEntity interviewEntity = interviewMapper.toEntity(interviewCreationDto);
        UserEntity interviewer = authDetails.getUserEntity();
        UserEntity searcher = userService.findById(interviewCreationDto.getSearcherId());
        validateRoles(interviewer, searcher);
        checkForSchedulingConflicts(interviewer.getId(), searcher.getId(), interviewEntity.getPlannedDateTime());
        interviewEntity.setInterviewer(interviewer);
        interviewEntity.setSearcher(searcher);
        InterviewEntity savedInterview = interviewRepository.save(interviewEntity);
        return interviewMapper.toDto(savedInterview);
    }

    private void validateRoles(UserEntity interviewer, UserEntity searcher) {
        if (!userContainsRole(interviewer, UserRole.INTERVIEWER) || !userContainsRole(searcher, UserRole.SEARCHER)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Searcher or interviewer don't have appropriate role");
        }
    }

    private boolean userContainsRole(UserEntity userEntity, UserRole role) {
        return userEntity.getUserRoleSkillEntitySet().stream()
                .map(x -> x.getRole().getName())
                .anyMatch(x -> x.equals(role.toString()));
    }

    private void checkForSchedulingConflicts(Long interviewerId, Long searcherId, LocalDateTime plannedTime) {
        if (plannedTime == null) {
            return;
        }

        LocalDateTime start = plannedTime.minusHours(1);
        LocalDateTime end = plannedTime.plusHours(1);

        boolean interviewerConflict = interviewRepository.interviewerHaveInterviewOn(interviewerId, start, end);
        if (interviewerConflict) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Interviewer already have interview on specified date time");
        }

        boolean searcherConflict = interviewRepository.searcherHaveInterviewOn(searcherId, start, end);
        if (searcherConflict) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Searcher already have interview on specified date time");
        }
    }

    public List<ShortInterviewDto> getInterviewList(AuthDetails authDetails) {
        UserEntity currentUser = authDetails.getUserEntity();
        List<InterviewEntity> interviews = interviewRepository
                .findByInterviewer_IdOrSearcher_Id(currentUser.getId(), currentUser.getId());
        return interviews.stream().map(interviewMapper::toShortDto).toList();
    }

    public InterviewDto updateInterview(Long interviewId, InterviewUpdateDto interviewDto) {
        Optional<InterviewEntity> optionalInterviewEntity = interviewRepository.findById(interviewId);
        if (optionalInterviewEntity.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview not found");
        }
        InterviewEntity interviewEntity = optionalInterviewEntity.get();
        interviewEntity.setTitle(interviewDto.getTitle());
        interviewEntity.setPlannedDateTime(interviewDto.getPlannedDateTime());
        InterviewEntity savedInterview = interviewRepository.save(interviewEntity);
        return interviewMapper.toDto(savedInterview);
    }

    public InterviewDto updateInterviewStatus(Long interviewId, InterviewStatus status) {
        InterviewEntity interviewEntity = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview not found"));
        InterviewStatus.validateStatusTransition(interviewEntity.getStatus(), status);
        if (status == InterviewStatus.FINISHED) {
            interviewEntity.setEndDateTime(LocalDateTime.now(ZoneOffset.UTC));
        } else if (status == InterviewStatus.ACTIVE) {
            interviewEntity.setStartDateTime(LocalDateTime.now(ZoneOffset.UTC));
        }
        interviewEntity.setStatus(status);
        log.debug("Interview id = {} status updated from {} to {}", interviewId, interviewEntity.getStatus(), status);
        return interviewMapper.toDto(interviewRepository.save(interviewEntity));
    }

    @Transactional(rollbackFor = Exception.class)
    public InterviewQuestionResponseDto saveQuestion(AuthDetails authDetails, InterviewQuestionRequestDto questionDto) {
        extractedUserAndCheckRole(authDetails);
        InterviewEntity interviewEntity = getInterviewEntity(questionDto);
        if (!interviewEntity.getInterviewer().getId().equals(questionDto.getInterviewerId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "The interviewer Id for the interview does not match the interviewer Id provided in the request");
        }
        Long interviewId = questionDto.getInterviewId();
        Long skillId = questionDto.getSkillId();
        SkillEntity skillEntity = getSkillEntity(skillId);
        String questionText = questionDto.getQuestion();

        InterviewQuestionEntity interviewQuestionEntity = interviewQuestionMapper.toEntity(questionDto);
        interviewQuestionEntity.setCreateAt(LocalDateTime.now(ZoneId.of("UTC")));
        interviewQuestionEntity.setSkill(skillEntity);

        InterviewerQuestionEntity interviewerQuestionEntity =
                interviewerQuestionRepository.findByInterviewerIdAndSkillIdAndQuestion(
                                questionDto.getInterviewerId(),
                                skillId,
                                questionText)
                        .orElseGet(() -> {
                            InterviewerQuestionEntity entity =
                                    interviewerQuestionMapper.toEntity(questionDto);
                            entity.setSkill(skillEntity);
                            return entity;
                        });
        interviewerQuestionEntity.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
        interviewerQuestionEntity = interviewerQuestionRepository.save(interviewerQuestionEntity);
        log.info("""
                        The question has been successfully saved in the interviewer's question database.
                        Id: {}
                        Skill: {}
                        Question: {}
                        """,
                interviewerQuestionEntity.getId(),
                interviewerQuestionEntity.getSkill().getName(),
                interviewerQuestionEntity.getQuestion());

        InterviewQuestionEntity savedInterviewQuestion;
        if (interviewQuestionRepository.existsByInterviewIdAndSkillIdAndQuestion(interviewId, skillId, questionText)) {
            log.info("Question already exists.");
            savedInterviewQuestion = getInterviewQuestionEntity(interviewId, skillId, questionText);
        } else {
            savedInterviewQuestion = interviewQuestionRepository.save(interviewQuestionEntity);
        }

        log.info("The question has been successfully saved (or it already exists) in the database of interview questions. Id: {}, Skill: {}", savedInterviewQuestion.getId(), skillEntity.getName());
        return InterviewQuestionResponseDto.builder()
                .id(savedInterviewQuestion.getId())
                .skillName(skillEntity.getName())
                .question(questionDto.getQuestion())
                .createdAt(savedInterviewQuestion.getCreateAt().truncatedTo(ChronoUnit.SECONDS))
                .build();
    }

    public InterviewEntity getInterviewEntity(InterviewQuestionRequestDto questionDto) {
        return interviewRepository.findById(questionDto.getInterviewId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview not found with Id: " + questionDto.getInterviewId()));
    }

    public InterviewQuestionEntity getInterviewQuestionEntity(Long interviewId, Long skillId, String questionText) {
        return interviewQuestionRepository.findByInterviewIdAndSkillIdAndQuestion(interviewId, skillId, questionText).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not fount with skill Id: " + skillId + ", question text: " + questionText));
    }

    public InterviewerQuestionEntity getInterviewerQuestionEntity(Long skillId, String questionText) {
        return interviewerQuestionRepository.findBySkillIdAndQuestion(skillId, questionText).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not fount with skill Id: " + skillId + ", question text: " + questionText));
    }

    public void extractedUserAndCheckRole(AuthDetails authDetails) {
        String username = authDetails.getUsername();
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (!userHasRole(userDetails)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Only interviewers can save questions/(graded question).");
        }
    }

    public boolean userHasRole(UserDetails userDetails) {
        return userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("INTERVIEWER"));
    }

    public SkillEntity getSkillEntity(Long skillId) {
        return skillRepository.findById(skillId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found with id: " + skillId));
    }

    @Transactional(rollbackFor = {Exception.class})
    public InterviewQuestionGradeResponseDto evaluateQuestion(AuthDetails authDetails, InterviewQuestionGradeRequestDto interviewQuestionDto) {
        extractedUserAndCheckRole(authDetails);

        interviewRepository.findById(interviewQuestionDto.getInterviewId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview not found with Id: " + interviewQuestionDto.getInterviewId()));

        InterviewQuestionEntity interviewQuestionEntity = interviewQuestionRepository.findById(interviewQuestionDto.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question not found."));

        if (!interviewQuestionDto.getInterviewId().equals(interviewQuestionEntity.getInterviewId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "The interview Id for question Id does not match the interview Id provided in the request");
        }

        interviewQuestionEntity.setGrade(interviewQuestionDto.getGrade());
        InterviewQuestionEntity savedEntity = interviewQuestionRepository.save(interviewQuestionEntity);
        if (savedEntity.getId() == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save question grade.");
        } else {
            log.info("The grade was saved successfully. Id: {}", savedEntity.getId());
            return new InterviewQuestionGradeResponseDto(savedEntity.getId(), interviewQuestionDto.getGrade());
        }
    }

    public List<InterviewQuestionResponseDto> getMyQuestionsBySkillId(AuthDetails authDetails,
                                                                      long id) {
        Sort sort = Sort.by(Sort.Direction.DESC, "updatedAt");
        return interviewerQuestionRepository
                .findAllByInterviewerIdAndSkillId(authDetails.getUserEntity().getId(), id, sort)
                .stream()
                .map(interviewerQuestionMapper::toResponseDto)
                .toList();
    }

    public String updateFeedback(Long interviewId, String feedback) {
        Optional<InterviewEntity> optionalInterviewEntity = interviewRepository.findById(interviewId);
        if (optionalInterviewEntity.isPresent()) {
            InterviewEntity interviewEntity = optionalInterviewEntity.get();
            interviewEntity.setFeedback(feedback);
            interviewRepository.save(interviewEntity);
            return interviewEntity.getFeedback();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Interview not found");
        }
    }

//    @Cacheable("geminiQuestionsBySkillId")
//    public List<String> getGeminiQuestionsBySkillId(long id) {
//        SkillEntity skill = skillRepository
//                .findById(id)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found!"));
//        return geminiService.generateQuestionsBySkillName(skill.getName());
//    }

//    public List<InterviewStatisticDto> getInterviewStatistics(LocalDateTime startDate, LocalDateTime endDate) {
//        return interviewRepository.getInterviewStatistics(startDate, endDate);
//    }

    /**
     * Статистика 1: Отримання оцінок по навичках за період для конкретного користувача.
     * Реалізує групування та обчислення середнього балу на рівні Java.
     */
    public List<UserStatisticsPeriodDto> getUserStatisticsByPeriod(Long userId, LocalDate from, LocalDate to) {

        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(LocalTime.MAX);

        List<InterviewEntity> interviews = interviewRepository
                .findBySearcherIdAndEndDateTimeBetween(userId, start, end);

        List<UserStatisticsPeriodDto> result = new ArrayList<>();

        for (InterviewEntity interview : interviews) {
            // ВИПРАВЛЕНО: Групування через q.getSkill(), бо interviewerQuestion відсутній у вашій сутності
            Map<SkillEntity, List<InterviewQuestionEntity>> groupedBySkill = interview.getQuestions().stream()
                    .collect(Collectors.groupingBy(InterviewQuestionEntity::getSkill));

            for (Map.Entry<SkillEntity, List<InterviewQuestionEntity>> entry : groupedBySkill.entrySet()) {
                SkillEntity skill = entry.getKey();
                List<InterviewQuestionEntity> questions = entry.getValue();

                int totalGrade = questions.stream()
                        .mapToInt(InterviewQuestionEntity::getGrade)
                        .sum();
                int questionCount = questions.size();
                double averageGrade = questionCount > 0 ? (double) totalGrade / questionCount : 0.0;

                // ВИПРАВЛЕНО: Прямий доступ до q.getQuestion()
                List<QuestionGradeDto> questionDetails = questions.stream()
                        .map(q -> new QuestionGradeDto(q.getQuestion(), q.getGrade()))
                        .collect(Collectors.toList());

                // ВИПРАВЛЕНО: назва методу білдера .grade() відповідно до DTO
                result.add(UserStatisticsPeriodDto.builder()
                        .skillName(skill.getName())
                        .grade(averageGrade)
                        .date(interview.getEndDateTime())
                        .questions(questionDetails)
                        .build());
            }
        }
        return result;
    }

    /**
     * Статистика 2: Найчастіше перевіряні навички.
     * Реалізує агрегацію (COUNT, AVG) безпосередньо в SQL запиті.
     */
    public List<MostCheckedSkillDto> getMostCheckedSkills(LocalDateTime fromDate) {
        return interviewRepository.getMostCheckedSkills(fromDate);
    }

    /**
     * Статистика: Рівень відповідності кандидатів по кожній навичці.
     * Метод повертає агреговані дані: назву навички, кількість унікальних кандидатів
     * та середній бал за вказаний період.
     */
    public List<SkillComplianceDto> getSkillComplianceStats(LocalDateTime start, LocalDateTime end) {
        // Виклик методу репозиторію, який містить складний JPQL запит з COUNT(DISTINCT) та AVG
        List<SkillComplianceDto> stats = interviewRepository.getSkillComplianceStats(start, end);

        // Якщо за період немає даних, повертаємо порожній список (щоб уникнути null на фронтенді)
        if (stats == null) {
            return new ArrayList<>();
        }

        return stats;
    }

    public List<InterviewerStatsDto> getInterviewerStats(LocalDate from, LocalDate to) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(LocalTime.MAX);
        return interviewRepository.getInterviewerStatistics(start, end);
    }

    public List<SkillCoverageDto> getSkillCoverageStats(LocalDateTime start, LocalDateTime end) {
        // Отримуємо інтерв'ю з усіма необхідними зв'язками для уникнення LazyInitializationException
        List<InterviewEntity> interviews = interviewRepository.findInterviewsWithDetails(start, end);

        return interviews.stream().map(interview -> {
            // 1. Отримуємо назви навичок, які реально були оцінені в цьому інтерв'ю
            List<String> evaluated = interview.getQuestions().stream()
                    .filter(q -> q.getSkill() != null)
                    .map(q -> q.getSkill().getName())
                    .distinct()
                    .collect(Collectors.toList());

            // 2. Отримуємо назви навичок, які очікувалися від кандидата (searcher)
            // Проходимо шлях: UserEntity -> Set<UserRoleSkillEntity> -> SkillEntity -> name
            List<String> expected = new ArrayList<>();
            if (interview.getSearcher() != null && interview.getSearcher().getUserRoleSkillEntitySet() != null) {
                expected = interview.getSearcher().getUserRoleSkillEntitySet().stream()
                        .filter(urs -> urs.getSkill() != null)
                        .map(urs -> urs.getSkill().getName())
                        .distinct()
                        .collect(Collectors.toList());
            }

            // 3. Знаходимо навички, які були пропущені (Expected мінус Evaluated)
            List<String> missing = expected.stream()
                    .filter(skillName -> !evaluated.contains(skillName))
                    .collect(Collectors.toList());

            return SkillCoverageDto.builder()
                    .interviewId(interview.getId())
                    .interviewTitle(interview.getTitle())
                    .evaluatedCount(evaluated.size())
                    .evaluatedSkills(evaluated)
                    .expectedCount(expected.size())
                    .missingSkills(missing)
                    .build();
        }).collect(Collectors.toList());
    }
}
