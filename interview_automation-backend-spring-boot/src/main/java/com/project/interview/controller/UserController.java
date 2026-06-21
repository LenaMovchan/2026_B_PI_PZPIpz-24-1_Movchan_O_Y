package com.project.interview.controller;

import com.project.interview.dtos.*;
import com.project.interview.dtos.result.UserResultsByInterviewsResponseDto;
import com.project.interview.dtos.search.SearchSkillGradeDto;
import com.project.interview.dtos.statistic.UserStatisticsPeriodDto;
import com.project.interview.security.oauth2.model.AuthDetails;
import com.project.interview.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("${rest.prefix}/users")
@Tag(name = "Users", description = "User management endpoints!")
@SecurityRequirement(name = "jwt")
@ApiResponse(responseCode = "401", content = {@Content})
@AllArgsConstructor
public class UserController {

    private UserService service;

    @Operation(summary = "Test endpoint without security. Will be deleted soon.")
    @ApiResponse(responseCode = "200", content = {@Content})
    @GetMapping("/hello")
    public Map<String, String> getHello() {
        return Map.of("message", "Hello");
    }

    @Operation(summary = "Get information about authorized user.")
    @ApiResponse(responseCode = "200",
            content = {@Content(schema = @Schema(implementation = UserResponseDto.class), mediaType = "application/json")})
    @GetMapping("/me")
    public UserResponseDto getMe(@AuthenticationPrincipal AuthDetails authDetails) {
        return service.getMe(authDetails);
    }

    @Operation(summary = "Get information about all users. Use Pageable.")
    @ApiResponse(responseCode = "200",
            content = {@Content(
                    array = @ArraySchema(schema = @Schema(implementation = UserResponseDto.class)),
                    mediaType = "application/json")})
    @GetMapping
    public List<UserResponseDto> getAllUsers(@ParameterObject Pageable pageable) {
        return service.findAllUser(pageable);
    }

    @Operation(summary = "Get information about all roles.")
    @ApiResponse(responseCode = "200",
            content = {@Content(
                    array = @ArraySchema(schema = @Schema(implementation = RoleDto.class)),
                    mediaType = "application/json")})
    @GetMapping("/all-roles")
    public Set<RoleDto> getRoles() {
        return service.getRoles();
    }

    @Operation(summary = "Get information about an user by email.")
    @ApiResponse(responseCode = "200",
            content = {@Content(schema = @Schema(implementation = UserResponseDto.class), mediaType = "application/json")})
    @ApiResponse(responseCode = "404", content = {@Content})
    @PostMapping("/by-email")
    public UserResponseDto getUserByEmail(@RequestBody EmailDto emailDto) {
        return service.getUserByEmail(emailDto);
    }

    @GetMapping("/portrait/{userId}")
    @Operation(summary = "Get a portrait of an IT specialist",
            description = "Get a portrait of an IT specialist based on the results of interviews, optionally within a specified period")
    @ApiResponse(responseCode = "200", description = "Portrait of IT specialist found successfully",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = UserResultsByInterviewsResponseDto.class))})
    @ApiResponse(responseCode = "400", description = "User (IT specialist) not found", content = {@Content})
    public List<UserResultsByInterviewsResponseDto> getResultsByInterviews(@PathVariable Long userId,
                                                                           @RequestParam(value = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                                           @RequestParam(value = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        if (fromDate != null && toDate != null) {
            return service.getUserInterviewsResultsByPeriod(userId, fromDate, toDate);
        } else {
            return service.getUserInterviewsResults(userId);
        }
    }

    @Operation(summary = "Get all users by skills and grade", description = "Get all users by skills and grade based on the results of interviews")
    @ApiResponse(responseCode = "200", description = "Users (IT specialist) found successfully",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = UserSearchResponseDto.class))})
    @ApiResponse(responseCode = "400", description = "User (IT specialist) not found", content = {@Content})
    @PostMapping("/by-skills-and-grades")
    public ResponseEntity<List<UserSearchResponseDto>> findUsersBySkillsAndGrades(@RequestBody List<SearchSkillGradeDto> skillGrades) {

        List<UserSearchResponseDto> responseDto = service.findSearcherIdBySkillsAndGrades(skillGrades);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "Get all users by role searcher", description = "Get all users by role seracher")
    @ApiResponse(responseCode = "200", description = "Users (IT specialist) found successfully",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = UserSearchResponseDto.class))})
    @ApiResponse(responseCode = "400", description = "User (IT specialist) not found", content = {@Content})
    @GetMapping("/all-candidates")
    public ResponseEntity<List<UserSearchResponseDto>> findAllSearcher() {
        List<UserSearchResponseDto> responseDto = service.findAllCandidates();
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @GetMapping("/by-lastname")
    public ResponseEntity<UserSearchResponseDto> searchByFullName(@RequestParam("lastname") String lastname) {
        UserSearchResponseDto responseDto = service.findCandidatesByFullName(lastname);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserSearchResponseDto> searchByEmail(@RequestParam("email") String email) {
        UserSearchResponseDto responseDto = service.findCandidatesByEmail(email);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }


    @GetMapping("/statistic/{userId}")
    @Operation(summary = "Get statistic", description = "Get statistic for the selected time period")
    @ApiResponse(responseCode = "200", description = "Statistic for the period were collected successfully",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = UserStatisticsPeriodDto.class))})
    @ApiResponse(responseCode = "400", description = "User not found", content = {@Content})
    public List<UserStatisticsPeriodDto> getUserStatisticsByPeriod(@PathVariable Long userId,
                                                                   @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                                   @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return service.getUserStatisticsByPeriod(userId, fromDate, toDate);
    }

    @Operation(summary = "Get information about user by id.")
    @ApiResponse(responseCode = "200",
            content = {@Content(schema = @Schema(implementation = UserResponseDto.class), mediaType = "application/json")})
    @ApiResponse(responseCode = "404", content = {@Content})
    @GetMapping("/{id}")
    public UserByIdDto getById(@PathVariable long id) {
        return service.getById(id);
    }

    @Operation(summary = "Change user password.")
    @ApiResponse(responseCode = "200",
            content = {@Content(schema = @Schema(implementation = Boolean.class), mediaType = "application/json")})
    @PatchMapping("/password")
    public boolean changePassword(@AuthenticationPrincipal AuthDetails authDetails,
                                  @RequestBody @Valid UserChangePasswordDto dto) {
        return service.changePassword(authDetails, dto);
    }

    @DeleteMapping
    public boolean deleteUser(@AuthenticationPrincipal AuthDetails authDetails) {
        return service.deleteMe(authDetails.getUserEntity().getId());
    }
}
