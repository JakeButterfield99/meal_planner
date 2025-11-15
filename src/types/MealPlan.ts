export interface Recipe {
    id: number,
    ingredients: JSON,
    method: JSON,
    oven_temp?: number,
}

export interface Food {
    id: number,
    image?: string,
    name: string,
    recipe_id?: number,
    tags: MealType[],
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