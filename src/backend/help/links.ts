export function studentLink(id: number) {
    return `/students/${id}`;
}

export function teacherLink(id: number) {
    return `/teachers/${id}`;
}

export function conversationLink(classId: number, assignmentId: number, groupId: number, conversationId: number) {
    return `/classes/${classId}/assignments/${assignmentId}/groups/${groupId}/conversations/${conversationId}`;
}