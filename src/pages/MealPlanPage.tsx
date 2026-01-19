import { useState } from "react";
import MealPlan from "../components/MealPlan/MealPlan";
import ShoppingList from "../components/ShoppingList/ShoppingList";

import '../styles/meal_plan.css';
import '../styles/shopping_list.css';

import AddPlanItemModal from "../modals/AddPlanItemModal";
import AddNoteModal from "../modals/AddNoteModal";
import { AddPlanItemType, PlanItem } from "../types/MealPlan";

const MealPlanPage = () => {
    const [shoppingListOpen, setShoppingListOpen] = useState<boolean>(false);

    const [addPlanItemDate, setAddPlanItemDate] = useState<Date>();
    const [addPlanNoteDate, setAddPlanNoteDate] = useState<Date>();
    const [existingPlanItem, setExistingPlanItem] = useState<PlanItem>();

    function RequestAddPlanItem(
        date: Date,
        type: AddPlanItemType,
        existing_note?: PlanItem
    ) {
        if (type === AddPlanItemType.ITEM)
            return setAddPlanItemDate(date);

        if (type === AddPlanItemType.NOTE) {
            setExistingPlanItem(existing_note);
            return setAddPlanNoteDate(date);
        }
    }

    return (
        <section id="meal_plan_page">
            <AddPlanItemModal
                isOpen={addPlanItemDate !== undefined}
                setIsOpen={() => setAddPlanItemDate(undefined)}
                date={addPlanItemDate}
            />
            <AddNoteModal
                isOpen={addPlanNoteDate !== undefined}
                setIsOpen={() => setAddPlanNoteDate(undefined)}
                date={addPlanNoteDate}
                existingItem={existingPlanItem}
            />

            <MealPlan
                shoppingListOpen={shoppingListOpen}
                setShoppingListOpen={setShoppingListOpen}
                RequestAddPlanItem={RequestAddPlanItem}
            />
            <ShoppingList
                open={shoppingListOpen}
                setOpen={setShoppingListOpen}
            />
        </section>
    )
}

export default MealPlanPage;