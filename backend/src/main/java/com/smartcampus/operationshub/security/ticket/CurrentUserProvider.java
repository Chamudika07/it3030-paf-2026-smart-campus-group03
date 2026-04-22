package com.smartcampus.operationshub.security.ticket;

import com.smartcampus.operationshub.entity.AppUser;
import com.smartcampus.operationshub.enums.AppUserRole;
import com.smartcampus.operationshub.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Locale;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final AuthService authService;

    public CurrentUser getCurrentUser() {
        HttpServletRequest request = getCurrentRequest();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Optional<AppUser> authenticatedUser = authService.findAuthenticatedUser(authentication);
        if (authenticatedUser.isPresent()) {
            AppUser user = authenticatedUser.get();
            return CurrentUser.builder()
                    .identifier(user.getEmail())
                    .name(user.getName())
                    .role(user.getRole())
                    .build();
        }

        String identifier = headerValue(request, "X-User-Id")
                .or(() -> authenticatedName(authentication))
                .orElse("demo-user");
        String displayName = headerValue(request, "X-User-Name")
                .or(() -> authenticatedName(authentication))
                .orElse("Campus User");
        AppUserRole role = headerValue(request, "X-User-Role")
                .map(this::parseRole)
                .orElseGet(() -> resolveRole(authentication));

        return CurrentUser.builder()
                .identifier(identifier.trim())
                .name(displayName.trim())
                .role(role)
                .build();
    }

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes == null ? null : attributes.getRequest();
    }

    private Optional<String> headerValue(HttpServletRequest request, String name) {
        if (request == null) {
            return Optional.empty();
        }

        String value = request.getHeader(name);
        return value == null || value.isBlank() ? Optional.empty() : Optional.of(value);
    }

    private Optional<String> authenticatedName(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        String name = authentication.getName();
        if ("anonymousUser".equalsIgnoreCase(name)) {
            return Optional.empty();
        }

        return Optional.of(name);
    }

    private AppUserRole resolveRole(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities() == null) {
            return AppUserRole.USER;
        }

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(authority -> authority.replace("ROLE_", ""))
                .map(this::parseRole)
                .findFirst()
                .orElse(AppUserRole.USER);
    }

    private AppUserRole parseRole(String roleValue) {
        try {
            return AppUserRole.valueOf(roleValue.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return AppUserRole.USER;
        }
    }
}
