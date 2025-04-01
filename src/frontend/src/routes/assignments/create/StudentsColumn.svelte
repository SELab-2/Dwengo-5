<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { currentTranslations } from "../../../lib/locales/i18n";
	import SearchBar from "../../../lib/components/features/SearchBar.svelte";
	import Avatar from "../../../lib/components/ui/Avatar.svelte";
	import "../../../lib/styles/global.css";
	import { apiBaseUrl } from "../../../config";
	import { apiRequest } from "../../../lib/api";
	import { user } from "../../../lib/stores/user.ts";
	import { params } from 'svelte-spa-router';
    import { groups, groupCounter, allStudents, selectedStudents } from "../../../lib/stores/createAssignment.ts";
    import { get } from 'svelte/store';
	import { createSearchStore, searchHandler } from "../../../lib/stores/search.ts";


	type Student = {
		name: string;
		url: string;
	};

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

			allStudents.set(studentData);
		} catch (error) {
			console.error("Error fetching students:", error);
		}
	}

	let selectAll = false;

	function assignEachStudentToGroup() {
        if (get(allStudents).length !== 0) {
            groups.set(
                get(allStudents).map((student, index) => ({
                    id: index,
                    students: [student]
                }))
            );
        }

		groupCounter.set(get(groups).length); // Update counter
		allStudents.set([]); // Clear all students
	}

	function toggleSelection(event, student: Student) {
		if (event.target.checked) {
			selectedStudents.update(s => [...s, student]); // Add selected student
			addToGroup(student);
		} else {
			selectedStudents.update(s => s.filter(selectedStudent => selectedStudent.name !== student.name));
			removeFromGroup(student);
		}
	}

	function toggleSelectionAll() {
		if (!selectAll) {
			selectedStudents.set(get(allStudents));
			addAllToGroup();
            selectAll = true;
		} else {
			get(selectedStudents).forEach(student => {
				removeFromGroup(student);
        });
			selectedStudents.set([]);
            selectAll = false;
		}
	}

    function addToGroup(student: Student) {
		groups.update(g => {
			let currentGroup = g[get(groupCounter)];
			if (!currentGroup.students.includes(student)) {
				currentGroup.students = [...currentGroup.students, student];
			}
			return [...g];
		});
    }

    function removeFromGroup(student: Student) {
		groups.update(g => 
			g.map(group => ({
				...group,
				students: group.students.filter(s => s !== student)
			}))
		);
	}

    function addAllToGroup() {
        if (get(allStudents).length === 0) return;
        
		groups.update(g => {
			g[get(groupCounter)].students = [...get(allStudents)];
			return [...g];
		});
	}


	// Search bar

	let searchProducts: Array<Student & { searchTerms: string }> = [];
	$: searchProducts = $allStudents.map((student) => ({
		...student,
		searchTerms: `${student.name}`
	}));

	let searchStore = createSearchStore<Student & { searchTerms: string }>([]);

	$: if (searchProducts.length) {
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
		<input class="input-search" type="search" placeholder="Type to search..." bind:value={$searchStore.search} />
	</div>

    <div class="student-buttons">
        <button class="button student-btn" on:click="{assignEachStudentToGroup}">{$currentTranslations.group.createIndividual}</button> <!-- TODO: vertaal -->
        <button class="button student-btn" on:click="{(event) => toggleSelectionAll()}">{$currentTranslations.group.selectAll}</button> <!-- TODO: vertaal -->
    </div>

	{#if $searchStore.filtered}
    	<!-- Students -->
		{#each $searchStore.filtered as student}
			<div class="student">
				<input 
					type="checkbox" 
					id="student-{student.name}" 
					checked="{selectAll || $selectedStudents.includes(student)}"
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
</style>