<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import Drawer from "../../lib/components/features/Drawer.svelte";
    import Avatar from "../../lib/components/ui/Avatar.svelte";
    import { currentTranslations } from "../../lib/locales/i18n";

    import { apiBaseUrl } from "../../config";
    import { apiRequest } from "../../lib/api";

    import { user } from "../../lib/stores/user.ts";
    import { routeTo } from '../../lib/route.ts';

    let id: string | null = null;
    const role = $user.role;

    let error: string | null = null;
    let loading = true;

    let navigation_items: string[] = ["Members", "Assignments"];
    let active: string = "Members";

    let pendingRequests: any[] = [
        { id: "3", username: "MikeJohnson", avatar: "mike.jpg" },
        { id: "4", username: "EmilyBrown", avatar: "emily.jpg" }
    ];

    let allAcceptedMembers = [
        { id: "1", username: "JohnDoe", role: "teacher", avatar: "john.jpg" },
        { id: "2", username: "JaneSmith", role: "student", avatar: "jane.jpg" }
    ];

    let acceptedMembers = [...allAcceptedMembers];

    function toggleAcceptedRole(role: string) {
        if (role === "teacher") {
            acceptedMembers = allAcceptedMembers.filter(member => member.role === "teacher");
        } else if (role === "student") {
            acceptedMembers = allAcceptedMembers.filter(member => member.role === "student");
        } else {
            acceptedMembers = [...allAcceptedMembers]; // Restore full list
        }
    }


    onMount(async () => {
        const hash = window.location.hash;
        const queryString = hash.split('?')[1];
        if (queryString) {
            const urlParams = new URLSearchParams(queryString);
            id = urlParams.get('id');

            if ((role === "teacher" || role === "student") && id) {
                try {
                    loadingClasses = true;
                    console.log(id);
                    const response = await apiRequest(`/${role}s/${id}/classes`);
                    let classUrls = response.classes;
                    
                } catch (err) {
                    
                }
            } else {
                
            }

        } else {
            
        }
    });

    function acceptRequest(id: string) {
        console.log("Accepted user with ID:", id);
    }

    function rejectRequest(id: string) {
        console.log("Rejected user with ID:", id);
    }

</script>

<main>
    <Header/>

    <div class="content-container">
        <!-- Sidebar Navigation -->
        <nav class="sidebar">
            <ul>
                {#each navigation_items as item}
                    <div class="container" class:active={item === active}>
                        <img src={"../../../../static/images/icons/" + item + ".png"} alt="{item} icon">
                        <span class="nav-text">{item}</span>
                    </div>            
                {/each}
            </ul>
        </nav>
        

        <!-- Tables Wrapper -->
        <div class="tables-container">
            
            <!-- Accepted Members Table -->
            <section class="table-section">
                <h2>Accepted Members</h2>
                <div class="filter-buttons">
                    <button on:click={() => toggleAcceptedRole("teacher")}>Show Teachers</button>
                    <button on:click={() => toggleAcceptedRole("student")}>Show Students</button>
                    <button on:click={() => toggleAcceptedRole("all")}>Show All</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each acceptedMembers as member}
                            <tr>
                                <td><Avatar name={member.name}/></td>
                                <td>{member.id}</td>
                                <td>{member.username}</td>
                                <td>{member.role}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </section>

            <!-- Pending Requests Table -->
            <section class="table-section">
                <h2>Pending Requests</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each pendingRequests as request}
                            <tr>
                                <td><Avatar name={request.name}/></td>
                                <td>{request.id}</td>
                                <td>{request.username}</td>
                                <td class="actions">
                                    <button class="icon-button accept" on:click={() => acceptRequest(request.id)} aria-label="Accept request">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M20 6 9 17l-5-5"/>
                                        </svg>
                                    </button>
                                    <button class="icon-button reject" on:click={() => rejectRequest(request.id)} aria-label="Reject request">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M18 6 6 18M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </section>

        </div>
    </div>
</main>

<style>
    .container {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    .nav-text {
        font-family: 'C059-Italic';
        color: black;
        text-decoration: none;
        font-size: 16px;
    }

    .content-container {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
    }

    .sidebar {
        width: 220px;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .tables-container {
        flex: 1;
        display: flex;
        justify-content: space-between;
        gap: 20px;
    }

    .table-section {
        flex: 1;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: var(--dwengo-green);
        color: white;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .filter-buttons {
        margin-bottom: 10px;
    }

    .filter-buttons button {
        margin-right: 5px;
        padding: 5px 10px;
        border: none;
        cursor: pointer;
        background: var(--dwengo-green);
        color: white;
        border-radius: 4px;
    }

    .accept {
        background-color: green;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }

    .reject {
        background-color: red;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
