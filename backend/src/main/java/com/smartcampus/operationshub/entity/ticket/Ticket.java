package com.smartcampus.operationshub.entity.ticket;

import com.smartcampus.operationshub.entity.BaseEntity;
import com.smartcampus.operationshub.entity.Resource;
import com.smartcampus.operationshub.enums.AppUserRole;
import com.smartcampus.operationshub.enums.ticket.TicketCategory;
import com.smartcampus.operationshub.enums.ticket.TicketPriority;
import com.smartcampus.operationshub.enums.ticket.TicketStatus;
import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tickets")
public class Ticket extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TicketCategory category;

    @Column(nullable = false, length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TicketPriority priority;

    @Column(nullable = false, length = 150)
    private String preferredContact;

    @Column(length = 180)
    private String locationText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TicketStatus status = TicketStatus.OPEN;

    @Column(length = 500)
    private String rejectionReason;

    @Column(length = 1500)
    private String resolutionNotes;

    @Column(nullable = false, length = 120)
    private String createdByIdentifier;

    @Column(nullable = false, length = 120)
    private String createdByName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AppUserRole createdByRole;

    @Column(length = 120)
    private String assignedTechnicianIdentifier;

    @Column(length = 120)
    private String assignedTechnicianName;

    @Column(length = 160)
    private String assignedTechnicianEmail;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<TicketAttachment> attachments = new ArrayList<>();
}
