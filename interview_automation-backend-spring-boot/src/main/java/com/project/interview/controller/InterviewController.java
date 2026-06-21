package com.project.interview.controller;

import com.project.interview.dtos.InterviewResultsDto;
import com.project.interview.dtos.QuestionScoreDto;
import com.project.interview.dtos.interview.*;
import com.project.interview.dtos.question.InterviewQuestionGradeRequestDto;
import com.project.interview.dtos.question.InterviewQuestionGradeResponseDto;
import com.project.interview.dtos.question.InterviewQuestionRequestDto;
import com.project.interview.dtos.question.InterviewQuestionResponseDto;
import com.project.interview.dtos.statistic.InterviewReportDto;
import com.project.interview.dtos.statistic.InterviewerStatsDto;
import com.project.interview.dtos.statistic.TechnicalLevelReportDto;
import com.project.interview.dtos.status.StatusDto;
import com.project.interview.enumeration.InterviewStatus;
import com.project.interview.security.oauth2.model.AuthDetails;
import com.project.interview.service.InterviewService;
import com.project.interview.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("${rest.prefix}/interviews")
@Tag(name = "Interviews", description = "Interview management endpoints!")
@SecurityRequirement(name = "jwt")
@ApiResponse(responseCode = "401", content = {@Content})
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InterviewController {

    final InterviewService interviewService;
    final SimpMessagingTemplate template;
    final ReportService reportService;

    @GetMapping("/{interviewId}/results")
    @Operation(summary = "Get interview results", description = "Get interview results")
    @ApiResponse(responseCode = "200", description = "Interview results found",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = InterviewResultsDto.class))})
    @ApiResponse(responseCode = "404", description = "Interview not found", content = {@Content})
    public InterviewResultsDto getInterviewResults(@PathVariable Long interviewId) {
        return interviewService.getInterviewResults(interviewId);
    }

    @GetMapping("/{interviewId}")
    @Operation(summary = "Get interview by id", description = "get interview by id")
    @ApiResponse(responseCode = "200", description = "Interview found",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = InterviewFullDto.class))})
    @ApiResponse(responseCode = "404", description = "Interview not found",
            content = {@Content})
    public InterviewFullDto getInterviewById(@PathVariable Long interviewId) {
        return interviewService.getInterviewById(interviewId);
    }

    @GetMapping
    @Operation(summary = "Get all interviews", description = "Get all interviews of user")
    @ApiResponse(responseCode = "200", description = "Interviews found",
            content = {@Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ShortInterviewDto.class)))})
    public List<ShortInterviewDto> getAllInterviews(@AuthenticationPrincipal AuthDetails authDetails) {
        return interviewService.getInterviewList(authDetails);
    }

    @PatchMapping("/{interviewId}")
    @Operation(summary = "Update interview before it's start", description = "Update interview before it's start")
    @ApiResponse(responseCode = "200", description = "Interview updated successfully",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = InterviewDto.class))})
    @ApiResponse(responseCode = "404", description = "Interview not found", content = {@Content})
    @ApiResponse(responseCode = "400", description = "Invalid interview data", content = {@Content})
    public InterviewDto updateInterview(@PathVariable Long interviewId,
                                        @RequestBody @Valid InterviewUpdateDto interviewDto) {
        return interviewService.updateInterview(interviewId, interviewDto);
    }

    @PatchMapping("/status/{interviewId}")
    @Operation(summary = "Update interview status", description = "Update interview status")
    @ApiResponse(responseCode = "200", description = "Interview status updated successfully",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = InterviewDto.class))})
    @ApiResponse(responseCode = "404", description = "Interview not found", content = {@Content})
    @ApiResponse(responseCode = "400", description = "Invalid interview status", content = {@Content})
    public InterviewDto updateInterviewStatus(@RequestParam(name = "status") InterviewStatus status,
                                              @PathVariable Long interviewId) {
        InterviewDto interviewDto = interviewService.updateInterviewStatus(interviewId, status);
        template.convertAndSendToUser(String.valueOf(interviewId), "/questions", new StatusDto(status));
        return interviewDto;
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create interview", description = "Create interview")
    @ApiResponse(responseCode = "201", description = "Interview created successfully",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = InterviewDto.class))})
    @ApiResponse(responseCode = "400", description = "Invalid interview data", content = {@Content})
    public InterviewDto createInterview(@AuthenticationPrincipal AuthDetails authDetails,
                                        @RequestBody @Valid InterviewCreationDto interviewDto) {
        return interviewService.createInterview(authDetails, interviewDto);
    }

    @PostMapping("/question")
    @Operation(summary = "Save question", description = "Save question")
    @ApiResponse(responseCode = "200", description = "Question saved successfully",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = InterviewQuestionResponseDto.class))})
    @ApiResponse(responseCode = "400", description = "Invalid question data", content = {@Content})
    public InterviewQuestionResponseDto saveQuestion(@AuthenticationPrincipal AuthDetails authDetails,
                                                     @RequestBody @Valid InterviewQuestionRequestDto questionRequestDto) {
        Long interviewId = questionRequestDto.getInterviewId();
        InterviewQuestionResponseDto savedQuestion = interviewService.saveQuestion(authDetails, questionRequestDto);
        List<QuestionScoreDto> allQuestions = interviewService.getInterviewById(interviewId).getQuestions();
        template.convertAndSendToUser(String.valueOf(interviewId), "/questions", allQuestions);
        return savedQuestion;
    }

    @PatchMapping("/question/grade")
    @Operation(summary = "Evaluate question", description = "Evaluate question (set grade)")
    @ApiResponse(responseCode = "200", description = "Question evaluated successfully",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = InterviewQuestionGradeResponseDto.class))})
    @ApiResponse(responseCode = "400", description = "Invalid question data", content = {@Content})
    public InterviewQuestionGradeResponseDto evaluateQuestion(@AuthenticationPrincipal AuthDetails authDetails,
                                                              @RequestBody @Valid InterviewQuestionGradeRequestDto questionDto) {
        return interviewService.evaluateQuestion(authDetails, questionDto);
    }

    @GetMapping("/questions/skill/{id}")
    @Operation(summary = "Get interviewer questions by skill id.")
    @ApiResponse(responseCode = "200",
            content = {@Content(
                    array = @ArraySchema(schema = @Schema(implementation = InterviewQuestionResponseDto.class)),
                    mediaType = "application/json")})
    public List<InterviewQuestionResponseDto> getMyQuestionsBySkillId(
            @AuthenticationPrincipal AuthDetails authDetails,
            @PathVariable(name = "id") long id) {
        return interviewService.getMyQuestionsBySkillId(authDetails, id);
    }

    @PatchMapping("/{interviewId}/feedback")
    @Operation(summary = "Update feedback", description = "Update the feedback to the interview")
    @ApiResponse(responseCode = "200", description = "Feedback updated successfully",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = String.class))})
    @ApiResponse(responseCode = "400", description = "Interview not found", content = {@Content})
    public String updateFeedback(@PathVariable Long interviewId, @RequestBody String feedback) {
        return interviewService.updateFeedback(interviewId, feedback);
    }

//    @GetMapping("/questions/gemini/skill/{id}")
//    @Operation(summary = "Get questions from Gemini ai by skill id.")
//    @ApiResponse(responseCode = "200",
//            content = {@Content(
//                    array = @ArraySchema(schema = @Schema(implementation = String.class)),
//                    mediaType = "application/json")})
//    @ApiResponse(responseCode = "404", description = "Skill not found or Gemini does not work!", content = {@Content})
//    public List<String> gemini(@PathVariable(name = "id") long id) {
//        return interviewService.getGeminiQuestionsBySkillId(id);
//    }

    @GetMapping("/interviewers")
    public List<InterviewerStatsDto> getInterviewerStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return interviewService.getInterviewerStats(from, to);
    }

    @GetMapping("/report/interview/{id}/pdf")
    public ResponseEntity<byte[]> downloadReport(@PathVariable Long id) throws Exception {
        InterviewReportDto data = reportService.getReportData(id); // Отримання даних
        byte[] pdfContents = reportService.generateInterviewReport(data);

        String fileName = "Report_Interview_" + id + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContents);
    }

    @GetMapping("/report/technical-level/excel")
    public ResponseEntity<byte[]> downloadTechnicalReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) throws Exception {

        TechnicalLevelReportDto data = reportService.getTechnicalLevelData(from, to);
        byte[] excelContent = reportService.generateTechnicalLevelExcelReport(data);

        String fileName = "Technical_Level_Report_" + from + "_to_" + to + ".xlsx";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(excelContent);
    }
}
