import { FC, useMemo } from "react";
import { QueryClientProvider } from "react-query";
import useCustomQueryClient from "./hooks/useCustomQueryClient";

import useAuthState from "./hooks/useAuthState";

import PrivateApp from "./PrivateApp";
import PublicApp from "./PublicApp";
import { MobileWarningTemplate } from "./templates";

import { HelmetProvider } from 'react-helmet-async';

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
            {isAuthenticated ? <PrivateApp userID={userID} /> : <PublicApp />}
          </div>
        </QueryClientProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
