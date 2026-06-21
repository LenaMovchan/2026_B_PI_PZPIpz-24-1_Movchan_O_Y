package com.project.interview.mapper;

import com.project.interview.dtos.QuestionScoreDto;
import com.project.interview.dtos.UserResponseDto;
import com.project.interview.dtos.interview.InterviewCreationDto;
import com.project.interview.dtos.interview.InterviewDto;
import com.project.interview.dtos.interview.InterviewFullDto;
import com.project.interview.dtos.interview.ShortInterviewDto;
import com.project.interview.entity.InterviewEntity;
import com.project.interview.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {RoleMapper.class, UserMapper.class})
public abstract class InterviewMapper {
    protected UserMapper userMapper;

    @Autowired
    public void setRoleMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public abstract InterviewEntity toEntity(InterviewCreationDto interviewEntity);

    @Mapping(source = "interviewer", target = "interviewer", qualifiedByName = "mapUserToDto")
    @Mapping(source = "searcher", target = "searcher", qualifiedByName = "mapUserToDto")
    public abstract InterviewDto toDto(InterviewEntity interviewEntity);

    public InterviewFullDto toFullDto(InterviewEntity interviewEntity, List<QuestionScoreDto> questions) {
        InterviewDto interviewDto = toDto(interviewEntity);
        InterviewFullDto interviewFullDto = new InterviewFullDto();
        interviewFullDto.setId(interviewDto.getId());
        interviewFullDto.setTitle(interviewDto.getTitle());
        interviewFullDto.setStatus(interviewDto.getStatus());
        interviewFullDto.setInterviewer(interviewDto.getInterviewer());
        interviewFullDto.setSearcher(interviewDto.getSearcher());
        interviewFullDto.setPlannedDateTime(interviewDto.getPlannedDateTime());
        interviewFullDto.setStartDateTime(interviewDto.getStartDateTime());
        interviewFullDto.setEndDateTime(interviewDto.getEndDateTime());
        interviewFullDto.setFeedback(interviewDto.getFeedback());
        interviewFullDto.setQuestions(questions);
        return interviewFullDto;
    }

    @Mapping(source = "interviewer", target = "interviewer")
    @Mapping(source = "searcher", target = "searcher")
    public abstract  ShortInterviewDto toShortDto(InterviewEntity interviewEntity);

    @Named("concatenateFullName")
    String concatenateFullName(UserEntity user) {
        return user.getFirstname() + " " + user.getLastname();
    }

    @Named("mapUserToDto")
    UserResponseDto mapUserToDto(UserEntity user) {
        return userMapper.toDto(user);
    }
}
