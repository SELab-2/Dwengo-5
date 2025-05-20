// A node within a graph
export interface GraphNode {
  id: string;
  title: string;
}

// Optional content associated with a node
export interface NodeContent {
  id: string;
  title: string;
  htmlContent: string;
}

// A transition/edge between two nodes
export interface Transition {
  label: string;
  source: string; // ID of the source node
  target: string; // ID of the target node
  min_score: number;
  max_score: number;
}

// A graph that contains nodes and a starting point
export interface Graph {
  id: string;
  startNode: string; // ID of the start node
  nodes: string[]; // store IDs of the nodes
}
