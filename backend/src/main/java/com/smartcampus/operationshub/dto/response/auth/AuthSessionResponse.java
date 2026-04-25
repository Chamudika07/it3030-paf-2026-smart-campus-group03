package com.smartcampus.operationshub.dto.response.auth;

public record AuthSessionResponse(
        boolean authenticated,
        AuthUserResponse user
) {
}
