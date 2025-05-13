<script lang="ts">
    import Header from "../../../lib/components/layout/Header.svelte";
    import Footer from "../../../lib/components/layout/Footer.svelte";
    import Drawer from "../../../lib/components/features/Drawer.svelte";
    import BackButton from "../../../lib/components/ui/BackButton.svelte";
    import { currentTranslations } from "../../../lib/locales/i18n";
    import { onMount } from "svelte";
    import { apiRequest } from "../../../lib/api";
    import { routeTo } from "../../../lib/route.ts";
    import type { MessageData, Submission } from "../../../lib/types/types.ts";

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

    let studentGroupsUrls: string[] = [];
    let conversationUrls: string[] = [];
    let students: string[] = [];
    let messages: MessageData[] = [];
    let numberOfLearningObjects = 0;
    let done = 0;

    let navigation_items = ["classrooms", "assignments"];
    let navigation_paths = ["classrooms", `classrooms/${classId}/assignments`];
    let assignmentName = "";
    let learningpathUrl = "";
    let loading = true;

    const submissionOne: Submission = {
        grade: 1/4,
        time: "24/10/2025",
        learningobject: "Chapter 1 Algebra",
        amount: 1,
        id: 1
    };

    const submissionSecond: Submission = {
        grade: 1/4,
        time: "25/10/2025",
        learningobject: "Chapter 1 Algebra",
        amount: 2,
        id: 2
    };

    const submissionThird: Submission = {
        grade: 3/4,
        time: "26/10/2025",
        learningobject: "Chapter 1 Algebra",
        amount: 3,
        id: 3
    };

    const submissionFourth: Submission = {
        grade: 3/4,
        time: "27/10/2025",
        learningobject: "Chapter 1 Physics",
        amount: 4,
        id: 4,
    };

    const submissionFive: Submission = {
        grade: 3/4,
        time: "28/10/2025",
        learningobject: "Chapter 1 Physics",
        amount: 5,
        id: 5
    };

    const submissionSix: Submission = {
        grade: 3/4,
        time: "31/10/2025",
        learningobject: "Chapter 1 Physics",
        amount: 6,
        id: 6
    };
    
    
    let submissions: Submission[] = [submissionOne, submissionSecond, submissionThird, submissionFourth, submissionFive, submissionSix];

    async function fetchGroup() {
        try {
            const response = await apiRequest(`/classes/${classId}/assignments/${assignmentId}/groups/${groupId}`, "GET");
            studentGroupsUrls = studentGroupsUrls.concat(response.links.students);
            conversationUrls = conversationUrls.concat(response.links.conversations);
        } catch(error) {
            console.error("Error fetching group: " + error);
        }
    }

    async function fetchAssignment() {
        try {
            const response = await apiRequest(`/classes/${classId}/assignments/${assignmentId}`, "GET");
            assignmentName = response.name;
            learningpathUrl = response.learningpath;
        } catch(error) {
            console.error("Error fetching assignment: " + error);
        }
    }

    async function fetchLearningPathContent() {
        try {
            const response = await apiRequest(`${learningpathUrl}/content`, "GET");
            numberOfLearningObjects = response.length;
            tasksDone();
        } catch(error) {
            console.error("Error fetching learnpathContent: " + error);
        }
    }

    function tasksDone() {
        let visited: string[]  = [];
        let sum = 0;
        for(let sub of submissions) {
            if(sub.grade >= 0.5 && !visited.includes(sub.learningobject)) {
                visited = visited.concat(sub.learningobject);
                sum += 1;
            }
        }
        done = sum;
    }

    async function fetchStudents() {
        try {
            for(let studentGroupUrl of studentGroupsUrls) {
                const response = await apiRequest(`${studentGroupUrl}`, "GET");
                let studentsUrls: string[] = [];
                studentsUrls = studentsUrls.concat(response.students);
                for(let studentUrl of studentsUrls) {
                    const responseStudent = await apiRequest(`${studentUrl}`, "GET");
                    students = students.concat(responseStudent.name);
                }
            }
        } catch(error) {
            console.error("Error fetching student: " + error);
        }
    }

    async function fetchConversations() {
        try {
            for(let conversationUrl of conversationUrls) {
                const response = await apiRequest(`${conversationUrl}`, "GET");
                let conversationlist = response.conversations;
                for(let convUrl of conversationlist) {
                    const responseConv = await apiRequest(`${convUrl}`, "GET");
                    let messagesUrls: string[] = [];
                    messagesUrls = messagesUrls.concat(responseConv.links.messages);
                    for( let messageUrl of messagesUrls) {
                        const responseMessage = await apiRequest(`${messageUrl}`, "GET");
                        let myMessages: string[] = [];
                        myMessages = myMessages.concat(responseMessage.messages);
                        for(let oneMessageUrl of myMessages) {
                            const oneMessage = await apiRequest(`${oneMessageUrl}`, "GET");
                            const student = await fetchStudent(oneMessage.sender);
                            let message: MessageData = {
                                sender: student,
                                content: oneMessage.content
                            }
                            messages = [...messages, message];
                        }
                    }
                }
            }
        } catch(error) {
            console.error("Error fetching conversations: " + error);
        }
    }

    async function fetchStudent(url: string){
        try {
            const response = await apiRequest(`${url}`, "GET");
            return response.name;
        } catch(error) {
            console.error("Error fetching student: " + error);
        }
    }

    onMount(async () => {
        await fetchAssignment();
        await fetchGroup();
        await fetchStudents();
        await fetchConversations();
        await fetchLearningPathContent();
        loading = false;
    });
</script>

<main>
    <Header />
    {#if loading}
        <div class="page-layout">
            <aside class="sidebar">
                <BackButton text={$currentTranslations.groupsPage.groups}/>
                <Drawer navigation_items={navigation_items} navigation_paths={navigation_paths} active="classrooms"></Drawer>
            </aside>

            <div class="main-content">
                <p>Loading...</p>
            </div>
        </div>
    {:else}
        <div class="page-layout">
            <aside class="sidebar">
                <BackButton text={$currentTranslations.groupsPage.groups}/>
                <Drawer navigation_items={navigation_items} navigation_paths={navigation_paths} active="classrooms"></Drawer>
            </aside>
            <div class="main-content">
                <h1><em style = "color: var(--dwengo-green)">{assignmentName}:</em> <em>{translatedGroup} {groupId}</em></h1>

                <div class="top-section">
                    {#if submissions.length === 0}
                        <div class="no-messages">No submissions available for this page.</div>
                    {:else}
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
                                    {#each submissions as submission, index}
                                        <div class="submission-row">
                                            <p>{submission.grade * 100}%</p>
                                            <p>{submission.time}</p>
                                            <p>{submission.learningobject}</p>
                                            <button on:click|preventDefault={() => {routeTo(`/classrooms/${classId}/assignments/${assignmentId}/groups/${groupId}/submissions/${submission.id}`);}} class="text-button">{index}</button>
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
                    {/if}

                    
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
                    <progress value={(Number.isFinite(done) && Number.isFinite(numberOfLearningObjects) && numberOfLearningObjects > 0) 
                        ? done / numberOfLearningObjects * 100 
                        : 0} 
                        max="100">
                    </progress>
                    <div class="progress-labels"><span>0</span><span>100%</span></div>
                </section>

                {#if messages.length === 0}
                    <div class="no-messages">No messages available for this page.</div>
                {:else}
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
                {/if}
            </div>
        </div>
    {/if}
    <Footer />
</main>

<style>
    .text-button {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: #0077cc;
    cursor: pointer;
    text-decoration: underline;
    width: 5%;
  }

  .text-button:hover {
    text-decoration: none;
    color: #005fa3;
  }

  .text-button:focus {
    outline: none;
    text-decoration: underline;
    color: #003f7f;
  }

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

    .no-messages {
        text-align: center;
        padding: 1rem;
        color: #777;
        font-style: italic;
        background-color: #f9f9f9;
        border: 1px dashed #ccc;
        border-radius: 8px;
        margin: 1rem;
    }
  </style>