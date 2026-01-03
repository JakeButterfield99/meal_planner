import { useState } from "react";
import { useFood } from "../context/FoodContext";
import { useRecipe } from "../context/RecipeContext";

import planService from '../services/plan.service';

import { GetTypeText } from "../utils/food";
import { GetDateKey, GetShortDate, GetWeekDates } from "../utils/date";
import { GetImage } from "../utils/image";

import { toast } from 'react-toastify';
import Modal from 'react-modal';

import placeholder_img from '../assets/placeholder_img.jpg';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EditIcon from '@mui/icons-material/Edit';

import DateSelector from "../components/MealPlan/DateSelector";
import AddFoodPlanModal from "./AddFoodPlanModal";
import { Recipe } from "../types/MealPlan";


interface IProps {
    isOpen: boolean,
    setIsOpen: Function,
    setEditMode: Function,
}
const FoodViewModal = (props: IProps) => {
    const foodContext = useFood();
    const recipeContext = useRecipe();

    const [activePlanDate, setActivePlanDate] = useState<Date>();
    const [activeDate, setActiveDate] = useState<Date>();
    const [addFoodPlanModal, setAddFoodModal] = useState<boolean>(false);

    function CloseModal() {
        foodContext.setActiveFood(undefined);
        props.setIsOpen(false);
    }

    function OpenEditMode() {
        props.setEditMode(true);
        props.setIsOpen(false);
    }

    function OpenAddFoodPlan(date: Date) {
        setActiveDate(date);
        setAddFoodModal(true);
    }

    function OpenRecipe(recipe: Recipe) {
        recipeContext.SetActiveRecipe(recipe);
    }

    async function AddToMealPlan(type: number, assigned: string) {
        if (!foodContext.activeFood) return;
        if (!activePlanDate) return;
        if (!activeDate) return;

        const plan = await planService.GetMealPlan(activePlanDate);

        planService.AddListItem(
            plan.id,
            GetDateKey(activeDate),
            foodContext.activeFood.id,
            type,
            assigned
        ).then(value => {
            toast(`${value.food.name} assigned to ${value.date} (${GetTypeText(value.type)})`);
        }).catch(err => {
            console.log("FOOD ADD ERR", err);
        })

        setAddFoodModal(false);
        CloseModal();
    }

    let image = placeholder_img;
    if (foodContext.activeFood?.image)
        image = GetImage(foodContext.activeFood?.image);

    // Sync the displayed dates to active monday
    let dates: Date[] = [];
    if (activePlanDate)
        dates = GetWeekDates(activePlanDate);

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={CloseModal}
            className="food_modal food_view_modal"
        >
            <AddFoodPlanModal
                isOpen={addFoodPlanModal}
                setIsOpen={setAddFoodModal}
                date={activeDate}
                onSubmit={AddToMealPlan}
            />

            <div className='header'>
                <div className="left"></div>
                <h2>{foodContext.activeFood?.name}</h2>
                <div className="right" onClick={OpenEditMode}>
                    <EditIcon />
                </div>
            </div>

            <div className="content">
                <div className="details">
                    <div className="image_container">
                        <img src={image} />
                    </div>

                    <div className="info_container">
                        <label>Tags</label>
                        <div className="tags">
                            {foodContext.activeFood?.tags?.sort(
                                (a, b) => a - b
                            ).map((val) => {
                                return (
                                    <div key={val} className="tag">
                                        <p>{GetTypeText(val)}</p>
                                    </div>
                                )
                            })}

                            {(!foodContext.activeFood?.tags || foodContext.activeFood?.tags?.length === 0) && (
                                <p>No tags assigned</p>
                            )}
                        </div>

                        <div className="recipes">
                            <label>Recipes</label>
                            {foodContext.activeFood?.recipes?.map((val, idx) => {
                                return (
                                    <div
                                        key={idx}
                                        className="recipe"
                                        onClick={() => OpenRecipe(val)}
                                    >
                                        <RestaurantIcon />
                                        <p>{recipeContext.recipes.find(r => r.id === val.id)?.name}</p>
                                        <OpenInNewIcon className="link" />
                                    </div>
                                )
                            })}

                            {(!foodContext.activeFood?.recipes || foodContext.activeFood?.recipes?.length === 0) && (
                                <p>No recipes assigned</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="plan_section">
                <h2>Add to Meal Plan</h2>

                <div className="add_to_plan">
                    <DateSelector
                        SetActiveDate={(date: Date) => setActivePlanDate(date)}
                    />

                    <div className="dates">
                        {dates.map((value, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => OpenAddFoodPlan(value)}
                                    className="date_entry"
                                >
                                    <p>{value.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                    <p className="short_date">{GetShortDate(value)}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default FoodViewModal;