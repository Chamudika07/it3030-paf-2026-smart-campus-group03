package com.smartcampus.operationshub.service.ticket.impl;

import com.smartcampus.operationshub.config.AppProperties;
import com.smartcampus.operationshub.entity.ticket.Ticket;
import com.smartcampus.operationshub.entity.ticket.TicketAttachment;
import com.smartcampus.operationshub.exception.BadRequestException;
import com.smartcampus.operationshub.exception.FileStorageException;
import com.smartcampus.operationshub.service.ticket.TicketAttachmentStorageService;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TicketAttachmentStorageServiceImpl implements TicketAttachmentStorageService {

    private static final int MAX_ATTACHMENTS = 3;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp"
    );

    private final Path storagePath;

    public TicketAttachmentStorageServiceImpl(AppProperties appProperties) {
        this.storagePath = Paths.get(appProperties.getStorage().getTicketAttachmentsDir())
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(this.storagePath);
        } catch (IOException exception) {
            throw new FileStorageException("Could not create attachment storage directory", exception);
        }
    }

    @Override
    public List<TicketAttachment> storeAttachments(Ticket ticket, List<MultipartFile> files) {
        List<MultipartFile> safeFiles = files == null ? List.of() : files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .toList();

        if (safeFiles.size() > MAX_ATTACHMENTS) {
            throw new BadRequestException("A ticket can contain up to 3 image attachments");
        }

        List<TicketAttachment> attachments = new ArrayList<>();
        for (MultipartFile file : safeFiles) {
            validateFile(file);
            String extension = extractExtension(file.getOriginalFilename());
            String storedFileName = UUID.randomUUID() + extension;
            Path targetLocation = storagePath.resolve(storedFileName).normalize();

            try {
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException exception) {
                throw new FileStorageException("Failed to store attachment: " + file.getOriginalFilename(), exception);
            }

            TicketAttachment attachment = new TicketAttachment();
            attachment.setTicket(ticket);
            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null || originalFileName.isBlank()) {
                originalFileName = "attachment";
            }
                attachment.setOriginalFileName(Objects.requireNonNull(
                    StringUtils.cleanPath(originalFileName),
                    "Original file name must not be null"
                ));
            attachment.setStoredFileName(storedFileName);
            attachment.setFilePath(targetLocation.toString());
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachments.add(attachment);
        }

        return attachments;
    }

    @Override
    public Resource loadAsResource(TicketAttachment attachment) {
        try {
            Path filePath = Paths.get(attachment.getFilePath()).normalize();
            Resource resource = new UrlResource(Objects.requireNonNull(filePath.toUri(), "Attachment URI must not be null"));
            if (!resource.exists() || !resource.isReadable()) {
                throw new FileStorageException("Attachment file could not be read");
            }
            return resource;
        } catch (MalformedURLException exception) {
            throw new FileStorageException("Attachment file path is invalid", exception);
        }
    }

    private void validateFile(MultipartFile file) {
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Only JPEG, PNG, GIF, and WEBP images are allowed");
        }
    }

    private String extractExtension(String fileName) {
        String cleanedName = StringUtils.cleanPath(fileName == null ? "attachment" : fileName);
        int extensionIndex = cleanedName.lastIndexOf('.');
        return extensionIndex >= 0 ? cleanedName.substring(extensionIndex) : "";
    }
}
