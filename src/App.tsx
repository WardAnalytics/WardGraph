import { QueryClientProvider } from "react-query";
import useCustomQueryClient from "./hooks/useCustomQueryClient";
import authService from "./services/auth/auth.services";

import "./services/firebase/firebase";

import PrivateApp from "./PrivateApp";
import PublicApp from "./PublicApp";
import { MobileWarningTemplate } from "./templates";

function App() {
  const queryClient = useCustomQueryClient();
  const user = authService.useAuthState().user;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MobileWarningTemplate className="h-screen w-screen sm:hidden" />
        <div className="hidden h-fit w-fit sm:block">
          {user ? <PrivateApp /> : <PublicApp />}
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;
