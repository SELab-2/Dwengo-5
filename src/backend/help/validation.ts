import { z } from "zod";

export const userRexp = /^\/users\/\d+$/;
export const learningobjectRexp = /^\/learningobjects\/.*$/;
export const learningpathRexp = /^\/learningpaths\/.*$/;
export const assignmentLink = /^\/classes\/\d+\/assignments\/\d+$/;
export const zUserLink = z.string().regex(userRexp);
export const zLearningobjectLink = z.string().regex(learningobjectRexp);
export const zLearningpathLink = z.string().regex(learningpathRexp);
export const zAssignmentLink = z.string().regex(assignmentLink);
