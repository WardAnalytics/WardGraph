export class GraphNameNotUniqueError extends Error {
  constructor(message: string = "Graph name is not unique for this user") {
    super(message);
    this.name = "GraphNameNotUniqueError";
  }
}

export class GraphNotFoundError extends Error {
  constructor(message: string = "Graph not found") {
    super(message);
    this.name = "GraphNotFoundError";
  }
}
