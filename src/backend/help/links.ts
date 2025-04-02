export function studentLink(id: number) {
    return `/students/${id}`;
}

export function teacherLink(id: number) {
    return `/teachers/${id}`;
}

export function classLink(id: number) {
    return `/classes/${id}`;
}

export function assignmentLink(classId: number, assignmentId: number) {
    return `/classes/${classId}/assignments/${assignmentId}`;
}

export function groupLink(classId: number, assignmentId: number, groupId: number) {
    return `/classes/${classId}/assignments/${assignmentId}/groups/${groupId}`;
}

export function conversationLink(classId: number, assignmentId: number, groupId: number, conversationId: number) {
    return `/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}`;
}

export function messageLink(classId: number, assignmentId: number, groupId: number, conversationId: number, messageId: number) {
    return `/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}/messages/${messageId}`;
}

export function learningpathLink(id: string) {
    return `/learningpaths/${id}`;
}

export function learningobjectLink(id: string) {
    return `/learningobjects/${id}`;
}

export function studentNotificationLink(studentId: number, notificationId: number) {
    return `/students/${studentId}/notifications/${notificationId}`;
}


export function studentWaitingroomLink(classId: number, studentId: number) {
    return `/classes/${classId}/students/waitingroom/${studentId}`;
}

/**
 * a function to get the characters of a link after the last slash
 * @param link the link
 * @return the last value of the link
 */
export function splitIdToString(link: string) {
    return link.split("/").at(-1);
}

/**
 * a function to get an id located after the last slash
 * @param link the link
 * @return the id located after the last slash
 */
export function splitId(link: string) {
    return Number(link.split("/").at(-1));
}