<script>
    import Header from "../../lib/components/layout/Header.svelte";

    // Props for user role and assigned classes
    export let role = "teacher"; // Can be "teacher" or "student"
    export let userClass = role === "student" ? { name: "Math 101", teacher: "Mr. Smith", students: 30 } : null;

    // Dummy class data (only for teachers)
    let teacherClasses = [
        { id: 1, name: "Math 101", teacher: "Mr. Smith", students: 30 },
        { id: 2, name: "Physics 202", teacher: "Dr. Johnson", students: 25 },
        { id: 3, name: "History 303", teacher: "Ms. Adams", students: 20 },
    ];

    let menuItems = ["Dashboard", "Classes", "Questions", "Settings", "Catalog"];

    // Function to delete a class (only for teachers)
    function deleteClass(classId) {
        teacherClasses = teacherClasses.filter(cls => cls.id !== classId);
    }
</script>

<main>
    <Header />

    <div class="container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="menu">
                {#each menuItems as item}
                    <div class="menu-item">{item}</div>
                {/each}
            </div>
        </aside>

        <!-- Main content -->
        <section class="content">
            <div class="actions">
                {#if role === "teacher"}
                    <button class="btn create">+ Create Class</button>
                {/if}
                <button class="btn join">🔗 Join Class</button>
            </div>

            <h2>{role === "teacher" ? "Your Classes" : "Your Class"}</h2>

            <div class="class-list">
                {#if role === "teacher"}
                    {#each teacherClasses as classs}
                        <div class="class-card">
                            <h3>{classs.name}</h3>
                            <p>Teacher: {classs.teacher}</p>
                            <p>Students: {classs.students}</p>
                            <div class="buttons">
                                <button class="btn view">View Class</button>
                                <button class="btn delete" on:click={() => deleteClass(classs.id)}>🗑 Delete</button>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <div class="class-card">
                        <h3>{userClass.name}</h3>
                        <p>Teacher: {userClass.teacher}</p>
                        <p>Students: {userClass.students}</p>
                        <button class="btn view">View Class</button>
                    </div>
                {/if}
            </div>
        </section>
    </div>
</main>

<style>
    /* Layout */
    .container {
        display: flex;
        height: calc(100vh - 80px);
        background: white;
    }

    /* Sidebar */
    .sidebar {
        width: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background: white;
    }

    .menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }

    .menu-item {
        cursor: pointer;
        font-size: 18px;
        font-weight: 500;
        color: #2e7d32;
        transition: color 0.3s, transform 0.2s;
    }

    .menu-item:hover {
        color: #1b5e20;
        transform: scale(1.1);
    }

    .content {
        flex: 1;
        background: white;
        padding: 20px;
        overflow-y: auto;
    }

    .actions {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }

    .btn {
        padding: 12px 18px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: background 0.3s, transform 0.2s;
    }

    .btn.create {
        background: #388e3c; /* Medium green */
        color: white;
    }

    .btn.create:hover {
        background: #2e7d32;
        transform: scale(1.05);
    }

    .btn.join {
        background: #43a047; /* Green */
        color: white;
    }

    .btn.join:hover {
        background: #388e3c;
        transform: scale(1.05);
    }

    .class-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .class-card {
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .buttons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }

    .btn.view {
        background: #1b5e20; /* Dark green */
        color: white;
    }

    .btn.view:hover {
        background: #145a32;
        transform: scale(1.05);
    }

    .btn.delete {
        background: #d32f2f; /* Red */
        color: white;
    }

    .btn.delete:hover {
        background: #b71c1c;
        transform: scale(1.05);
    }
</style>
