interface Route {
    path: string;
    element: React.ReactNode;
}

export const publicRoutes: Route[] = [
    {
        path: "/",
        element: <></>,
    },
    {
        path: "*",
        element: <></>
    }
];

export const privateRoutes: Route[] = [
    {
        path: "/graph/:uid",
        element: <></>
    },
    {
        path: "/saved-graph/:uid",
        element: <></>
    },
    {
        path: "/billing",
        element: <></>
    },
    {
        path: "/graphs",
        element: <></>
    },
    {
        path: "*",
        element: <></>
    }
];