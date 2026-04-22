package com.smartcampus.operationshub.dto.response.ticket;

import com.smartcampus.operationshub.enums.AppUserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ActorSummaryResponse {
    private String identifier;
    private String name;
    private String email;
    private AppUserRole role;
}
