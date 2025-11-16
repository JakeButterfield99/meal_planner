import { useRef, useState } from "react";
import { useFood } from "../context/FoodContext";
import { useMealPlan } from "../context/MealPlanContext";

import planService from '../services/plan.service';
import foodService from '../services/food.service';

import { MealType } from "../types/MealPlan";
import { Option } from '../utils/form';
import { GetTypeText } from "../utils/food";
import { GetDateKey, GetShortDate, GetWeekDates } from "../utils/date";

import { Formik, FormikErrors, FormikProps, FormikValues } from 'formik';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Modal from 'react-modal';

import placeholder_img from '../assets/placeholder_img.jpg';
import loading_gif from '../assets/loading.gif';

import DateSelector from "../components/MealPlan/DateSelector";
import AddFoodPlanModal from "./AddFoodPlanModal";
import imageService from "../services/image.service";
import { GetImage } from "../utils/image";

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

interface IProps {
    isOpen: boolean,
    setIsOpen: Function,
}
const FoodEditModal = (props: IProps) => {
    const foodContext = useFood();
    const formRef = useRef<FormikProps<FormikValues>>(null);

    const [activePlanDate, setActivePlanDate] = useState<Date>();
    const [activeDate, setActiveDate] = useState<Date>();
    const [addFoodPlanModal, setAddFoodModal] = useState<boolean>(false);
    const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);

    function CloseModal() {
        foodContext.setActiveFood(undefined);
        props.setIsOpen(false);
        foodContext.RefreshFood();
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

        foodService.EditFood(foodContext.activeFood.id, values.name, image, tags)
            .then(data => {
                console.log("EDIT SUCCESS", data);
                foodContext.setActiveFood(data);
            })
            .catch(err => {
                console.log("GOT EDIT ERR", err);
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

    if (activePlanDate)
        console.log(activePlanDate, GetWeekDates(activePlanDate));

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={CloseModal}
            className="food_edit_modal"
        >
            <AddFoodPlanModal
                isOpen={addFoodPlanModal}
                setIsOpen={setAddFoodModal}
                date={activeDate}
                onSubmit={AddToMealPlan}
            />

            <div className='header'>
                <h2>{foodContext.activeFood?.name}</h2>
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
                        }}
                    >
                        {({ values, errors, handleChange, setFieldValue, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={values.name}
                                    onChange={handleChange}
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

                                <button type="submit">
                                    Edit
                                </button>
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