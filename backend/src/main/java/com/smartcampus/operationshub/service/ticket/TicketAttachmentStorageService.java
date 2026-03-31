package com.smartcampus.operationshub.service.ticket;

import com.smartcampus.operationshub.entity.ticket.Ticket;
import com.smartcampus.operationshub.entity.ticket.TicketAttachment;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface TicketAttachmentStorageService {
    List<TicketAttachment> storeAttachments(Ticket ticket, List<MultipartFile> files);
    Resource loadAsResource(TicketAttachment attachment);
}
