import React, { ReactNode, useContext, useEffect, useState } from "react";
import recipeService from "../services/recipe.service";
import { Recipe } from "../types/MealPlan";

export interface IRecipeContext {
    recipes: Recipe[],
    lastUpdate: Date,
    RefreshRecipes: Function,
}

const RecipeContext = React.createContext<IRecipeContext | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date(0));

    function RefreshRecipes() {
        recipeService.GetAllRecipes()
            .then((value) => {
                console.log("GOT ALL RECIPES", value);
                setRecipes(value);
            })
            .catch(err => console.log("GET ALL RECIPE ERR", err));
    }

    useEffect(() => {
        RefreshRecipes();
    }, []);

    return (
        <RecipeContext.Provider value={{
            recipes,
            lastUpdate,
            RefreshRecipes
        }}>
            {children}
        </RecipeContext.Provider>
    )
}

export const useRecipe = (): IRecipeContext => {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error('useRecipe must be used within a RecipeProvider');
    }
    return context;
};