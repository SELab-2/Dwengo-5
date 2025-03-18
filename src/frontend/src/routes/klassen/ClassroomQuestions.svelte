<script lang="ts">
    import Header from "../../lib/components/layout/Header.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import { onMount } from "svelte";

    let questionsByClass: Record<string, { id: number; text: string }[]> = {
        "Math": [
            { id: 1, text: "What is 2 + 2?" },
            { id: 2, text: "Solve for x: 3x = 9" }
        ],
        "Science": [
            { id: 3, text: "What is Newton's first law?" },
            { id: 4, text: "Define photosynthesis." }
        ],
        "History": [
            { id: 5, text: "Who was the first president of the USA?" },
            { id: 6, text: "What year did World War II start?" }
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
                                <span on:click={() => handleClick(question.text)}>{question.text}</span>
                                <button class="delete-btn" on:click={() => deleteQuestion(className, question.id)}>❌</button>
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

    .delete-btn {
        background: none;
        border: none;
        color: red;
        cursor: pointer;
        font-size: 16px;
    }

    .delete-btn:hover {
        color: darkred;
    }
</style>
