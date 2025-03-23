
<script lang=ts>
    import { apiRequest } from "../../lib/api";
    import Header from "../../lib/components/layout/Header.svelte";
    import { currentTranslations} from "../../lib/locales/i18n";
    import { onMount } from "svelte";

    //$: translatedTitle = $currentTranslations.assignments.title

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

    type assignment = {
        deadline: String;
        name: String;
        learningpath: String;
    }

    let asignments: assignment[] = []

    async function fetchAssignments(){
        try{
            let allAssignments = []

            for (let asignmentUrl of assignmentsUrls){
                const response = await apiRequest(asignmentUrl);
                allAssignments = allAssignments.concat(response);
            }

            asignments = allAssignments;
        }catch(error){
            console.log("foei")
        }
    }



    onMount(async () => {
        await fetchLearningPaths();
        await fetchAssignmentsUrls();
        await fetchAssignments();
        console.log("All tasks completed!");
    });

    //$: {
        //fetchLearningPaths();
    //}

</script>

<main>
    <Header name=Pedro role={role}/>
    <div class="container">
        <div class="title-container">
            
    </div>

    <div class="catalog-content">
        <ul>
          {#each asignments as assignment}
          <li>
            <div class="header">
              <p>{assignment.name}</p>
            </div>

            <div class="content">
              <p>{assignment.deadline}</p>
              <p>{assignment.learningpath}</p>
            </div>
          </li>
        {/each}
        </ul>
      </div>
</main>





