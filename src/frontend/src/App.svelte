<script>
	import Router, {location, link,push} from 'svelte-spa-router';
    import Login from "./routes/authenticatie/aanmelden/LoginPage.svelte";
    import Home from "./routes/home/HomePage.svelte";
    import Register from "./routes/authenticatie/registreren/RegisterPage.svelte";

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
    }}
  />
  
