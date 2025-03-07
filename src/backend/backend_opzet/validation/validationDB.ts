import { z } from "zod";

// User Validation Schema
export const createUserValidationSchema = z.object({
    first_name: z.string().min(3).max(32),
    last_name: z.string().min(3).max(32),
    email: z.string().email(),
    role: z.enum(["student", "teacher"]),
    created_at: z.string().datetime()
});

// Student Validation Schema
export const studentValidationSchema = createUserValidationSchema.extend({
    username: z.string().min(3).max(32),
    password: z.string().min(8)
});

// Teacher Validation Schema
export const teacherValidationSchema = createUserValidationSchema.extend({
    username: z.string().min(3).max(32)
});

// Assignment Validation Schema
export const assignmentValidationSchema = z.object({
    name: z.string(),
    deadline: z.string().datetime().optional(),
    created_at: z.string().datetime(),
    learning_path: z.string().uuid(),
    class: z.number().int()
});

// Class Validation Schema
export const classValidationSchema = z.object({
    name: z.string().optional()
});

// Group Validation Schema
export const groupValidationSchema = z.object({
    name: z.string().optional(),
    class: z.number().int(),
    assignment: z.number().int()
});

// Conversation Validation Schema
export const conversationValidationSchema = z.object({
    title: z.string().optional(),
    learning_object: z.string().uuid(),
    teachers: z.number().int(),
    group: z.number().int(),
    assignment: z.number().int()
});

// Learning Object Validation Schema
export const learningObjectValidationSchema = z.object({
    hruid: z.string(),
    uuid: z.string().uuid(),
    language: z.string().length(2),
    version: z.string(),
    html_content: z.string()
});

// Learning Object Metadata Validation Schema
export const learningObjectMetadataValidationSchema = z.object({
    uuid: z.string().uuid(),
    version: z.number().int(),
    language: z.string().length(2),
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()),
    target_ages: z.array(z.number().int()),
    teacher_exclusive: z.boolean(),
    educational_goals: z.record(z.any()).optional(),
    copyright: z.string().optional(),
    license: z.string().optional(),
    difficulty: z.number().int(),
    estimated_time: z.number().int(),
    available: z.boolean(),
    content_location: z.string()
});

// Message Validation Schema
export const messageValidationSchema = z.object({
    content: z.string().optional(),
    is_student: z.boolean(),
    student: z.number().int().optional(),
    index: z.number().int(),
    conversation: z.number().int()
});

// Notification Validation Schema
export const notificationValidationSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    read: z.boolean(),
    student: z.number().int().optional(),
    teacher: z.number().int().optional()
});

// Submission Validation Schema
export const submissionValidationSchema = z.object({
    group: z.number().int(),
    assignment: z.number().int(),
    submission_type: z.enum(["multiplechoice", "image"]),
    submission_content: z.record(z.any()),
    graded_by: z.number().int().optional()
});
