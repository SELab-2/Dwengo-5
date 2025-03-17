<script>
    import { Router, Route } from "svelte-spa-router";
    import Login from "./routes/authenticatie/aanmelden/LoginPage.svelte";
    import Home from "./routes/TestHomePage.svelte";
  </script>
  
  <Router>
    <Route path="/" component={Home} />
  </Router>
  