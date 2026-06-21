package com.project.interview.security.oauth2;

import com.project.interview.entity.UserEntity;
import com.project.interview.mapper.UserMapper;
import com.project.interview.repository.TempUserRepository;
import com.project.interview.security.oauth2.model.AuthDetails;
import com.project.interview.security.oauth2.model.OAuth2UserInfo;
import com.project.interview.security.oauth2.model.OAuth2UserInfoFactory;
import com.project.interview.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;
    private final UserMapper userMapper;
    private final TempUserRepository tempUserRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException e) {
            throw e;
        } catch (Exception e) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(e.getMessage(), e.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest,
                                         OAuth2User oAuth2User) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory
                .getOAuth2UserInfo(
                        oAuth2UserRequest.getClientRegistration().getRegistrationId(),
                        oAuth2User.getAttributes()
                );
        if (ObjectUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "OAuth2 failed!");
        }

        return new AuthDetails(userService
                .findByEmail(oAuth2UserInfo.getEmail())
                .orElseGet(() -> registerNewUser(oAuth2UserInfo)))
                .setAttributes(oAuth2UserInfo.getAttributes());
    }

    private UserEntity registerNewUser(OAuth2UserInfo oAuth2UserInfo) {
        tempUserRepository.deleteByEmail(oAuth2UserInfo.getEmail());
        return userService.saveNewUserWithDefaultRole(userMapper.oauth2InfoToEntity(oAuth2UserInfo));
    }
}
