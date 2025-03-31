<script lang="ts">
    import Header from "../../lib/components/layout/Header.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import { onMount } from "svelte";

    let questionsByClass: Record<string, { id: number; text: string; group: string }[]> = {
        "Klas 1A": [
            { id: 1, text: "I don't understand this", group: "Group 1" },
            { id: 2, text: "Can you explain?", group: "Group 2" }
        ],
        "Klas 2A": [
            { id: 3, text: "This doesn't make any sense.", group: "Group 19" },
            { id: 4, text: "You forgot something here.", group: "Group 12" }
        ],
        "Klas 3D": [
            { id: 5, text: "Who was the first president of the USA?", group: "Group 5" },
            { id: 6, text: "This seems incorrect.", group: "Group 9" }
        ]
    };

    function deleteQuestion(className: string, questionId: number) {
        questionsByClass[className] = questionsByClass[className].filter(q => q.id !== questionId);
    }

    function handleClick(questionText: string) {
        alert("Clicked on: " + questionText);
    }
</script>

<main>
    <Header />
    <div class="container">
        <Drawer navigation_items={["dashboard","questions","classrooms", "catalog"]} active="questions"/>
        
        <div class="questions-container">
            <h1>All Questions</h1>
            {#each Object.keys(questionsByClass) as className}
                <section class="class-section">
                    <h2>{className}</h2>
                    <ul>
                        {#each questionsByClass[className] as question}
                            <li>
                                <div class="question-info">
                                    <span on:click={() => handleClick(question.text)}>{question.text}</span>
                                    <small class="group-label">{question.group}</small>
                                </div>
                                <button class="goto-btn">➝</button>
                            </li>
                        {/each}
                    </ul>
                </section>
            {/each}
        </div>
    </div>
</main>


<style>
    h1 {
        text-align: center;
        color: #166534;
    }

    .container {
        display: flex;
        height: calc(100vh - 80px);
        background: white;
    }

    .questions-container {
        flex-grow: 1; /* Takes up remaining space */
        display: flex;
        flex-direction: column; /* Stack class sections vertically */
        padding: 20px;
        overflow-y: auto; /* Allows scrolling if there are many classes */
    }

    .question-info {
        display: flex;
        flex-direction: column;
    }

    .group-label {
        font-size: 12px;
        color: #555;
        background: #d1fae5;
        padding: 2px 6px;
        border-radius: 5px;
        width: fit-content;
        margin-top: 3px;
    }

    .class-section {
        background: #f0fdf4;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px; /* Adds spacing between class sections */
    }

    h2 {
        color: #15803d;
        margin-bottom: 10px;
    }

    ul {
        list-style: none;
        padding: 0;
        width: 100%;
        display: flex;
        flex-direction: column; /* Stack questions vertically */
        gap: 8px; /* Add spacing between questions */
    }

    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 10px;
        border-radius: 8px;
        cursor: pointer;
    }

    li span:hover {
        text-decoration: underline;
    }

    .goto-btn {
        background: none;
        border: none;
        color: black;
        cursor: pointer;
        font-size: 16px;
    }

    .goto-btn:hover {
        color: darkred;
    }
</style>
