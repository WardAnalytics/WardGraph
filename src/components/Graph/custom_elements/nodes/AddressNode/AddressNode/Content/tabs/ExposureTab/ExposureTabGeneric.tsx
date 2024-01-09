import { FC, useState, useEffect, useContext, createContext } from "react";
import { Exposure, Address } from "../../../../../../api/model";

import Breadcrumbs, { Page } from "../../../../../_common/Breadcrumbs";
import FocusedEntity from "./FocusedEntity";

import ExposureView from "./ExposureView";
import EntityView from "./EntityView";
import AddressView from "./AddressView";

import { AnalysisContext } from "../../../AnalysisWindow";

interface ExposureTabContext {
  incomingExposure: Exposure;
  outgoingExposure: Exposure;
  focusedEntity: FocusedEntity | null;
  focusedAddress: Address | null;
  setFocusedEntity: (entity: FocusedEntity) => void;
  setFocusedAddress: (address: Address) => void;
}

export const ExposureTabContext = createContext<ExposureTabContext | null>(
  null,
);

/** This component is the main component for the Exposure tab.
 * It forwards to one of three components: ExposureView, EntityView, or AddressView.
 * It is capable of switching between them as well.
 *
 * @param incomingExposure: The incoming exposure data
 * @param outgoingExposure: The outgoing exposure data
 * @param setTargetAddress: The function to set the target address of the analysis window
 */

interface ExposureTabProps {
  incomingExposure: Exposure;
  outgoingExposure: Exposure;
}

const ExposureTab: FC<ExposureTabProps> = ({
  incomingExposure,
  outgoingExposure,
}: ExposureTabProps) => {
  const { analysisData } = useContext(AnalysisContext)!;

  // The exposure tab is dynamic and can actually list: lists of categories, addresses by entity, and activity by address
  const [focusedEntity, setFocusedEntity] = useState<FocusedEntity | null>(
    null,
  ); // The entity that is focused
  const [focusedAddress, setFocusedAddress] = useState<Address | null>(null); // The address that is focused
  const [pages, setPages] = useState<Page[]>([]); // The pages that are shown in the breadcrumbs

  // Define context
  const contextValue = {
    incomingExposure,
    outgoingExposure,
    focusedEntity,
    focusedAddress,
    setFocusedEntity,
    setFocusedAddress,
  };

  // Whenever focusedEntity or focusedAddress changes, update the pages using useEffect
  useEffect(() => {
    // If there is no focused entity, return nothing
    if (focusedEntity === null) return;

    setPages([
      {
        name: `${focusedEntity.incoming ? "Incoming" : "Outgoing"}`,
        onClick: () => setFocusedEntity(null),
      },
      { name: focusedEntity.entity.name },
    ]);

    // If there is a focused address, show its tab
    if (focusedAddress === null) return;

    setPages([
      {
        name: `${focusedEntity.incoming ? "Incoming" : "Outgoing"}`,
        onClick: () => setFocusedEntity(null),
      },
      {
        name: focusedEntity.entity.name,
        onClick: () => setFocusedAddress(null),
      },
      { name: focusedAddress.hash },
    ]);
  }, [focusedEntity, focusedAddress]);

  // Whenever focusedEntity changes, setFocusedAddress to null
  useEffect(() => {
    setFocusedAddress(null);
  }, [focusedEntity]);

  // If an address is focused, show the address view
  if (focusedAddress) {
    return (
      <ExposureTabContext.Provider value={contextValue}>
        <div className="flex w-full flex-col gap-y-4">
          <Breadcrumbs pages={pages} />
          {focusedAddress.paths === undefined ? (
            <AddressView
              paths={[[analysisData.address, focusedAddress.hash]]}
            />
          ) : (
            <AddressView paths={focusedAddress.paths!} />
          )}
        </div>
      </ExposureTabContext.Provider>
    );
  }

  // If an entity is focused, show the entity view
  if (focusedEntity) {
    return (
      <ExposureTabContext.Provider value={contextValue}>
        <div className="flex w-full flex-col gap-y-4">
          <Breadcrumbs pages={pages} />
          <EntityView />
        </div>
      </ExposureTabContext.Provider>
    );
  }

  // If nothing is focused, show the exposure view
  return (
    <ExposureTabContext.Provider value={contextValue}>
      <ExposureView />
    </ExposureTabContext.Provider>
  );
};

export default ExposureTab;
