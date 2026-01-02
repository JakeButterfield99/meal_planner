import api from "./axios";

import { Food, MealType, Recipe } from "../types/MealPlan";

async function GetFood(): Promise<Food[]> {
    return new Promise<Food[]>(async (resolve, reject) => {
        try {
            const response = await api.get('/food');
            return resolve(response.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function CreateFood(name: string): Promise<Food> {
    return new Promise<Food>(async (resolve, reject) => {
        try {
            const response = await api.post('/food', {
                name
            });
            return resolve(response.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function EditFood(
    id: number,
    name: string,
    image: string | undefined,
    tags: MealType[],
    recipes: Recipe[],
): Promise<Food> {
    return new Promise<Food>(async (resolve, reject) => {
        try {
            const response = await api.patch(`/food/${id}`, {
                name,
                image,
                tags,
                recipes,
            });
            return resolve(response.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function DeleteFood(
    id: number
): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const response = await api.delete(`/food/${id}`);
            if (response.status === 200)
                resolve();
            reject(response.status);
        }
        catch (err) {
            reject(err);
        }
    });
}

export default {
    GetFood,
    CreateFood,
    EditFood,
    DeleteFood
}