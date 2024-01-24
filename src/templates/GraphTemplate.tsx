import { FC } from "react";
import Graph from "../components/Graph";
import Socials from "../components/socials";

const GraphTemplate: FC = () => {
  return (
    <div className="h-screen w-screen">
      <Graph />
      <Socials className="absolute bottom-0 right-0 m-4" />
    </div>
  );
};

export default GraphTemplate;
