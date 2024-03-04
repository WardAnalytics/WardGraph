import { FC, createContext, useEffect, useMemo, useState } from "react";
import { QueryClientProvider } from "react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import useCustomQueryClient from "./hooks/useCustomQueryClient";
import useAuthState from "./hooks/useAuthState";

import Navbar from "./components/navbar";
import {
  BillingTemplate,
  SavedGraphTemplate,
  SavedGraphsTemplate,
  UnsavedGraphTemplate,
  MobileWarningTemplate,
} from "./templates";
import AuthDialog from "./components/auth";

// The total time spent on the app was moved to a context to start the timer only when the user searches an address
// It has the flexibility to be used in other components
interface UnauthenticatedTimeContextProps {
  setStartTime: (startTime: boolean) => void;
}

export const UnauthenticatedTimeContext =
  createContext<UnauthenticatedTimeContextProps>({
    setStartTime: () => {},
  });

const App: FC = () => {
  const queryClient = useCustomQueryClient();
  const { user, isAuthenticated } = useAuthState();

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

  const userID = useMemo(() => {
    if (user) {
      return user.uid;
    }

    return "";
  }, [user]);

  useEffect(() => {
    // The time limit is only active in production
    const devMode = import.meta.env.DEV;

    if (!devMode && startTime && !isAuthenticated) {
      console.log("Starting time");
      const interval = setInterval(() => {
        console.log("Time limit reached");
        setShowAuthDialog(true);
        localStorage.setItem("expiredFreeTrial", "true");
      }, timeLimit * 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthDialog(false);
    }
  }, [isAuthenticated]);

  // Ensure that context is never scoped outside of the current instance of the app
  const helmetContext = {};
  return (
    <>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <MobileWarningTemplate className="h-screen w-screen sm:hidden" />
          <div className="hidden h-fit w-fit sm:block">
            <div className="flex h-screen w-screen flex-row">
              <BrowserRouter>
                {/* TODO: Make it so the navbar only opens once the user searches an address. For now it's fine like this. */}
                {isAuthenticated && <Navbar userID={userID} open />}
                <UnauthenticatedTimeContext.Provider
                  value={unauthenticatedTimeContext}
                >
                  <Routes>
                    {/* Unsaved graph coming from a link */}
                    <Route
                      path={`/graph/:uid`}
                      element={<UnsavedGraphTemplate />}
                    />
                    {/* Keep for legacy reasons */}
                    <Route
                      path="/shared/graph/:uid"
                      element={<UnsavedGraphTemplate />}
                    />

                    {/* Unsaved graph without any link sharing. This is the default landing page. */}
                    <Route
                      path={`*`}
                      element={<UnsavedGraphTemplate showLandingPage />}
                    />
                    {isAuthenticated && (
                      <>
                        {/* Graph saved by an account and constantly tracked */}
                        <Route
                          path={`/saved-graph/:uid`}
                          element={<SavedGraphTemplate />}
                        />
                        <Route
                          path={`/billing`}
                          element={<BillingTemplate />}
                        />
                        <Route
                          path={`/graphs`}
                          element={<SavedGraphsTemplate />}
                        />
                      </>
                    )}
                  </Routes>
                </UnauthenticatedTimeContext.Provider>
                {/* The AuthDialog is shown when the user is not authenticated and the time limit is reached
      No setter is passed to the AuthDialog because the user can only close it by logging in or creating an account */}
                <AuthDialog
                  isOpen={showAuthDialog}
                  setIsOpen={() => {}}
                  signInText="Sign in to your account to continue using the app"
                />
              </BrowserRouter>
            </div>
          </div>
        </QueryClientProvider>
      </HelmetProvider>
    </>
  );
};

export default App;
