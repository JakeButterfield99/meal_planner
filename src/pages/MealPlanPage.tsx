import { useEffect, useState } from "react";
import MealPlan from "../components/MealPlan/MealPlan";
import ShoppingList from "../components/ShoppingList";

import '../styles/meal_plan.css';
import AddPlanItemModal from "../modals/AddPlanItemModal";
import { useMealPlan } from "../context/MealPlanContext";

const MealPlanPage = () => {
    const context = useMealPlan();

    const [addPlanItemModal, setAddPlanItemModal] = useState<boolean>(false);
    const [shoppingListOpen, setShoppingListOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!context.activePlanDate) return;
        setAddPlanItemModal(true);
    }, [context.activePlanDate]);

    return (
        <section id="meal_plan_page">
            <AddPlanItemModal
                isOpen={addPlanItemModal}
                setIsOpen={setAddPlanItemModal}
            />

            <MealPlan
                shoppingListOpen={shoppingListOpen}
                setShoppingListOpen={setShoppingListOpen}
            />
            <ShoppingList
                open={shoppingListOpen}
                setOpen={setShoppingListOpen}
            />
        </section>
    )
}

export default MealPlanPage;