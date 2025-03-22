<script>
	  import Router, {location, link,push} from 'svelte-spa-router';
    import Login from "./routes/authentication/login/LoginPage.svelte";
    import Home from "./routes/home/HomePage.svelte";
    import Register from "./routes/authentication/register/RegisterPage.svelte";
    import ClassroomOverview from "./routes/klassen/ClassroomOverview.svelte";
    import ClassroomQuestions from "./routes/klassen/ClassroomQuestions.svelte";
    import Catalog from "./routes/catalog/CatalogPage.svelte";

    //Make sure the user is logged in before navigating to the home page
    const redirectToLogin = () => {
    push('/login');
    return null;
  };
  </script>

  <Router routes={{
    '/':redirectToLogin,
    '/login':Login,
    '/home':Home,
    '/register':Register,
    '/classroom': ClassroomOverview,
    '/catalog':Catalog,
    }}
  />
  
