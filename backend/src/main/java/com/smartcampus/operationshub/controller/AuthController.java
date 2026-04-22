package com.smartcampus.operationshub.controller;

import com.smartcampus.operationshub.dto.response.ApiResponse;
import com.smartcampus.operationshub.dto.response.auth.AuthUserResponse;
import com.smartcampus.operationshub.entity.AppUser;
import com.smartcampus.operationshub.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthUserResponse>> getCurrentUser(Authentication authentication) {
        AppUser user = authService.requireAuthenticatedUser(authentication);
        return ResponseEntity.ok(new ApiResponse<>("Current user fetched successfully", authService.toResponse(user)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request,
                                                    HttpServletResponse response,
                                                    Authentication authentication) {
        new SecurityContextLogoutHandler().logout(request, response, authentication);
        return ResponseEntity.ok(new ApiResponse<>("Logged out successfully", null));
    }
}
