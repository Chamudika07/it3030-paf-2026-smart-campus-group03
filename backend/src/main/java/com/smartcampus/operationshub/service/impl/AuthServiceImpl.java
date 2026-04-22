package com.smartcampus.operationshub.service.impl;

import com.smartcampus.operationshub.dto.response.auth.AuthUserResponse;
import com.smartcampus.operationshub.entity.AppUser;
import com.smartcampus.operationshub.enums.AppUserRole;
import com.smartcampus.operationshub.enums.AuthProvider;
import com.smartcampus.operationshub.exception.ForbiddenOperationException;
import com.smartcampus.operationshub.repository.AppUserRepository;
import com.smartcampus.operationshub.service.AuthService;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AppUserRepository appUserRepository;

    @Override
    public AppUser provisionGoogleUser(OAuth2User oauthUser) {
        String providerId = requiredAttribute(oauthUser, "sub");
        String email = requiredAttribute(oauthUser, "email").toLowerCase();
        String name = attributeOrDefault(oauthUser, "name", email);
        String avatarUrl = oauthUser.getAttribute("picture");

        AppUser user = appUserRepository.findByEmailIgnoreCase(email)
                .or(() -> appUserRepository.findByProviderId(providerId))
                .orElseGet(AppUser::new);

        user.setName(name);
        user.setEmail(email);
        user.setAvatarUrl(avatarUrl);
        user.setProvider(AuthProvider.GOOGLE);
        user.setProviderId(providerId);
        user.setActive(true);

        if (user.getRole() == null) {
            user.setRole(AppUserRole.USER);
        }

        return appUserRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AppUser> findAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equalsIgnoreCase(String.valueOf(authentication.getPrincipal()))) {
            return Optional.empty();
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof OAuth2User oauthUser) {
            String email = oauthUser.getAttribute("email");
            if (email != null && !email.isBlank()) {
                return appUserRepository.findByEmailIgnoreCase(email);
            }
        }

        String name = authentication.getName();
        if (name != null && !name.isBlank()) {
            return appUserRepository.findByEmailIgnoreCase(name);
        }

        return Optional.empty();
    }

    @Override
    @Transactional(readOnly = true)
    public AppUser requireAuthenticatedUser(Authentication authentication) {
        AppUser user = findAuthenticatedUser(authentication)
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("Authentication is required"));
        if (!user.isActive()) {
            throw new ForbiddenOperationException("Your account is disabled");
        }
        return user;
    }

    @Override
    public AuthUserResponse toResponse(AppUser user) {
        return AuthUserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .build();
    }

    private String requiredAttribute(OAuth2User oauthUser, String name) {
        String value = oauthUser.getAttribute(name);
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Google profile did not include required attribute: " + name);
        }
        return value;
    }

    private String attributeOrDefault(OAuth2User oauthUser, String name, String defaultValue) {
        String value = oauthUser.getAttribute(name);
        return value == null || value.isBlank() ? defaultValue : value;
    }
}
