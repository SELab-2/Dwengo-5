import {z} from "zod";

export const teacherRexp = /^\/teachers\/\d+$/;
export const studentRexp = /^\/students\/\d+$/;
export const learningobjectRexp = /^\/learningobjects\/[a-z0-9-]*$/;
export const learningpathRexp = /^\/learningpaths\/[a-z0-9-]*$/;
export const studentOrTeacherRexp = new RegExp(studentRexp.source + "|" + teacherRexp.source);
export const zTeacherLink = z.string().regex(teacherRexp);
export const zStudentLink = z.string().regex(studentRexp);
export const zLearningobjectLink = z.string().regex(learningobjectRexp);
export const zLearningpathLink = z.string().regex(learningpathRexp);
export const zStudentOrTeacherLink = z.string().regex(studentOrTeacherRexp);

