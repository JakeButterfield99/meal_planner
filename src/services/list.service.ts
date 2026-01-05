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

async function CheckListEntry(
    id: number,
    checked: boolean
): Promise<ShoppingList> {
    return new Promise<ShoppingList>(async (resolve, reject) => {
        try {
            const response = await api.patch("shopping_list", {
                id,
                checked,
            })
            return resolve(response.data);
        }
        catch (err) {
            console.log("CheckListEntry error=", err);
            reject(err);
        }
    });
}

async function RemoveListEntry(
    id: number
): Promise<ShoppingList> {
    return new Promise<ShoppingList>(async (resolve, reject) => {
        try {
            const response = await api.patch("shopping_list", {
                id,
                remove: true,
            })
            return resolve(response.data);
        }
        catch (err) {
            console.log("RemoveListEntry error=", err);
            reject(err);
        }
    });
}

async function IgnoreListEntry(
    id: number
): Promise<ShoppingList> {
    return new Promise<ShoppingList>(async (resolve, reject) => {
        try {
            const response = await api.patch("shopping_list", {
                id,
                ignore: true,
            })
            return resolve(response.data);
        }
        catch (err) {
            console.log("IgnoreListEntry error=", err);
            reject(err);
        }
    });
}

async function GenerateList(): Promise<ShoppingList> {
    return new Promise<ShoppingList>(async (resolve, reject) => {
        try {
            const response = await api.post("shopping_list/generate")
            return resolve(response.data);
        }
        catch (err) {
            console.log("GenerateList error=", err);
            reject(err);
        }
    });
}

async function ClearList(): Promise<ShoppingList> {
    return new Promise<ShoppingList>(async (resolve, reject) => {
        try {
            const response = await api.delete("shopping_list");
            return resolve(response.data);
        }
        catch (err) {
            console.log("ClearList error=", err);
            reject(err);
        }
    });
}

async function AddToAnyList(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const response = await api.post("shopping_list/anylist");
            return resolve(response.data);
        }
        catch (err) {
            console.log("ClearList error=", err);
            reject(err);
        }
    });
}

async function AddIngredientToList(
    item: string,
): Promise<ShoppingList> {
    return new Promise<ShoppingList>(async (resolve, reject) => {
        try {
            const response = await api.post("shopping_list/add", { item });
            return resolve(response.data);
        }
        catch (err) {
            console.log("AddIngredientToList error=", err);
            reject(err);
        }
    });
}

export default {
    GetShoppingList,
    CheckListEntry,
    RemoveListEntry,
    IgnoreListEntry,
    GenerateList,
    ClearList,
    AddToAnyList,
    AddIngredientToList,
}