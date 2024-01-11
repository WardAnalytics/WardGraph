import { FC, useState, useEffect, createContext } from "react";
import { Transition } from "@headlessui/react";
import { Exposure } from "../../../../../../../../../api/model";

import FocusedEntity from "./FocusedEntity";

import Breadcrumbs, { Page } from "./Breadcrumbs";
import ExposureView from "./ExposureView";
import EntityView from "./EntityView";

interface ExposureTabContext {
  incomingExposure: Exposure;
  outgoingExposure: Exposure;
  focusedEntity: FocusedEntity | null;
  setFocusedEntity: (entity: FocusedEntity) => void;
}

export const ExposureTabContext = createContext<ExposureTabContext | null>(
  null,
);

interface ViewTransitionProps {
  children: React.ReactNode;
  show: boolean;
}

const ViewTransition: FC<ViewTransitionProps> = ({ children, show }) => (
  <Transition
    appear={true}
    show={show}
    enter="transition-all duration-200"
    enterFrom="opacity-50 -translate-x-10"
    enterTo="opacity-100 translate-x-0"
    leave="hidden duration-0"
  >
    {children}
  </Transition>
);

interface ExposureTabProps {
  incomingExposure: Exposure;
  outgoingExposure: Exposure;
}

/** This component is the main component for the Exposure tab.
 * It forwards to one of three components: ExposureView, EntityView, or AddressView.
 * It is capable of switching between them as well.
 *
 * @param incomingExposure: The incoming exposure data
 * @param outgoingExposure: The outgoing exposure data
 * @param setTargetAddress: The function to set the target address of the analysis window
 */

const ExposureTab: FC<ExposureTabProps> = ({
  incomingExposure,
  outgoingExposure,
}: ExposureTabProps) => {
  // The exposure tab is dynamic and can actually list: lists of categories, addresses by entity, and activity by address
  const [focusedEntity, setFocusedEntity] = useState<FocusedEntity | null>(
    null,
  ); // The entity that is focused
  const [pages, setPages] = useState<Page[]>([]); // The pages that are shown in the breadcrumbs

  // Define context
  const contextValue = {
    incomingExposure,
    outgoingExposure,
    focusedEntity,
    setFocusedEntity,
  };

  // Whenever focusedEntity or focusedAddress changes, update the pages using useEffect
  useEffect(() => {
    // If there is no focused entity, return nothing
    if (focusedEntity === null) {
      setPages([]);
      return;
    }

    setPages([
      {
        name: `${focusedEntity.incoming ? "Incoming" : "Outgoing"}`,
        onClick: () => setFocusedEntity(null),
      },
      { name: focusedEntity.entity.name },
    ]);
  }, [focusedEntity]);

  return (
    <ExposureTabContext.Provider value={contextValue}>
      <div className="flex w-full flex-col">
        {pages.length > 0 && (
          <Breadcrumbs pages={pages} className="mb-4 ml-3 mt-3" />
        )}
        <ViewTransition show={focusedEntity !== null}>
          {focusedEntity && <EntityView />}
        </ViewTransition>
        <ViewTransition show={focusedEntity === null}>
          <ExposureView />
        </ViewTransition>
      </div>
    </ExposureTabContext.Provider>
  );
};

export default ExposureTab;
