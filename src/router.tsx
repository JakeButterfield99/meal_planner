import { createBrowserRouter, RouteObject } from "react-router-dom";

import DefaultLayout from "./pages/layouts/DefaultLayout";

import MealPlanPage from "./pages/MealPlanPage";
import FoodPage from "./pages/FoodPage";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <MealPlanPage />
            },
            {
                path: '/food',
                element: <FoodPage />
            }
        ]
    }
]

const router = createBrowserRouter(routes);
export default router;