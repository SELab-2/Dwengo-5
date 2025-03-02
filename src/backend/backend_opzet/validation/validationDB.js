"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionValidationSchema = exports.notificationValidationSchema = exports.messageValidationSchema = exports.learningObjectMetadataValidationSchema = exports.learningObjectValidationSchema = exports.conversationValidationSchema = exports.groupValidationSchema = exports.classValidationSchema = exports.assignmentValidationSchema = exports.teacherValidationSchema = exports.studentValidationSchema = exports.createUserValidationSchema = void 0;
var zod_1 = require("zod");
// User Validation Schema
exports.createUserValidationSchema = zod_1.z.object({
    first_name: zod_1.z.string().min(3).max(32),
    last_name: zod_1.z.string().min(3).max(32),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(["student", "teacher"]),
    active_language: zod_1.z.string().length(2),
    created_at: zod_1.z.string().datetime()
});
// Student Validation Schema
exports.studentValidationSchema = exports.createUserValidationSchema.extend({
    username: zod_1.z.string().min(3).max(32),
    password: zod_1.z.string().min(8)
});
// Teacher Validation Schema
exports.teacherValidationSchema = exports.createUserValidationSchema.extend({
    username: zod_1.z.string().min(3).max(32)
});
// Assignment Validation Schema
exports.assignmentValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    deadline: zod_1.z.string().datetime().optional(),
    created_at: zod_1.z.string().datetime(),
    learning_path: zod_1.z.string().uuid(),
    class: zod_1.z.number().int()
});
// Class Validation Schema
exports.classValidationSchema = zod_1.z.object({
    name: zod_1.z.string().optional()
});
// Group Validation Schema
exports.groupValidationSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    class: zod_1.z.number().int(),
    assignment: zod_1.z.number().int()
});
// Conversation Validation Schema
exports.conversationValidationSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    learning_object: zod_1.z.string().uuid(),
    teachers: zod_1.z.number().int(),
    group: zod_1.z.number().int(),
    assignment: zod_1.z.number().int()
});
// Learning Object Validation Schema
exports.learningObjectValidationSchema = zod_1.z.object({
    hruid: zod_1.z.string(),
    uuid: zod_1.z.string().uuid(),
    language: zod_1.z.string().length(2),
    version: zod_1.z.string(),
    html_content: zod_1.z.string()
});
// Learning Object Metadata Validation Schema
exports.learningObjectMetadataValidationSchema = zod_1.z.object({
    uuid: zod_1.z.string().uuid(),
    version: zod_1.z.number().int(),
    language: zod_1.z.string().length(2),
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    keywords: zod_1.z.array(zod_1.z.string()),
    target_ages: zod_1.z.array(zod_1.z.number().int()),
    teacher_exclusive: zod_1.z.boolean(),
    educational_goals: zod_1.z.record(zod_1.z.any()).optional(),
    copyright: zod_1.z.string().optional(),
    license: zod_1.z.string().optional(),
    difficulty: zod_1.z.number().int(),
    estimated_time: zod_1.z.number().int(),
    available: zod_1.z.boolean(),
    content_location: zod_1.z.string()
});
// Message Validation Schema
exports.messageValidationSchema = zod_1.z.object({
    content: zod_1.z.string().optional(),
    is_student: zod_1.z.boolean(),
    student: zod_1.z.number().int().optional(),
    index: zod_1.z.number().int(),
    conversation: zod_1.z.number().int()
});
// Notification Validation Schema
exports.notificationValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    read: zod_1.z.boolean(),
    student: zod_1.z.number().int().optional(),
    teacher: zod_1.z.number().int().optional()
});
// Submission Validation Schema
exports.submissionValidationSchema = zod_1.z.object({
    group: zod_1.z.number().int(),
    assignment: zod_1.z.number().int(),
    submission_type: zod_1.z.enum(["multiplechoice", "image"]),
    submission_content: zod_1.z.record(zod_1.z.any()),
    graded_by: zod_1.z.number().int().optional()
});
