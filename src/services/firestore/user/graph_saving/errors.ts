export class GraphNotFoundError extends Error {
  constructor(message: string = "Graph not found") {
    super(message);
    this.name = "GraphNotFoundError";
  }
}
