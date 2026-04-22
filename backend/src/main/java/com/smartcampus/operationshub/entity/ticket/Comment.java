package com.smartcampus.operationshub.entity.ticket;

import com.smartcampus.operationshub.entity.BaseEntity;
import com.smartcampus.operationshub.enums.AppUserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ticket_comments")
public class Comment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(nullable = false, length = 120)
    private String authorIdentifier;

    @Column(nullable = false, length = 120)
    private String authorName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AppUserRole authorRole;

    @Column(nullable = false, length = 1000)
    private String content;
}
