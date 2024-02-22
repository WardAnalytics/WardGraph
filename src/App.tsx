import { QueryClientProvider } from "react-query";
import useCustomQueryClient from "./hooks/useCustomQueryClient";

import useAuthState from "./hooks/useAuthState";

import PrivateApp from "./PrivateApp";
import PublicApp from "./PublicApp";
import { MobileWarningTemplate } from "./templates";

import { HelmetProvider } from 'react-helmet-async';

function App() {
  const queryClient = useCustomQueryClient();
  const { isAuthenticated } = useAuthState();

  // Ensure that context is never scoped outside of the current instance of the app
  const helmetContext = {};

  return (
    <>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <MobileWarningTemplate className="h-screen w-screen sm:hidden" />
          <div className="hidden h-fit w-fit sm:block">
            {isAuthenticated ? <PrivateApp /> : <PublicApp />}
          </div>
        </QueryClientProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
