import { FC, lazy } from "react";
import { RouteObject, useRoutes } from "react-router-dom";

import RedirectPaymentCheckout from "./components/Payment/RedirectPaymentCheckoutPage";

const GraphTemplate = lazy(() => import("./templates/GraphTemplate"));
const RedirectShortUrl = lazy(() => import("./templates/RedirectShortUrl"));

// TODO: Replace the last route with a 404 page
const PublicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <GraphTemplate />,
  },
  {
    path: "/short/:key",
    element: <RedirectShortUrl />,
  },
  {
    path: "/payment-checkout",
    element: <RedirectPaymentCheckout />
  },
  {
    path: "*",
    element: <GraphTemplate />,
  },
];

const Routes: FC = () => {
  return useRoutes(PublicRoutes);
};

export default Routes;
