import { ShoppingList } from "../types/ShoppingList";
import api from "./axios";

async function GetShoppingList(): Promise<ShoppingList> {
    return new Promise<ShoppingList>(async (resolve, reject) => {
        try {
            const response = await api.get("shopping_list")
            return resolve(response.data);
        }
        catch (err) {
            console.log("GetShoppingList error=", err);
            reject(err);
        }
    });
}

async function GenerateList(planId: number): Promise<ShoppingList> {
    return new Promise<ShoppingList>(async (resolve, reject) => {
        try {
            const response = await api.post("shopping_list", { planId })
            return resolve(response.data);
        }
        catch (err) {
            console.log("GenerateList error=", err);
            reject(err);
        }
    });
}

export default {
    GetShoppingList,
    GenerateList
}