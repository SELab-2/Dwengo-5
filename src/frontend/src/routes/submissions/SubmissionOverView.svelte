<script lang="ts"> 
    import Header from "../../lib/components/layout/Header.svelte";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import BackButton from "../../lib/components/ui/BackButton.svelte";
    
    import { onMount } from "svelte";
    import { apiRequest } from "../../lib/api";
    import { routeTo } from "../../lib/route.ts";

    function getQueryParamsURL() {
        const hash = window.location.hash; // Get the hash part of the URL
        const queryParams = new URLSearchParams(hash.split('?')[1] || ''); // Extract the query parameters after '?'
        return {
			role: queryParams.get('role'),
			id: queryParams.get('id'),
        };
    }
    
    let loading = true;
    let role = getQueryParamsURL().role;
    let id = getQueryParamsURL().id;

    let url = window.location.href;
    let hashWithoutParams = window.location.hash.split("?")[0];
    let urlWithoutParams = hashWithoutParams.split("#")[1];
    let assignmentId = urlWithoutParams.split('/')[4]
    let groupId = urlWithoutParams.split('/')[6]
    let classId = urlWithoutParams.split('/')[2]


</script>

<Header></Header>
<p>{assignmentId}</p>
<p>{groupId}</p>
<p>{classId}</p>