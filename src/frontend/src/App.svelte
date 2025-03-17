<script>
	import Router, {location, link} from 'svelte-spa-router';
    import Login from "./routes/authenticatie/aanmelden/LoginPage.svelte";
    import Home from "./routes/TestHomePage.svelte";
  </script>
  
  <Router routes={{
    '/': Home,
    '/login': Login,

    }}
  />
  
  