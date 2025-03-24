
<script lang=ts>
    import { apiRequest } from "../../lib/api";
    import Header from "../../lib/components/layout/Header.svelte";
    import { currentTranslations} from "../../lib/locales/i18n";
    import { onMount } from "svelte";
    // todo replace url with learnpath url.
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
          console;log("pppppppppppppppppppp")
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
    let mytest =""
    async function fetchClassesTeacher() {
        try{
            let classpaths =  await apiRequest(`/teachers/1/classes`, "get");
            classes = classpaths.classes;
            mytest = classpaths.name;
        }catch(error){
            console.log("foei")
        }
    }

    let assignmentsUrls = []
    

    async function fetchAssignmentsUrls() {
        try{
            let allAssignments = [];
        
            for (let classId of classes) {
                const response = await apiRequest(`/students/${id}${classId}/assignments`, "get");
                allAssignments = allAssignments.concat(response.assignments); // Merge results
            }

            assignmentsUrls = allAssignments; //todo result in seed.ts is not right.
            //assignments = await apiRequest(`/students/${id}${classes[0]}/assignments`)
        }catch(error){
            console.log("foei")
        }
    }

    async function fetchAssigmentUrlsTeacher(){
        try{
            let allAssignments = [];
        
            for (let classId of classes) {
                const response = await apiRequest(`/classes/${classId}/assignments`, "get");
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
        
        if(role == "student"){
            
            await fetchLearningPaths();
            await fetchAssignmentsUrls();
        }else{
            
            await fetchClassesTeacher()
            await fetchAssigmentUrlsTeacher();
        }
        
        await fetchAssignments();
        //console.log("All tasks completed!");
    });


</script>



  <main>
    <div>
      <Header name={name} role={role}/>
    
    
      <div class="container">
      <div class="title-container">
        <h1>Mijn Opdrachten</h1>
      </div>

      <div class="assignments-container">
        {#each asignments as assignment}
          <div class="assignment-card">
            <div class="card-content">
              <h3>{assignment.name}</h3>
              <p><strong>Deadline:</strong> {assignment.deadline}</p>
              <p>{assignment.description}</p>
              <a href="#" class="read-more">Lees meer</a> 
            </div>
          </div>
        {/each}
      </div>
    </div>
  </main>
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  
    main {
      display: flex;
      font-family: sans-serif;
      min-height: 100vh;
    }
  
    .sidebar {
      width: 250px;
      background: #f0f9eb;
      padding: 20px;
    }
  
    .sidebar h2 {
      font-size: 1.8rem;
      margin-bottom: 20px;
    }
  
    nav ul {
      list-style: none;
      padding: 0;
    }
  
    nav li {
      padding: 10px;
      cursor: pointer;
      font-size: 1.2rem;
      border-radius: 5px;
    }
  
    nav li.active {
      background: #b6ec93;
    }
  
    .assignments-container {
      margin-top: 20px; /* Adds spacing below header */
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .assignment-card {
      background: white;
      border-radius: 10px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      flex: 1 1 calc(33.333% - 20px); /* Makes the cards responsive */
    }
  
    .assignment-card img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
  
    .card-content {
      padding: 15px;
    }
  
    .card-content h3 {
      color: #2f6d3b;
      margin-bottom: 5px;
    }
  
    .read-more {
      color: #3b8d32;
      text-decoration: none;
      font-weight: bold;
    }
  </style>