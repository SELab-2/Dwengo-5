<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../lib/components/layout/Header.svelte";
    import Footer from "../../lib/components/layout/Footer.svelte";
    import EdgeModal from "./CreateNodeModal.svelte";
    import ErrorBox from "../../lib/components/features/ErrorBox.svelte";
    import "../../lib/styles/global.css";
    import { currentTranslations, savedLanguage, currentLanguage } from "../../lib/locales/i18n";
    import cytoscape from "cytoscape";
    import dagre from "cytoscape-dagre";

    cytoscape.use(dagre);

    let cy: cytoscape.Core; // Cytoscape instance
    let nodeIdCounter = 1; // Counter to generate unique node 
    
    let showModal = false; // State to control modal visibility

    let showError = false; // State to control error visibility
    let errorMessage = ""; // Error message to display

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

    function addEdge(sourceId: string, targetId: string) {
        // Add the edge temporarily
        const tempEdge = cy.add({ data: { source: sourceId, target: targetId } });

        // Perform a BFS/DFS to check for cycles
        const hasCycle = detectCycle(sourceId);

        if (hasCycle) {
            // Remove the edge if it creates a cycle
            tempEdge.remove();
            errorMessage = $currentTranslations.CreateLearningPath.error_cycle; // Set the error message
            showError = true; // Show the error message
        } else {
            // If no cycle, finalize the edge addition
            cy.layout({
                name: "dagre"
            }).run();
        }
    }

    function detectCycle(startNodeId: string) {
        const visited = new Set<string>();
        const stack = new Set<string>();

        function dfs(nodeId: string): boolean {
            if (stack.has(nodeId)) {
                return true; // Cycle detected
            }
            if (visited.has(nodeId)) {
                return false; // Already processed
            }

            visited.add(nodeId);
            stack.add(nodeId);

            const neighbors = cy.edges(`[source="${nodeId}"]`).map(edge => edge.data("target"));
            for (const neighbor of neighbors) {
                if (dfs(neighbor)) {
                    return true;
                }
            }

            stack.delete(nodeId);
            return false;
        }

        // Start cycle detection from the given node
        return dfs(startNodeId);
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

    function handleModalSubmit(sourceId: string, label: string, targetId: string) {
        if (label) {
            addNodeAfter(sourceId, label);
        } else if (targetId) {
            addEdge(sourceId, targetId);
        }
        showModal = false;
    }
</script>

<Header />
<h1>{$currentTranslations.CreateLearningPath.title}</h1>
<div class="form-container">
    <div id="cy" class="graph-container"></div>
</div>
{#if showModal}
    <EdgeModal nodeList={nodeList} sourceId={selectedNode} onSubmit={handleModalSubmit} onCancel={handleModalCancel} />
{/if}
{#if showError}
    <div class="errorbox-container">
        <ErrorBox errorMessage={errorMessage} on:close={() => showError = false} />
    </div>
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

    .errorbox-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000; /* Ensure it appears above other elements */
    }
</style>