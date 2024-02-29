"use client";

import { FC, createContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthDialog from "./components/auth";
import { UnsavedGraphTemplate } from "./templates";
import RedirectSharedGraph from "./templates/RedirectShortUrl";

// The total time spent on the app was moved to a context to start the timer only when the user searches an address
// It has the flexibility to be used in other components
interface UnauthenticatedTimeContextProps {
  setStartTime: (startTime: boolean) => void;
}

export const UnauthenticatedTimeContext =
  createContext<UnauthenticatedTimeContextProps>({
    setStartTime: () => {},
  });

const PublicApp: FC = () => {
  // The total time spent on the app
  // It is used to show force the user to login after a certain amount of time
  const [startTime, setStartTime] = useState<boolean>(false);

  // Time limit in seconds
  const timeLimit = 100; // 100 seconds

  // The AuthDialog is shown when the user is not authenticated and the time limit is reached
  const initialShowDialog = localStorage.getItem("expiredFreeTrial") === "true";
  const [showAuthDialog, setShowAuthDialog] =
    useState<boolean>(initialShowDialog);

  // Create time context
  const unauthenticatedTimeContext: UnauthenticatedTimeContextProps = {
    setStartTime,
  };

  useEffect(() => {
    // The time limit is only active in production
    const devMode = import.meta.env.DEV;

    if (!devMode && startTime) {
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
          <Routes>
            <Route
              path="/public"
              element={<UnsavedGraphTemplate showLandingPage={true} />}
            />
            <Route
              path="/public/graph/:uid"
              element={<UnsavedGraphTemplate />}
            />
            <Route path="/public/graph" element={<UnsavedGraphTemplate />} />
            <Route
              path="/shared/graph/:uid"
              element={<RedirectSharedGraph />}
            />
            {/* Keep for legacy reasons */}
            <Route path="/graph/:uid" element={<RedirectSharedGraph />} />
            <Route path="*" element={<Navigate to="/public" />} />
          </Routes>
        </div>
      </UnauthenticatedTimeContext.Provider>
      {/* The AuthDialog is shown when the user is not authenticated and the time limit is reached
      No setter is passed to the AuthDialog because the user can only close it by logging in or creating an account */}
      <AuthDialog
        isOpen={showAuthDialog}
        setIsOpen={() => {}}
        signInText="Sign in to your account to continue using the app"
      />
    </BrowserRouter>
  );
};

export default PublicApp;
