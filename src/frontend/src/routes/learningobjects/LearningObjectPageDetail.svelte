<script lang=ts>
    import { onMount } from "svelte";
    import { currentTranslations } from "../../lib/locales/i18n";
	import { location } from 'svelte-spa-router';
    import Header from "../../lib/components/layout/Header.svelte";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import "../../lib/styles/global.css";
    import { apiRequest } from "../../lib/api";
    import { routeTo } from '../../lib/route.ts';

    let id : string | undefined;
    let loading = true;
    let learnpathid : string;
    
    let name = "";
    let time = "";
    
    let learningobject = null;
    let contentUrl = ""
    let content : string = "";
    let leerpadlinks : string[] = [];
    let learningobjectLinks : string[] = [];
    let learnpathName = "";
    let progress = 0;
    let total = 0;

	let currentLearningObject : number = 0;
    let metadata: data[] = [];
    
    type data = {
        time: number;
        title: string;
        difficulty: number;
        language: string;
		links: {
			content: string;
		}
    }

    async function getlearningObject() {
        try {
			const response = await apiRequest(`/learningobjects/${id}`, "GET");
            learningobject = response;
            name = response.name;
            time = response.estimated_time;
            contentUrl = learningobject.links.content;
        } catch(error){
            console.error("Error fetching learningobject");
        }
    }

    async function getLearnpath() {
        try {
            const response = await apiRequest(`/learningpaths/${learnpathid}`, "GET");
            leerpadlinks = response.links.content;
            learnpathName = response.name;
        } catch(error) {
            console.error("Error fetching Learnpath");
            
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
                const q: data = {
                    title: response.name,
                    time: response.estimated_time,
                    language: response.language,
                    difficulty: response.difficulty,
					links: {
						content: ""
					}
                };
                metadata = metadata.concat(q);
            }
            loading = false;
        } catch(error){
            console.error("Error fetching metadata");
        }
        
        
    }

    async function getContent() {
        try{
			if(!contentUrl) return;
            const response = await apiRequest(`${contentUrl}`, "GET");
            content = response.htmlContent.replace(
				/<img\b(?![^>]*\bstyle=)[^>]*>/gi,
				(match: string) => match.replace('<img', '<img style="width: 500px; height: auto;"')
			);

        } catch(error){
            console.error("Error fetching content of learningobject");
        }
    }

	function getUrls() {
		const url = window.location.href;
		id = url.split("/").pop()?.split("?")[0];
		learnpathid = url.split("/")[5];
	}

	// Update currentLearningObject when a learning object is clicked
	function setCurrentLearningObject(index: number) {
		currentLearningObject = index;
	}

	$: {
		id = $location.split("/").pop()?.split("?")[0];
		
		if (id) {
			(async () => {
				await getlearningObject();
				await getContent();
				for(let i = 0;i < learningobjectLinks.length; i++){
					if(id === learningobjectLinks[i].split("/").pop()) {
						progress = i + 1;
					}
            	}
			})();
		}
	}	

	onMount(async () => {
		getUrls();

		await getLearnpath();
		await getContentLearnpath();
		await getMetadata();
		await getContent();
		await getlearningObject();

		if (currentLearningObject === null && metadata.length > 0) {
            currentLearningObject = 0; // Set the first learning object as current
        }
	});
</script>

<main>
	{#if loading}
		<p>{$currentTranslations.learningpath.loading}...</p>
	{:else}
		<Header/>
	
		<div class="title-container">
			<h1 class="title">{$currentTranslations.learningpath.title}: <span style="color:#80cc5d">{learnpathName}</span></h1>
		</div>
		<div class="container">
		
			<div class="side-panel">
				{#each learningobjectLinks as link, index}
					<a href={`/learningpaths/${learnpathid}${link}`} on:click|preventDefault={() => {
						setCurrentLearningObject(index);
						routeTo(`/learningpaths/${learnpathid}${link}`);
						}}
						class="side-panel-element {index === currentLearningObject ? 'current' : ''}"
					>
						<span>{metadata[index].time}'</span>	
						<span>{metadata[index].title}</span>
					</a>
				{/each}
			</div>
		
	
			<div class="content">
				<div class="progress">
					<p>{$currentTranslations.assignments.progress}</p>
					<div class="progress-wrapper">
						<div class="progress-container">
							<div class="progress-bar" style="width: {(progress - 1) / total * 100 }%"></div>
						</div>
						<span>{Math.round((progress - 1) / total * 100)}%</span>
					</div>
				</div>
			
				<h2 class="learningobject-title">{name}</h2>
			
				<div class="learningpath-card">
					<div class="card-content">
						{@html content}
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
		text-decoration: none;
		color: inherit;
		cursor: pointer;
	}
	
	.side-panel-element.current {
		background-color: var(--dwengo-green); /* more solid green for headers */
		font-weight: bold;
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
</style>
