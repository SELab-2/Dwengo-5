<script lang="ts">
    import Header from "../../lib/components/layout/Header.svelte";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import { location } from 'svelte-spa-router';
    import { currentTranslations } from "../../lib/locales/i18n";
    import { onMount } from "svelte";
    import { apiRequest } from "../../lib/api";
    import { routeTo } from "../../lib/route.ts";
    import { formatDate } from "../../lib/utils.ts";
	import type { MetaData, LearningObject } from "../../lib/types/types.ts";

    function getQueryParamsURL() {
        const hash = window.location.hash; // Get the hash part of the URL
        const queryParams = new URLSearchParams(hash.split('?')[1] || ''); // Extract the query parameters after '?'
        return {
			role: queryParams.get('role'),
			id: queryParams.get('id'),
        };
    }
    
    let loading = true;
    let role = getQueryParamsURL().role;
    let id = getQueryParamsURL().id;

    let url = window.location.href;
    let hashWithoutParams = window.location.hash.split("?")[0];
    let urlWithoutParams = hashWithoutParams.split("#")[1];
    let assignmentId = urlWithoutParams.split("/")[4];
    let classId = urlWithoutParams.split("/")[2];
    let learningobjectId = urlWithoutParams.split("/")[6];

    let learnpathUrl = "";
    let learnpathId = "";

    let leerpadlinks : string[] = [];
    let learnpathName = "";
    let learningobjectLinks : string[] = [];
    let total = 0;

	let metaData: MetaData[] = [];
    let currentLearningObject = 0;
    let time = "";
    let name = "";
    let contentUrl = "";
    let content : string = "";
    let progress = 0;
    let learningobject : LearningObject | null = null;

    let assignment = null ;
    let assignmentName = "";
    let deadline = "";

	let showDropdown = false;
	let title = "";
	let message = "";
	let errorPost = "";
    
    async function fetchAssignment() {
        try {
			const response =  await apiRequest(`/classes/${classId}/assignments/${assignmentId}`, "GET");
            assignment = response;
            learnpathUrl = response.learningpath;
            learnpathId = learnpathUrl.split("/")[2];
            assignmentName = assignment.name;
            deadline = formatDate(assignment.deadline);
        } catch(error){
            console.error("Error fetching assignment");
            console.log(error);
        }
    }

    async function getLearnpath() {
        try {
            const response = await apiRequest(`/learningpaths/${learnpathId}`, "GET");
            leerpadlinks = response.links.content;
            learnpathName = response.name;
        } catch(error) {
            console.error("Error fetching Learnpath");
            console.log(error);
        }
    }

    async function getContentLearnpath() {
        try {
            const response = await apiRequest(`${leerpadlinks}`, "GET");
            for(let i = 0; i < response.learningPath.length; i++) {
                learningobjectLinks = learningobjectLinks.concat(response.learningPath[i].learningObject);
                if(id === learningobjectLinks[i].split("/").pop()){
                    progress = i + 1;
                }
            }
            total = learningobjectLinks.length;
        } catch(error){
            console.error("Error fetching content.");
        }
    }

    async function getMetadata() {
        try {
            for(let url of learningobjectLinks) {
                const response = await apiRequest(`${url}`, "GET");
				const htmlContent = await apiRequest(`${response.links.content}`, "GET");
                const q: LearningObject = {
                    title: response.name,
                    time: response.estimated_time,
                    language: response.language,
                    difficulty: response.difficulty,
					links: {
						content: htmlContent
					}
				};
                metaData = metaData.concat(q);
            }
            loading = false;
        } catch(error){
            console.error("Error fetching metadata");
        }
    }

    async function getlearningObject() {
        try {
            const response = await apiRequest(`/learningobjects/${learningobjectId}`, "GET");
			learningobject = response;
            name = response.name;
            time = response.estimated_time;
			if(learningobject) contentUrl = learningobject.links.content;
        } catch(error){
            console.error("Error fetching learningobject");
            console.log(error);
        }
    }

    function setCurrentLearningObject(index: number) {
		currentLearningObject = index;
	}

    function getUrls() {
		const url = window.location.href;
		learningobjectId = url.split("/").pop()?.split("?")[0] || "";
	}

    $: {
		learningobjectId = $location.split("/").pop()?.split("?")[0] || "";
        
		if (learningobjectId) {
			(async () => {
				await getlearningObject();
				await getContent();
				for(let i = 0; i < learningobjectLinks.length; i++) {
					if(learningobjectId === learningobjectLinks[i].split("/").pop()) {
						progress = i + 1;
					}
            	}
			})();
		}
	}

    async function getContent() {
        try {
			if(!contentUrl) return;
            const response = await apiRequest(`${contentUrl}`, "GET");
            content = response.htmlContent;
        } catch(error){
            console.error("Error fetching content of learningobject");
        }
    }

    onMount(async () => {
        getUrls();
        await fetchAssignment();
        await getLearnpath();
        await getContentLearnpath();
        await getMetadata();
    });

	async function postMessage() {
		if (message.trim() && title.trim()) {
			try {
				//Create conversation
				const response = await apiRequest(`/classes/${classId}/assignments/${assignmentId}/groups/1/conversations/`, "POST", { 
					body: JSON.stringify({
						title: title.trim(),
						learningobject: `/learningobjects/${learningobjectId}`
					})
				});

				//Add initial message to conversation
				await apiRequest(`${response.conversation}/messages`, "POST", { 
					body: JSON.stringify({
						sender: `/users/${id}`,
						content: message.trim()
					})
				});

				title = "";
				message = "";
				showDropdown = false;
			} catch (err) {
				console.error("Failed to post message:", err);
				errorPost = "Failed to post message.";
			}
		}
	}
</script>

<main>
	<Header/>
	{#if loading}
		<p>{$currentTranslations.assignment.loading}...</p>
	{:else}
		<div class="title-container">
			<h1 class="title">{$currentTranslations.assignment.title}: <span style="color:#80cc5d">{assignmentName}</span></h1>
			<h2>{$currentTranslations.assignment.deadline}: <span style="color:#80cc5d">{deadline}</span></h2>
		</div>
		<div class="container">
		
			<div class="side-panel">
				{#each learningobjectLinks as link, index}
					<a href={`/classrooms/${classId}/assignments/${assignmentId}${link}`}
						on:click|preventDefault={() => {
							setCurrentLearningObject(index);
							routeTo(`/classrooms/${classId}/assignments/${assignmentId}${link}`);
						}}
						class="side-panel-element {index === currentLearningObject ? 'current' : ''}"
					>
						<span>{metaData[index].time}'</span>
						<span>{metaData[index].title}</span>
					</a>
				{/each}
			</div>
		
			<div class="content">
				<div class="progress">
					<p>{$currentTranslations.assignments.progress}</p>
					<div class="progress-wrapper">
						<span>0</span>
						<div class="progress-container">
							<div class="progress-bar" style="width: {(progress - 1) / total * 100}%"></div>
						</div>
						<span>{Math.round((progress - 1) / total * 100)}%</span>
						<div class="question-container">
							{#if role === "student"}
								<button on:click={() => showDropdown = !showDropdown}>Ask a question</button>
							{/if}
							{#if showDropdown}
								<div class="dropdown">
									<textarea bind:value={title} placeholder="Place your title here" rows="1"></textarea>
									<textarea bind:value={message} placeholder="Type your message here..." rows="4"></textarea>
									<button on:click={postMessage}>Submit</button>
								</div>
							{/if}
						</div>
					</div>
				</div>
			
				<h2 class="learningobject-title">{name}</h2>
				
				<div class="learningpath-card">
					<div class="card-content">
						<p>{@html content.replace(
							/<img(?![^>]*\bstyle=)[^>]*>/gi,
							(match: string) => match.replace('<img', '<img style="width: 500px; height: auto;"')
						)}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
	<Footer/>
</main>

  
<style>
	main {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

    .learningpath-card {
		flex: 1;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(0, 128, 0, 0.15); /* soft green shadow */
		font-family: sans-serif;
		border-radius: 15px;
		background-color: white;
		border: 15px solid var(--dwengo-green);
		padding: 20px;
		overflow-y: auto;
  		min-height: 700px; /* You can adjust the min-height as needed for a bigger card */
    }
	
	.content {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0px 80px;
		padding: 20px;
		flex: 1;
		min-height: 0;
	}

	.container {
		display: flex;
		flex: 1;
		gap: 5px;
		padding: 5px;
		height: 100%;
		min-height: 0;
    }

	.side-panel {
		display: flex;
		flex-direction: column;
		width: 310px;
		font-family: sans-serif;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		border: none;
		margin: 20px;
		margin-top: 50px;
		flex-shrink: 0;
		align-self: flex-start; /* Prevent it from stretching vertically */
	}

	.side-panel-element {
		display: block;
		justify-content: space-between;
		align-items: center;
		padding: 15px 20px;
		font-size: 14px;
		color: #333;
		border: 1px solid gainsboro;
		margin-bottom: -1px; /* Prevent double border where cards meet */
		color: inherit;
		text-decoration: none;
		cursor: pointer;
	}
	
	.side-panel-element.current {
		background-color: var(--dwengo-green); /* more solid green for headers */
		font-weight: bold;
	}
  
    .card-content p {
		font-size: 1rem;
		color: #333;
		margin-bottom: 10px;
    }

	.progress-wrapper {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		margin-bottom: 20px; /* less space below */
	}

	.progress-container {
		flex: 1;
		height: 10px; /* smaller height */
		background-color: #e0e0e0; /* light grey like in the image */
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background-color: #80cc5d; /* matches Dwengo green */
		transition: width 0.3s ease;
	}

	.progress {
		width: 60%;
	}

	.learningobject-title {
		font-size: 2rem;
		margin-bottom: 20px;
	}

	.title-container {
		flex: 0;
		padding-left: 20px;
    }

	.title {
		font-family: 'C059-Roman';
		font-size: 3rem;
		justify-content: top; /* Center vertically */
		margin-bottom: 5px;
    }

	.question-container {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 20px;
		position: relative;
	}

	button {
		background-color: var(--dwengo-green);
		color: white;
		border: none;
		padding: 10px 15px;
		border-radius: 5px;
		cursor: pointer;
	}

	.dropdown {
		position: absolute;
		top: 110%;
		right: 0;
		background: white;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 8px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
		width: 300px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	textarea {
		resize: vertical;
		width: 94%;
		padding: 8px;
		border-radius: 4px;
		border: 1px solid #ccc;
	}

</style>
