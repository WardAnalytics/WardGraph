import { FC, useMemo } from "react";
import authService from "../services/auth/auth.services";

import Graph from "../components/Graph";
import Socials from "../components/Socials";
import Banner from "../components/banner";

const GraphTemplate: FC = () => {
  const user = authService.useAuthState();

  console.log("User is ", user);
  const isAutenticated = useMemo(() => {
    return user !== null;
  }, [user]);

  return (
    <div className="h-screen w-screen">
      {!isAutenticated && <Banner />}
      <Graph />
      <Socials className="absolute bottom-0 right-0 m-4" />
    </div>
  );
};

export default GraphTemplate;
