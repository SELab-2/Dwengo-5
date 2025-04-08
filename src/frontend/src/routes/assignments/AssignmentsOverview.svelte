<script lang=ts>
    import { apiRequest } from "../../lib/api";
    import Header from "../../lib/components/layout/Header.svelte";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";

    import { currentTranslations} from "../../lib/locales/i18n";
    import { onMount } from "svelte";
	import { routeTo } from "../../lib/route.ts";
	import { user } from "../../lib/stores/user.ts";

    // todo replace url with learnpath url.
    $: translatedTitle = $currentTranslations.assignmentsOverview.title
    $: translatedDeadline = $currentTranslations.assignmentsOverview.deadline
    $: translatedFurther = $currentTranslations.assignmentsOverview.further
    $: translatedClass = $currentTranslations.assignmentsOverview.class

    let navigation_items = $user.role === "teacher" ? ["dashboard", "questions"] : [];
    let navigation_paths = $user.role === "teacher" ? ["dashboard", "questions"] : []

    navigation_items = [...navigation_items, "classrooms", "assignments", "catalog"];
    navigation_paths = [...navigation_paths, "classrooms", "assignments", "catalog"];

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

    let classes = []

    // fetch classes of student
    async function fetchClassesStudent() {
        try{
            const learningpaths = await apiRequest(`/students/${id}/classes`, "get");

            classes = learningpaths.classes;
        }catch(e){
            console.error("error fetching classes for student", e);
        }
    } 

    // fetch classes of teacher
    async function fetchClassesTeacher() {
        try{
            let classpaths =  await apiRequest(`/teachers/${id}/classes`, "get");
            classes = classpaths.classes;
        }catch(e){
            console.error("error fetching classes for teacher", e)
        }
    }

    let assignmentsUrls = []
    let classIds: number[] = []

    async function fetchAssignmentsUrlsStudent() {
        try {
            let allAssignments = [];
        
            for(let classUrl of classes) {
                const classResponse = await apiRequest(`${classUrl}`, "GET");
                const className = classResponse.name;

                const classId = classUrl.split("/").pop(); // Extract the class ID from the URL
                classIds[className] = classId; // Store the class ID in the map

                const response = await apiRequest(`/students/${id}${classUrl}/assignments`, "GET");
                allAssignments = allAssignments.concat({className: className, assignments: response.assignments});
            }

            assignmentsUrls = allAssignments; //todo result in seed.ts is not right.
            
        } catch(error) {
            console.error("error fetching assignmenturls for student", e)
        }
    }

    async function fetchAssigmentUrlsTeacher() {
        try {
            let allAssignments = [];
        
            for (let classUrl of classes) {
                const classResponse = await apiRequest(`${classUrl}`, "GET");
                const className = classResponse.name;

                const classId = classUrl.split("/").pop(); // Extract the class ID from the URL
                classIds[className] = classId; // Store the class ID in the map

                const response = await apiRequest(`${classUrl}/assignments`, "GET");
                allAssignments = allAssignments.concat({className: className, assignments: response.assignments});
            }

            assignmentsUrls = allAssignments; //todo result in seed.ts is not right.
            
        } catch(error) {
          console.error("error fetching assignmenturls for teacher", e)
        }
    }

    type assignment = {
        deadline: String;
        name: String;
        learningpath: String;
    }

    let asignments: assignment[] = []

    let assignmentsPerClass = {};
    async function fetchAssignments() {
        try {
            for (let {className, assignments: urls} of assignmentsUrls) {

                const assignments = [];
                for (let assignmentUrl of urls) {
                    const assignmentResponse = await apiRequest(assignmentUrl, "get");
					const learningPathResponse = await apiRequest(`${assignmentResponse.learningpath}`, "get");

                    const assignment: assignment = {
                        ...assignmentResponse,
                        url: assignmentUrl,
                        learningpathDescription: learningPathResponse.description,
                        image: learningPathResponse.image,
                    };

                    assignments.push(assignment);
                }
                assignmentsPerClass[className] = assignments;
            }
        } catch (error) {
            console.error("Error fetching assignments", error);
        }
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    onMount(async () => {
        if(role == "student") {
            await fetchClassesStudent();
            await fetchAssignmentsUrlsStudent();
        } else {
            await fetchClassesTeacher()
            await fetchAssigmentUrlsTeacher();
        }
        
        await fetchAssignments();
        console.log("Assignments per class:", assignmentsPerClass);
        console.log("classIds:", classIds);
    });

</script>

<main>
    <div>
        <Header/>
    <div class="body">
        <div class="title-container">
            <h1>{translatedTitle}</h1>
        </div>
    
        <div class="content">
            <!-- Drawer Navigation -->
            <Drawer navigation_items={navigation_items} navigation_paths={navigation_paths} active="assignments"/>
    
                <!-- Assignment Cards Container -->
                <div class="assignments-container">
                    {#each Object.entries(assignmentsPerClass) as [classroom, assignments]}
                        <div class="class-container">
                            <div class="class-header">
                                <h1>{classroom}</h1>
                                {#if role === "teacher"}
                                    <button class="button create-assignment" on:click={() => routeTo(`/classrooms/${classIds[classroom]}/assignments/create`)}>{$currentTranslations.assignments.create}</button>
                                {/if}
                            </div>
                            <div class="class-assigments">
                                {#if assignments.length === 0}
                                    <p>No assignments available for this class.</p> <!-- Display message if no assignments -->
                                {:else}
                                    {#each assignments as assignment}
                                        <div on:click={routeTo(assignment.url)} class="assignment-card">
                                            <div class="image-container">
                                                <img class="image" src="../../static/images/learning_path_img_test2.jpeg" alt="learning-path" />
                                                <!--<img src={assignment.image} alt="learning-path" />-->
                                            </div>
                                            <div class="card-content">
                                                <div class="assignment-title">
                                                    <img class="icon" src="../../static/images/logo_test.png" alt="icon" />
                                                    <!--<img src={assignment.icon} alt="icon" />-->
                                                    <h3>{assignment.name}</h3>
                                                </div>
                                                <p><strong>{translatedDeadline}:</strong> {formatDate(assignment.deadline)}</p>
                                                <p>{assignment.learningpathDescription}</p>
                                            </div>
                                        </div>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
    </div>
    <Footer/>
    </div>
</main>
	
<style>
  
    .content {
        display: flex;         /* Enables flexbox */
        gap: 20px;             /* Adds spacing between elements */
        align-items: flex-start; /* Aligns items at the top */
    }

    .assignments-container {
        display: flex; /* Use flexbox for vertical stacking */
        flex-direction: column; /* Stack the class containers vertically */
        gap: 70px; /* Add space between each class container */
        justify-content: flex-start; /* Align items at the top */

        background-color: white;
        border: 15px solid var(--dwengo-green);
        border-radius: 15px;

        padding: 20px;
        max-width: 1200px; /* Optional max width to prevent full screen */
        margin: 0px auto; /* Centers the container */
        max-height: 80vh;
        overflow-y: auto; /* Enables vertical scrolling if needed */
        box-sizing: border-box; /* ensures padding and border are included in width */
    }

    .assignment-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        width: 250px; /* Adjust width as needed */
    }

    .card-content {
        padding: 15px;
    }

    .card-content h3 {
        color: var(--dwengo-green);
    }

    .title-container {
        display: flex;
        justify-content: space-between; /* Ensures elements are spaced apart */
        align-items: center; /* Aligns items vertically */
        padding-bottom: 30px;
    }

    .create-assignment {
        margin-bottom: 15px;
        align-self: flex-end;
    }

    .assignment-title {
        display: flex;
        direction: column;
        gap: 20px;
        align-items: center;
    }

    .icon {
        width: 60px;
        height: 60px;
    }

    .image-container {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
    }

    .image {
        max-width: 250px;
        max-height: 250px;
        object-fit: contain;
        border-radius: 8px 8px 0 0; /* Top corners rounded, bottom corners regular */
    }

    h1 {
        margin: 0;
    }

    .class-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .class-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .class-assigments {
        display: flex;
        flex-direction: row;
        gap: 20px;
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 10px;
    }

    @media (max-width: 600px) {
        .assignments-container {
            grid-template-columns: 1fr; /* Stack in one column */
        }
    }

</style>