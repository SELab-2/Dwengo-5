<script>
    import Router, {location, link,push} from 'svelte-spa-router';
    import Login from "./routes/authentication/login/LoginPage.svelte";
    import Home from "./routes/home/HomePage.svelte";
    import Register from "./routes/authentication/register/RegisterPage.svelte";
    import Assignments from "./routes/classes/assignments/AssignmentsPage.svelte";
    import ClassroomOverview from "./routes/classes/ClassroomOverview.svelte";
    import ClassroomDetail from "./routes/classes/ClassroomDetail.svelte";
    import ClassroomQuestions from "./routes/classes/ClassroomQuestions.svelte";
    import Catalog from "./routes/catalog/CatalogPage.svelte";
    import LearnPath from "./routes/leerpaden/LearningPathDetail.svelte"
    import LearningPathOverview from "./routes/leerpaden/LearningPageOverview.svelte"
    import LearnObject from "./routes/learningobjects/LearningObjectPageDetail.svelte"
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
    '/classrooms/:id': ClassroomDetail,
    '/klassen/:id': ClassroomDetail,
    '/klassen': ClassroomOverview,
    '/classrooms': ClassroomOverview,
    '/assignments':Assignments,
    '/catalogus': Catalog,
    '/catalog': Catalog,
    '/learningpaths/:id': LearnPath,
    '/learningpaths/:id/learningobjects/:id': LearnObject,
    '/learningpaths': LearningPathOverview
    }}
/>
  
