import { Recipe, RecipeContents } from "../types/MealPlan";
import api from "./axios";

async function GetAllRecipes(): Promise<Recipe[]> {
    return new Promise<Recipe[]>(async (resolve, reject) => {
        try {
            const response = await api.get('recipe');
            return resolve(response.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function GetRecipe(id: string): Promise<RecipeContents> {
    return new Promise<RecipeContents>(async (resolve, reject) => {
        try {
            const response = await api.get(`recipe/${id}`);
            return resolve(response.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

export default {
    GetAllRecipes,
    GetRecipe
}