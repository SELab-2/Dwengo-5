<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Header from "../../../lib/components/layout/Header.svelte";
    import Footer from "../../../lib/components/layout/Footer.svelte";
    
    import ErrorBox from "../../../lib/components/features/ErrorBox.svelte";
    import "../../../lib/styles/global.css";
    import { currentTranslations, savedLanguage, currentLanguage } from "../../../lib/locales/i18n";
    import cytoscape from "cytoscape";
    import dagre from "cytoscape-dagre";
    import { apiRequest } from "../../../lib/api";


    let title: string = "";
    let hruuid: string = "";
    let language: string = "";
    let description: string = "";
    let languageChoices = ["en", "de", "nl", "fr", "it", "es"]


    async function postLearningpath(){
        if(title.trim() && language.trim() && description.trim()){
            try{
                const response = await apiRequest(`/learningpaths`, "POST", { 
					body: JSON.stringify({
						title: title.trim(),
						language: language.trim(),
                        description: description.trim(),
					})
				});
                title ="";
                language="";
                description="";
            }
            catch(error){
                console.error("Error creating learningpath: " + error);
            }
        }
    }

</script>

<Header></Header>
<div class = "content">
    <div class="title-container">
        <p class="title">Create Learningpath</p>
    </div>
    <div class="learningpath-container">
        <p>Title</p>
        <textarea class="learningpath-text" bind:value={title} placeholder="Type your Title here..." rows=1></textarea>
        <p>Description</p>
        <textarea class="learningpath-text" bind:value={description} placeholder="Type your Title here..." rows=4></textarea>
        <p>Language</p>
        <select class="learningpath-text" bind:value={language}>
	    <option value="" disabled selected>Select a language</option>
	    {#each languageChoices as lang}
		    <option value={lang}>{lang}</option>
	    {/each}
        </select>

        <div class="button-container">
            <button on:click={postLearningpath}>Create Learningpath</button>
        </div>

    </div>
    
</div>


<style>
    .content{
        flex-direction: column;
        
        
    }
    .button-container{
        padding: 20px;
        
    }
    .title {
		font-family: 'C059-Roman';
		font-size: 3rem;
		justify-content: top; /* Center vertically */
		margin-bottom: 5px;
    }
    .learningpath-container {
		flex-direction: column;
		border: 15px solid var(--dwengo-green);
        max-width: 250px;
        justify-content: center;
	}
    .learningpath-text{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding-top: 5%;
		margin-bottom: 20px;
        padding: 2px;
	}
    button {
		background-color: var(--dwengo-green);
		color: white;
		border: none;
		padding: 10px 15px;
		border-radius: 5px;
		cursor: pointer;
        padding: 5px;
	}
</style>