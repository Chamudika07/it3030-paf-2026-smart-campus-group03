package com.smartcampus.operationshub.repository.ticket;

import com.smartcampus.operationshub.entity.ticket.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}
