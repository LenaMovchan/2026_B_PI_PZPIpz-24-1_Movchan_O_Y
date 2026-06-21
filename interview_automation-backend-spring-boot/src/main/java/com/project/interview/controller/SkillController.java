package com.project.interview.controller;

import com.project.interview.dtos.SkillDto;
import com.project.interview.dtos.SkillTreeDto;
import com.project.interview.dtos.SkillWithIdDto;
import com.project.interview.dtos.UserSkillAddDto;
import com.project.interview.dtos.statistic.MostCheckedSkillDto;
import com.project.interview.dtos.statistic.SkillComplianceDto;
import com.project.interview.dtos.statistic.SkillCoverageDto;
import com.project.interview.security.oauth2.model.AuthDetails;
import com.project.interview.service.InterviewService;
import com.project.interview.service.SkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("${rest.prefix}/skills")
@Tag(name = "Skills", description = "Skill management endpoints!")
@SecurityRequirement(name = "jwt")
@ApiResponse(responseCode = "401", content = {@Content})
@RequiredArgsConstructor
@Slf4j
public class SkillController {
    private final SkillService skillService;
    private final InterviewService interviewService;

    @GetMapping("/role/{roleId}")
    public List<SkillTreeDto> getSkillTree(@PathVariable Long roleId) {
        return skillService.getSkillsByRoleId(roleId);
    }

    @PostMapping("/user/{roleId}")
    public void addUserSkills(@AuthenticationPrincipal AuthDetails authDetails,
                              @RequestBody UserSkillAddDto skillDto,
                              @PathVariable Long roleId) {
        skillService.addUserSkills(authDetails, skillDto, roleId);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get all lower-level skills by user id for the SEARCHER role")
    @ApiResponse(responseCode = "200", description = "Skills found successfully",
            content = {@Content(mediaType = "application/json")})
    @ApiResponse(responseCode = "400", description = "User not found", content = {@Content})
    public List<String> getAllSkillsByUserId(@PathVariable Long userId) {
        return skillService.getAllSkillsByUserId(userId);
    }

    @GetMapping("/lower-level")
    @Operation(summary = "Get all lower-level skills for the SEARCHER role")
    @ApiResponse(responseCode = "200", description = "Skills found successfully",
            content = {@Content(mediaType = "application/json")})
    public List<SkillDto> getAllLastLevelSkills() {
        return skillService.getLastLevelSkills();
    }


//    @GetMapping("/{userId}/role/{roleId}")
//    public List<String> getAllSkillsByUserIdAndRoleId(@PathVariable Long userId, @PathVariable Long roleId) {
//        return skillService.getAllSkillsByUserIdAndRoleId(userId, roleId);
//    }

    @DeleteMapping("/{userId}/role/{roleId}/skill/{skillId}")
    public boolean deleteSkill(@PathVariable Long userId,
                               @PathVariable Long roleId,
                               @PathVariable Long skillId) {
        return skillService.deleteSkill(userId, roleId, skillId);
    }

    //    @GetMapping("/{userId}/role/{roleId}")
//       public List<SkillTreeDto> getAllSkillsByUserIdAndRoleId(@PathVariable Long userId, @PathVariable Long roleId) {
//        return skillService.getUserSkillsTree(userId, roleId);
//    }
    @GetMapping("/{userId}/role/{roleId}")
    public List<SkillWithIdDto> getAllSkillsByUserIdAndRoleId(@PathVariable Long userId, @PathVariable Long roleId) {
        return skillService.getAllSkillsByUserIdAndRoleId(userId, roleId);
    }

    @GetMapping("/most-checked")
    public List<MostCheckedSkillDto> getMostCheckedSkills(@RequestParam("months") int months) {
        LocalDateTime fromDate = LocalDateTime.now().minusMonths(months);
        return interviewService.getMostCheckedSkills(fromDate);
    }

    @GetMapping("/skills-compliance")
    public List<SkillComplianceDto> getSkillCompliance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(LocalTime.MAX);
        return interviewService.getSkillComplianceStats(start, end);
    }

    @GetMapping("/skills-coverage")
    @Operation(summary = "Покриття навичок", description = "Аналіз повноти оцінювання очікуваних компетенцій")
    public List<SkillCoverageDto> getSkillCoverage(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = to.atTime(LocalTime.MAX);
        return interviewService.getSkillCoverageStats(start, end);
    }

}
