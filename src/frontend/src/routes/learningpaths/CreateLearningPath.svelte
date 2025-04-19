<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import EdgeModal from "./EdgeModal.svelte";
    import "../../lib/styles/global.css";
    import cytoscape from "cytoscape";
    import dagre from "cytoscape-dagre";

    cytoscape.use(dagre);

    let cy; // Cytoscape instance
    let nodeIdCounter = 1; // Counter to generate unique node 
    
    let showModal = false; // State to control modal visibility

    let nodeList = [];
    let selectedNode = "";

    function get_node_id() {
        const id = nodeIdCounter;
        nodeIdCounter++;
        return String(id);
    }

    const rootNodeId = get_node_id();
    const createNodeId = get_node_id();

    nodeList.push({
        id: rootNodeId,
        label: "Start"
    });

    onMount(() => {
        // Resolve CSS variables
        const rootStyles = getComputedStyle(document.documentElement);
        const dwengoGreen = rootStyles.getPropertyValue("--dwengo-green").trim();
        const dwengoDarkGreen = rootStyles.getPropertyValue("--dwengo-dark-green").trim();
        const offWhite = rootStyles.getPropertyValue("--off-white").trim();
        const tealLight = rootStyles.getPropertyValue("--teal-light").trim();

        // Initialize Cytoscape
        cy = cytoscape({
            container: document.getElementById("cy"), // Container for the graph
            elements: [
                {
                    data: {
                        id: rootNodeId,
                        label: "Start"
                    }
                },
                {
                    data: {
                        id: createNodeId,
                        label: "+",
                        type: "create-node",
                        parentId: rootNodeId
                    }
                },
                {
                    data: {
                        source: rootNodeId,
                        target: createNodeId
                    }
                }
            ],
            style: [
                {
                    selector: "node",
                    style: {
                        "label": "data(label)",
                        "text-valign": "center",
                        "color": 'black', // Text color for regular nodes
                        "text-outline-width": 2,
                        "text-outline-color": offWhite, // Outline matches the node background
                        "background-color": dwengoGreen, // Regular node background
                        "border-color": dwengoDarkGreen, // Regular node border
                        "border-width": 2,
                        "width": "40px",
                        "height": "40px"
                    }
                },
                {
                    selector: "edge",
                    style: {
                        "width": 2,
                        "line-color": tealLight, // Edge line color
                        "target-arrow-shape": "triangle",
                        "target-arrow-color": tealLight, // Arrow color
                        "curve-style": "bezier"
                    }
                },
                {
                    selector: 'node[type="create-node"]',
                    style: {
                        "background-color": offWhite, // Create node background
                        "border-color": dwengoDarkGreen, // Create node border
                        "border-width": 2,
                        "width": "15px",
                        "height": "15px",
                        "label": "+",
                        "font-size": "10px",
                        "color": dwengoGreen, // Create node text color
                        "text-valign": "center",
                        "text-halign": "center"
                    }
                },
                {
                    selector: `node[id="${rootNodeId}"]`,
                    style: {
                        "background-color": dwengoDarkGreen, // Start node background
                        "color": 'black', // Start node text color
                        "border-color": dwengoDarkGreen, // Start node border
                        "border-width": 3,
                        "width": "50px",
                        "height": "50px"
                    }
                }
            ],
            layout: {
                name: "dagre" // Top-to-bottom layout

            },
        });

        // Add event listener for node clicks
        cy.on("tap", 'node[type="create-node"]', (event) => {
            const node = event.target;
            const parentId = node.data("parentId"); // Retrieve the parent ID from the create-node's data
            if (parentId) {
                selectedNode = parentId; // Set the selected node to the parent ID
                showModal = true; // Show the modal
            }
        });
    });

    function addEdge(sourceId, targetId) {
        cy.add([
            { data: { source: sourceId, target: targetId } } // Add edge between existing nodes
        ]);
        cy.layout({
            name: "dagre"
        }).run();
    }

    function handleModalCancel() {
        showModal = false;
    }

    function addNodeAfter(parentId: string, newNodeLabel: string) {
        if (!newNodeLabel) {
            return; // Prevent adding empty nodes
        }

        const id = get_node_id();
        const create_id = get_node_id();

        cy.add([
            { data: { id: id, label: newNodeLabel } }, // new node
            { data: { source: parentId, target: id } }, // edge from parent to new node
            { data: { id: create_id, label: "+", type: "create-node", "parentId": id } }, // new create-node with correct parent
            { data: { source: id, target: create_id } } // edge from new node to create-node
        ]);

        nodeList.push({ id, label: newNodeLabel });

        cy.layout({
            name: "dagre"
        }).run();
    }

    function handleModalSubmit(sourceId, label, targetId) {
        if (label) {
            addNodeAfter(sourceId, label);
        } else if (targetId) {
            addEdge(sourceId, targetId);
        }
        showModal = false;
    }
</script>

<Header />
<h1>Create a New Learning Path</h1>
<div class="form-container">
    <div id="cy" class="graph-container"></div>
</div>
{#if showModal}
    <EdgeModal nodeList={nodeList} sourceId={selectedNode} onSubmit={handleModalSubmit} onCancel={handleModalCancel} />
{/if}
<Footer />

<style>
    @import "../../lib/styles/global.css";

    .form-container {
        padding: 20px;
    }

    .graph-container {
        width: 100%;
        height: 500px; /* Adjust height as needed */
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-top: 20px;
    }
</style>