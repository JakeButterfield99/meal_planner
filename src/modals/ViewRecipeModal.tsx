import { useState } from 'react';
import Modal from 'react-modal';
import { useRecipe } from '../context/RecipeContext';
import { useFood } from '../context/FoodContext';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface IProps {
    isOpen: boolean
}
const ViewRecipeModal = (props: IProps) => {
    const foodContext = useFood();
    const recipeContext = useRecipe();

    function CloseModal() {
        recipeContext.SetActiveRecipe(null);
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
                        return (
                            <div key={idx} className='ingredient'>
                                <CheckBoxOutlineBlankIcon />
                                {ingredient.text}
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