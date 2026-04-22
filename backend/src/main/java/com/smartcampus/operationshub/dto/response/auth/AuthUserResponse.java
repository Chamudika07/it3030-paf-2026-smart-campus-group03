package com.smartcampus.operationshub.dto.response.auth;

import com.smartcampus.operationshub.enums.AppUserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthUserResponse {
    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    private AppUserRole role;
}
