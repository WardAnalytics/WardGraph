import { FC, lazy } from "react";
import { RouteObject, useRoutes } from "react-router-dom";

const Home = lazy(() => import("./components/Home/Home"));
const GraphTemplate = lazy(() => import("./templates/GraphTemplate"));

const PublicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/graph/:addressId",
    element: <GraphTemplate />,
  },
];

const Routes: FC = () => {
  return useRoutes(PublicRoutes);
};

export default Routes;
