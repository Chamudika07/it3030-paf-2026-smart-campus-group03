package com.smartcampus.operationshub.service;

import com.smartcampus.operationshub.dto.response.auth.AuthUserResponse;
import com.smartcampus.operationshub.entity.AppUser;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface AuthService {
    AppUser provisionGoogleUser(OAuth2User oauthUser);

    Optional<AppUser> findAuthenticatedUser(Authentication authentication);

    AppUser requireAuthenticatedUser(Authentication authentication);

    AuthUserResponse toResponse(AppUser user);
}
