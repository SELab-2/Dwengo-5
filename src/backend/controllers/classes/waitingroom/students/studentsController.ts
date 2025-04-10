import {deleteWaitingroomUserUnion,patchWaitingroomUserUnion,postWaitingroomUserUnion,getWaitingroomUserUnion} from "../../../teacherStudentUnions/waitingroomControllerUnion.ts"

export const deleteWaitingroomStudent = deleteWaitingroomUserUnion("student");
export const patchWaitingroomStudent =     patchWaitingroomUserUnion("student");
export const postWaitingroomStudent =     postWaitingroomUserUnion("student");
export const getWaitingroomStudents =     getWaitingroomUserUnion("student");