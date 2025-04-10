import {
    deleteWaitingroomUserUnion,
    getWaitingroomUserUnion,
    patchWaitingroomUserUnion,
    postWaitingroomUserUnion
} from "../../../teacherStudentUnions/waitingroomControllerUnion.ts"

export const deleteWaitingroomTeacher = deleteWaitingroomUserUnion("teacher");
export const patchWaitingroomTeacher = patchWaitingroomUserUnion("teacher");
export const postWaitingroomTeacher = postWaitingroomUserUnion("teacher");
export const getWaitingroomTeachers = getWaitingroomUserUnion("teacher");