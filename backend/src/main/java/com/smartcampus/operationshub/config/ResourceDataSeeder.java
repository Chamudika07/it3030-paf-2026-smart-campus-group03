package com.smartcampus.operationshub.config;

import com.smartcampus.operationshub.entity.Resource;
import com.smartcampus.operationshub.enums.ResourceCategory;
import com.smartcampus.operationshub.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class ResourceDataSeeder {

    @Bean
    public CommandLineRunner seedResources(ResourceRepository resourceRepository) {
        return args -> {
            if (resourceRepository.count() > 0) {
                log.info("📦 Resource data already exists — skipping seed ({} records found).",
                        resourceRepository.count());
                return;
            }

            log.info("🌱 Seeding sample resource data...");

            List<Resource> resources = List.of(

                    // ── New Building — Lecture Halls ──────────────────
                    resource("A301", "Lecture Hall A301", ResourceCategory.LECTURE_HALL,
                            "NEW_BUILDING", 120, true),
                    resource("A501", "Lecture Hall A501", ResourceCategory.LECTURE_HALL,
                            "NEW_BUILDING", 200, true),
                    resource("A502", "Lecture Hall A502", ResourceCategory.LECTURE_HALL,
                            "NEW_BUILDING", 200, false),

                    // ── New Building — Labs ───────────────────────────
                    resource("A401", "Computer Lab A401", ResourceCategory.LAB,
                            "NEW_BUILDING", 40, true),
                    resource("A601", "Physics Lab A601", ResourceCategory.LAB,
                            "NEW_BUILDING", 30, true),

                    // ── New Building — Meeting Rooms ──────────────────
                    resource("A101", "Meeting Room A101", ResourceCategory.MEETING_ROOM,
                            "NEW_BUILDING", 12, true),
                    resource("A102", "Meeting Room A102", ResourceCategory.MEETING_ROOM,
                            "NEW_BUILDING", 8, true),

                    // ── New Building — Equipment ──────────────────────
                    resource("PROJ-001", "Projector Unit 001", ResourceCategory.EQUIPMENT,
                            "NEW_BUILDING", 1, true),
                    resource("SCANNER-001", "Document Scanner 001", ResourceCategory.EQUIPMENT,
                            "NEW_BUILDING", 1, false),

                    // ── Engineering Building — Lecture Halls ──────────
                    resource("E301", "Engineering Lecture Hall E301", ResourceCategory.LECTURE_HALL,
                            "ENGINEERING_BUILDING", 150, true),
                    resource("E501", "Engineering Lecture Hall E501", ResourceCategory.LECTURE_HALL,
                            "ENGINEERING_BUILDING", 250, true),

                    // ── Engineering Building — Labs ───────────────────
                    resource("E401", "Electronics Lab E401", ResourceCategory.LAB,
                            "ENGINEERING_BUILDING", 35, true),
                    resource("E601", "Robotics Lab E601", ResourceCategory.LAB,
                            "ENGINEERING_BUILDING", 20, true),

                    // ── Business Building — Lecture Halls ─────────────
                    resource("B301", "Business Lecture Hall B301", ResourceCategory.LECTURE_HALL,
                            "BUSINESS_BUILDING", 100, true),
                    resource("B501", "Business Lecture Hall B501", ResourceCategory.LECTURE_HALL,
                            "BUSINESS_BUILDING", 180, false),

                    // ── Business Building — Meeting Rooms ─────────────
                    resource("B101", "Board Room B101", ResourceCategory.MEETING_ROOM,
                            "BUSINESS_BUILDING", 20, true),
                    resource("B102", "Seminar Room B102", ResourceCategory.MEETING_ROOM,
                            "BUSINESS_BUILDING", 15, true),

                    // ── Main Building ─────────────────────────────────
                    resource("F301", "Main Lecture Hall F301", ResourceCategory.LECTURE_HALL,
                            "MAIN_BUILDING", 300, true),
                    resource("F101", "Staff Meeting Room F101", ResourceCategory.MEETING_ROOM,
                            "MAIN_BUILDING", 10, true),

                    // ── Villom Angels ─────────────────────────────────
                    resource("V301", "Villom Lecture Hall V301", ResourceCategory.LECTURE_HALL,
                            "VILLOM_ANGELS", 90, true)
            );

            resourceRepository.saveAll(resources);
            log.info("✅ Successfully seeded {} sample resources.", resources.size());
        };
    }

    /**
     * Helper to build a Resource entity cleanly.
     */
    private Resource resource(String code, String name, ResourceCategory category,
                               String location, int capacity, boolean active) {
        Resource r = new Resource();
        r.setCode(code);
        r.setName(name);
        r.setCategory(category);
        r.setLocation(location);
        r.setCapacity(capacity);
        r.setActive(active);
        return r;
    }
}
