import React, { ReactNode, useContext, useState } from "react";
import { Food } from "../types/MealPlan";
import foodService from "../services/food.service";

export interface IFoodContext {
    food: Food[],
    setFood: Function,

    activeFood?: Food,
    setActiveFood: Function,

    RefreshFood: Function,
}

const FoodContext = React.createContext<IFoodContext | undefined>(undefined);

export const FoodProvider = ({ children }: { children: ReactNode }) => {
    const [food, setFood] = useState<Food[]>([]);
    const [activeFood, setActiveFood] = useState<Food>();

    function RefreshFood() {
        foodService.GetFood()
            .then((value) => {
                setFood(value);
            })
            .catch((err) => console.log(err));
    }

    return (
        <FoodContext.Provider value={{
            food, setFood,
            activeFood, setActiveFood,
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