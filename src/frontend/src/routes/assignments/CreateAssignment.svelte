<script lang="ts">
	import { onMount } from "svelte";
	import Header from "../../lib/components/layout/Header.svelte";
	import { currentTranslations, savedLanguage, currentLanguage } from "../../lib/locales/i18n";
	import Footer from "../../lib/components/layout/Footer.svelte";
	import Drawer from "../../lib/components/features/Drawer.svelte";
	import SearchBar from "../../lib/components/features/SearchBar.svelte";
	import Avatar from "../../lib/components/ui/Avatar.svelte";
	import "../../lib/styles/global.css";
	import { apiBaseUrl } from "../../config";
	import { apiRequest } from "../../lib/api";
	import { user } from "../../lib/stores/user.ts";
	import { get } from "svelte/store";
	import { push, params } from 'svelte-spa-router';
	
	import { getToken } from "../../lib/auth";

	/* TODO's
	 * vertaal pagina
	 * avatar in student-kolom en groepen hetzelfde maken
	 * input-veld voor deadline
	 * controleer of groep juist in backend wordt aangemaakt
	 * icon voor members tab in drawer
	 */

	$: translatedTitle = $currentTranslations.assignments.title

	// Learning paths

	type LearningPath = {
		img: string;
		name: string;
		description: string;
		content: string;
		url: string;
	};

	// Selected learning path
	let chosenLearningPath: LearningPath | null = null;

	function selectLearningPath(path: LearningPath) {
		chosenLearningPath = path;
	}


	// All learning paths
	// TODO: shared function
	let learningPaths: LearningPath[] = [];
	
	async function fetchLearningPaths(language: string) {
		try {
			// Fetch learning path urls
			const { learningpaths } = await apiRequest(`/learningpaths?language=${language}`, "get");

			// Fetch all learning paths
			const learningPathData = await Promise.all(
				learningpaths.map(async (path: string) => {
					const res = await apiRequest(`${path}?language=${language}`, "get");
					res.url = path;
					return res;
				})
			);

			learningPaths = learningPathData;
		} catch (error) {
			console.error("Error fetching learning paths:", error);
		}
	}

	type Student = {
		name: string;
		url: string;
	};

	// All students from this classroom
	let allStudents: Student[] = [];
	async function fetchStudents() {
		try {
			const { students } = await apiRequest(`/classes/${classId}/students`, "get");

			const studentData = await Promise.all(
				students.map(async (path: string) => {
					const res = await apiRequest(`${path}`, "get");
					res.url = path;
					return res;
				})
			);

			allStudents = studentData;
		} catch (error) {
			console.error("Error fetching students:", error);
		}
	}

	let selectedStudents: Student[] = [];
	let selectAll = false;

	function assignEachStudentToGroup() {
		if (allStudents.length === 0) {
			allStudents = groups.flatMap(group => group.students); // Restore students
			groupIdCounter = 0;
			groups = [{ id: groupIdCounter, students: [] }];
			return;
		}

		groups = allStudents.map((student, index) => ({
			id: index,
			students: [student]
		}));
		groupIdCounter = groups.length; // Update counter
		allStudents = []; // Clear all students
	}

	function toggleSelection(event, student: Student) {
		if (event.target.checked) {
			selectedStudents = [...selectedStudents, student]; // Add selected student
			addToGroup(student); // Add student to a group
		} else {
			selectedStudents = selectedStudents.filter(selectedStudent => selectedStudent.name !== student.name); // Remove if unchecked
			removeFromGroup(student); // Remove student from a group
		}
	}

	function toggleSelectionAll() {
		selectAll = !selectAll;
		if (selectAll) {
			selectedStudents = [...allStudents]; // Select all students
			addAllToGroup(); // Add all students to a group
		} else {
			selectedStudents.forEach(student => removeFromGroup(student)); // Remove all from group
			selectedStudents = [];
		}
	}

	// Groups
	let groups: { id: number; students: Student[] }[] = [];
	let groupIdCounter = 0;
	groups.push({ id: groupIdCounter, students: [] });

	function addToGroup(student: Student) {
		let currentGroup = groups[groupIdCounter];

		if (!currentGroup.students.includes(student)) {
			currentGroup.students = [...currentGroup.students, student];
			groups = [...groups]; // Reassign to trigger reactivity
		}
	}

	function removeFromGroup(student: Student) {
		groups = groups.map(group => ({
			...group,
			students: group.students.filter(s => s !== student)
		}));
	}

	function addAllToGroup() {
		let currentGroup = groups[groupIdCounter];
		currentGroup.students = [...allStudents];
		groups = [...groups]; // Reassign array for reactivity
	}

	function createGroup() {
		allStudents = allStudents.filter(student => !selectedStudents.includes(student)); // Remove selected students from all students
		groupIdCounter = groups.length
		if (allStudents.length != 0) groups.push({ id: groupIdCounter, students: [] });
	}


	// Assignments

	let name: string;

	// TODO: add input field for deadline
	let deadline = new Date();
	
	async function createAssignment() {
		// maak assignment
		const token = getToken();
		if (!token) throw new Error("No token available");

		if (!chosenLearningPath) {
			alert("Kies een leerpad"); // TODO: vertaal - op andere manier tonen
			return;
		}

		let response = await fetch(`${apiBaseUrl}/classes/${classId}/assignments`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				name: name, // TODO: add input field for assignment name
				learningpath: chosenLearningPath.url,
				deadline: deadline,
			})
		});

		const body = await response.json(); // Extract the response body
		console.log(body);
		const assignmentUrl = body.assignment;

		
		// Create assignment for each group
		for (const group of groups) {
			const studentUrls = group.students.map(student => student.url);

			await fetch(`${apiBaseUrl}${assignmentUrl}/groups`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					students: studentUrls
				})
			});
		}
	}


	$: classId = $params?.class_id || null;

	$: {
		fetchLearningPaths($currentLanguage);
		if (classId) fetchStudents();
	}

</script>

<main>
	{#if user}
		<Header/>
		<div class="container">
			<div class="title-container">
				<p class="title">Klas: <span class="title" style="color:#80cc5d">{classId}</span></p>
			</div>

			<div class="button-container">
				<input type="text" bind:value={name} placeholder="Naam van de opdracht" class="assignment-name-input"/> <!-- TODO: vertaal -->
				<button class="button" on:click="{(event) => createAssignment()}">Maak opdracht</button> <!-- TODO: vertaal -->
			</div>

			<div class="bottom">
					<div class="drawer-container">
						<Drawer navigation_items={["members", "assignments"]} active="assignments" />
					</div>

					<div class="assignment-content">

						<div class="learning-paths">
							<!-- Content for column 1 -->
							<SearchBar />

							<!-- Learning paths -->
							{#each learningPaths as path}
								<button 
									type="button"
									class="learning-path {chosenLearningPath === path ? 'selected' : ''}" 
									on:click={() => selectLearningPath(path)}
									aria-label={`Select learning path: ${path.name}`}>
									<div class="header">
										<img src={"../static/images/learning_path_img_test.jpeg"} alt="Learning path icon" />
										<!-- <img src={path.img} alt="Learning path icon" /> -->
										<h1>{path.name}</h1>
									</div>
								
									<div class="content">
										<p>{path.description}</p>
									</div>
								</button>
							{/each}
						</div>

						<div class="students">
							<!-- Content for column 2 -->
							<SearchBar/>
							<div class="student-buttons">
								<button class="button student-btn" on:click="{assignEachStudentToGroup}">Plaats elke student in een aparte groep</button> <!-- TODO: vertaal -->
								<button class="button student-btn" on:click="{(event) => toggleSelectionAll()}">Selecteer allemaal</button> <!-- TODO: vertaal -->
							</div>

							{#each allStudents as student}
								<div class="student">
									<input 
										type="checkbox" 
										id="student-{student.name}" 
										checked="{selectAll || selectedStudents.includes(student)}"
										on:change={(event) => toggleSelection(event, student)}
									/>
									<Avatar name={student.name} />
									<p>{student.name}</p>
									
								</div>
							{/each}


						</div>
						
						<div class="groups">
							<!-- Content for column 3 -->
							{#each groups as group}
								<div class="group">
									<h2>Groep {group.id+1}</h2>
									{#each group.students as student}
										<div class="student">
											<Avatar name={student.name} />
											<p>{student.name}</p>
										</div>
									{/each}
									
									{#if group.id === groupIdCounter}
										<button class="button create-group" on:click={() => createGroup()}>Maak groep</button> <!-- TODO: vertaal-->
									{/if}
								</div>
							{/each}
						</div>
					</div>
			</div>
	</div>
		<!--<Footer />-->
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

	.learning-paths, .students {
		flex: 1; /* Each column takes equal space */
		display: flex;
		flex-direction: column; /* Stack content vertically */
		gap: 5px; /* Spacing between items */
		border-radius: 15px;
		border: 15px solid var(--dwengo-green);
	}

	.learning-path {
		margin: 7px;
		padding: 20px;
		border: none;
		background-color: transparent;
	}

	.selected {
		background-color: var(--dwengo-dark-green);
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
	}

	.title {
		font-family: 'C059-Roman';
		font-size: 4rem;
		justify-content: top; /* Center vertically */
	}

	.assignment-name-input {
		padding: 10px;
		margin-right: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 16px;
		width: 290px; /* Adjust width as needed */
	}

	p {
		font-family: sans-serif;
		font-size: 1.1rem;
	}

	img {
		width: 100px;
		height: 100px;
	}

	.header {
	display: flex;
	align-items: center; /* Aligns image and text vertically */
	gap: 15px; /* Space between image and text */
	}

	.content {
		display: flex;
		flex-direction: column;
		padding-top: 10px;
	}

	h1 {
		font-family: sans-serif;
		font-size: 1.8rem;
	}

	img {
		width: 100px; /* Adjust size as needed */
		height: 100px;
	}   


	/* Students */
	.student {
		display: flex;
		align-items: center; /* Vertically aligns the avatar and text */
		gap: 10px; /* Adds some space between the avatar and the name */
		padding: 5px 20px;
	}

	.student-buttons {
		display: flex;
		gap: 10px; /* Space between buttons */
		margin-bottom: 20px;
		margin-left: 15px;
		margin-right: 15px;
	}


	/* Groups */
	.groups {
		flex: 1; /* Each column takes equal space */
		display: flex;
		flex-direction: column; /* Stack content vertically */
		gap: 15px; /* Spacing between items */
	}

	.group {
		padding: 20px;	
		border-top: 1px solid #ccc;
		border-radius: 15px;
		border: 15px solid var(--dwengo-green);
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

	.create-group {	
		width: 100%;
		margin-top: 20px;
		text-align: center;
	}

	h2 {
		padding-bottom: 20px;
	}

</style>


