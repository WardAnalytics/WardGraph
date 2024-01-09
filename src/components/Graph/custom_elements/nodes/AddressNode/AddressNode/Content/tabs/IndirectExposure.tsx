import { useContext } from "react";

import ExposureTab from "./ExposureTab";

import { AnalysisContext } from "../../AnalysisWindow";

const IndirectExposure = () => {
  const { analysisData } = useContext(AnalysisContext)!;

  return (
    <ExposureTab
      incomingExposure={analysisData.incomingIndirectExposure}
      outgoingExposure={analysisData.outgoingIndirectExposure}
    />
  );
};

export default IndirectExposure;
