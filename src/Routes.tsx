import { FC, lazy } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";

const Graph = lazy(() => import("./templates/Graph"));

const PublicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Graph />,
  },
];

const Routes: FC = () => {
  return useRoutes(PublicRoutes);
};

export default Routes;
