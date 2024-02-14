// Error for when a graph with a specific UUID is not found
export class GraphNotFoundError extends Error {
  constructor(message: string = "Graph not found") {
    super(message);
    this.name = "GraphNotFoundError";
  }
}
