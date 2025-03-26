<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import { currentTranslations, savedLanguage, currentLanguage } from "../../lib/locales/i18n";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import SearchBar from "../../lib/components/features/SearchBar.svelte";
    import Avatar from "../../lib/components/ui/Avatar.svelte";
    import "../../lib/styles/global.css";
    import { apiBaseUrl } from "../../config";
    import { apiRequest } from "../../lib/api";
    import { user } from "../../lib/stores/user.ts";
    import { get } from "svelte/store";
    import { push, params } from 'svelte-spa-router';
  

    // Selected learning path
    let chosenLearningPath: LearningPath | null = null;

    function selectLearningPath(path: LearningPath) {
      chosenLearningPath = path;
    }
    
    $: translatedTitle = $currentTranslations.assignments.title
  
    type LearningPath = {
      img: string;
      name: string;
      description: string;
      content: string;
    };
  
    // All learning paths
    // TODO: shared function
    let learningPaths: LearningPath[] = [];
    
    async function fetchLearningPaths(language: string) {
      try {
        // Fetch learning path urls
        const { learningpaths } = await apiRequest(`/learningpaths?language=${language}`, "get");
  
        // Fetch all learning paths
        const learningPathData = await Promise.all(
          learningpaths.map(async (path: string) => {
            const res = await apiRequest(`${path}?language=${language}`, "get");
            res.url = path;
            return res;
          })
        );
  
        learningPaths = learningPathData;
      } catch (error) {
        console.error("Error fetching learning paths:", error);
      }
    }

    type Student = {
      name: string;
      url: string;
    };

    // All students from this classroom
    let allStudents: Student[] = [];
    async function fetchStudents() {
      try {
        const { students } = await apiRequest(`/classes/${classId}/students`, "get");

        const studentData = await Promise.all(
          students.map(async (path: string) => {
            const res = await apiRequest(`${path}`, "get");
            res.url = path;
            return res;
          })
        );

        allStudents = studentData;
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }

    let selectedStudents: Student[] = [];
    let selectAll = false;

    function toggleSelection(event, student: Student) {
      if (event.target.checked) {
        selectedStudents = [...selectedStudents, student]; // Add selected student
      } else {
        selectedStudents = selectedStudents.filter(selectedStudent => selectedStudent.name !== student.name); // Remove if unchecked
      }
    }

    function toggleSelectionAll() {
      selectAll = !selectAll;
      if (selectAll) {
        selectedStudents = [...allStudents];
      } else {
        selectedStudents = [];
      }

      console.log(selectedStudents);
    }


    // Groups
    let groups: { id: number; students: Student[] }[] = [];
    let groupIdCounter = 1;

    function createGroup() {
      if (selectedStudents.length > 0) {
        groups = [...groups, { id: groupIdCounter++, students: selectedStudents }];
        allStudents = allStudents.filter(student => !selectedStudents.includes(student)); // Remove selected students from all students
        selectedStudents = []; // Clear selection after grouping
        selectAll = false; // Reset select all toggle
      }
    }


    $: classId = $params?.class_id || null;
  
    $: {
      fetchLearningPaths($currentLanguage);
      if (classId) fetchStudents();
    }

  </script>
  
  <main>
    {#if user}
      <Header/>
      <div class="container">
        <div class="title-container">
          <p class="title">Klas: </p>
        </div>
  
        <div class="bottom">
            <div class="drawer-container">
              <Drawer navigation_items={["members", "assignments"]} active="assignments" />
            </div>
  
            <div class="assignment-content">

              <div class="learning-paths">
                <!-- Content for column 1 -->
                <SearchBar />

                <!-- Learning paths -->
                {#each learningPaths as path}
                  <div 
                    class="learning-path {chosenLearningPath === path ? 'selected' : ''}" 
                    on:click={() => selectLearningPath(path)}>
                    <div class="header">
                      <img src={"../static/images/learning_path_img_test.jpeg"} alt="Learning path icon" />
                      <!-- <img src={path.img} alt="Learning path icon" /> -->
                      <h1>{path.name}</h1>
                    </div>
    
                    <div class="content">
                      <p>{path.description}</p>
                    </div>
                  </div>
                {/each}
              </div>

              <div class="students">
                <!-- Content for column 2 -->
                <SearchBar/>

                <button on:click="{(event) => toggleSelectionAll()}">Selecteer allemaal</button> <!-- TODO: vertaal -->

                {#each allStudents as student}
                  <div class="student">
                    <input 
                      type="checkbox" 
                      id="student-{student.name}" 
                      checked="{selectAll || selectedStudents.includes(student)}"
                      on:change={(event) => toggleSelection(event, student)}
                    />
                    <Avatar name={student.name} />
                    <p>{student.name}</p>
                    
                  </div>
                {/each}


              </div>
              
              <div class="groups">
                <!-- Content for column 3 -->
                <button on:click="{createGroup}">Maak groep</button>

                {#each groups as group}
                  <div class="group">
                    <h2>Groep {group.id}</h2>
                    {#each group.students as student}
                      <Avatar name={student.name} />
                      <p>{student.name}</p>
                    {/each}
                  </div>
                {/each}
              </div>
            </div>
        </div>
    </div>
      <Footer />
    {:else}
      <p class="error">User data could not be loaded.</p>
    {/if}
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
      display: flex;
      gap: 20px; /* Spacing between columns */
      width: 100%;
      padding: 20px;
    }

    .learning-paths, .students {
      flex: 1; /* Each column takes equal space */
      display: flex;
      flex-direction: column; /* Stack content vertically */
      gap: 5px; /* Spacing between items */
      border-radius: 15px;
      border: 15px solid var(--dwengo-green);
    }

    .learning-path {
      margin: 7px;
      padding: 20px;
    }

    .selected {
      background-color: var(--dwengo-dark-green);
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    }
  
    .title {
      font-family: 'C059-Roman';
      font-size: 4rem;
      justify-content: top; /* Center vertically */
    }
  
    p {
      font-family: sans-serif;
      font-size: 1.1rem;
    }

    img {
      width: 100px;
      height: 100px;
    }

    .header {
    display: flex;
    align-items: center; /* Aligns image and text vertically */
    gap: 15px; /* Space between image and text */
  }

  .content {
    display: flex;
    flex-direction: column;
    padding-top: 10px;
  }

  h1 {
    font-family: sans-serif;
    font-size: 1.8rem;
  }

  img {
    width: 100px; /* Adjust size as needed */
    height: 100px;
  }   
  
  
  /* Students */
  .student {
    display: flex;
    align-items: center; /* Vertically aligns the avatar and text */
    gap: 10px; /* Adds some space between the avatar and the name */
    padding: 20px;
  }


  /* Groups */
  .groups {
      flex: 1; /* Each column takes equal space */
      display: flex;
      flex-direction: column; /* Stack content vertically */
      gap: 5px; /* Spacing between items */
    }

  .group {
    padding: 20px;
    border-top: 1px solid #ccc;
    border-radius: 15px;
    border: 15px solid var(--dwengo-green);
  }

  </style>


