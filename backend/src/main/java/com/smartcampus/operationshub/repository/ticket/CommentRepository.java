package com.smartcampus.operationshub.repository.ticket;

import com.smartcampus.operationshub.entity.ticket.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
