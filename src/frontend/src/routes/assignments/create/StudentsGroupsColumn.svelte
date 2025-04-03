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

	// Reactive variables
	$: currentGroup;
	$: groupCounter;
	$: studentsWithoutGroup;
	$: selectedStudents;


	async function fetchStudents() {
		try {
			const response = await apiRequest(`/classes/${classId}/students`, "get");
			const students = response.students;

			const studentData = await Promise.all(
				students.map(async (path: string) => {
					const res = await apiRequest(`${path}`, "get");
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
				new Map(
					studentsWithoutGroup.map((student, index) => [index, [student]])
				)
			);
		}

		currentGroup = get(groups).size; // Update reactive variable
		groupCounter = get(groups).size; // Update reactive variable
		studentsWithoutGroup = []; // Clear all students
		editMode = true;
	}

	function toggleSelection(event, student: Student) {
		editMode = false;

		if (event.target.checked) {
			selectedStudents = [...selectedStudents, student]; // Add selected student
			addToGroup(student);
		} else {
			selectedStudents = selectedStudents.filter(selectedStudent => selectedStudent.url !== student.url);
			removeFromGroup(student);
		}
	}

	function toggleSelectionAll() {
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
			const current = g.get(currentGroup); // Find group by id
			if (current && !current.includes(student)) {
				current.push(student);
			}
			return new Map(g);
		});
	}

	function removeFromGroup(student: Student) {
		groups.update(g => {
			g.forEach((students, groupId) => {
				g.set(groupId, students.filter(s => s.url !== student.url));
			});
			return new Map(g);
		});
	}

	function addAllToGroup() {
		if (studentsWithoutGroup.length === 0) return;

		groups.update(g => {
			g.set(currentGroup, [...studentsWithoutGroup]);
			return new Map(g);
		});
	}

	// Group management

	function makeNewGroup() {
		if (!editMode || studentsWithoutGroup.length === 0) return;

		groupCounter += 1; // Increment reactive variable
		currentGroup = groupCounter; // Update reactive variable
		groups.update(g => {
			g.set(groupCounter, []);
			return g;
		});

		editMode = false;
	}

	function saveGroup() {
		if (get(groups).get(currentGroup)?.length === 0) {
			groups.update(g => {
				// remove empty group
				g.delete(currentGroup);

				return g;
			});
			editMode = true;
			return;
		}


		if (selectedStudents.length === 0) return;

		currentGroup = groupCounter + 1; // Update reactive variable

		studentsWithoutGroup = studentsWithoutGroup.filter(student => !selectedStudents.some(sel => sel.url === student.url)); // Update reactive variable
		selectedStudents = []; // Clear selected students

		editMode = true;
	}

	function editGroup(groupId: number) {
		editMode = false;
		groups.update(g => {
			// Find the group to update
			const groupToUpdate = g.get(groupId);

			if (groupToUpdate) {
				// Move students back to the available pool
				studentsWithoutGroup = [...studentsWithoutGroup, ...groupToUpdate]; // Update reactive variable

				// Also update selected students
				selectedStudents = [...selectedStudents, ...groupToUpdate]; // Update reactive variable

				// Update currentGroup to the latest existing group or reset
				currentGroup = groupId; // Update reactive variable
			}
			return g;
		});
	}

	$: editModeStates = Array.from($groups.keys()).map(groupId => {
		return editMode;
	});

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
		{#each $searchStore.filtered as student}
			<div class="student">
				<input 
					type="checkbox" 
					id="student-{student.name}" 
					disabled={!$groups.has(currentGroup)}
					checked={selectedStudents.some(sel => sel.url === student.url)}
					on:change={(event) => toggleSelection(event, student)}
				/>
				<Avatar name={student.name} />
				<p>{student.name}</p>
			</div>
		{/each}
	  {:else}
		<li>No learning paths found</li>
	{/if}
</div>

<div class="groups">
    {#each Array.from($groups.entries()) as [groupId, students]}
        <div class="group">
            <div class="group-header">
				<h2>{$currentTranslations.group.title} {groupId + 1}</h2>
				{#if editMode}
					<button class="edit-group" on:click={() => editGroup(groupId)}><img src="../../../../static/images/icons/edit.png" alt="Edit group" /></button>
				{/if}
			</div>

            {#each students as student}
                <div class="student">
                    <Avatar name={student.name} />
                    <p>{student.name}</p>
                </div>
            {/each}
            
            {#if groupId === currentGroup}
                <button class="button create-group" on:click={() => saveGroup()}>{$currentTranslations.group.create}</button>
			{/if}
        </div>
    {/each}
	{#if studentsWithoutGroup.length > 0}
		<button class="button create-group" on:click={makeNewGroup}>{$currentTranslations.group.new}</button>
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
</style>