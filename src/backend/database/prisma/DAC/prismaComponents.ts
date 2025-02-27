import {DataAccessComponent} from "../../abstract/DAC/components.ts";
import PrismaAssignmentDAO from "../DAO/prismaAssignmentDAO.ts";
import PrismaClassDAO from "../DAO/prismaClassDAO.ts";
import PrismaConversationDAO from "../DAO/prismaConversationDAO.ts";
import PrismaGroupDAO from "../DAO/prismaGroupDAO.ts";
import PrismaLearningObjectDAO from "../DAO/prismaLearningObjectDAO.ts";
import PrismaLearningObjectMetadataDAO from "../DAO/prismaLearningObjectMetadataDAO.ts";
import PrismaLearningPathDAO from "../DAO/prismaLearningPathDAO.ts";
import PrismaLearningPathNodeDAO from "../DAO/prismaLearningPathNodeDAO.ts";
import PrismaMessageDAO from "../DAO/prismaMessageDAO.ts";
import PrismaStudentDAO from "../DAO/prismaStudentDAO.ts";
import PrismaSubmissionDAO from "../DAO/prismaSubmissionDAO.ts";
import PrismaTeacherDAO from "../DAO/prismaTeacherDAO.ts";

const dataAccessComponent: DataAccessComponent = {
    assignmentDAO: new PrismaAssignmentDAO(),
    classDAO: new PrismaClassDAO(),
    conversationDAO: new PrismaConversationDAO(),
    groupDAO: new PrismaGroupDAO(),
    learningObjectDAO: new PrismaLearningObjectDAO(),
    learningObjectMetadataDAO: new PrismaLearningObjectMetadataDAO(),
    learningPathDAO: new PrismaLearningPathDAO(),
    learningPathNodeDAO: new PrismaLearningPathNodeDAO(),
    messageDAO: new PrismaMessageDAO(),
    studentDAO: new PrismaStudentDAO(),
    submissionDAO: new PrismaSubmissionDAO(),
    teacherDAO: new PrismaTeacherDAO()
    //transitionDAO: new TransitionDAO(),
};

export default dataAccessComponent;
