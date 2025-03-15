export const teacherRexp = /^\/teachers\/\d+$/;
export const studentRexp = /^\/students\/\d+$/;
export const learingobjectRexp = /^\/learningobjects\/[a-z0-9]$/;
export const studentOrTeacherRexp = new RegExp(studentRexp.source + "|" + teacherRexp.source);