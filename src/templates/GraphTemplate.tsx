import { FC, useMemo, useState } from "react";
import authService from "../services/auth/auth.services";

import { PublicGraph, PrivateGraph } from "../components/Graph";
import LoginDialog from "../components/auth";

import Socials from "../components/Socials";
import Banner from "../components/banner";

const getURLSearchParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const addresses = urlParams.get("addresses")?.split(",") || [];
  const paths = urlParams.get("paths")?.split(",") || [];
  return { addresses, paths };
};

const GraphTemplate: FC = () => {
  // Get the current user
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const user = authService.useAuthState();
  const isAutenticated = useMemo(() => {
    return user !== null;
  }, [user]);

  // On initial load, get the addresses and paths from the URL
  const { initialAddresses, initialPaths } = useMemo(() => {
    const { addresses, paths } = getURLSearchParams();
    return { initialAddresses: addresses, initialPaths: paths };
  }, []);

  return (
    <div className="h-screen w-screen">
      {isAutenticated ? (
        <>
          <PrivateGraph
            initialAddresses={initialAddresses}
            initialPaths={initialPaths}
          />
        </>
      ) : (
        <>
          <Banner />
          <PublicGraph
            initialAddresses={initialAddresses}
            initialPaths={initialPaths}
          />
        </>
      )}
      <Socials className="absolute bottom-0 right-0 m-4" />
      <LoginDialog
        isOpen={isLoginDialogOpen}
        setIsOpen={setIsLoginDialogOpen}
      />
    </div>
  );
};

export default GraphTemplate;
