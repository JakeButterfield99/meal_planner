import React, { ReactNode, useContext, useState } from "react";
import { Food, MealType } from "../types/MealPlan";
import foodService from "../services/food.service";

export interface IFoodContext {
    food: Food[],
    setFood: Function,

    activeFood?: Food,
    setActiveFood: Function,

    activeType?: MealType,
    setActiveType: Function,

    RefreshFood: Function,
}

const FoodContext = React.createContext<IFoodContext | undefined>(undefined);

export const FoodProvider = ({ children }: { children: ReactNode }) => {
    const [food, setFood] = useState<Food[]>([]);
    const [activeFood, setActiveFood] = useState<Food>();
    const [activeType, setActiveType] = useState<MealType>();

    function RefreshFood() {
        foodService.GetFood()
            .then((value) => {
                console.log("SET FOOD", value);
                setFood(value);
            })
            .catch((err) => console.log(err));
    }

    return (
        <FoodContext.Provider value={{
            food, setFood,
            activeFood, setActiveFood,
            activeType, setActiveType,
            RefreshFood
        }}>
            {children}
        </FoodContext.Provider>
    )
}

export const useFood = (): IFoodContext => {
    const context = useContext(FoodContext);
    if (!context) {
        throw new Error('useFood must be used within a FoodProvider');
    }
    return context;
};