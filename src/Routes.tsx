import { FC, lazy } from "react";
import { RouteObject, useRoutes } from "react-router-dom";

/**
 * Public routes are accessible to all users, regardless of authentication status. Private routes are only accessible to authenticated users.
 * 
 * To add new routes:
 * - Import the component that you want to add to the routes.
 * - Add a new object to either array.
 * 
 * Example:
 * 
 * const NewComponent = lazy(() => import('./pages/NewComponent/NewComponent'))
 * 
 * const PublicRoutes: RouteObject[] = [
 *    {
 *       // The URL path that the route will be accessible at
 *       path: '/new-component', 
 *      element: (
 *        // The component that will be rendered when the route is accessed
 *         <NewComponent />
 *     ),
 *  },
 * ]
 */

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
    path: "*",
    element: <GraphTemplate />,
  },
];

const Routes: FC = () => {
  return useRoutes(PublicRoutes);
};

export default Routes;
