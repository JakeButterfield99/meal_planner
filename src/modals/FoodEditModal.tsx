import { useMemo, useRef, useState } from "react";
import { useFood } from "../context/FoodContext";
import { useModal } from "../context/ModalContext";
import { useRecipe } from "../context/RecipeContext";

import planService from '../services/plan.service';
import foodService from '../services/food.service';
import imageService from "../services/image.service";

import { MealType, Recipe } from "../types/MealPlan";
import { Option } from '../utils/form';
import { GetTypeText } from "../utils/food";
import { GetDateKey, GetShortDate, GetWeekDates } from "../utils/date";
import { GetImage } from "../utils/image";

import { Formik, FormikErrors, FormikProps, FormikValues } from 'formik';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Modal from 'react-modal';

import placeholder_img from '../assets/placeholder_img.jpg';
import loading_gif from '../assets/loading.gif';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';

import DateSelector from "../components/MealPlan/DateSelector";
import AddFoodPlanModal from "./AddFoodPlanModal";

const OPTION_LOOKUP: { [type: number]: Option } = {
    [MealType.BREAKFAST]: { value: MealType.BREAKFAST, label: GetTypeText(MealType.BREAKFAST) },
    [MealType.LUNCH]: { value: MealType.LUNCH, label: GetTypeText(MealType.LUNCH) },
    [MealType.DINNER]: { value: MealType.DINNER, label: GetTypeText(MealType.DINNER) },
    [MealType.SNACK]: { value: MealType.SNACK, label: GetTypeText(MealType.SNACK) },
}

const TAG_OPTIONS = [
    OPTION_LOOKUP[MealType.BREAKFAST],
    OPTION_LOOKUP[MealType.LUNCH],
    OPTION_LOOKUP[MealType.DINNER],
    OPTION_LOOKUP[MealType.SNACK],
]

function GetOptionsFromTags(tags: MealType[] | undefined): Option[] {
    if (!tags) return [];
    const options: Option[] = [];

    tags.forEach((value) => {
        options.push(OPTION_LOOKUP[value]);
    });

    return options;
}

function GetOptionsFromRecipes(recipes: Recipe[] | undefined): Option[] {
    if (!recipes) return [];
    const options: Option[] = [];

    recipes.forEach((value) => {
        options.push({ value: value.id, label: value.name });
    });

    return options;
}

interface IProps {
    isOpen: boolean,
    setIsOpen: Function,
    setViewMode: Function,
}
const FoodEditModal = (props: IProps) => {
    const foodContext = useFood();
    const modalContext = useModal();
    const recipeContext = useRecipe();
    const formRef = useRef<FormikProps<FormikValues>>(null);

    const [activePlanDate, setActivePlanDate] = useState<Date>();
    const [activeDate, setActiveDate] = useState<Date>();
    const [addFoodPlanModal, setAddFoodModal] = useState<boolean>(false);
    const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);

    const recipeOptions = useMemo(() => {
        return recipeContext.recipes.map((recipe) => ({
            value: recipe.id,
            label: recipe.name,
        }));
    }, [recipeContext.recipes]);

    function CloseModal() {
        foodContext.RefreshFood();
        props.setIsOpen(false);
        props.setViewMode(true);
    }

    function ValidateForm(values: FormikValues): FormikErrors<any> {
        const errors: FormikErrors<any> = {};
        if (!values.name || values.name == "")
            errors.name = "Please enter a food name";
        return errors;
    }

    function OnSubmit(values: FormikValues) {
        if (!foodContext.activeFood) return;

        const image = undefined;

        const tags: MealType[] = [];
        values.tags.forEach((tag: Option) => {
            if (typeof tag.value != "number") return;
            tags.push(tag.value);
        });

        const recipes: Recipe[] = [];
        values.recipes.forEach((recipe: Option) => {
            const found = recipeContext.recipes.find(r => r.id === recipe.value);
            if (found) recipes.push(found);
        });

        foodService.EditFood(foodContext.activeFood.id, values.name, image, tags, recipes)
            .then(data => {
                console.log("EDIT SUCCESS", data);
                toast(`Edit successful for: ${foodContext.activeFood?.name}`);
                foodContext.setActiveFood(data);
                CloseModal();
            })
            .catch(err => {
                console.log("GOT EDIT ERR", err);
                toast(`Edit error:`, err);
            })
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

    async function GenerateImage() {
        if (!foodContext.activeFood) return;
        setIsLoadingImage(true);

        toast(`Generating image for ${foodContext.activeFood.name}`);

        imageService.GenerateImage(foodContext.activeFood.id)
            .then((url: string) => {
                if (!foodContext.activeFood) return;
                foodContext.setActiveFood({
                    ...foodContext.activeFood,
                    image: url,
                });

                toast(`Successfully generated image`);
            })
            .catch(err => {
                console.log("GENERATE IMAGE ERROR", err);
                toast(`Image Generation error: `, err);
            }).finally(() => {
                setIsLoadingImage(false);
            });
    }

    async function ConfirmDeleteFood() {
        if (!foodContext.activeFood) return;
        foodService.DeleteFood(foodContext.activeFood?.id)
            .then(() => {
                toast(`Deleted Food Item: ${foodContext.activeFood?.name}`);
                CloseModal();
            })
            .catch(err => console.log("DELETE ERR", err));
    }

    async function DeleteFood() {
        modalContext.show({
            title: "Are you sure?",
            text: `Do you want to delete: ${foodContext.activeFood?.name}`,
            confirm_cb: () => ConfirmDeleteFood(),
            cancel_cb: () => { },
        });
    }

    function OpenAddFoodPlan(date: Date) {
        setActiveDate(date);
        setAddFoodModal(true);
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
            className="food_modal food_edit_modal"
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
                <div className="right" onClick={CloseModal}>
                    <CloseIcon />
                </div>
            </div>

            <div className="content">
                <div className="details">
                    <div
                        className="image_container"
                        style={{ display: isLoadingImage ? 'none' : 'block' }}
                    >
                        <img src={image} />
                        <div className="after">
                            <button
                                className="alt_button"
                                onClick={GenerateImage}
                            >
                                Generate Image
                            </button>
                        </div>
                    </div>

                    <div
                        className="loading_container"
                        style={{ display: isLoadingImage ? 'flex' : 'none' }}
                    >
                        <img src={loading_gif} />
                    </div>

                    <Formik
                        innerRef={formRef}
                        validate={ValidateForm}
                        onSubmit={values => OnSubmit(values)}
                        initialValues={{
                            name: foodContext.activeFood?.name,
                            tags: GetOptionsFromTags(foodContext.activeFood?.tags),
                            recipes: GetOptionsFromRecipes(foodContext.activeFood?.recipes),
                        }}
                    >
                        {({ values, errors, handleChange, setFieldValue, handleSubmit, dirty }) => (
                            <form onSubmit={handleSubmit}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Steak Pie"
                                />

                                <label>Tags</label>
                                <Select
                                    name='tags'
                                    isMulti={true}
                                    value={values.tags}
                                    onChange={(option) => setFieldValue('tags', option)}
                                    isSearchable={true}
                                    options={TAG_OPTIONS}
                                />

                                <label>Recipes</label>
                                <Select
                                    name='recipes'
                                    isMulti={true}
                                    value={values.recipes}
                                    onChange={(option) => setFieldValue('recipes', option)}
                                    isSearchable={true}
                                    options={recipeOptions}
                                />

                                <div className="edit_buttons">
                                    <button type="submit" className={`${dirty ? '' : 'disabled'} alt_button`}>
                                        Edit
                                    </button>
                                    <button type="button" className="delete" onClick={DeleteFood}>
                                        <DeleteOutlineIcon />
                                    </button>
                                </div>
                            </form>
                        )}

                    </Formik>
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

export default FoodEditModal;