import { QueryClientProvider } from "react-query";
import useCustomQueryClient from "./hooks/useCustomQueryClient";
import authService from "./services/auth/auth.services";

import "./services/firebase/firebase";

import PrivateApp from "./PrivateApp";
import PublicApp from "./PublicApp";

function App() {
  const queryClient = useCustomQueryClient();
  const user = authService.useAuthState().user;

  return (
    <QueryClientProvider client={queryClient}>
      {user ? <PrivateApp /> : <PublicApp />}
    </QueryClientProvider>
  );
}

export default App;
