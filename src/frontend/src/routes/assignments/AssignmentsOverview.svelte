
<script>
    import { apiRequest } from "../../lib/api";
    
    function getQueryParamsURL() {
        const hash = window.location.hash; // Get the hash part of the URL
        const queryParams = new URLSearchParams(hash.split('?')[1] || ''); // Extract the query parameters after '?'
        return {
        role: queryParams.get('role'),
        id: queryParams.get('id'),
        };
    }
    //export const role = getQueryParams()[0];
    //export const id = getQueryParams()[1];
    let role = getQueryParamsURL().role
    let id = getQueryParamsURL().id

    let learningpaths = []
    let classes = []
    async function fetchLearningPaths() {
        try{
            learningpaths = await apiRequest(`/students/${id}/classes`, "get");
            //classes = learningpaths.classes

            classes = learningpaths.classes;
        }catch(e){
            console.log("foei");
        }
        
    }

    let assignmentsUrls = []

    async function fetchAssignmentsUrls() {
        try{
            let allAssignments = [];
        
            for (let classId of classes) {
                const response = await apiRequest(`/students/${id}${classId}/assignments`);
                allAssignments = allAssignments.concat(response.assignments); // Merge results
            }

            assignmentsUrls = allAssignments; //todo result in seed.ts is not right.
            //assignments = await apiRequest(`/students/${id}${classes[0]}/assignments`)
        }catch(error){
            console.log("foei")
        }
    }

    let asignments = []



    

    //$: {
        //fetchLearningPaths();
    //}

</script>



<p>Loading...yesssss!!!</p>
<p>{role}</p>
<p>{id}</p>
<p>{learningpaths}</p>
<button on:click={fetchLearningPaths}>fetch classes</button>
<p>{learningpaths}</p>
{#each learningpaths.classes as item}
<p>{item}</p>
{/each}
<p>{JSON.stringify(learningpaths)}</p>
<p>{classes}</p>
<button on:click={fetchAssignmentsUrls}>fetch assignments</button>
<p>{JSON.stringify(assignmentsUrls)}</p>


