## Graph Manipulation Function Separation Policy

A single workload should never use the setState hook more than once as this will completely break everything.
To avoid this but still being able to do multiple complex operations on a group of nodes, we have separated
the graph manipulation functions into two categories:

1. **Calculations** -- These receive a list of nodes and edges and output a list of nodes and edges, but they
   do not set the state. They are in `graph_calculations.tsx`.
2. **Mutations** -- These don't receive or return anything, they simply execute operations. They are inside
   the `Graph` component and manipulate the useState hooks directly.
