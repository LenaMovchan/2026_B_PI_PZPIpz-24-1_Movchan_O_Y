package com.project.interview.mapper;

import com.project.interview.dtos.question.InterviewQuestionRequestDto;
import com.project.interview.dtos.question.InterviewQuestionResponseDto;
import com.project.interview.entity.InterviewerQuestionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface InterviewerQuestionMapper {

    @Mapping(target = "skill.id", source = "skillId")
    @Mapping(target = "interviewer.id", source = "interviewerId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", source = "question")
    InterviewerQuestionEntity toEntity(InterviewQuestionRequestDto questionDto);

    @Mapping(target = "skillName", source = "skill.name")
    InterviewQuestionResponseDto toResponseDto(InterviewerQuestionEntity entity);
}
