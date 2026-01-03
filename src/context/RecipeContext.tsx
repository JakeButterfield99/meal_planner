import React, { ReactNode, useContext, useEffect, useState } from "react";
import recipeService from "../services/recipe.service";
import { Recipe, RecipeContents, RecipeData } from "../types/MealPlan";

export interface IRecipeContext {
    recipes: Recipe[],
    lastUpdate: Date,
    RefreshRecipes: Function,

    activeRecipe: Recipe | null,
    recipeContents: RecipeContents | null,
    SetActiveRecipe: Function,
}

const RecipeContext = React.createContext<IRecipeContext | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
    const [recipeContents, setRecipeContents] = useState<RecipeContents | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date(0));

    function RefreshRecipes() {
        recipeService.GetAllRecipes()
            .then((value) => {
                setRecipes(value);
            })
            .catch(err => console.log("GET ALL RECIPE ERR", err));
    }

    function GetRecipeData() {
        if (!activeRecipe) return;
        recipeService.GetRecipe(activeRecipe.id)
            .then((val) => {
                console.log("GOT RECIPE DATA", val);
                setRecipeContents(val);
            })
            .catch(err => console.log("GET RECIPE DATA ERR", err));
    }

    function SetActiveRecipe(recipe: Recipe | null) {
        if (recipe === null)
            setRecipeContents(null);
        setActiveRecipe(recipe);
    }

    useEffect(() => {
        RefreshRecipes();
    }, []);

    useEffect(() => {
        GetRecipeData();
    }, [activeRecipe]);

    return (
        <RecipeContext.Provider value={{
            recipes,
            lastUpdate,
            RefreshRecipes,
            activeRecipe,
            recipeContents,
            SetActiveRecipe,
        }}>
            {children}
        </RecipeContext.Provider>
    )
}

export const useRecipe = (): IRecipeContext => {
    const context = useContext(RecipeContext);
    if (!context)
        throw new Error('useRecipe must be used within a RecipeProvider');
    return context;
};