import { NavLink, Outlet } from "react-router-dom";

import HomeIcon from '@mui/icons-material/Home';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import RecipeModal from "../../modals/RecipeModal";
import { useFood } from "../../context/FoodContext";
import ViewRecipeModal from "../../modals/ViewRecipeModal";
import { useRecipe } from "../../context/RecipeContext";

const DefaultLayout = () => {
    const foodContext = useFood();
    const recipeContext = useRecipe();

    return (
        <main>
            <RecipeModal
                isOpen={false}
            />

            <ViewRecipeModal
                isOpen={recipeContext.activeRecipe !== null}
            />

            <aside>
                <HomeIcon className="home_icon" />

                <nav>
                    <NavLink to='/'>
                        <SpaceDashboardIcon />
                    </NavLink>

                    <NavLink to='/food'>
                        <FastfoodIcon />
                    </NavLink>
                </nav>
            </aside>

            <Outlet />
        </main>
    )
}

export default DefaultLayout;