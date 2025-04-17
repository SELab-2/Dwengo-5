<script lang="ts">
    import Header from "../../../lib/components/layout/Header.svelte";
    import Footer from "../../../lib/components/layout/Footer.svelte";
    import Drawer from "../../../lib/components/features/Drawer.svelte";
    import BackButton from "../../../lib/components/ui/BackButton.svelte";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import { onMount } from "svelte";
    import { apiRequest } from "../../../lib/api";
    import { routeTo } from "../../../lib/route.ts";


    let url = window.location.href;
    let hashWithoutParams = window.location.hash.split("?")[0];
    let urlWithoutParams = hashWithoutParams.split("#")[1];

    $: translatedName = $currentTranslations.assignmentDashboard.name;
    $: translatedTime = $currentTranslations.assignmentDashboard.time;
    $: translatedStatus = $currentTranslations.assignmentDashboard.status;
    $: translatedLearningobject = $currentTranslations.assignmentDashboard.learningobject;
    $: translatedGrade = $currentTranslations.assignmentDashboard.grade;
    $: translatedActivity = $currentTranslations.assignmentDashboard.activity;
    $: translatedStudents = $currentTranslations.assignmentDashboard.students;
    $: translatedMessages = $currentTranslations.assignmentDashboard.messages;
    $: translatedMessage = $currentTranslations.assignmentDashboard.message;
    $: translatedSender = $currentTranslations.assignmentDashboard.sender;
    $: translatedProgress = $currentTranslations.assignmentDashboard.progress;
    $: translatedWrong = $currentTranslations.assignmentDashboard.wrong;
    $: translatedApproved = $currentTranslations.assignmentDashboard.approved;
    $: translatedGroup = $currentTranslations.assignmentDashboard.group;

    const classId = urlWithoutParams.split("/")[2];
    const assignmentId = urlWithoutParams.split("/")[4];
    const groupId =  urlWithoutParams.split("/")[6];

    let studentGroupsUrls = [];
    let conversationUrls = [];
    let students = [];
    let messages: message[] = [];

    let navigation_items = ["classrooms", "assignments", "catalog"];
    let navigation_paths = ["classrooms", "assignments", "catalog"];
    let assignmentName = "";

    const submissionOne: submission = {
      grade: 1/4,
      time: "24/10/2025",
      learningobject: "Chapter 1 Algebra",
      amount: 1
    };

    const submissionSecond: submission = {
      grade: 1/4,
      time: "25/10/2025",
      learningobject: "Chapter 1 Algebra",
      amount: 2
    };

    const submissionThird: submission = {
      grade: 3/4,
      time: "26/10/2025",
      learningobject: "Chapter 1 Algebra",
      amount: 3
    };

    const submissionFourth: submission = {
      grade: 3/4,
      time: "27/10/2025",
      learningobject: "Chapter 1 Physics",
      amount: 4
    };

    const submissionFive: submission = {
      grade: 3/4,
      time: "28/10/2025",
      learningobject: "Chapter 1 Physics",
      amount: 5
    };

    const submissionSix: submission = {
      grade: 3/4,
      time: "31/10/2025",
      learningobject: "Chapter 1 Physics",
      amount: 6
    };

    type submission = {
      grade: float;
      time: String;
      learningobject: String;
      amount: number;
    };

    type message = {
        sender: String;
        content: String;
    };

    let submissions: submission[] = [submissionOne, submissionSecond, submissionThird, submissionFourth, submissionFive, submissionSix];

    async function fetchGroup(){
        try{
            const response = await apiRequest(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}`, "get");
            studentGroupsUrls = studentGroupsUrls.concat(response.links.students);
            conversationUrls = conversationUrls.concat(response.links.conversations);
        }
        catch(error){
            console.error("Error fetching group: " + error);
        }
    }

    async function fetchAssignment(){
        try{
            const response = await apiRequest(`/classes/${classId}/assignments/${assignmentId}`, "get");
            assignmentName = response.name;
        }
        catch(error){
            console.error("Error fetching assignment: " + error);
        }
    }

    async function fetchStudents(){
        try{
            for(let studentGroupUrl of studentGroupsUrls){
                const response = await apiRequest(`${studentGroupUrl}`, "get");
                let studentsUrls = [];
                studentsUrls = studentsUrls.concat(response.students);
                for(let studentUrl of studentsUrls){
                    const responseStudent = await apiRequest(`${studentUrl}`, "get");
                    students = students.concat(responseStudent.name);
                }
            }
        }
        catch(error){
            console.error("Error fetching student: " + error);
        }
    }

    async function fetchConversations(){
        try{
            for(let conversationUrl of conversationUrls){
                
                const response = await apiRequest(`${conversationUrl}`, "get");
                let conversationlist = response.conversations;
                for(let convUrl of conversationlist){
                    const responseConv = await apiRequest(`${convUrl}`, "get");
                    let messagesUrls = [];
                    messagesUrls = messagesUrls.concat(responseConv.links.messages);
                    for( let messageUrl of messagesUrls){
                        const responseMessage = await apiRequest(`${messageUrl}`, "get");
                        let myMessages = [];
                        myMessages = myMessages.concat(responseMessage.messages);
                        for(let oneMessageUrl of myMessages){
                            const oneMessage = await apiRequest(`${oneMessageUrl}`, "get");
                            const student = await fetchStudent(oneMessage.sender);
                            let message: message = {
                                sender: student,
                                content: oneMessage.content
                            }
                            messages = [...messages, message];
                        }
                    }
                    
                }
                //console.log(response);
            }
        }
        catch(error){
            console.error("Error fetching conversations: " + error)
        }
    }

    async function fetchStudent(url){
        try{
            const response = await apiRequest(`${url}`, "get");
            return response.name
        }
        catch(error){
            console.error("Error fetching student: " + error);
        }
    }

    onMount(async () => {
        await fetchAssignment();
        await fetchGroup();
        await fetchStudents();
        await fetchConversations();
    });
</script>


<Header></Header>
<div class="page-layout">
  
  
  <aside class="sidebar">
    
    <Drawer navigation_items={navigation_items} navigation_paths={navigation_paths} active="classrooms"></Drawer>
  </aside>

  
  <main class="main-content">
    <h1><em style = "color: var(--dwengo-green)">{assignmentName}:</em> <em>{translatedGroup} {groupId}</em></h1>

    <div class="top-section">
      
      <section class="card">
        <h2>{translatedActivity}</h2>
        
        <div class="submission-table">
          
          <div class="submission-header">
            <p>{translatedGrade}</p>
            <p>{translatedTime}</p>
            <p>{translatedLearningobject}</p>
            <p>#</p>
            <p>{translatedStatus}</p>
          </div>
        
          
          <div class="submission-scroll">
            {#each submissions as submission}
              <div class="submission-row">
                <p>{submission.grade * 100}%</p>
                <p>{submission.time}</p>
                <p>{submission.learningobject}</p>
                <p>{submission.amount}</p>
                {#if submission.grade > 0.5}
                    <p style = "color: var(--dwengo-green)">{translatedApproved}</p>
                
                {:else}
                    <p style = "color: red">{translatedWrong}</p>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </section>

      
      <section class="card">
        <h2>{translatedStudents}:</h2>
        <div class="student-container">
          
          <div class="student-header">
            <p>{translatedName}</p>
          </div>
      
         
          <div class="student-scroll">
            {#each students as student}
              <div class="student-row">
                <p>{student}</p>
              </div>
            {/each}
          </div>
        </div>
      </section>
    </div>

    
    <section class="card progress-card">
      <h2>{translatedProgress}</h2>
      <progress value="70" max="100"></progress>
      <div class="progress-labels"><span>0</span><span>100%</span></div>
    </section>

    
    <section class="card">
      <h2>{translatedMessages}</h2>
      <div class="message-container">
        
        <div class="message-header">
          <p class="sender">{translatedSender}</p>
          <p class="content">{translatedMessage}</p>
        </div>
    
        
        <div class="message-scroll">
          {#each messages as message}
            <div class="message-row">
              <p class="sender">{message.sender}</p>
              <p class="content">{message.content}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>
  </main>
</div>




    

  
  
  <style>

    
.page-layout {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}


.sidebar {
  width: 300px;
  background-color: #f9f9f9;
  border-right: 1px solid #ccc;
  padding: 1rem;
}




.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.main-content h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
}



.top-section {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.card {
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  flex: 1;
  min-width: 300px;
}


.progress-card progress {
  width: 100%;
  height: 20px;
  color: var(--dwengo-green);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  
}

.submission-table {
  width: 100%;
  max-width: 1000px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: sans-serif;
  background-color: #fff;
  overflow: hidden;
  margin-top: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.submission-header {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 1fr;
  background-color: #f2f2f2;
  padding: 0.75rem;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}

.submission-scroll {
  max-height: 300px; 
  overflow-y: auto;
}

.submission-row {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 1fr;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.submission-row p {
  margin: 0;
  word-break: break-word;
}

.student-container {
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  font-family: sans-serif;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  justify-content: center;
}

.student-header {
  background-color: #f2f2f2;
  font-weight: bold;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  text-align: center;
}

.student-scroll {
  max-height: calc(5 * 50px);
  overflow-y: auto;
}

.student-row {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.message-header {
  display: flex;
  justify-content: space-between;
  background-color: #f2f2f2;
  padding: 0.5rem;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}
.message-scroll {
  max-height: calc(5 * 60px); 
  overflow-y: auto;
}

.message-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}
  
.sender {
  width: 40%;
  word-wrap: break-word;
}
  
.content {
  width: 60%;
  word-wrap: break-word;
}
  
.message-container {
  border: 1px solid #ccc;
  border-radius: 8px 8px 0 0;
  width: 100%;
  font-family: sans-serif;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

progress {
  appearance: none;
  -webkit-appearance: none;
  height: 20px;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background-color: #eee;
  border: none;
}

progress::-webkit-progress-bar {
  background-color: #eee;
  border-radius: 10px;
}

progress::-webkit-progress-value {
  background-color: var(--dwengo-green); /* light green */
  border-radius: 10px;
}

progress::-moz-progress-bar {
  background-color: var(--dwengo-green);
}
  </style>