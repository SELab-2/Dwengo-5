<script>
    import { Router, Route } from "svelte-spa-router";
    import Login from "./routes/authenticatie/aanmelden/LoginPage.svelte";
  </script>
  
  <Router>
    <Route path="/" component={Login} />
  </Router>
  