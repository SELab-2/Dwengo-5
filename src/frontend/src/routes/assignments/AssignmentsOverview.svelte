
<script lang=ts>
    import { apiRequest } from "../../lib/api";
    import Header from "../../lib/components/layout/Header.svelte";
    import { currentTranslations} from "../../lib/locales/i18n";
    import { onMount } from "svelte";
    // todo replace url with learnpath url.
    $: translatedTitle = $currentTranslations.assignmentsOverview.title
    $: translatedDeadline = $currentTranslations.assignmentsOverview.deadline
    $: translatedFurther = $currentTranslations.assignmentsOverview.further
    $: translatedClass = $currentTranslations.assignmentsOverview.class

    function getQueryParamsURL() {
        const hash = window.location.hash; // Get the hash part of the URL
        const queryParams = new URLSearchParams(hash.split('?')[1] || ''); // Extract the query parameters after '?'
        return {
        role: queryParams.get('role'),
        id: queryParams.get('id'),
        };
    }
    
    let role = getQueryParamsURL().role
    let id = getQueryParamsURL().id

    let learningpaths = []
    let classes = []
    let name = ""

    // fetching name of user
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
            console.error("error fetching name: ", e)
        }
    }

    // fetch classes of student
    async function fetchClassesStudent() {
        try{
            learningpaths = await apiRequest(`/students/${id}/classes`, "get");

            classes = learningpaths.classes;
        }catch(e){
            console.error("error fetching classes for student", e);
        }
        
    } 
    let mytest =""
    // fetch classes of teacher
    async function fetchClassesTeacher() {
        try{
            let classpaths =  await apiRequest(`/teachers/${id}/classes`, "get");
            classes = classpaths.classes;
            mytest = classpaths.name;
        }catch(error){
            console.error("error fetching classes for teacher", e)
        }
    }

    let assignmentsUrls = []
    let classNames = []
    let classIds: number[] = []
    let lengte = 0
    async function fetchAssignmentsUrls() {
        try{
            let allAssignments = [];
        
            for (let classId of classes) {
                const response = await apiRequest(`/students/${id}${classId}/assignments`, "get");
                console.log(`/students/${id}${classId}/assignments`)
                allAssignments = allAssignments.concat(response.assignments); // Merge results
                lengte = response.assignments.length
                for(let i= 0; i<lengte;i++){
                  await fetchClassNames(classId)
                }
            }

            assignmentsUrls = allAssignments; //todo result in seed.ts is not right.
            
        }catch(error){
            console.error("error fetching assignmenturls for student", e)
        }
    }

    async function fetchAssigmentUrlsTeacher(){
        try{
            let allAssignments = [];
        
            for (let classId of classes) {
                const response = await apiRequest(`${classId}/assignments`, "get");
                allAssignments = allAssignments.concat(response.assignments); // Merge results
                lengte = response.assignments.length
                for(let i= 0; i<lengte;i++){
                  await fetchClassNames(classId)
                }
            }

            assignmentsUrls = allAssignments; //todo result in seed.ts is not right.
            
        }catch(error){
          console.error("error fetching assignmenturls for teacher", e)
        }
    }

    async function fetchClassNames(classId){
      try{
        
        const response = await apiRequest(`${classId}`, "get");
        classNames = classNames.concat(response.name);
      }
      catch(error){
        console.error("Error fetching class by classId")
      }
    }

    type assignment = {
        deadline: String;
        name: String;
        learningpath: String;
    }

    let asignments: assignment[] = []

    let assignementsPerClass = {}
    async function fetchAssignments(){
        try{
            let allAssignments = []

            for (const [index, asignmentUrl] of assignmentsUrls.entries()){
                const response = await apiRequest(asignmentUrl);
                console.log(classNames[index])
                if (!assignementsPerClass[classNames[index]]) {
                  assignementsPerClass[classNames[index]] = [];
                }
                assignementsPerClass[classNames[index]].push(response);
                allAssignments = allAssignments.concat(response);
            }

            asignments = allAssignments;
        }catch(error){
            console.error("Error fetching assignments")
        }
    }

    async function test(){
      try{
        const response = await apiRequest('/learningobjects/550e8400-e29b-41d4-a716-446655440002/metadata', "get")
        console.log(response)
      }
      catch(error){
        console.error("Error fetching test")
      }
    }


    onMount(async () => {
        await fetchName();
        
        if(role == "student"){
            await fetchClassesStudent();
            await fetchAssignmentsUrls();
        }else{
            
            await fetchClassesTeacher()
            await fetchAssigmentUrlsTeacher();
        }
        
        await fetchAssignments();
        await test();
    });


</script>



  <main>
    <div>
      <Header name={name} role={role}/>
    
    
      <div class="container">
      <div class="title-container">
        <h1>{translatedTitle}</h1>
      </div>

      <div class="assignments-container">
        {#each Object.entries(assignementsPerClass) as [classId, classAssignments]}
          <div class="class-group">
            <h2><strong>{translatedClass}: </strong> {classId}</h2>

            {#each classAssignments as assignment}
              <div class="assignment-card">
                <div class="card-content">
                  <h3>{assignment.name}</h3>
                  <p><strong>{translatedDeadline}:</strong> {assignment.deadline}</p>
                  <p>{assignment.description}</p>
                  <a href="#" class="read-more">{translatedFurther}</a> 
                </div>
              </div>
            {/each}
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
      background: var(--dwengo_green);
    }
  
    .assignments-container {
      margin-top: 20px; /* Adds spacing below header */
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      flex-direction: column;
    }

    .class-group{
      flex-direction: column;
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
      color: var(--dwengo_green);
      text-decoration: none;
      font-weight: bold;
    }
  </style>