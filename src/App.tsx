import { FC, useMemo } from "react";
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

const App: FC = () => {
  const queryClient = useCustomQueryClient();
  const { user, isAuthenticated } = useAuthState();

  const userID = useMemo(() => {
    if (user) {
      return user.uid;
    }

    return "";
  }, [user]);

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
                <Routes>
                  {/* Unsaved graph without any link sharing. This is the default landing page. */}
                  <Route
                    path={`/*`}
                    element={<UnsavedGraphTemplate showLandingPage />}
                  />
                  {/* Unsaved graph coming from a link */}
                  <Route
                    path={`/graph/:uid`}
                    element={<UnsavedGraphTemplate />}
                  />
                  {isAuthenticated && (
                    <>
                      {/* Graph saved by an account and constantly tracked */}
                      <Route
                        path={`/saved-graph/:uid`}
                        element={<SavedGraphTemplate />}
                      />
                      <Route path={`/billing`} element={<BillingTemplate />} />
                      <Route
                        path={`/graphs`}
                        element={<SavedGraphsTemplate />}
                      />
                    </>
                  )}
                </Routes>
              </BrowserRouter>
            </div>
          </div>
        </QueryClientProvider>
      </HelmetProvider>
    </>
  );
};

export default App;
