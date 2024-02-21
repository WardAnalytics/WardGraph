import { QueryClientProvider } from "react-query";
import useCustomQueryClient from "./hooks/useCustomQueryClient";

import useAuthState from "./hooks/useAuthState";

import { useMemo } from "react";
import PrivateApp from "./PrivateApp";
import PublicApp from "./PublicApp";
import { MobileWarningTemplate } from "./templates";

function App() {
  const queryClient = useCustomQueryClient();
  const { user, isAuthenticated } = useAuthState();

  const userID = useMemo(() => {
    if (user) {
      return user.uid;
    }

    return "";
  }, [user]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MobileWarningTemplate className="h-screen w-screen sm:hidden" />
        <div className="hidden h-fit w-fit sm:block">
          {isAuthenticated ? <PrivateApp userID={userID} /> : <PublicApp />}
        </div>
      </QueryClientProvider>
    </>
  );
}

// Clear local storage when the user closes the browser
window.onbeforeunload = function () {
  localStorage.clear();
}

export default App;
