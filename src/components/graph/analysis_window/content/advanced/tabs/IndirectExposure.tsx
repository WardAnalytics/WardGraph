import { useContext, FC } from "react";

import ExposureTab from "./ExposureTab";

import { AnalysisContext } from "../../../AnalysisWindow";

const IndirectExposure: FC = () => {
  const { analysisData } = useContext(AnalysisContext)!;

  return (
    <ExposureTab
      incomingExposure={analysisData!.incomingIndirectExposure}
      outgoingExposure={analysisData!.outgoingIndirectExposure}
    />
  );
};

export default IndirectExposure;
