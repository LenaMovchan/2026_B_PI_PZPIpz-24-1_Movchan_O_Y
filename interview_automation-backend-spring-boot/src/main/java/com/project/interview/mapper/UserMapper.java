package com.project.interview.mapper;

import com.project.interview.dtos.*;
import com.project.interview.entity.TempUserEntity;
import com.project.interview.entity.UserEntity;
import com.project.interview.security.oauth2.model.OAuth2UserInfo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Set;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses = {RoleMapper.class})
public abstract class UserMapper {

    protected PasswordEncoder passwordEncoder;

    protected RoleMapper roleMapper;

    @Value("${registration.emailTokenExpireTimeInMinutes}")
    protected long registrationEmailTokenExpireTimeInMinutes;

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    public void setRoleMapper(RoleMapper roleMapper) {
        this.roleMapper = roleMapper;
    }

    @Mapping(target = "roles", source = "userEntity", qualifiedByName = "mapSkills")
    public abstract UserResponseDto toDto(UserEntity userEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "firstname", source = "name")
    @Mapping(target = "lastname", source = "oAuth2UserInfo", qualifiedByName = "emptyString")
    @Mapping(target = "avatarImgUrl", source = "imageUrl")
    public abstract UserEntity oauth2InfoToEntity(OAuth2UserInfo oAuth2UserInfo);

    @Mapping(target = "password", source = "password", qualifiedByName = "encodePassword")
    @Mapping(target = "expireAt", source = "registerRequest", qualifiedByName = "createExpireAt")
    public abstract TempUserEntity registerToTemp(RegisterRequest registerRequest);

    @Mapping(target = "id", ignore = true)
    public abstract UserEntity tempUserToUser(TempUserEntity tempUserEntity);

    @Named("createExpireAt")
    protected LocalDateTime currentLocalDateTime(RegisterRequest registerRequest) {
        return LocalDateTime.now(ZoneOffset.UTC).plusMinutes(registrationEmailTokenExpireTimeInMinutes);
    }

    @Named("encodePassword")
    protected String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    @Named("emptyString")
    protected String getEmptyString(Object object) {
        return "";
    }

    @Named("mapSkills")
    protected Set<RoleWithSkillsDto> mapSkills(UserEntity userEntity) {
        return roleMapper.userRoleSkillsToDto(userEntity.getId(), userEntity.getUserRoleSkillEntitySet());
    }

    public abstract UserSearchResponseDto toSearchResponseDto(UserEntity userEntity);

    @Mapping(target = "userFullName", source = "userEntity", qualifiedByName = "getFullName")
    public abstract UserShortInfo toShortInfo(UserEntity userEntity);

    @Named("getFullName")
    protected String getFullName(UserEntity entity) {
        return entity.getLastname() + " " + entity.getFirstname();
    }

    @Mapping(target = "roles", source = "userEntity", qualifiedByName = "mapSkills")
    public abstract UserByIdDto toByIdDto(UserEntity userEntity);
}
