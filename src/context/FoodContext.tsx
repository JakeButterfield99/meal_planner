import React, { ReactNode, useContext, useEffect, useState } from "react";
import { Food, MealType } from "../types/MealPlan";
import foodService from "../services/food.service";
import FoodViewModal from "../modals/FoodViewModal";
import FoodEditModal from "../modals/FoodEditModal";

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
    const [activeRecipe, setActiveRecipe] = useState<Food>();

    const [viewFoodModal, setViewFoodModal] = useState<boolean>(false);
    const [editFoodModal, setEditFoodModal] = useState<boolean>(false);

    function RefreshFood() {
        foodService.GetFood()
            .then((value) => {
                setFood(value);
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        if (!activeFood) return;
        setViewFoodModal(true);
    }, [activeFood]);

    return (
        <FoodContext.Provider value={{
            food, setFood,
            activeFood, setActiveFood,
            activeType, setActiveType,
            RefreshFood
        }}>
            <FoodEditModal
                isOpen={editFoodModal}
                setIsOpen={setEditFoodModal}
                setViewMode={setViewFoodModal}
            />

            <FoodViewModal
                isOpen={viewFoodModal}
                setIsOpen={setViewFoodModal}
                setEditMode={setEditFoodModal}
            />

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