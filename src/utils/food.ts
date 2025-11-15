import { MealType } from '../types/MealPlan';

const TYPE_TEXT = {
    [MealType.BREAKFAST]: "Breakfast",
    [MealType.LUNCH]: "Lunch",
    [MealType.DINNER]: "Dinner",
    [MealType.SNACK]: "Snack",
}

export function GetTypeText(type: MealType) {
    return TYPE_TEXT[type];
}