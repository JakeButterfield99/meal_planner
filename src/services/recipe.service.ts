import { Recipe } from "../types/MealPlan";
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

export default {
    GetAllRecipes
}