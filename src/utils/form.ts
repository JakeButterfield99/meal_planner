import { MealType } from '../types/MealPlan';
import { GetTypeText } from './food';

export interface Option {
    readonly label: string;
    readonly value: string | number;
}

export const ASSIGNED_OPTIONS: Option[] = [
    { value: 'shared', label: "Shared" },
    { value: 'jake', label: "Jake" },
    { value: 'elser', label: "Elser" },
];

export const TYPE_OPTIONS: Option[] = [
    { value: MealType.BREAKFAST, label: GetTypeText(MealType.BREAKFAST) },
    { value: MealType.LUNCH, label: GetTypeText(MealType.LUNCH) },
    { value: MealType.DINNER, label: GetTypeText(MealType.DINNER) },
    { value: MealType.SNACK, label: GetTypeText(MealType.SNACK) },
];