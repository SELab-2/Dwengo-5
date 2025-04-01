<script lang="ts">
	import { onMount } from "svelte";
	import Header from "../../../lib/components/layout/Header.svelte";
	import Footer from "../../../lib/components/layout/Footer.svelte";
	import Drawer from "../../../lib/components/features/Drawer.svelte";
	import SearchBar from "../../../lib/components/features/SearchBar.svelte";
	import Avatar from "../../../lib/components/ui/Avatar.svelte";
	import LearningPathsColumn from "./LearningPathsColumn.svelte";
	import StudentsColumn from "./StudentsColumn.svelte";
	import GroupsColumn from "./GroupsColumn.svelte";
	import { chosenLearningPath } from "../../../lib/stores/createAssignment.ts";
	import { currentTranslations } from "../../../lib/locales/i18n";
	import "../../../lib/styles/global.css";
	import { apiRequest } from "../../../lib/api";
	import { user } from "../../../lib/stores/user.ts";
	import { params } from 'svelte-spa-router';
	import { get } from 'svelte/store';
	import { groups } from "../../../lib/stores/createAssignment.ts";

	/* TODO's
	 * controleer of groep juist in backend wordt aangemaakt
	 * icon voor members tab in drawer
	 */

	$: translatedTitle = $currentTranslations.assignments.title

	let name: string;
	let deadline: date;
	
	async function createAssignment() {

		let errorMessages = [];

		// Check if all fields are filled in
		if (!get(chosenLearningPath)) {
			errorMessages.push($currentTranslations.assignments.errorLearningPath);
		}

		if (!name) {
			errorMessages.push($currentTranslations.assignments.errorName);
		}

		if (!deadline) {
			errorMessages.push($currentTranslations.assignments.errorDeadline);
		}

		// If there are errors, stop execution
		if (errorMessages.length > 0) {
			const allerts = errorMessages.join("\n");
			alert(allerts);
			return;
		}

		console.log("name", name);
		console.log("chosenLearningPath", get(chosenLearningPath).url);
		console.log("deadline", deadline);
		console.log("classId", classId);
		console.log("groups", get(groups));

		// Create assignment
		let response = await apiRequest(`/classes/${classId}/assignments`, "post", {
			name: name,
			learningpath: get(chosenLearningPath).url,
			deadline: deadline,
		});
		const assignmentUrl = response.assignment;

		// Create all the groups for the assignment
		for (const group of get(groups)) {
			const studentUrls = group.students.map(student => student.url);

			await apiRequest(`${assignmentUrl}/groups`, "post", {
				students: studentUrls
			});
		}
	}

	$: classId = $params?.class_id || null;
</script>

<main>
	{#if user}
		<Header/>
		<div class="container">
			<div class="title-container">
				<p class="title">Klas: <span class="title" style="color:#80cc5d">{classId}</span></p>
			</div>

			<div class="button-container">
				<input type="date" bind:value={deadline}/>
				<input type="text" bind:value={name} placeholder={$currentTranslations.assignments.name} class="assignment-name-input"/>	
				<button class="button" on:click="{(event) => createAssignment()}">{$currentTranslations.assignments.create}</button>
			</div>

			<div class="bottom">
					<div class="drawer-container">
						<Drawer navigation_items={["members", "assignments"]} active="assignments" />
					</div>

					<div class="assignment-content">

						<LearningPathsColumn/>

						<StudentsColumn classId={classId}/>
						
						<GroupsColumn/>

					</div>
			</div>
	</div>
		<!--<Footer />-->
		<Footer/>
	{:else}
		<p class="error">User data could not be loaded.</p>
	{/if}
</main>
	
<style>
	main {
		display: flex;
		flex-direction: column;
		min-height: 100vh; /* Full viewport height */
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	.container {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		padding-top: 50px;
	}
	.title-container {
		flex: 0;
		padding-left: 20px;
	}
	.button-container {
		display: flex;
		justify-content: flex-end;
		padding-right: 20px;
		gap: 10px; /* Space between buttons */
	}
	.bottom {
		flex: 1;
		display: flex;
	}
	.drawer-container {
		flex: 0;
		display: flex;
		flex-direction: column;
		padding-top: 40px;
	}
	.assignment-content {
		display: flex;
		gap: 20px; /* Spacing between columns */
		width: 100%;
		padding: 20px;
	}

	.title {
		font-family: 'C059-Roman';
		font-size: 4rem;
		justify-content: top; /* Center vertically */
	}

	.assignment-name-input {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 16px;
		width: 290px; /* Adjust width as needed */
	}

	p {
		font-family: sans-serif;
		font-size: 1.1rem;
	}
 
	.error { /* TODO: ERROR MESSAGES */
		color: red;
		font-size: 1.5rem;
		text-align: center;
		margin-top: 20px;
	}

	.button {
		background: #43a047;
		color: white;
		padding: 12px 18px;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		transition: background 0.3s, transform 0.2s;
	}
</style>


