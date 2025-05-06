<script lang="ts">
	import { apiRequest } from "../../lib/api";
	import Header from "../../lib/components/layout/Header.svelte";
	import Footer from "../../lib/components/layout/Footer.svelte";
	import Drawer from "../../lib/components/features/Drawer.svelte";

	import { currentTranslations } from "../../lib/locales/i18n";
	import { onMount } from "svelte";
	import { routeTo } from "../../lib/route.ts";
	import { user } from "../../lib/stores/user.ts";
	import { formatDate } from "../../lib/utils.ts";
	
	// reactive translations
	$: translatedTitle = $currentTranslations.assignmentsOverview.title
      .replace("{opdrachten}", `<span style="color:#80cc5d">opdrachten's</span><br>`)
      .replace("{assignments}", `<span style="color:#80cc5d">assignments</span><br>`);

	$: translatedDeadline = $currentTranslations.assignmentsOverview.deadline;
	$: translatedFurther = $currentTranslations.assignmentsOverview.further;
	$: translatedClass = $currentTranslations.assignmentsOverview.class;

	// user info from URL
	function getQueryParamsURL() {
		const hash = window.location.hash;
		const queryParams = new URLSearchParams(hash.split('?')[1] || '');
		return {
			role: queryParams.get('role'),
			id: queryParams.get('id'),
		};
	}
	const { role, id } = getQueryParamsURL();

	// state variables
	let assignmentsPerClass: Record<string, any[]> = {};
	let classIds: Record<string, string> = {};
	let initialized = false;

	async function fetchDataOnce() {
		if (initialized) return;

		try {
			const classApiUrl = `/users/${id}/classes`;
			const classData = await apiRequest(classApiUrl, "GET");
			const classUrls = classData.classes;

			// Fetch class metadata in parallel
			const classDetails = await Promise.all(
				classUrls.map((url: string)=> apiRequest(url, "GET"))
			);

			const allAssignments = await Promise.all(
				classDetails.map(async (classMeta, idx) => {
					const classUrl = classUrls[idx];
					const classId = classUrl.split("/").pop();
					const className = classMeta.name;
					classIds[className] = classId;

					const assignmentUrl = `/users/${id}${classUrl}/assignments`;
					const assignmentData = await apiRequest(assignmentUrl, "GET");

					// Fetch assignment details
					const detailedAssignments = await Promise.all(
						assignmentData.assignments.map(async (assignmentUrl: string) => {
							const assignmentRes = await apiRequest(assignmentUrl, "GET");
							const learnPathRes = await apiRequest(assignmentRes.learningpath, "GET");
							return {
								...assignmentRes,
								url: assignmentUrl,
								id: assignmentUrl.split("/").pop(),
								classId: assignmentUrl.split("/")[2],
								learningpathDescription: learnPathRes.description,
								image: learnPathRes.image
							};
						})
					);

					return { className, assignments: detailedAssignments };
				})
			);

			for (const { className, assignments } of allAssignments) {
				assignmentsPerClass[className] = assignments;
			}

			initialized = true;
		} catch (err) {
			console.error("Error fetching data", err);
		}
	}

    type Assignment = {
        id: string;
        classId: string;
        url: string;
    }


	async function goTo(assignment: Assignment) {
		const response = await apiRequest(assignment.url, "GET");
		const learnpath = await apiRequest(response.learningpath, "GET");
		const content = await apiRequest(learnpath.links.content, "GET");
		routeTo(`/classrooms/${assignment.classId}/assignments/${assignment.id}${content[0].learningobject}`);
	}

	onMount(fetchDataOnce);
</script>

<main style="overflow-y: auto; max-height: 100vh;">
	<Header />
	<div class="body">
		<div class="title-container">
            <p class="title">{ @html translatedTitle }</p>
        </div>
        
		<div class="content">

			<div class="assignments-container">
				{#each Object.entries(assignmentsPerClass) as [classroom, assignments]}
					<div class="class-container">
						<div class="class-header">
							<h1>{classroom}</h1>
							{#if role === "teacher"}
								<button class="button create-assignment" on:click={() => routeTo(`/classrooms/${classIds[classroom]}/assignments/create`)}>
									{$currentTranslations.assignments.create}
								</button>
							{/if}
						</div>
						<div class="class-assigments">
							{#if assignments.length === 0}
								<p >No assignments available for this class.</p>
							{:else}
								{#each assignments as assignment}
									<button type="button" on:click={() => goTo(assignment)} class="assignment-card">
										<div class="image-container">
											<img class="image" src="../../static/images/learning_path_img_test2.jpeg" alt="learning-path" />
										</div>
										<div class="card-content">
											<div class="assignment-title">
												<img class="icon" src="../../static/images/logo_test.png" alt="icon" />
												<h3>{assignment.name}</h3>
											</div>
											<p><strong>{translatedDeadline}:</strong> {formatDate(assignment.deadline)}</p>
											<p>{assignment.learningpathDescription}</p>
										</div>
									</button>
								{/each}
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<Footer />
</main>
	
<style>
  
    .content {
        display: flex;         /* Enables flexbox */
        align-items: flex-start; /* Aligns items at the top */
    }

    .assignments-container {
        display: flex; /* Use flexbox for vertical stacking */
        flex-direction: column; /* Stack the class containers vertically */
        gap: 70px; /* Add space between each class container */
        justify-content: flex-start; /* Align items at the top */

        background-color: white;
        border: 15px solid var(--dwengo-green);
        border-radius: 15px;

        padding: 20px;
        max-width: 1200px; /* Optional max width to prevent full screen */
        margin: 0px auto; /* Centers the container */
        max-height: unset; /* Remove the height restriction */
        overflow-y: auto; /* Enables vertical scrolling if needed */
        box-sizing: border-box; /* ensures padding and border are included in width */
		min-width: 1200px;
		min-height: 700px; /* Ensures consistent size */
    }

	.assignment-card {
		background: #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        width: 250px;
        text-decoration: none;
        color: inherit;
        display: flex; /* Use flexbox to ensure image stays at the top */
        flex-direction: column; /* Stack image and content vertically */
        cursor: pointer;
		border: none;
		border-radius: 15px;
		padding: 0px;
    }

    .assignment-card:hover {
        background-color: #f9f9f9;
    }

    .card-content {
        padding: 15px;
    }

    .card-content h3 {
        color: var(--dwengo-green);
    }

    .title-container {
        display: flex;
        justify-content: space-between; /* Ensures elements are spaced apart */
        align-items: center; /* Aligns items vertically */
        padding-bottom: 30px;
    }

    .create-assignment {
        margin-bottom: 15px;
        align-self: flex-end;
    }

    .assignment-title {
        display: flex;
        direction: column;
        gap: 20px;
        align-items: center;
    }

    .icon {
        width: 60px;
        height: 60px;
    }

    .image-container {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 0; /* Remove bottom margin to keep image flush with content */
    }

    .image {
        max-width: 250px;
        max-height: 250px;
        object-fit: contain;
        border-radius: 8px 8px 0 0; /* Top corners rounded, bottom corners regular */
    }

    h1 {
        margin: 0;
    }

    .class-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .class-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .class-assigments {
        display: flex;
        flex-direction: row;
        gap: 20px;
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 10px;
		padding-left: 5px;
		padding-right: 5px;
    }

    @media (max-width: 600px) {
        .assignments-container {
            grid-template-columns: 1fr; /* Stack in one column */
        }
    }
</style>