import { FC, useContext } from "react";

import ExposureTab from "./ExposureTab";

import { AnalysisContext } from "../../AnalysisWindow";

const DirectExposure: FC = () => {
  const { analysisData } = useContext(AnalysisContext)!;

  return (
    <ExposureTab
      incomingExposure={analysisData!.incomingDirectExposure}
      outgoingExposure={analysisData!.outgoingDirectExposure}
    />
  );
};

export default DirectExposure;
