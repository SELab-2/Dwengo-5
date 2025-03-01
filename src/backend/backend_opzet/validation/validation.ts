import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ValidationResult {
    websiteUp: boolean;
    sslEnabled: boolean;
    consoleErrors: boolean;
    loadTime: string | null;
}

async function validateWebsite(url: string): Promise<ValidationResult> {
    const browser = await puppeteer.launch({
        headless: true,
        channel: 'chrome'
    });

    const page = await browser.newPage();

    const results: ValidationResult = {
        websiteUp: false,
        sslEnabled: url.startsWith('https'),
        consoleErrors: false,
        loadTime: null
    };

    try {
        const start = Date.now();
        const response = await page.goto(url, { waitUntil: 'load', timeout: 10000 });
        const end = Date.now();

        results.websiteUp = response?.status() === 200 || false;
        results.loadTime = `${((end - start) / 1000).toFixed(2)}s`;

        let consoleErrors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        results.consoleErrors = consoleErrors.length > 0;

    } catch (error: any) {
        console.error("Error checking website:", error.message);
    } finally {
        await browser.close();
    }

    return results;
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

interface User {
    email: string;
    username: string;
}

function checkEmailFormat(user: User): void {
    if (user.email && !validateEmail(user.email)) {
        throw new Error(`Invalid email format for ${user.username}.`);
    }
}

async function checkUniqueEmail(email: string, prisma: PrismaClient): Promise<void> {
    const studentWithEmail = await prisma.student.findUnique({ where: { email } });
    const teacherWithEmail = await prisma.teacher.findUnique({ where: { email } });

    if (studentWithEmail || teacherWithEmail) {
        throw new Error("Email is already in use by another user (student or teacher).");
    }
}

async function checkIfUserIsActive(userId: number, isStudent: boolean, prisma: PrismaClient): Promise<void> {
    const user = isStudent
        ? await prisma.student.findUnique({ where: { id: userId } })
        : await prisma.teacher.findUnique({ where: { id: userId } });

    if (!user) {
        throw new Error(`User with ID ${userId} is not active.`);
    }
}

async function checkStudentInClass(classId: number, studentId: number, prisma: PrismaClient): Promise<void> {
    const studentInClass = await prisma.classStudent.findFirst({
        where: { classes_id: classId, students_id: studentId },
    });

    if (!studentInClass) {
        throw new Error(`Student with ID ${studentId} is not enrolled in class ${classId}.`);
    }
}

async function checkTeacherInClass(classId: number, teacherId: number, prisma: PrismaClient): Promise<void> {
    const teacherInClass = await prisma.classTeacher.findFirst({
        where: { classes_id: classId, teachers_id: teacherId },
    });

    if (!teacherInClass) {
        throw new Error(`Teacher with ID ${teacherId} is not assigned to class ${classId}.`);
    }
}

async function checkGroupExistence(groupId: number, prisma: PrismaClient): Promise<void> {
    const groupExists = await prisma.group.findUnique({ where: { id: groupId } });

    if (!groupExists) {
        throw new Error(`Group with ID ${groupId} does not exist.`);
    }
}

function checkIfFirstIsSmaller(arr: number[]): boolean {
    if (arr.length !== 2) {
        throw new Error("The array must contain exactly two integers.");
    }

    const [first, second] = arr;
    return first < second;
}

function validateLanguage(language: string): boolean {
    return typeof language === 'string' && language.length === 2;
}

interface Assignment {
    name: string;
    learning_path: string;
    class: string;
    deadline?: string;
    created_at?: string;
}

function checkRequiredFields(assignment: Assignment): void {
    if (!assignment.name || assignment.name.trim() === '') {
        throw new Error("Assignment name cannot be empty.");
    }
    if (!assignment.learning_path) {
        throw new Error("Learning path is required.");
    }
    if (!assignment.class) {
        throw new Error("Class ID is required.");
    }
}

function checkDateConsistency(assignment: Assignment): void {
    if (assignment.deadline && assignment.created_at && new Date(assignment.deadline) < new Date(assignment.created_at)) {
        throw new Error("Assignment deadline cannot be before the creation date.");
    }
}

function checkDeadlineNotTooFar(deadline: string): void {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (new Date(deadline) > oneYearFromNow) {
        throw new Error("Assignment deadline cannot be more than one year in the future.");
    }
}

async function checkClassExistence(classId: number, prisma: PrismaClient): Promise<void> {
    const classExists = await prisma.class.findUnique({ where: { id: classId } });

    if (!classExists) {
        throw new Error(`Class with ID ${classId} does not exist.`);
    }
}

async function checkLearningPathExistence(learningPathUuid: string, prisma: PrismaClient): Promise<void> {
    const learningPathExists = await prisma.learningPath.findUnique({ where: { uuid: learningPathUuid } });

    if (!learningPathExists) {
        throw new Error(`Learning path with UUID ${learningPathUuid} does not exist.`);
    }
}

async function checkUniqueLearningObjectUUID(uuid: string, prisma: PrismaClient): Promise<void> {
    const uuidExists = await prisma.learningObject.findUnique({ where: { uuid } });

    if (uuidExists) {
        throw new Error("Learning object UUID is already in use.");
    }
}

const validSubmissionTypes: string[] = ['multiplechoice', 'image'];

function checkValidSubmissionType(submissionType: string): void {
    if (!validSubmissionTypes.includes(submissionType)) {
        throw new Error("Invalid submission type.");
    }
}

function checkMessageContent(messageContent: string): void {
    if (!messageContent || messageContent.trim() === '') {
        throw new Error("Message content cannot be empty.");
    }
}

function checkValidLearningObjectVersion(version: number): void {
    if (isNaN(version) || version < 1) {
        throw new Error("Learning object version must be a positive integer.");
    }
}

function checkKeywordsLength(keywords: string[]): void {
    keywords.forEach((keyword) => {
        if (keyword.length > 50) {
            throw new Error("Each keyword must be less than 50 characters.");
        }
    });
}

function checkSubmissionSize(submissionContent: string): void {
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (submissionContent.length > MAX_SIZE) {
        throw new Error("Submission exceeds the maximum allowed size of 10 MB.");
    }
}

validateWebsite('https://sel2-5.ugent.be').then(results => console.log(results));

export {
    validateWebsite,
    validateEmail,
    checkEmailFormat,
    checkUniqueEmail,
    checkIfUserIsActive,
    checkStudentInClass,
    checkTeacherInClass,
    checkGroupExistence,
    checkIfFirstIsSmaller,
    validateLanguage,
    checkRequiredFields,
    checkDateConsistency,
    checkDeadlineNotTooFar,
    checkClassExistence,
    checkLearningPathExistence,
    checkUniqueLearningObjectUUID,
    checkValidSubmissionType,
    checkMessageContent,
    checkValidLearningObjectVersion,
    checkKeywordsLength,
    checkSubmissionSize
};
