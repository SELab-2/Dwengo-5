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
    let messages = [];

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
                        myMessages = myMessages.concat(responseMessage.messages)
                        for(let oneMessageUrl of myMessages){
                            const oneMessage = await apiRequest(`${oneMessageUrl}`, "get");
                            console.log(oneMessage)
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

    onMount(async () => {
        await fetchGroup();
        await fetchStudents();
        await fetchConversations();
    });
</script>



<p>ooooooooooooooooo</p>
<p>{urlWithoutParams}</p>
<p>{classId}</p>
<p>{assignmentId}</p>
<p>{groupId}</p>
<p>{conversationUrls}</p>
<p>{studentGroupsUrls}</p>