<script lang="ts">
    import LearningObjectEditor from './LearningObjectEditor.svelte';
    import { currentTranslations, currentLanguage } from "../../lib/locales/i18n";
    import SelectExistingNode from "./SelectExistingNode.svelte";

    const Step = {
        Selection: 'selection',
        CreateNew: 'createNew',
        UseExisting: 'useExisting',
        CreateEdge: 'createEdge'
    } as const;

    type StepType = typeof Step[keyof typeof Step];

    let currentStep: StepType = Step.Selection;


    // handling of the steps
    function selectCreateNew() {
        currentStep = Step.CreateNew;
    }

    function selectUseExisting() {
        currentStep = Step.UseExisting;
    }

    function selectCreateEdge() {
        currentStep = Step.CreateEdge;
    }

    function goBack() {
        currentStep = Step.Selection;
    }

    const AnswerType = {
        None: 'none',
        Text: 'text',
        MultipleChoice: 'multiple'
    } as const;

    type AnswerTypeKey = keyof typeof AnswerType;
    type AnswerTypeValue = typeof AnswerType[AnswerTypeKey];

    let answerType: AnswerTypeValue = AnswerType.None;

    let difficulty: number = 0;
    let estimated_time: number = 0;
    let target_ages: number[] = [];
    let keywords: string[] = [];
    let teacher_exclusive: boolean = false;
    let minAge: number = 0;
    let maxAge: number = 0;
    let skos_concepts: string[] = [];
    let available = true;

    
    let textAnswer = '';
    let choices: { text: string; isCorrect: boolean }[] = [{ text: '', isCorrect: false }];

    function addChoice() {
        choices = [...choices, { text: '', isCorrect: false }];
    }

    function removeChoice(index: number) {
        if (choices.length > 1) {
            choices = choices.filter((_, i) => i !== index);
        }
    }

    function markCorrect(index: number) {
        choices = choices.map((choice, i) => ({ ...choice, isCorrect: i === index }));
    }

    interface Node {
        id: string;
        label: string;
    }

    export let nodeList: Node[] = []; // List of nodes passed from the parent
    export let onSubmit: Function;
    export let onCancel: (event: MouseEvent | void) => void;

    export let sourceId = "";

    let targetId = "";
    let label = "";
    let htmlContent = '';

    let inputElement: HTMLInputElement;

    function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && document.activeElement === inputElement) {
        handleSubmit();
    } else if (event.key === 'Escape') {
        onCancel();
    }
    }

    import { onMount, onDestroy } from "svelte";

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);

        if (inputElement) {
            inputElement.focus(); // Focus the input element when the modal opens
        }
    });

    onDestroy(() => {
        window.removeEventListener("keydown", handleKeydown);
    });

    async function handleSubmit() {
        if (!label || !htmlContent) {
            alert("Title and content are required.");
            return;
        }

        const body = {
            hruid: label.toLowerCase().replace(/\s+/g, "-"),
            language: $currentLanguage, // You can make this dynamic
            version: "1.0",
            html_content: htmlContent,
            title: label,
            description: "",
            answer: answerType === 'text'
                ? [textAnswer]
                : answerType === 'multiple'
                ? choices.map(c => c.text)
                : [],

            possible_answers: answerType === 'multiple' ? choices.map(c => c.text) : [],
            submission_type: answerType !== 'none' ? answerType : null,
            content_type: "extern",
            keywords: [],
            target_ages: [0, 99],
            teacher_exclusive: false,
            skos_concepts: [],
            educational_goals: null,
            copyright: "",
            license: "",
            difficulty: 1,
            estimated_time: 0,
            return_value: null,
            available: true,
            content_location: "sel2-5.ugent.be"
        };
        console.log(body);

        try {
            const response = await fetch("/learningobjects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error creating learning object:", errorData);
                alert("Failed to create learning object.");
                return;
            }

            const data = await response.json();
            console.log("Created learning object:", data);
            onSubmit(data.id, label, targetId);
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred.");
        }
    }
</script>

<div class="modal">
    <div class="modal-content">
        {#if currentStep === Step.Selection}
            <div class="form-group">
                <button class="button primary" on:click={selectCreateNew}>
                    {$currentTranslations.createLearningPath.createNewNode}
                </button>
                <button class="button primary" on:click={selectUseExisting}>
                    {$currentTranslations.createLearningPath.useExistingNode}
                </button>
                <button class="button primary" on:click={selectCreateEdge}>
                    {$currentTranslations.createLearningPath.createEdgeOnly}
                </button>
            </div>
        {:else if currentStep === Step.CreateNew}
            <h2>{$currentTranslations.createLearningPath.modalTitle}</h2>
            <div class="form-group">
                <label for="node-label">{$currentTranslations.createLearningPath.createNode}</label>
                <input
                    id="node-label"
                    type="text"
                    placeholder={$currentTranslations.createLearningPath.createNodeLabel}
                    bind:value={label}
                    bind:this={inputElement}
                />

                <LearningObjectEditor content={htmlContent} onUpdate={(html) => (htmlContent = html)} />

                <div class="form-group">
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label>{$currentTranslations.createLearningPath.answerType}</label>
                    <select bind:value={answerType}>
                        <option value="none">{$currentTranslations.createLearningPath.noAnswer}</option>
                        <option value="text">{$currentTranslations.createLearningPath.textAnswer}</option>
                        <option value="multiple">{$currentTranslations.createLearningPath.multipleChoice}</option>
                    </select>
                </div>

                {#if answerType === 'multiple'}
                    <div class="form-group">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label>{$currentTranslations.createLearningPath.multipleChoiceOptions}</label>
                        {#each choices as choice, index}
                            <div class="choice-item">
                                <input type="text" bind:value={choice.text} placeholder={$currentTranslations.createLearningPath.optionPlaceholder} />
                                <input type="radio" name="correct" checked={choice.isCorrect} on:change={() => markCorrect(index)} />
                                <button on:click={() => removeChoice(index)} disabled={choices.length === 1}>✕</button>
                            </div>
                        {/each}
                        <button class="button secondary" on:click={addChoice}>{$currentTranslations.createLearningPath.addOption}</button>
                    </div>
                {/if}
                <label>Difficulty</label>
                <input type="number" placeholder="difficulty" min=0 bind:value={difficulty} />
                <label>Estimated time (minutes)</label>
                <input type="number" placeholder="difficulty" min=0 bind:value={estimated_time} />
                <label>Min Age: {minAge}</label>
                <input type="number" bind:value={minAge}/>

                <label>Max Age: {maxAge}</label>
                <input type="number" min={minAge} max="25" bind:value={maxAge}/>

                <label><input type="checkbox" bind:checked={teacher_exclusive} />Teacher Exclusive</label>
            </div>
            <button class="button secondary" on:click={goBack}>Back</button>
        {:else if currentStep === Step.UseExisting}
                <SelectExistingNode
                    onSelect={(selectedPath) => {
                        console.log("Selected path:", selectedPath);
                    }}
                    onCancel={goBack}
                />
            <button class="button secondary" on:click={goBack}>Back</button>
        {:else if currentStep === Step.CreateEdge}
            <div class="form-group">
                <label for="target-node">{$currentTranslations.createLearningPath.selectNode}</label>
                <select id="target-node" bind:value={targetId}>
                    <option value="" disabled selected>{$currentTranslations.createLearningPath.selectNodeLabel}</option>
                    {#each nodeList as node}
                        {#if node.id !== sourceId && node.id !== '1'} <!-- Exclude the source node from the list -->
                            <option value={node.id}>{node.label}</option>
                        {/if}
                    {/each}
                </select>
            </div>
            <button class="button secondary" on:click={goBack}>Back</button>
        {/if}
        <div class="modal-actions">
            <button class="button primary" on:click={handleSubmit}>{$currentTranslations.createLearningPath.submit}</button>
            <button class="button secondary" on:click={onCancel}>{$currentTranslations.createLearningPath.cancel}</button>
        </div>
    </div>
</div>

<style>
    @import "../../lib/styles/global.css";

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--off-white);
        padding: 30px;
        border-radius: 8px;
        width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    h2 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--dwengo-dark-green);
        text-align: center;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    label {
        font-size: 0.9rem;
        font-weight: bold;
        color: var(--teal-dark);
    }

    input,
    select {
        padding: 10px;
        border: 1px solid var(--teal-light);
        border-radius: 4px;
        font-size: 1rem;
        color: var(--teal-dark);
        background: var(--off-white);
        outline: none;
        transition: border-color 0.3s;
    }

    input:focus,
    select:focus {
        border-color: var(--dwengo-green);
    }

    .modal-actions {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    .button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;
    }

    .button.primary {
        background: var(--dwengo-green);
        color: var(--off-white);
    }

    .button.primary:hover {
        background: var(--green-medium);
    }

    .button.secondary {
        background: var(--teal-light);
        color: var(--off-white);
    }

    .button.secondary:hover {
        background: var(--teal-dark);
    }

</style>