package com.smartcampus.operationshub.repository.ticket;

import com.smartcampus.operationshub.entity.ticket.TicketAttachment;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {
    Optional<TicketAttachment> findByStoredFileName(String storedFileName);
}
