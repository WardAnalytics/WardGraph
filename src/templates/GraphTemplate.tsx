import { FC, useMemo } from "react";
import authService from "../services/auth/auth.services";

import { PublicGraph, PrivateGraph } from "../components/graph";

import Socials from "../components/socials";
import Banner from "../components/banner";
import Navbar from "../components/navbar";

const getURLSearchParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const addresses = urlParams.get("addresses")?.split(",") || [];
  const paths = urlParams.get("paths")?.split(",") || [];
  return { addresses, paths };
};

const GraphTemplate: FC = () => {
  // Get the current user
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
        <div className="flex h-full flex-row">
          <Navbar />
          <PrivateGraph
            initialAddresses={initialAddresses}
            initialPaths={initialPaths}
          />
        </div>
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
    </div>
  );
};

export default GraphTemplate;
