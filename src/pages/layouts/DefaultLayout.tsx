import { NavLink, Outlet } from "react-router-dom";

import { useRecipe } from "../../context/RecipeContext";
import { useFood } from "../../context/FoodContext";

import HomeIcon from '@mui/icons-material/Home';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import RecipeModal from "../../modals/RecipeModal";
import ViewRecipeModal from "../../modals/ViewRecipeModal";

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

                    <NavLink to='/shopping'>
                        <ShoppingCartIcon />
                    </NavLink>
                </nav>
            </aside>

            <Outlet />
        </main>
    )
}

export default DefaultLayout;