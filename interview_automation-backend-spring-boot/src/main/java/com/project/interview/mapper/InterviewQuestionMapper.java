package com.project.interview.mapper;

import com.project.interview.dtos.QuestionScoreDto;
import com.project.interview.dtos.question.InterviewQuestionGradeResponseDto;
import com.project.interview.dtos.question.InterviewQuestionRequestDto;
import com.project.interview.entity.InterviewQuestionEntity;
import com.project.interview.entity.SkillEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface InterviewQuestionMapper {

    InterviewQuestionEntity toEntity(InterviewQuestionRequestDto questionDto);

    InterviewQuestionGradeResponseDto toDto(InterviewQuestionEntity interviewQuestionEntity);

    @Mapping(target = "skillName", source = "skill", qualifiedByName = "getSkillName")
    @Mapping(source = "createAt", target = "createdAt", qualifiedByName = "formatDateTime")
    QuestionScoreDto toScoreDto(InterviewQuestionEntity interviewQuestionEntity);

    default List<QuestionScoreDto> toScoreDtoList(List<InterviewQuestionEntity> interviewQuestionEntities) {
        return interviewQuestionEntities.stream().map(this::toScoreDto).toList();
    }

    @Named("getSkillName")
    default String getSkillName(SkillEntity skillEntity) {
        return skillEntity.getName();
    }

    @Named("formatDateTime")
    default LocalDateTime formatDateTime(LocalDateTime dateTime) {
        return dateTime.truncatedTo(ChronoUnit.SECONDS);
    }
}
