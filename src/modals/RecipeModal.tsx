import { useState } from 'react';
import Modal from 'react-modal';

import { IngredientCategory } from '../utils/recipe';

import { useFood } from '../context/FoodContext';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

const TEST_INGREDIENTS: IngredientCategory[] = [
    {
        category: "CHICKEN STOCK",
        ingredients: [
            "2 cups chicken stock / broth",
            "1 cup water",
            "3 chicken drumsticks"
        ]
    },
    {
        category: "LAKSA BROTH",
        ingredients: [
            "1 1/2 tbsp oil",
            "2 garlic cloves , minced",
            "2 cm / 4/5″ piece of ginger , finely grated",
            "1 lemongrass , white part grated",
            "2 birds eye chillis , finely chopped",
            "1/2 cup laksa paste",
            "400ml can coconut milk",
            "2 tsp fish sauce"
        ]
    }
]

interface IProps {
    isOpen: boolean
}
const RecipeModal = (props: IProps) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [ingredients, setIngredients] = useState<IngredientCategory[]>(TEST_INGREDIENTS);
    const [addIngredient, setAddIngredient] = useState<boolean>(false);

    const foodContext = useFood();

    function CloseModal() {
        foodContext.setActiveRecipe(undefined);
    }

    function ToggleEditMode() {
        setEditMode(!editMode);
    }

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={CloseModal}
            className="recipe_modal"
        >
            <div className="header">
                <div className="left"></div>
                <h2>{foodContext.activeRecipe?.name}</h2>
                <div
                    className="right"
                    onClick={ToggleEditMode}
                >
                    {editMode ? <CheckIcon /> : <EditIcon />}
                </div>
            </div>

            <div className="content">
                <h2>Ingredients</h2>

                {ingredients.map((value, index) => {
                    return (
                        <div
                            key={index}
                            className="ingredients_list"
                        >
                            <h3>{value.category}</h3>

                            {value.ingredients.map((ingredient, ing_idx) => {
                                return (
                                    <div key={ing_idx} className='ingredient'>
                                        <CheckBoxOutlineBlankIcon />
                                        {ingredient}
                                    </div>
                                )
                            })}

                            {editMode &&
                                <button className="small">
                                    <AddIcon />
                                    <p>Add</p>
                                </button>
                            }
                        </div>

                    )
                })}

                <h2>Method</h2>
            </div>
        </Modal>
    )
}

export default RecipeModal;