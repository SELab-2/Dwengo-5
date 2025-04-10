<script>
    import Router, {location, link,push} from 'svelte-spa-router';
    import Login from "./routes/authentication/login/LoginPage.svelte";
    import Home from "./routes/home/HomePage.svelte";
    import Register from "./routes/authentication/register/RegisterPage.svelte";
    import Assignments from "./routes/classes/assignments/AssignmentsPage.svelte";
    import AssignmentsOverView from "./routes/assignments/AssignmentsOverview.svelte"
    import ClassroomOverview from "./routes/classes/ClassroomOverview.svelte";
    import ClassroomDashboard from "./routes/classes/ClassroomDashboard.svelte";
    import QuestionsOverview from "./routes/classes/questions/QuestionsOverview.svelte";
    import SpecificConversation from "./routes/classes/questions/SpecificConversation.svelte";
    import CreateAssignment from "./routes/assignments/create/CreateAssignment.svelte";
    import ClassroomQuestions from "./routes/classes/ClassroomQuestions.svelte";
    import Catalog from "./routes/catalog/CatalogPage.svelte";
    import AssignmentsClassroom from "./routes/classes/assignments/AssignmentsPage.svelte"
    import LearnPath from "./routes/leerpaden/LearningPathDetail.svelte"
    import LearningPathOverview from "./routes/leerpaden/LearningPageOverView.svelte"
    import LearnObject from "./routes/learningobjects/LearningObjectPageDetail.svelte"
    import assigntmentPage from "./routes/assignments/assignmentDetail.svelte"
    import ClassroomJoin from "./routes/classes/join/ClassroomJoin.svelte";
    import ClassroomJoinSpecific from "./routes/classes/join/ClassroomJoinSpecific.svelte";
    import { user } from "./lib/stores/user.ts";
    import { getToken ,clearToken} from './lib/auth.ts';
    import { get } from 'svelte/store';

    //Make sure the user is logged in before navigating to the home page
    const redirectToLogin = () => {
        const token = getToken();

        if (!token || token.trim() === "") {
            push('/login'); // Only redirect if no token
            return null;
        }

        // Get the user store values synchronously
        const userData = get(user); // Get current store state
        if (userData.role && userData.id) {
            push(`/home?role=${encodeURIComponent(userData.role)}&id=${encodeURIComponent(userData.id)}`);
        } else {
            clearToken();
            push('/login');
        }

        return null;
    };
</script>

<Router routes={{
    '/': redirectToLogin,
    '/login': Login,
    '/home': Home,
    '/thuis': Home,
    '/register': Register,
    '/classrooms/join': ClassroomJoin,
    '/classrooms/join/:id' : ClassroomJoinSpecific,
    '/classrooms/:id': ClassroomDashboard,
    '/klassen/:id': ClassroomDashboard,
    '/questions': QuestionsOverview,
    '/klassen': ClassroomOverview,
    '/classrooms': ClassroomOverview,
    //'/classrooms/:id/assignments': Assignments,
    '/assignments':AssignmentsOverView,
    '/opdrachten':AssignmentsOverView,
    //'/assignments':Assignments,
    '/classrooms/:class_id/assignments/create': CreateAssignment,
    '/catalogus': Catalog,
    '/catalog': Catalog,
    '/conversations/:id': SpecificConversation,
    '/classrooms/:id/assignments': AssignmentsClassroom,
    '/learningpaths/:id': LearnPath,
    '/learningpaths/:id/learningobjects/:id': LearnObject,
    '/learningpaths': LearningPathOverview,
    '/leerpaden': LearningPathOverview,
    '/assignments/:id/classes/:id/learningobjects/:id': assigntmentPage
    }}
/>
  
