import { createBrowserRouter, RouteObject } from "react-router-dom";
import DefaultLayout from "./pages/layouts/DefaultLayout";
import Dashboard from "./pages/Dashboard";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Dashboard />
            }
        ]
    }
]

const router = createBrowserRouter(routes);
export default router;