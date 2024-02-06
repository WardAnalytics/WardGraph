import { FC } from "react";
import { PublicGraph } from "../components/graph/Graph";
import Banner from "../components/banner";

const PublicGraphTemplate: FC = () => {
  return (
    <>
      <Banner />
      <PublicGraph />;
    </>
  );
};

export default PublicGraphTemplate;
