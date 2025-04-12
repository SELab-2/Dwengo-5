<script lang="ts">
	import { onDestroy } from "svelte";
	import { currentTranslations } from "../../../lib/locales/i18n";
	import Avatar from "../../../lib/components/ui/Avatar.svelte";
	import "../../../lib/styles/global.css";
	import { apiRequest } from "../../../lib/api";
	import { groups } from "../../../lib/stores/createAssignment.ts";
	import { get } from 'svelte/store';
	import { createSearchStore, searchHandler } from "../../../lib/stores/search.ts";

	type Student = {
		name: string;
		url: string;
	};

	// Reactive variables initialized in this file
	let currentGroup = 0;
	let groupCounter = 0;
	let studentsWithoutGroup: Student[] = [];
	let selectedStudents: Student[] = [];
	let editMode: boolean = false;
	let groupNameError: string | null = null; // Variable to store error message

	// Reactive variables
	$: currentGroup;
	$: groupCounter;
	$: studentsWithoutGroup;
	$: selectedStudents;


	async function fetchStudents() {
		try {
			const response = await apiRequest(`/classes/${classId}/students`, "GET");
			const students = response.students;

			const studentData = await Promise.all(
				students.map(async (path: string) => {
					const res = await apiRequest(`${path}`, "GET");
					res.url = path;
					return res;
				})
			);

			studentsWithoutGroup = studentData; // Update reactive variable
		} catch (error) {
			console.error("Error fetching students:", error);
		}
	}

	let selectAll = false;

	function assignEachStudentToGroup() {
		if (studentsWithoutGroup.length !== 0) {
			groups.set(
				studentsWithoutGroup.map((student, index) => ({
					id: index,
					name: `${index + 1}`,
					students: [student]
				}))
			);
		}

		currentGroup = get(groups).length; // Update reactive variable
		groupCounter = get(groups).length; // Update reactive variable
		studentsWithoutGroup = []; // Clear all students
		editMode = true;
	}

	function toggleSelection(event, student: Student) {
		// make new group if not already in one
		const emptyGroups = get(groups).filter(group => group.students.length === 0);
		if (selectedStudents.length === 0 && emptyGroups.length === 0) makeNewGroup();

		if (event.target.checked) {
			selectedStudents = [...selectedStudents, student]; // Add selected student
			addToGroup(student);
		} else {
			selectedStudents = selectedStudents.filter(selectedStudent => selectedStudent.url !== student.url);
			removeFromGroup(student);
		}

		editMode = false;
	}

	function toggleSelectionAll() {
		if (studentsWithoutGroup.length === 0) return;

		if (!selectAll) {
			selectedStudents = studentsWithoutGroup;
			addAllToGroup();
			selectAll = true;
		} else {
			selectedStudents.forEach(student => {
				removeFromGroup(student);
			});
			selectedStudents = [];
			selectAll = false;
		}

		editMode = false;
	}

	function addToGroup(student: Student) {
		groups.update(g => {
			const group = g.find(group => group.id === currentGroup);
			if (group && !group.students.includes(student)) {
				group.students.push(student);
			}
			return [...g];
		});
	}

	function removeFromGroup(student: Student) {
		groups.update(g => {
			g.forEach(group => {
				group.students = group.students.filter(s => s.url !== student.url);
			});
			return [...g];
		});
	}

	function addAllToGroup() {
		if (studentsWithoutGroup.length === 0) return;

		groups.update(g => {
			const group = g.find(group => group.id === currentGroup);
			if (group) {
				group.students = [...studentsWithoutGroup];
			}
			return [...g];
		});
	}

	// Group management

	function makeNewGroup() {
		if (!editMode || studentsWithoutGroup.length === 0) return;

		groupCounter += 1; // Increment reactive variable
		currentGroup = groupCounter; // Update reactive variable
		groups.update(g => [
			...g,
			{ id: currentGroup, name: `${currentGroup + 1}`, students: [] }
		]);

		editMode = false;
	}

	function saveGroup() {
		const group = get(groups).find(group => group.id === currentGroup);

		// Check if the group name is empty
		if (!group?.name.trim()) {
			groupNameError = "Group name cannot be empty."; // Set error message
			return;
		}

		groupNameError = null; // Clear error message if valid

		if (group?.students.length === 0) {
			groups.update(g => g.filter(group => group.id !== currentGroup));
			editMode = true;
			return;
		}

		if (selectedStudents.length === 0) return;

		currentGroup = groupCounter + 1;

		studentsWithoutGroup = studentsWithoutGroup.filter(student => !selectedStudents.some(sel => sel.url === student.url)); // Update reactive variable
		selectedStudents = []; // Clear selected students

		editMode = true;
	}

	function editGroup(groupId: number) {
		editMode = false;
		groups.update(g => {
			const group = g.find(group => group.id === groupId);

			if (group) {
				// Move students back to the available pool
				studentsWithoutGroup = [...studentsWithoutGroup, ...group.students];

				// Also update selected students
				selectedStudents = [...selectedStudents, ...group.students];

				// Update currentGroup to the latest existing group or reset
				currentGroup = groupId;
			}
			return [...g];
		});
	}

	function updateGroupName(groupId: number, newName: string) {
		if (groupNameError) groupNameError = null; // Clear error when typing
		groups.update(g => {
			const group = g.find(group => group.id === groupId);
			if (group) {
				group.name = newName;
			}
			return [...g];
		});
	}

	// Search bar

	let searchProducts: Array<Student & { searchTerms: string }> = [];
	let searchStore = createSearchStore<Student & { searchTerms: string }>([]);

	$: {
		searchProducts = studentsWithoutGroup.map((student) => ({
			...student,
			searchTerms: `${student.name}`
		}));
		
		searchStore.set({
			data: searchProducts,
			filtered: searchProducts,
			search: $searchStore?.search || ""
		});
	}

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));
	onDestroy(unsubscribe);

	$: { if (classId) fetchStudents(); }

	export let classId: string | null = null;
	export let groupError: boolean = false;
</script>

<div class="students">
    <div class="search-box">
		<input class="input-search" type="search" placeholder={$currentTranslations.searchBar.placeholder} bind:value={$searchStore.search} />
	</div>

    <div class="student-buttons">
        <button class="button student-btn" on:click={assignEachStudentToGroup}>{$currentTranslations.group.createIndividual}</button>
        <button class="button student-btn" on:click={toggleSelectionAll}>{$currentTranslations.group.selectAll}</button>
    </div>

	{#if $searchStore.filtered}
    	<!-- Students -->
		{#each $searchStore.filtered as student (student.url)}
			<div class="student">
				<input 
					type="checkbox" 
					id="student-{student.name}" 
					checked={selectedStudents.some(sel => sel.url === student.url)}
					on:change={(event) => toggleSelection(event, student)}
				/>
				<Avatar name={student.name} />
				<p>{student.name}</p>
			</div>
		{/each}
	  {:else}
		<li>{$currentTranslations.learningpath.notfound}</li>
	{/if}
</div>

<div class="groups">
    {#each $groups as { id, name, students }}
        <div class="group">
            <div class="group-header">
				<h2>{$currentTranslations.group.title}</h2>
				<input 
					type="text" 
					class="group-name-input {groupNameError ? 'error' : ''}" 
					bind:value={name}
					placeholder={groupNameError || ""} 
					on:input={(e) => updateGroupName(id, e.target.value)} 
				/>
				{#if editMode}
					<button class="edit-group" on:click={() => editGroup(id)}><img src="../../../../static/images/icons/edit.png" alt="Edit group" /></button>
				{/if}
			</div>

            {#each students as student (student.url)}
                <div class="student">
                    <Avatar name={student.name} />
                    <p>{student.name}</p>
                </div>
            {/each}
            
            {#if id === currentGroup}
                <button class="button create-group" on:click={() => saveGroup()}>{$currentTranslations.group.create}</button>
			{/if}
        </div>
    {/each}

	{#if groupError}
		<p class="error">{$currentTranslations.assignments.errorGroup}</p>
	{/if}
</div>


<style>
    .students {
		flex: 1; /* Each column takes equal space */
		display: flex;
		flex-direction: column; /* Stack content vertically */
		gap: 5px; /* Spacing between items */
		border-radius: 15px;
		border: 15px solid var(--dwengo-green);
	}

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

	.input-search {
		flex: 1;
		height: 50px;
		border-style: none;
		padding: 10px;
		font-size: 18px;
		letter-spacing: 2px;
		outline: none;
		transition: all 0.5s ease-in-out;
		padding-right: 40px;
		color: #000000;
		width: 300px;
		border-radius: 0px;
		background-color: transparent;
		border-bottom: 1px solid black;
  }

  .search-box { 
		display: flex; /* Add this to position the button correctly within this container */
		align-items: center;
		gap: 10px; /* Space between input and button */
		padding-left: 20px;
		padding-right: 20px;
		padding-bottom: 15px;
  }

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

	.group-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

    .student {
		display: flex;
		align-items: center; /* Vertically aligns the avatar and text */
		gap: 10px; /* Adds some space between the avatar and the name */
		padding: 5px 20px;
	}

	.create-group {	
		width: 100%;
		margin-top: 20px;
		text-align: center;
	}

	.edit-group {
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.group-name-input {
		font-size: 1.5rem;
		font-weight: bold;
		border: none;
		border-bottom: 1px solid #ccc;
		width: 100%;
		margin-left: 10px;
	}

	.group-name-input.error {
		border-bottom: 1px solid red;
	}

	.group-name-input.error::placeholder {
		color: red; /* Ensure placeholder text is red */
		font-size: 0.9rem;
		font-weight: lighter;
	}

	.group-name-input:not(.error) {
		color: black; /* Reset font color to black when no error */
	}

	.error {
		color: var(--red-dark);
		font-size: 1rem;
		text-align: center;
		margin-top: 20px;
	}
</style>