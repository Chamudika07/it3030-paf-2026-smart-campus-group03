package com.smartcampus.operationshub.security.oauth;

import com.smartcampus.operationshub.config.AppProperties;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);

    private final AppProperties appProperties;
    private final HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
        log.info("OAuth2 login succeeded for principal='{}', redirecting to '{}'",
                authentication == null ? "unknown" : authentication.getName(),
                appProperties.getOauth2().getSuccessRedirectUri());
        response.sendRedirect(appProperties.getOauth2().getSuccessRedirectUri());
    }
}
