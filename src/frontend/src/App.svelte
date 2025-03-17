<script>
	import Router, {location, link} from 'svelte-spa-router';
    import Login from "./routes/authenticatie/aanmelden/LoginPage.svelte";
    import Home from "./routes/TestHomePage.svelte";

    $: console.log("Current Route:", $location);

  </script>
  <p>Current route: {$location}</p>  <!-- Debugging -->

  <Router routes={{
    '/aanmelden': Home,
    '/':Login,
    }}
  />
  
  <hr>
/#{$location}