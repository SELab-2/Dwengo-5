import {AssignmentDAO} from '../DAO/assignmentDAO';
import {ClassDAO} from '../DAO/classDAO';
import {ConversationDAO} from '../DAO/conversationDAO';
import {GroupDAO} from '../DAO/groupDAO';
import {LearningObjectDAO} from '../DAO/learningObjectDAO';
import {LearningObjectMetadataDAO} from '../DAO/learningObjectMetadataDAO';
import {LearningPathDAO} from '../DAO/learningPathDAO';
import {LearningPathNodeDAO} from '../DAO/learningPathNodeDAO';
import {MessageDAO} from '../DAO/messageDAO';
import {StudentDAO} from '../DAO/studentDAO';
import {SubmissionDAO} from '../DAO/submissionDAO';
import {TeacherDAO} from '../DAO/teacher_DAO';
//import TransitionDAO from '../DAO/transitionDAO';


export interface DataAccessComponent {
    assignmentDAO: AssignmentDAO;
    classDAO: ClassDAO;
    conversationDAO: ConversationDAO;
    groupDAO: GroupDAO;
    learningObjectDAO: LearningObjectDAO;
    learningObjectMetadataDAO: LearningObjectMetadataDAO;
    learningPathDAO: LearningPathDAO;
    learningPathNodeDAO: LearningPathNodeDAO;
    messageDAO: MessageDAO;
    studentDAO: StudentDAO;
    submissionDAO: SubmissionDAO;
    teacherDAO: TeacherDAO;
    //transitionDAO: TransitionDAO;
}