
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
    let name = ""
    async function fetchName(){
        try{
            if (role === "student"){
                let student = await apiRequest(`/students/${id}`, "get");
                name = student.name
            }
            else{
                let teacher = await apiRequest(`/teachers/${id}`, "get")
                name = teacher.name
            }
        
        }catch(e){
            console.log("foei")
        }
    }
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
        await fetchName();
        await fetchLearningPaths();
        await fetchAssignmentsUrls();
        await fetchAssignments();
        console.log("All tasks completed!");
    });


</script>

<main>
    <Header name={name} role={role}/>
    <div class="container">
        <div class="title-container">
            <p>Mijn Opdrachten</p>
    </div>

    <div class="assignment-content">
        <ul>
          {#each asignments as assignment}
          <li>
            <div class="header">
              <p>{assignment.name}</p>
            </div>

            <div class="content">
              <p>deadline: {assignment.deadline}</p>
              <p>leerpad: {assignment.learningpath}</p>
            </div>
          </li>
        {/each}
        </ul>
      </div>
</main>

<style>
    main {
      display: flex;
      flex-direction: column;
      min-height: 100vh; /* Full viewport height */
    }
  
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .container {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding-top: 50px;
    }
    .title-container {
      flex: 0;
      padding-left: 20px;
    }
    .bottom {
      flex: 1;
      display: flex;
    }
    .drawer-container {
      flex: 0;
      display: flex;
      flex-direction: column;
      padding-top: 40px;
    }
    .assignment-content {
    flex: 1;
    background-color: white;
    margin-left: 100px;
    margin-right: 100px;
    margin-top: 30px;
    border-radius: 15px;
    border: 15px solid var(--dwengo-green);
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    
    max-height: 70vh; /* Adjust height as needed */
    overflow-y: auto; /* Enables vertical scrolling */
  }
    li {
      font-family: 'C059-Italic'; 
      list-style-type: none;
      background-color: lightgreen;
      border: 15px solid var(--dwengo-green);
    }
  
    ul {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
    }
  
    .title {
      font-family: 'C059-Roman';
      font-size: 4rem;
      justify-content: top; /* Center vertically */
    }
    .green-text {
      color: var(--dwengo-green); /* Makes "lesthema's" green */
    }
  
    /* styling per catalog item */
    .header {
      display: flex;
      align-items: center; /* Aligns image and text vertically */
      gap: 15px; /* Adds space between image and text */
    }
  
    .content {
      display: flex;
      flex-direction: column;
    }
  
    h1 {
      font-family: sans-serif;
      font-size: 1.8rem;
    }
  
    p {
      font-family: sans-serif;
      font-size: 1.1rem;
    }
  
    img {
      width: 100px; /* Adjust size as needed */
      height: 100px;
    }
  
    li {
      list-style: none;
      margin-bottom: 30px;
    }
  
    .learning-path-link {
    display: inline-block; /* Ensures margin applies properly */
    margin-top: 20px; /* Adjust as needed */
    font-family: sans-serif;
    font-size: 0.8rem;
    text-decoration: none; /* Removes underline */
    color: blue; /* Makes link green */
  }
  </style>






