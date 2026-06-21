package com.project.interview.mapper;

import com.project.interview.dtos.SkillDto;
import com.project.interview.entity.SkillEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SkillMapper {

    SkillDto toDto(SkillEntity skillEntity);

}

