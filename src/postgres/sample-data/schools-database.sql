-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
    teacher_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);

-- Insert dummy data into teachers table
INSERT INTO teachers (name, email, phone)
VALUES
    ('John Smith', 'john.smith@example.com', '123-456-7890'),
    ('Alice Johnson', 'alice.johnson@example.com', '987-654-3210'),
    ('Michael Brown', 'michael.brown@example.com', '555-123-4567'),
    ('Emily Davis', 'emily.davis@example.com', '111-222-3333'),
    ('David Wilson', 'david.wilson@example.com', '444-555-6666'),
    ('Jessica Martinez', 'jessica.martinez@example.com', '777-888-9999'),
    ('Christopher Taylor', 'christopher.taylor@example.com', '888-777-6666'),
    ('Sarah Anderson', 'sarah.anderson@example.com', '999-000-1111'),
    ('Matthew Thomas', 'matthew.thomas@example.com', '000-999-8888'),
    ('Elizabeth Jackson', 'elizabeth.jackson@example.com', '111-222-3333'),
    ('Daniel Harris', 'daniel.harris@example.com', '222-333-4444'),
    ('Jennifer White', 'jennifer.white@example.com', '333-444-5555'),
    ('William Garcia', 'william.garcia@example.com', '444-555-6666'),
    ('Olivia Martinez', 'olivia.martinez@example.com', '555-666-7777'),
    ('James Hernandez', 'james.hernandez@example.com', '666-777-8888');

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);

-- Insert dummy data into students table
INSERT INTO students (name, email, phone)
VALUES
    ('Emma Johnson', 'emma.johnson@example.com', '123-456-7890'),
    ('Noah Williams', 'noah.williams@example.com', '987-654-3210'),
    ('Olivia Brown', 'olivia.brown@example.com', '555-123-4567'),
    ('Liam Jones', 'liam.jones@example.com', '111-222-3333'),
    ('Ava Garcia', 'ava.garcia@example.com', '444-555-6666'),
    ('William Martinez', 'william.martinez@example.com', '777-888-9999'),
    ('Isabella Miller', 'isabella.miller@example.com', '888-777-6666'),
    ('Mason Taylor', 'mason.taylor@example.com', '999-000-1111'),
    ('Sophia Davis', 'sophia.davis@example.com', '000-999-8888'),
    ('James Rodriguez', 'james.rodriguez@example.com', '111-222-3333'),
    ('Emily Wilson', 'emily.wilson@example.com', '222-333-4444'),
    ('Benjamin Johnson', 'benjamin.johnson@example.com', '333-444-5555'),
    ('Charlotte Anderson', 'charlotte.anderson@example.com', '444-555-6666'),
    ('Lucas Hernandez', 'lucas.hernandez@example.com', '555-666-7777'),
    ('Amelia Martinez', 'amelia.martinez@example.com', '666-777-8888');

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100)
);

-- Insert dummy data into subjects table
INSERT INTO subjects (subject_name)
VALUES
    ('Algebra'),
    ('Biology'),
    ('World History'),
    ('Literature'),
    ('Programming'),
    ('Drawing'),
    ('Gym'),
    ('Music Theory');

-- Create teacher_subjects table for many-to-many relationship between teachers and subjects
CREATE TABLE IF NOT EXISTS teacher_subjects (
    teacher_id INT REFERENCES teachers(teacher_id),
    subject_id INT REFERENCES subjects(subject_id),
    PRIMARY KEY (teacher_id, subject_id)
);

-- Insert dummy data into teacher_subjects table
INSERT INTO teacher_subjects (teacher_id, subject_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 1),
    (10, 2),
    (11, 3),
    (12, 4),
    (13, 5),
    (14, 6),
    (15, 7);

-- Create student_subjects table for many-to-many relationship between students and subjects
CREATE TABLE IF NOT EXISTS student_subjects (
    student_id INT REFERENCES students(student_id),
    subject_id INT REFERENCES subjects(subject_id),
    PRIMARY KEY (student_id, subject_id)
);

-- Insert dummy data into student_subjects table
INSERT INTO student_subjects (student_id, subject_id)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 1),
    (10, 2),
    (11, 3),
    (12, 4),
    (13, 5),
    (14, 6),
    (15, 7);
