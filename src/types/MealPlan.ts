export type Recipe = {
    id: string,
    name: string,
}

export type RecipeData = {
    text: string,
    type: string,
}

export type RecipeContents = {
    ingredients: RecipeData[],
    method: RecipeData[],
}

export interface Food {
    id: number,
    image?: string,
    name: string,
    recipes: Recipe[],
    tags?: MealType[],
}

export enum MealType {
    BREAKFAST,
    LUNCH,
    DINNER,
    SNACK
}

export interface PlanItem {
    id: number,
    date: string,
    food: Food,
    assigned: string,
    type: MealType,
}

export interface MealPlan {
    id: number,
    monday: string, // YYYY-MM-DD
    items: PlanItem[],
}

export interface AlertIngredient {
    id: number,
    item: string,
}