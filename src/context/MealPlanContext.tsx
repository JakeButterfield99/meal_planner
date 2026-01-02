import React, { ReactNode, useContext, useEffect, useState } from "react";
import { MealPlan, PlanItem } from "../types/MealPlan";
import planService from "../services/plan.service";

export interface IMealPlanContext {
    activeMonday?: Date,
    setActiveMonday: Function,
    mealPlan?: MealPlan,
    setMealPlan: Function,
    activePlanDate?: Date,
    setActivePlanDate: Function,
    activePlanItem?: PlanItem,
    setActivePlanItem: Function,
    RefreshMealPlan: Function,
}

const MealPlanContext = React.createContext<IMealPlanContext | undefined>(undefined);

export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
    const [activeMonday, setActiveMonday] = useState<Date>();
    const [mealPlan, setMealPlan] = useState<MealPlan>();
    const [activePlanDate, setActivePlanDate] = useState<Date>();
    const [activePlanItem, setActivePlanItem] = useState<PlanItem>();

    function RefreshMealPlan() {
        if (!activeMonday) return;

        planService.GetMealPlan(activeMonday)
            .then((value) => {
                setMealPlan(value);
            })
            .catch((err) => {
                console.log("RefreshMealPlan Error=", err);
                setMealPlan(undefined);
            })
    }

    useEffect(() => {
        RefreshMealPlan();
    }, [activeMonday])

    return (
        <MealPlanContext.Provider value={{
            activeMonday, setActiveMonday,
            mealPlan, setMealPlan,
            activePlanDate, setActivePlanDate,
            activePlanItem, setActivePlanItem,
            RefreshMealPlan,
        }}>
            {children}
        </MealPlanContext.Provider>
    )
}

export const useMealPlan = (): IMealPlanContext => {
    const context = useContext(MealPlanContext);
    if (!context)
        throw new Error('useMealPlan must be used within a MealPlanProvider');

    return context;
};