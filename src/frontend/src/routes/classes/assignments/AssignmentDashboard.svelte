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

    const classId = urlWithoutParams.split("/")[2];
    const assignmentId = urlWithoutParams.split("/")[4];
    const groupId =  urlWithoutParams.split("/")[6];

    let studentGroupsUrls = [];
    let conversationUrls = [];
    let students = [];
    let messages: message[] = [];

    type message = {
        sender: String;
        content: String;
    }



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
        await fetchGroup();
        await fetchStudents();
        await fetchConversations();
    });
</script>



<Header></Header>
<BackButton text={$currentTranslations.groupsPage.groups}/>


    
        
        
<div class="wrapper">
    <div class="student-container">
      <!-- Header (Legenda) -->
      <h3>Students</h3>
      <div class="student-header">
        <p>Name</p>
      </div>
      
      <!-- Scrollable student list -->
      <div class="student-scroll">
        {#each students as student}
          <div class="student-row">
            <p>{student}</p>
          </div>
        {/each}
      </div>
    </div>
  
    <!-- Message table at the bottom -->
    <div class="message-container">
      <h3>Messages</h3>
      <!-- Legenda row -->
      <div class="message-header">
        <p class="sender">Sender</p>
        <p class="content">Message</p>
      </div>
  
      <!-- Scrollable messages -->
      <div class="message-scroll">
        {#each messages as message}
          <div class="message-row">
            <p class="sender">{message.sender}</p>
            <p class="content">{message.content}</p>
          </div>
        {/each}
      </div>
    </div>
  </div> 
  
  
  <style>
    .message-header {
      display: flex;
      justify-content: space-between;
      background-color: #f2f2f2;
      padding: 0.5rem;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
    }
  
    .message-scroll {
      max-height: calc(5 * 60px); /* Adjust if your row height is different */
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
  
    .wrapper {
        display: flex;
        flex-direction: column; /* Align elements vertically */
        gap: 20px; /* Adds space between the two containers */
        align-items: flex-end; /* Aligns the student container to the right */
    }

    .student-container {
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    font-family: sans-serif;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
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
  </style>