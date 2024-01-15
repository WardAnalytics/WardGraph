import { FC, lazy } from "react";
import { RouteObject, useRoutes } from "react-router-dom";

const GraphTemplate = lazy(() => import("./templates/GraphTemplate"));

const PublicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <GraphTemplate />,
  },
];

const Routes: FC = () => {
  return useRoutes(PublicRoutes);
};

export default Routes;
