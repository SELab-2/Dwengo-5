import {z} from "zod";

export const userRexp = /^\/users\/\d+$/;
export const learningobjectRexp = /^\/learningobjects\/[a-z0-9-]*$/;
export const learningpathRexp = /^\/learningpaths\/[a-z0-9-]*$/;
export const zUserLink = z.string().regex(userRexp);
export const zLearningobjectLink = z.string().regex(learningobjectRexp);
export const zLearningpathLink = z.string().regex(learningpathRexp);

