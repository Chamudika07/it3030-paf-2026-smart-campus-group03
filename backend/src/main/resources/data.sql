-- Seed data for resources table
-- Only insert if table is empty
INSERT INTO resources (code, name, category, location, capacity, active, created_at, updated_at)
SELECT * FROM (VALUES
    ('LH001', 'Lecture Hall 1', 'LECTURE_HALL', 'Building A, 1st Floor', 150, true, NOW(), NOW()),
    ('LH002', 'Lecture Hall 2', 'LECTURE_HALL', 'Building A, 2nd Floor', 120, true, NOW(), NOW()),
    ('LH003', 'Lecture Hall 3', 'LECTURE_HALL', 'Building B, Ground Floor', 100, true, NOW(), NOW()),
    ('LAB001', 'Physics Lab', 'LAB', 'Building B, 1st Floor', 40, true, NOW(), NOW()),
    ('LAB002', 'Chemistry Lab', 'LAB', 'Building B, 2nd Floor', 35, false, NOW(), NOW()),
    ('LAB003', 'Biology Lab', 'LAB', 'Building C, 1st Floor', 30, true, NOW(), NOW()),
    ('MR001', 'Meeting Room 1', 'MEETING_ROOM', 'Building C, 2nd Floor', 20, true, NOW(), NOW()),
    ('MR002', 'Meeting Room 2', 'MEETING_ROOM', 'Building C, 3rd Floor', 15, true, NOW(), NOW()),
    ('EQ001', 'Projector 1', 'EQUIPMENT', 'A/V Storage', 1, true, NOW(), NOW()),
    ('EQ002', 'Projector 2', 'EQUIPMENT', 'A/V Storage', 1, true, NOW(), NOW()),
    ('EQ003', 'Whiteboard 1', 'EQUIPMENT', 'Building A Store', 1, true, NOW(), NOW())
) AS data(code, name, category, location, capacity, active, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM resources);
