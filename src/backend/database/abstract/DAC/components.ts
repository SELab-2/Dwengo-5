//import TransitionDAO from '../DAO/transitionDAO';
import AssignmentDAO from '../DAO/assignmentDAO';
import ClassDAO from '../DAO/classDAO';
import ConversationDAO from '../DAO/conversationDAO';
import GroupDAO from '../DAO/groupDAO';
import LearningObjectDAO from '../DAO/learningObjectDAO';
import LearningObjectMetadataDAO from '../DAO/learningObjectMetadataDAO';
import LearningPathDAO from '../DAO/learningPathDAO';
import LearningPathNodeDAO from '../DAO/learningPathNodeDAO';
import MessageDAO from '../DAO/messageDAO';
import StudentDAO from '../DAO/studentDAO';
import SubmissionDAO from '../DAO/submissionDAO';
import TeacherDAO from '../DAO/teacher_DAO';



interface DataAccessComponent {
    learningPathNodeDAO: LearningPathNodeDAO;
    learningObjectDAO: LearningObjectDAO;
    //transitionDAO: TransitionDAO;
    // Additional DAOs can be added as needed
}

const dataAccessComponent: DataAccessComponent = {
    learningPathNodeDAO: new LearningPathNodeDAO(),
    learningObjectDAO: new LearningObjectDAO(),
    //transitionDAO: new TransitionDAO(),
};

export default dataAccessComponent;
