<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import "../../lib/styles/global.css";
    import cytoscape from "cytoscape";

    let cy; // Cytoscape instance
    let nodeIdCounter = 3; // Counter to generate unique node IDs
    let selectedNodeId: string | null = null; // Track the currently selected node

    onMount(() => {
        // Initialize Cytoscape
        cy = cytoscape({
            container: document.getElementById('cy'), // Container for the graph
            elements: [
                // Initial nodes
                { data: { id: 'a', label: 'Node A' } },
                { data: { id: 'b', label: 'Node B' } },
                { data: { id: 'c', label: 'Node C' } },
                // Initial edges
                { data: { source: 'a', target: 'b' } },
                { data: { source: 'b', target: 'c' } }
            ],
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': 'var(--dwengo-green)', // Use the green color from global.css
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'color': '#fff', // White text
                        'text-outline-width': 2,
                        'text-outline-color': 'var(--dwengo-dark-green)' // Dark green outline
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': 'var(--dwengo-dark-green)', // Dark green for edges
                        'target-arrow-color': 'var(--dwengo-dark-green)',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier' // Use bezier for smooth curves
                    }
                }
            ],
            layout: {
                name: 'breadthfirst', // Top-to-bottom layout
                directed: true, // Ensure edges are directed
                spacingFactor: 1.5, // Adjust spacing between nodes
                roots: '#a' // Start layout from Node A
            }
        });

        // Add event listener for node clicks
        cy.on('tap', 'node', (event) => {
            const node = event.target;
            selectedNodeId = node.id(); // Set the selected node
        });
    });

    // Function to add a new node with multiple parent nodes
    function addNodeWithParents(parentIds: string[]) {
        const newNodeId = `node-${nodeIdCounter++}`;
        const newNodeLabel = `Node ${newNodeId.toUpperCase()}`;

        // Add the new node
        cy.add({ data: { id: newNodeId, label: newNodeLabel } });

        // Add edges from each parent to the new node
        parentIds.forEach((parentId) => {
            cy.add({ data: { source: parentId, target: newNodeId } });
        });

        // Reapply the layout to maintain the DAG structure
        cy.layout({
            name: 'breadthfirst',
            directed: true,
            spacingFactor: 1.5,
            roots: '#a'
        }).run();
    }
</script>

<Header />
<h1>Create a New Learning Path</h1>
<div class="form-container">
    <div id="cy" class="graph-container"></div>
    <div class="controls">
        <button class="btn" on:click={() => addNodeWithParents(['a', 'b'])}>
            Add Node with Parents A and B
        </button>
    </div>
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

    .controls {
        margin-top: 20px;
    }

    .btn {
        padding: 10px 15px;
        background: var(--dwengo-green);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .btn:hover {
        background: var(--dwengo-dark-green);
    }
</style>