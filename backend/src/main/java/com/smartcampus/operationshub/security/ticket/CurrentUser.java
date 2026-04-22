package com.smartcampus.operationshub.security.ticket;

import com.smartcampus.operationshub.enums.AppUserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CurrentUser {
    private String identifier;
    private String name;
    private AppUserRole role;
}
