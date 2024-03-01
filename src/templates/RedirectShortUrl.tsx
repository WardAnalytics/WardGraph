import { FC, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthState from "../hooks/useAuthState";
import RedirectTemplate from "./RedirectTemplate";

const RedirectSharedGraph: FC = () => {
  const { uid: sharedGraphID } = useParams<{ uid: string }>();
  const { isAuthenticated, isLoading, user } = useAuthState();

  const userID = useMemo(() => {
    return user ? user.uid : "";
  }, [user]);

  const navigate = useNavigate();

  useEffect(() => {
    // If the user is loading, it does nothing
    if (isLoading) {
      return;
    }

    sessionStorage.removeItem("focusedAddressData");

    // If the user is authenticated, it redirects to the graph on user account, otherwise, it redirects to the public graph
    if (isAuthenticated) {
      navigate(`/${userID}/graph/${sharedGraphID}`);
    } else {
      navigate(`/public/graph/${sharedGraphID}`);
    }

  }, [isLoading, userID])

  return <RedirectTemplate title="Redirecting to the graph..." />;
};

export default RedirectSharedGraph;
