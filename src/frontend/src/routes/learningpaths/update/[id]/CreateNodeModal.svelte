<script lang="ts">
    import LearningObjectEditor from "./LearningObjectEditor.svelte";
    import {
        currentTranslations,
        currentLanguage,
    } from "../../../../lib/locales/i18n";
    import SelectExistingNode from "./SelectExistingNode.svelte";
    import { apiRequest } from "../../../../lib/api.ts";
    import type {
        Graph,
        GraphNode,
        NodeContent,
        Transition,
    } from "../../../../lib/types/graphTypes.ts";
    import ErrorBox from "../../../../lib/components/features/ErrorBox.svelte";

    // keep track of the graph we're building
    let transitions: Transition[] = [];
    let nodes: GraphNode[] = [];

    export let nodeId = "";

    const Step = {
        Selection: "selection",
        CreateNew: "createNew",
        UseExisting: "useExisting",
        CreateEdge: "createEdge",
    } as const;

    let urlWithoutParams = window.location.pathname;
    console.log(urlWithoutParams);
    //let assignmentId = urlWithoutParams.split("/")[4];
    type StepType = (typeof Step)[keyof typeof Step];

    let currentStep: StepType = Step.Selection;
    let errorMessage: string = "";
    let showValidation = false;

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
        None: "none",
        plaintext: "plaintext",
        multipleChoice: "multiplechoice",
    } as const;

    type AnswerTypeKey = keyof typeof AnswerType;
    type AnswerTypeValue = (typeof AnswerType)[AnswerTypeKey];

    let answerType: AnswerTypeValue = AnswerType.None;

    let difficulty: number = null;
    let estimated_time: number = null;
    let keywords: string[] = [];
    let teacher_exclusive: boolean = false;
    let minAge: number = null;
    let maxAge: number = null;
    let skos_concepts: string[] = [];
    let min_score: number = null;
    let max_score: number = null;

    let textAnswer = "";
    let choices: { text: string; isCorrect: boolean }[] = [
        { text: "", isCorrect: false },
    ];

    function addChoice() {
        choices = [...choices, { text: "", isCorrect: false }];
    }

    function removeChoice(index: number) {
        if (choices.length > 1) {
            choices = choices.filter((_, i) => i !== index);
        }
    }

    function markCorrect(index: number) {
        choices = choices.map((choice, i) => ({
            ...choice,
            isCorrect: i === index,
        }));
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
    let htmlContent = "";

    let inputElement: HTMLInputElement;

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" && document.activeElement === inputElement) {
            handleSubmit();
        } else if (event.key === "Escape") {
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

    function isInvalidNumber(val: number | null | undefined) {
        return val === null || val === undefined || isNaN(val) || val < 0;
    }

    async function handleSubmit() {
        showValidation = true;
        if (
            label.trim() &&
            htmlContent.trim() &&
            answerType.trim() &&
            difficulty >= 0 &&
            estimated_time &&
            minAge >= 0 &&
            maxAge >= 0 &&
            maxAge >= 0 &&
            min_score >= 0 &&
            max_score >= 0
        ) {
            if (minAge > maxAge) {
                errorMessage =
                    "Minimal age should not be less than maximum Age.";
            } else if (min_score > max_score) {
                errorMessage =
                    "Minimal score should not be less than maximum score.";
            } else {
                const user = JSON.parse(
                    window.localStorage.getItem("user") || "{}"
                );
                const userId = user.id;

                const body = {
                    user: userId,
                    data: {
                        hruid: label.toLowerCase().replace(/\s+/g, "-"),
                        language: $currentLanguage,
                        html_content: htmlContent,
                        title: label,
                        answer:
                            answerType === "plaintext"
                                ? [textAnswer]
                                : answerType === "multiplechoice"
                                  ? choices
                                        .filter((c) => c.isCorrect)
                                        .map((c) => c.text)
                                  : [],

                        possible_answers:
                            answerType === "multiplechoice"
                                ? choices.map((c) => c.text)
                                : [],
                        submission_type:
                            answerType !== "none" ? answerType : null,
                        content_type: "extern",
                        keywords: keywords,
                        target_ages: [minAge, maxAge],
                        teacher_exclusive: teacher_exclusive,
                        skos_concepts: skos_concepts,
                        educational_goals: null,
                        copyright: "",
                        license: "",
                        difficulty: difficulty,
                        estimated_time: estimated_time,
                        return_value: null,
                        available: true,
                    },
                };

                try {
                    const data = await apiRequest("/learningObjects", "POST", {
                        body: JSON.stringify(body),
                    });
                    const graphNode: GraphNode = { id: data.id, title: label };
                    const transition: Transition = {
                        label: "",
                        min_score,
                        max_score,
                        source: nodeId,
                        target: data.id,
                    };
                    onSubmit(transition, graphNode);
                } catch (error) {
                    return;
                }
            }
        } else {
            errorMessage = "Please fill in all fields.";
        }
    }

    function handleSelectExisting(node: GraphNode) {
        const transition: Transition = {
            label: "",
            min_score,
            max_score,
            source: nodeId,
            target: node.id,
        };

        onSubmit(transition, node);
    }
</script>

<div class="modal">
    <div class="modal-content">
        {#if errorMessage}
            <ErrorBox {errorMessage} on:close={() => (errorMessage = "")} />
        {/if}
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
                <label for="node-label"
                    >{$currentTranslations.createLearningPath.createNode}</label
                >
                <input
                    id="node-label"
                    type="text"
                    placeholder={$currentTranslations.createLearningPath
                        .createNodeLabel}
                    bind:value={label}
                    bind:this={inputElement}
                    class:validation-error={showValidation && !label.trim()}
                />

                <LearningObjectEditor
                    content={htmlContent}
                    onUpdate={(html) => (htmlContent = html)}
                />

                <div class="form-group">
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label
                        >{$currentTranslations.createLearningPath
                            .answerType}</label
                    >
                    <select bind:value={answerType} class:validation-error={showValidation && !answerType.trim()}>
                        <option value="none"
                            >{$currentTranslations.createLearningPath
                                .noAnswer}</option
                        >
                        <option value="plaintext"
                            >{$currentTranslations.createLearningPath
                                .textAnswer}</option
                        >
                        <option value="multiplechoice"
                            >{$currentTranslations.createLearningPath
                                .multipleChoice}</option
                        >
                    </select>
                </div>

                {#if answerType === "multiplechoice"}
                    <div class="form-group">
                        <!-- svelte-ignore a11y_label_has_associated_control -->
                        <label
                            >{$currentTranslations.createLearningPath
                                .multipleChoiceOptions}</label
                        >
                        {#each choices as choice, index}
                            <div class="choice-item">
                                <input
                                    type="text"
                                    bind:value={choice.text}
                                    placeholder={$currentTranslations
                                        .createLearningPath.optionPlaceholder}
                                    class:validation-error={showValidation && !choice.text.trim()}
                                />
                                <input
                                    type="radio"
                                    name="correct"
                                    checked={choice.isCorrect}
                                    on:change={() => markCorrect(index)}
                                />
                                <button
                                    on:click={() => removeChoice(index)}
                                    disabled={choices.length === 1}>✕</button
                                >
                            </div>
                        {/each}
                        <button class="button secondary" on:click={addChoice}
                            >{$currentTranslations.createLearningPath
                                .addOption}</button
                        >
                    </div>
                {/if}
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label>Minimum score required to go to this node</label>
                <input
                    type="number"
                    placeholder="Minimum score"
                    min="0"
                    max="100"
                    bind:value={min_score}
                    class:validation-error={showValidation && isInvalidNumber(min_score)}
                />
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label>Maximum score required to go to this node</label>
                <input
                    type="number"
                    placeholder="Maximum score"
                    min="0"
                    max="100"
                    bind:value={max_score}
                    class:validation-error={showValidation && isInvalidNumber(max_score)}
                />
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label>Difficulty</label>
                <input
                    type="number"
                    placeholder="difficulty"
                    min="0"
                    bind:value={difficulty}
                    class:validation-error={showValidation && isInvalidNumber(difficulty)}
                />
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label>Estimated time (minutes)</label>
                <input
                    type="number"
                    placeholder="difficulty"
                    min="0"
                    bind:value={estimated_time}
                    class:validation-error={showValidation && (isInvalidNumber(estimated_time) || estimated_time == 0)}
                />
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label>Min Age: {minAge}</label>
                <input type="number" bind:value={minAge} class:validation-error={showValidation && isInvalidNumber(minAge)} />

                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label>Max Age: {maxAge}</label>
                <input
                    type="number"
                    min={minAge}
                    max="25"
                    bind:value={maxAge}
                    class:validation-error={showValidation && isInvalidNumber(maxAge)}
                />

                <label
                    ><input
                        type="checkbox"
                        bind:checked={teacher_exclusive}
                    />Teacher Exclusive</label
                >
            </div>
            <button class="button secondary" on:click={goBack}>Back</button>
        {:else if currentStep === Step.UseExisting}
            <SelectExistingNode
                onSelect={(node: GraphNode) => {
                    handleSelectExisting(node);
                }}
            />
            <button class="button secondary" on:click={goBack}>Back</button>
        {:else if currentStep === Step.CreateEdge}
            <div class="form-group">
                <label for="target-node"
                    >{$currentTranslations.createLearningPath.selectNode}</label
                >
                <select id="target-node" bind:value={targetId}>
                    <option value="" disabled selected
                        >{$currentTranslations.createLearningPath
                            .selectNodeLabel}</option
                    >
                    {#each nodeList as node}
                        {#if node.id !== sourceId && node.id !== "1"}
                            <!-- Exclude the source node from the list -->
                            <option value={node.id}>{node.label}</option>
                        {/if}
                    {/each}
                </select>
            </div>
            <button class="button secondary" on:click={goBack}>Back</button>
        {/if}
        {#if currentStep !== Step.UseExisting}
            <div class="modal-actions">
                <button class="button primary" on:click={handleSubmit}
                    >{$currentTranslations.createLearningPath.submit}</button
                >
                <button
                    class="button secondary"
                    on:click={((errorMessage = ""), onCancel)}
                    >{$currentTranslations.createLearningPath.cancel}</button
                >
            </div>
        {/if}
    </div>
</div>

<style>
    @import "../../../../lib/styles/global.css";

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
        transition:
            background 0.3s,
            transform 0.2s;
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

    .validation-error {
        border: 2px solid #e74c3c !important;
        background: #fff6f6;
    }
</style>
