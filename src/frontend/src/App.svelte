<script lang="ts">
    import Router, {location, link} from 'svelte-spa-router';
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
    import Catalog from "./routes/catalog/CatalogPage.svelte";
    import AssignmentsClassroom from "./routes/classes/assignments/AssignmentsPage.svelte"
    import LearnPath from "./routes/learningpaths/LearningPathDetail.svelte"
    import LearningPathOverview from "./routes/learningpaths/LearningPageOverView.svelte"
    import LearnObject from "./routes/learningobjects/LearningObjectPageDetail.svelte"
    import AssignmentPage from "./routes/assignments/AssignmentDetail.svelte"
    import ClassroomJoinSpecific from "./routes/classes/join/ClassroomJoinSpecific.svelte";
    import AssignmentsGroupsPage from "./routes/classes/assignments/groups/AssignmentsGroupsPage.svelte";
    import AssignmentDashBoard from "./routes/classes/assignments/AssignmentDashboard.svelte";
	import UserProfile from "./routes/authentication/UserProfilePage.svelte";
    import { user } from "./lib/stores/user.ts";
    import { getToken ,clearToken} from './lib/auth.ts';
    import { get } from 'svelte/store';
    import { push } from './lib/route.ts';
    import CreateLearningPath from './routes/learningpaths/LearningpathCreate.svelte';
    import LearningPathUpdate from './routes/learningpaths/LearningpathUpdate.svelte';
    import AssignmentsPage from './routes/classes/assignments/AssignmentsPage.svelte';
    import SubmissionDetail from './routes/submissions/SubmissionDetail.svelte'
    import SubmissionOverView from './routes/submissions/SubmissionOverView.svelte'
    

    // Make sure the user is logged in before navigating to the home page
    const redirectToLogin = () => {
        const token = getToken();

        if (!token || token.trim() === "") {
            push('/login'); // Only redirect if no token
            return null;
        }

        // Get the user store values synchronously
        const userData = get(user); // Get current store state
        if (userData.role && userData.id) {
            push(`/home`);
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
    '/register': Register,
    '/classrooms/join/:id' : ClassroomJoinSpecific,
    '/classrooms/:id': ClassroomDashboard,
    '/questions': QuestionsOverview,
    '/classrooms': ClassroomOverview,
    //'/classrooms/:id/assignments': Assignments,
    '/assignments':AssignmentsOverView,
    '/classrooms/:class_id/assignments/create': CreateAssignment,
    '/catalog/learningtheme/:id': Catalog,
    '/conversations/:id': SpecificConversation,
    '/classrooms/:id/assignments': AssignmentsClassroom,
    '/learningpaths/create': CreateLearningPath, // Must be before /learningpaths/:id, otherwise 'create' will be interpreted as an id
    '/learningpaths/update/:id': LearningPathUpdate,
    '/learningpaths/:id': LearnPath,
    '/learningpaths/:id/learningobjects/:id': LearnObject,
    '/learningpaths': LearningPathOverview,
    '/leerpaden': LearningPathOverview,
    '/classrooms/:id/assignments/:id/groups': AssignmentsGroupsPage,
    '/classrooms/:id/assignments/:id/groups/:id/dashboard': AssignmentDashBoard,
    '/classrooms/:id/assignments/:id/learningobjects/:id': AssignmentPage,
    '/classrooms/:id/assignments/:id/groups/:id/submissions': SubmissionOverView,
    '/classrooms/:id/assignments/:id/groups/:id/submissions/:id': SubmissionDetail,
    '/userprofile': UserProfile,
    }}
/>
  
