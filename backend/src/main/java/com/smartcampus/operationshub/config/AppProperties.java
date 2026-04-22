package com.smartcampus.operationshub.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Cors cors = new Cors();
    private Storage storage = new Storage();
    private Oauth2 oauth2 = new Oauth2();

    @Getter
    @Setter
    public static class Cors {
        private String allowedOrigins;
    }

    @Getter
    @Setter
    public static class Storage {
        private String ticketAttachmentsDir = "uploads/tickets";
    }

    @Getter
    @Setter
    public static class Oauth2 {
        private String successRedirectUri = "http://localhost:5173/dashboard";
        private String failureRedirectUri = "http://localhost:5173/login?error=oauth";
    }
}
