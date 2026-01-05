import api from "./axios";

import { GetDateKey } from "../utils/date";
import { AlertIngredient, MealPlan, PlanItem } from "../types/MealPlan";

async function GetMealPlan(monday: Date): Promise<MealPlan> {
    const mon_str = GetDateKey(monday);

    return new Promise<MealPlan>(async (resolve, reject) => {
        try {
            const response = await api.get('meal_plan', {
                params: { monday: mon_str }
            });
            return resolve(response.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function AddListItem(
    planId: number,
    date: string,
    foodId: number,
    type: number,
    assigned: string
): Promise<PlanItem> {
    return new Promise<PlanItem>(async (resolve, reject) => {
        try {
            const response = await api.post("meal_plan", {
                planId, date, assigned, type, foodId
            })
            return resolve(response.data);
        }
        catch (err) {
            console.log("AddListItem error=", err);
            reject(err);
        }
    });
}

async function DeleteListItem(id: number): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const response = await api.delete(`meal_plan/${id}`);
            if (response.status === 200)
                resolve();
            reject(response.status);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function GetAlertIngredients(): Promise<AlertIngredient[]> {
    return new Promise<AlertIngredient[]>(async (resolve, reject) => {
        try {
            const response = await api.get('meal_plan/alert_ingredients');
            return resolve(response.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function AddAlertIngredient(item: string): Promise<AlertIngredient[]> {
    return new Promise<AlertIngredient[]>(async (resolve, reject) => {
        try {
            const response = await api.post(`meal_plan/alert_ingredients`, {
                item
            });
            resolve(response.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function RemoveAlertIngredient(item: number): Promise<AlertIngredient[]> {
    return new Promise<AlertIngredient[]>(async (resolve, reject) => {
        try {
            const response = await api.delete(`meal_plan/alert_ingredients/${item}`);
            resolve(response.data);
        }
        catch (err) {
            reject(err);
        }
    });
}

export default {
    GetMealPlan,
    AddListItem,
    DeleteListItem,

    GetAlertIngredients,
    AddAlertIngredient,
    RemoveAlertIngredient,
}