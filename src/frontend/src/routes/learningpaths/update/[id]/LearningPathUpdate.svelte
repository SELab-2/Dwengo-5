<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Header from "../../../../lib/components/layout/Header.svelte";
    import Footer from "../../../../lib/components/layout/Footer.svelte";
    import CreateNodeModal from "./CreateNodeModal.svelte";
    import EditNodeModal from "./EditNodeModal.svelte";
    import TransitionModal from "./TransitionModal.svelte"
    import ErrorBox from "../../../../lib/components/features/ErrorBox.svelte";
    import "../../../../lib/styles/global.css";
    import { apiRequest } from '../../../../lib/api.ts';
    import { currentTranslations, savedLanguage, currentLanguage } from "../../../../lib/locales/i18n";
    import cytoscape from "cytoscape";
    import dagre from "cytoscape-dagre";
    import type { Graph, GraphNode, NodeContent, Transition } from "../../../../lib/types/graphTypes.ts";

    // keep track of the graph we're building
    let transitions: Transition[] = [];
    let nodes: GraphNode[] = [];
    let startNodeId: string = null;

    cytoscape.use(dagre);

    let cy: cytoscape.Core; // Cytoscape instance
    let nodeIdCounter = 1; // Counter to generate unique node 
    
    let showModal = false; // State to control modal visibility
    let showEditModal = false; // State to control edit modal visibility
    let showEditEdgeModal = false;

    let showError = false; // State to control error visibility
    let errorMessage = ""; // Error message to display

    let selectedNode = "";

    function get_node_id() {
        const id = nodeIdCounter;
        nodeIdCounter++;
        return String(id);
    }

    const rootNodeId = get_node_id();
    const createNodeId = get_node_id();

    function handleBeforeUnload(event: BeforeUnloadEvent) {
        event.preventDefault();
        event.returnValue = currentTranslations.createLearningPath.unsavedChangesWarning;
    }

    onDestroy(() => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
    });

    onMount(() => {

        window.addEventListener("beforeunload", handleBeforeUnload);

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
                        'label': 'data(label)',
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

        // Add event listener for regular node clicks
        cy.on("tap", 'node[type="object-node"]', (event) => {
            const node = event.target;
            selectedNode = node.id(); // Set the selected node to the clicked node's ID
            showEditModal = true; // Show the edit modal
        });

        // Add event listener for edge clicks
        cy.on("tap", 'edge[type="transition"]', (event) => {
            const edge = event.target;
            showEditEdgeModal = true; // Show the edit modal
        });
    });


    function addEdge(egde: Transition) {
        const sourceId = edge.source;
        const targetId = edge.target;

        edge.label = `${edge.min_score} - ${edge.max_score}`

        const tempEdge = cy.add({ data: { source: sourceId, target: targetId, label: edge.label } });

        // Perform a BFS/DFS to check for cycles
        const hasCycle = detectCycle(sourceId);

        if (hasCycle) {
            // Remove the edge if it creates a cycle
            tempEdge.remove();
            errorMessage = $currentTranslations.createLearningPath.error_cycle; // Set the error message
            showError = true; // Show the error message
        } else {
            // If no cycle, finalize the edge addition
            cy.layout({
                name: "dagre"
            }).run();
            transitions.push(edge);
        }
    }

    function removeNode(nodeId: string) {
        const node = cy.getElementById(nodeId);
        if (node) {
            // Find and remove the child create-node
            const childCreateNode = cy.nodes(`[parentId="${nodeId}"]`);
            if (childCreateNode) {
                cy.remove(childCreateNode);
            }

            // Remove the node itself
            cy.remove(node);
            nodes = nodes.filter(node => node.id !== nodeId); // Remove from nodeList
        }
        showEditModal = false; // Close the edit modal
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

    function addNodeAfter(node: GraphNode, edge: Transition) {
        if (!node || !edge) {
            return; // Prevent adding empty nodes
        }

        const newNodeLabel = node.title;
        const id = node.id;
        const parentId = edge.source;
        const create_id = get_node_id();
        const edge_type = parentId != rootNodeId? "transition" : "";
        const edgeLabel = `${edge.min_score} - ${edge.max_score}`

        cy.add([
            { data: { id: id, label: newNodeLabel, type: "object-node" } }, // new node
            { data: { source: parentId, target: id, type: edge_type, label: edgeLabel } }, // edge from parent to new node, label from data
            { data: { id: create_id, label: "+", type: "create-node", parentId: id } }, // new create-node with correct parent
            { data: { source: id, target: create_id, label: '' } } // edge from new node to create-node
        ]);

        nodes.push(node);
        transitions.push(edge);

        cy.layout({
            name: "dagre"
        }).run();
    }

    function handleModalSubmit(edge: Transition, node: GraphNode) {
        if (node) {
            if (!nodes) {
                startNodeId = node.id;
                console.log(startNodeId);
            }
            addNodeAfter(node, edge);
        } else if (edge) {
            addEdge(edge);
        }
        showModal = false;
    }

    async function submitLearningPathContent() {
        const learningpathId = decodeURIComponent(window.location.pathname.split("/")[3]);
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("id");
        const language = urlParams.get("language");

        const body = {
            nodes: nodes.map(n => n.id),
            transitions: transitions.map(t => ({
                label: t.label,
                source: t.source,
                target: t.target,
                min_score: t.min_score,
                max_score: t.max_score,
            })),
            startNode: startNodeId
        };

        console.log(body);

        try {
            const response = await apiRequest(`/learningpaths/${learningpathId}/content`, 'POST', {
                body: JSON.stringify(body)
            });

            alert("Learning path content submitted successfully!");
        } catch (error) {
            console.error("Failed to submit learning path content:", error);
            alert("There was an error submitting the learning path content.");
        }
    }

</script>

<Header />
<h1>{$currentTranslations.createLearningPath.title}</h1>
<div class="form-container">
    <div id="cy" class="graph-container"></div>
</div>
{#if showModal}
    <CreateNodeModal nodeList={nodes} sourceId={selectedNode} onSubmit={handleModalSubmit} onCancel={handleModalCancel} nodeId={selectedNode} />
{/if}
{#if showEditModal}
    <EditNodeModal
        nodeId={selectedNode}
        onDelete={removeNode}
        onCancel={() => showEditModal = false} />
{/if}
{#if showEditEdgeModal}
    <TransitionModal onCancel={() => showEditEdgeModal = false}/>
{/if}
{#if showError}
    <div class="errorbox-container">
        <ErrorBox errorMessage={errorMessage} on:close={() => showError = false} />
    </div>
{/if}
<button class="button primary" on:click={submitLearningPathContent}>
    Submit Learning Path Structure
</button>
<Footer />

<style>
    @import "../../../../lib/styles/global.css";

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