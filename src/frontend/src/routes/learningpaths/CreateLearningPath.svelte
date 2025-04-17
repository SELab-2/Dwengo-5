<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import "../../lib/styles/global.css";
    import cytoscape from "cytoscape";
    import dagre from "cytoscape-dagre";

    cytoscape.use(dagre);

    let cy; // Cytoscape instance
    let nodeIdCounter = 1; // Counter to generate unique node IDs

    function get_node_id() {
        const id = nodeIdCounter;
        nodeIdCounter++;
        return String(id);
    }

    const rootNodeId = get_node_id();
    const createNodeId = get_node_id();

    onMount(() => {
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
                        label: "data(label)",
                        "text-valign": "center",
                        color: "#fff", // White text
                        "text-outline-width": 2,
                    },
                },
                {
                    selector: "edge",
                    style: {
                        width: 2,
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier", // Use bezier for smooth curves
                    },
                },
                {
                    selector: 'node[type="create-node"]',
                    style: {
                        "background-color": "#fff",
                        "border-color": "var(--dwengo-green)",
                        "border-width": 2,
                        width: 15,
                        height: 15,
                        label: "+",
                        "font-size": 10,
                        color: "var(--dwengo-green)",
                        "text-valign": "center",
                        "text-halign": "center",
                    },
                },
            ],
            layout: {
                name: "dagre", // Top-to-bottom layout
                rankDir: "TB", // Top-to-bottom layout
                nodeSep: 50, // Spacing between nodes
                edgeSep: 10, // Spacing between edges
                rankSep: 100, // Spacing between levels
            },
        });

        // Add event listener for node clicks
        cy.on("tap", 'node[type="create-node"]', (event) => {
            const node = event.target;
            const parentId = node.data("parentId"); // Retrieve the parent ID from the create-node's data
            if (parentId) {
                addNodeAfter(parentId); // Pass the correct parent ID
            }
        });
    });

    // Function to add a new node after a given node
    function addNodeAfter(parentId: string) {
        const newNodeLabel = window.prompt("Enter node label:");
        if (!newNodeLabel) {
            return; // Prevent adding empty nodes
        }

        // Add the new node and edge
        const id = get_node_id();
        const create_id = get_node_id();

        cy.add([
            { data: { id: id, label: newNodeLabel } }, // new node
            { data: { source: parentId, target: id } }, // edge from parent to new node
            { data: { id: create_id, label: "+", type: "create-node", "parentId": id } }, // new create-node with correct parent
            { data: { source: id, target: create_id } } // edge from new node to create-node
        ]);

        // Reapply the layout to maintain the DAG structure
        cy.layout({
            name: "dagre",
            rankDir: "TB", // Top-to-bottom layout
            nodeSep: 50, // Spacing between nodes
            edgeSep: 10, // Spacing between edges
            rankSep: 100, // Spacing between levels
        }).run();
    }
</script>

<Header />
<h1>Create a New Learning Path</h1>
<div class="form-container">
    <div id="cy" class="graph-container"></div>
</div>
<Footer />

<style>
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
