<script>
    import Header from "../../lib/components/layout/Header.svelte";
    import { onMount } from "svelte";

    // Dummy class data
    let classes = [
        { name: "Math 101", teacher: "Mr. Smith", students: 30 },
        { name: "Physics 202", teacher: "Dr. Johnson", students: 25 },
        { name: "History 303", teacher: "Ms. Adams", students: 20 },
        { name: "Biology 404", teacher: "Dr. Green", students: 15 },
    ];

    let menuItems = ["Dashboard", "Classes", "Questions", "Settings", "Catalog"];

    onMount(() => {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
    });

</script>

<main>
    <Header />

    <div class="container">
        <!-- Sidebar -->
        <aside class="sidebar">
            {#each menuItems as item}
                <div class="menu-item">{item}</div>
            {/each}
        </aside>

        <!-- Main content -->
        <section class="content">
            <div class="actions">
                <button class="btn create">+ Create Class</button>
                <button class="btn join">🔗 Join Class</button>
            </div>

            <h2>All Classes</h2>

            <div class="class-list">
                {#each classes as classs}
                    <div class="class-card">
                        <h3>{classs.name}</h3>
                        <p>Teacher: {classs.teacher}</p>
                        <p>Students: {classs.students}</p>
                        <button class="btn view">View Class</button>
                    </div>
                {/each}
            </div>
        </section>
    </div>
</main>

<style>
    .container {
        display: flex;
        height: calc(100vh - 80px); /* Adjust for header height */
    }

    .sidebar {
        width: 250px;
        background: #2c3e50;
        color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .menu-item {
        padding: 15px;
        cursor: pointer;
        background: #34495e;
        border-radius: 5px;
        text-align: center;
        transition: background 0.3s;
    }

    .menu-item:hover {
        background: #1abc9c;
    }

    .content {
        flex: 1;
        background: #ecf0f1;
        padding: 20px;
        overflow-y: auto;
    }

    .actions {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }

    .btn {
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.3s;
    }

    .btn.create {
        background: #3498db;
        color: white;
    }

    .btn.create:hover {
        background: #2980b9;
    }

    .btn.join {
        background: #2ecc71;
        color: white;
    }

    .btn.join:hover {
        background: #27ae60;
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

    .btn.view {
        align-self: flex-start;
        background: #f39c12;
        color: white;
    }

    .btn.view:hover {
        background: #e67e22;
    }
</style>
