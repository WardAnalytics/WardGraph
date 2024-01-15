import { FC } from "react";
import Graph from "../components/Graph";

const GraphTemplate: FC = () => {
  return (
    <div className="flex h-screen flex-col">
      <Graph />
    </div>
  );
};

export default GraphTemplate;
