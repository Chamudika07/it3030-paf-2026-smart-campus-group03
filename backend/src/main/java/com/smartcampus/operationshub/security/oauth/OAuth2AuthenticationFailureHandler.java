package com.smartcampus.operationshub.security.oauth;

import com.smartcampus.operationshub.config.AppProperties;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationFailureHandler.class);

    private final AppProperties appProperties;
    private final HttpCookieOAuth2AuthorizationRequestRepository authorizationRequestRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
        log.error("OAuth2 login failed: {}", exception.getMessage(), exception);
        String separator = appProperties.getOauth2().getFailureRedirectUri().contains("?") ? "&" : "?";
        String redirectUri = appProperties.getOauth2().getFailureRedirectUri()
                + separator
                + "reason="
                + URLEncoder.encode(exception.getMessage(), StandardCharsets.UTF_8);
        response.sendRedirect(redirectUri);
    }
}
