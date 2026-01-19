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
export const MealTypeOrder = Object.values(MealType);

export enum AddPlanItemType {
    ITEM,
    NOTE
}

export interface PlanItem {
    id: number,
    date: string,
    food?: Food,
    assigned?: string,
    type?: MealType,
    notes?: string
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