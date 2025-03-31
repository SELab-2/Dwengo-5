<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import Drawer from "../../../lib/components/features/Drawer.svelte";
    import { user } from "../../../lib/stores/user.ts";
    import { routeTo } from "../../../lib/route.ts";
    import { apiRequest } from "../../../lib/api";
    import { currentTranslations } from "../../../lib/locales/i18n";

    let id: string | null = null;
    const role = $user.role;

    let navigation_items: string[] = ["Members", "Assignments"];
    if(role === "teacher") navigation_items = [...navigation_items, "Questions"];

    let sortedByAssignment: boolean = false;
    let sortedByDate: boolean = false;
    let classrooms : any = null;

    let questions: any[] = [
        { topic: "Loops in JavaScript", assignment: "Assignment 1", postDate: "20-03-2025", author: "Student1" },
        { topic: "CSS Grid Layout", assignment: "Assignment 2", postDate: "18-03-2025", author: "Student2" },
        { topic: "Svelte Basics", assignment: "Assignment 3", postDate: "22-03-2025", author: "Student3" },
        { topic: "API Fetching in Svelte", assignment: "Assignment 1", postDate: "21-03-2025", author: "Student4" },
        { topic: "State Management in Svelte", assignment: "Assignment 2", postDate: "19-03-2025", author: "Student5" }
    ];

    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get('id');
        }

        const response = await apiRequest(`/${role}s/${id}/classes`, "GET");
        let classUrls = response.classes;

        for(let i = 0; i < classUrls.length; i++) {
            console.log(`${classUrls[i]}`)
            const resp = await apiRequest(`${classUrls[i]}/conversations`, 'GET')
            console.log(resp.conversations);
            //let conversations = [...conversations, { topic: resp, assignment: "", postDate:"", author: "" }];
            
        }

        classrooms = await Promise.all(classUrls.map(async (classUrl) => {
            console.log(`Fetching class data from: ${classUrl}`);
            
            const classData = await apiRequest(`${classUrl}`, "GET"); // Get class details
            const conversationResp = await apiRequest(`${classUrl}/conversations`, "GET"); // Get conversations

            console.log(`Conversations for ${classData.name}:`, conversationResp.conversations);

            for(let i = 0; i < conversationResp.conversations.length; i++) {
                let actualConversation = conversationResp.conversations[i];
                //console.log(await apiRequest(`${actualConversation}`, "GET"));
            }

            return {
                name: classData.name,
                conversations: conversationResp.conversations || [], // Attach conversations
            };
        }));

    });

    function sortQuestions(type: string) {
        if (type === 'assignment') {
            questions = questions.sort((a, b) => {
                // Sort by assignment name (alphabetical)
                return sortedByAssignment
                    ? a.assignment.localeCompare(b.assignment)
                    : b.assignment.localeCompare(a.assignment);
            });
            sortedByAssignment = !sortedByAssignment;
        }

        if (type === 'date') {
            questions = questions.sort((a, b) => {
                // Sort by date (earliest to latest)
                return sortedByDate
                    ? new Date(a.postDate).getTime() - new Date(b.postDate).getTime()
                    : new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
            });
            sortedByDate = !sortedByDate;
        }
    }
</script>

<main>
    <Header/>
    <div class="content-container">
        <!-- Sidebar Navigation -->
        <Drawer navigation_items={navigation_items} active="members"/>

        <div class="main-content">
            {#if role === "teacher"}
                {#each classrooms as classroom}
                    <section class="table-section">
                        <h2>{classroom.name}</h2>
                        {#if classroom.conversations.length > 0}
                            <table>
                                <thead>
                                    <tr>
                                        <th>Topic</th>
                                        <th>Assignment</th>
                                        <th>Post Date</th>
                                        <th>Author</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each classroom.conversations as question}
                                        <tr>
                                            <td>{question}</td>
                                            <td>{question.assignment}</td>
                                            <td>{question.postDate}</td>
                                            <td>{question.author}</td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        {:else}
                            <p>No conversations have been posted yet.</p>
                        {/if}
                    </section>
                {/each}
            {/if}
        </div>
    </div>
</main>

<style>
    .content-container {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
    }

    .main-content {
        flex: 1;
        padding: 20px;
    }
    
    .tables-container {
        display: flex;
        gap: 20px;
        margin-top: 20px;
    }

    .table-section {
        flex: 1;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }

    .table-section h2 {
        margin-bottom: 10px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: gray;
        color: white;
    }

</style>