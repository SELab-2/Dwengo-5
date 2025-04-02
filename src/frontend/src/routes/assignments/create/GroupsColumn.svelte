<script lang="ts">
	import { onMount } from "svelte";
	import { currentTranslations, currentLanguage } from "../../../lib/locales/i18n";
	import Avatar from "../../../lib/components/ui/Avatar.svelte";
	import StudentsColumn from "./StudentsColumn.svelte";
	import "../../../lib/styles/global.css";
	import { apiBaseUrl } from "../../../config";
	import { apiRequest } from "../../../lib/api";
	import { user } from "../../../lib/stores/user.ts";
	import { params } from 'svelte-spa-router';
    import { groups, groupCounter, studentsWithoutGroup, selectedStudents } from "../../../lib/stores/createAssignment.ts";
    import { get } from 'svelte/store';
	
	import { getToken } from "../../../lib/auth";   

	$: translatedTitle = $currentTranslations.assignments.title

	function createGroup() {
		if (get(selectedStudents).length === 0) return;

		studentsWithoutGroup.update(students => {
			const selected = get(selectedStudents);
			const remaining = students.filter(student => !selected.some(sel => sel.url === student.url));
			return remaining;
		});


		groupCounter.set(get(groupCounter) + 1); // Increment group counter
		if (get(studentsWithoutGroup).length != 0) {
            groups.update(g => {
                g.push({ id: g.length, students: [] });
                return g;
            });
        }
        selectedStudents.set([]); // Clear selected students
	}

	function editGroup(groupId) {
		groups.update(g => {
			// Find the group to remove
			const groupToUpdate = g.find(group => group.id === groupId);

			if (groupToUpdate) {
				// Move students back to the available pool
				studentsWithoutGroup.update(students => [...students, ...groupToUpdate.students]);

				// Also update selected students
				selectedStudents.update(selected => [...selected, ...groupToUpdate.students]);

				// Update groupCounter to the latest existing group or reset
				groupCounter.set(groupId);
			}
			return g;
    });
}
</script>


<div class="groups">
    {#each $groups as group}
        <div class="group">
            <h2>{$currentTranslations.group.title} {group.id+1}</h2>
            {#each group.students as student}
                <div class="student">
                    <Avatar name={student.name} />
                    <p>{student.name}</p>
                </div>
            {/each}
            
            {#if group.id === $groupCounter}
                <button class="button create-group" on:click={() => createGroup()}>{$currentTranslations.group.create}</button> <!-- TODO: vertaal-->
			{:else}
			<button class="button edit-group" on:click={() => editGroup(group.id)}>
				EDIT
				<!-- {$currentTranslations.group.edit} -->
			</button>
			{/if}

			
        </div>
    {/each}
</div>

<style>
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

    .student {
		display: flex;
		align-items: center; /* Vertically aligns the avatar and text */
		gap: 10px; /* Adds some space between the avatar and the name */
		padding: 5px 20px;
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
</style>