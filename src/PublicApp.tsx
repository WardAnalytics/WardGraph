"use client";

import { FC, createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Banner from "./components/banner";

import AuthDialog from "./components/auth";
import { UnsavedGraphTemplate } from "./templates";

// The total time spent on the app was moved to a context to start the timer only when the user searches an address
// It has the flexibility to be used in other components
interface UnauthenticatedTimeContextProps {
  setStartTime: (startTime: boolean) => void;
}

export const UnauthenticatedTimeContext = createContext<UnauthenticatedTimeContextProps>({
  setStartTime: () => { },
});

const PublicApp: FC = () => {
  // The total time spent on the app
  // It is used to show force the user to login after a certain amount of time
  const [startTime, setStartTime] = useState<boolean>(false);

  // Time limit in seconds
  const timeLimit = 2 * 60; // 2 minutes

  // The AuthDialog is shown when the user is not authenticated and the time limit is reached
  const initialShowDialog = localStorage.getItem("expiredFreeTrial") === "true";
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(initialShowDialog);

  // Create time context
  const unauthenticatedTimeContext: UnauthenticatedTimeContextProps = {
    setStartTime,
  };

  useEffect(() => {
    if (startTime) {
      console.log("Starting time");
      const interval = setInterval(() => {
        console.log("Time limit reached");
        setShowAuthDialog(true);
        localStorage.setItem("expiredFreeTrial", "true");
      }, timeLimit * 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  return (
    <BrowserRouter>
      <UnauthenticatedTimeContext.Provider value={unauthenticatedTimeContext}>
        <div className="flex h-screen w-screen flex-row">
          <Banner />
          <Routes>
            <Route path="/graph/:uid" element={<UnsavedGraphTemplate />} />
            <Route path="/graph" element={<UnsavedGraphTemplate />} />
            <Route path="*" element={<UnsavedGraphTemplate />} />
          </Routes>
        </div>
      </UnauthenticatedTimeContext.Provider>
      {/* The AuthDialog is shown when the user is not authenticated and the time limit is reached
      No setter is passed to the AuthDialog because the user can only close it by logging in or creating an account */}
      <AuthDialog isOpen={showAuthDialog} setIsOpen={() => { }} />
    </BrowserRouter>
  );
};

export default PublicApp;
