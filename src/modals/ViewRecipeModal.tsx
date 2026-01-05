import { useState } from 'react';
import Modal from 'react-modal';
import { useRecipe } from '../context/RecipeContext';
import { useFood } from '../context/FoodContext';
import { AlertIngredient, RecipeData } from '../types/MealPlan';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import listService from '../services/list.service';
import { useList } from '../context/ListContext';
import { ParseIngredientName } from '../utils/recipe';
import planService from '../services/plan.service';
import { useMealPlan } from '../context/MealPlanContext';

interface IProps {
    isOpen: boolean
}
const ViewRecipeModal = (props: IProps) => {
    const planContext = useMealPlan();
    const listContext = useList();
    const recipeContext = useRecipe();

    function CloseModal() {
        recipeContext.SetActiveRecipe(null);
    }

    function AddAlert(ingredient: RecipeData) {
        planService.AddAlertIngredient(ingredient.text)
            .then(val => planContext.setAlertIngredients(val))
            .catch(err => console.log("AddAlert err", err));
    }

    function RemoveAlert(alertId: AlertIngredient) {
        planService.RemoveAlertIngredient(alertId.id)
            .then(val => planContext.setAlertIngredients(val))
            .catch(err => console.log("RemoveAlert err", err));
    }

    function AddToShoppingList(ingredient: RecipeData) {
        listService.AddIngredientToList(ingredient.text)
            .then(val => listContext.setListItems(val))
            .catch(err => console.log("AddToShoppingList err", err));
    }

    let stepCount = 0;

    if (recipeContext.recipeContents === null) {
        return (
            <Modal
                isOpen={props.isOpen}
                onRequestClose={CloseModal}
                className="recipe_modal"
                style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0)", } }}
            >
                <div className="header">
                    <h2>{recipeContext.activeRecipe?.name}</h2>
                </div>

                <div className="content">
                    <p>Loading...</p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={CloseModal}
            className="recipe_modal"
            style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0)", } }}
        >
            <div className="header">
                <h2>{recipeContext.activeRecipe?.name}</h2>
            </div>

            {recipeContext.recipeContents === null && (
                <div className="content">
                    <p>Loading...</p>
                </div>
            )}

            {recipeContext.recipeContents !== null && (
                <div className="content">
                    <h3>Ingredients:</h3>

                    {recipeContext.recipeContents?.ingredients.map((ingredient, idx) => {
                        if (ingredient.type == "paragraph") {
                            return (
                                <h4>{ingredient.text}</h4>
                            )
                        }

                        const parseName = ParseIngredientName(ingredient.text);
                        const alertId = planContext.alertIngredients.find(val => val.item === ingredient.text);
                        const inList = listContext.listItems.find(val => val.item.toLowerCase() == parseName.toLowerCase());

                        return (
                            <div key={idx} className="ingredient">
                                <CheckBoxOutlineBlankIcon />
                                <p>{ingredient.text}</p>

                                {alertId !== undefined ?
                                    <div
                                        title='Remove Alert'
                                        className="btn btn-active"
                                        onClick={() => RemoveAlert(alertId)}
                                    >
                                        <NotificationsIcon />
                                    </div>
                                    :
                                    <div
                                        title='Add Alert'
                                        className="btn"
                                        onClick={() => AddAlert(ingredient)}
                                    >
                                        <NotificationsNoneIcon />
                                    </div>
                                }

                                {inList ?
                                    <div
                                        title='In Shopping List'
                                        className="btn btn-active"
                                    >
                                        <ShoppingCartIcon />
                                    </div>
                                    :
                                    <div
                                        title='Add to Shopping List'
                                        className="btn"
                                        onClick={() => AddToShoppingList(ingredient)}
                                    >
                                        <AddShoppingCartIcon />
                                    </div>
                                }
                            </div>
                        );
                    })}

                    <h3>Method:</h3>

                    {recipeContext.recipeContents?.method.map((step, idx) => {
                        stepCount++;
                        return (
                            <div key={idx} className='step'>
                                <p>{stepCount}</p>
                                <p>{step.text}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </Modal>
    )
}

export default ViewRecipeModal;