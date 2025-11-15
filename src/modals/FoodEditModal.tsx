import { useRef, useState } from "react";
import { useFood } from "../context/FoodContext";
import { useMealPlan } from "../context/MealPlanContext";

import planService from '../services/plan.service';
import foodService from '../services/food.service';

import { Option } from '../utils/form';
import { GetTypeText } from "../utils/food";

import { Formik, FormikErrors, FormikProps, FormikValues } from 'formik';
import { toast } from 'react-toastify';
import Select from 'react-select';

import Modal from 'react-modal';

import placeholder_img from '../assets/placeholder_img.jpg';
import { MealType } from "../types/MealPlan";
import DateSelector from "../components/MealPlan/DateSelector";
import { GetDateText, GetWeekDates } from "../utils/date";

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
    const mealContext = useMealPlan();
    const foodContext = useFood();
    const formRef = useRef<FormikProps<FormikValues>>(null);

    const [activePlanDate, setActivePlanDate] = useState<Date>();

    function CloseModal() {
        foodContext.setActiveFood(undefined);
        props.setIsOpen(false);
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

    const image = foodContext.activeFood?.image || placeholder_img;

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
            <div className='header'>
                <h2>{foodContext.activeFood?.name}</h2>
            </div>

            <div className="content">
                <div className="details">
                    <img src={image} />

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

                <div className="plan_section">
                    <h2>Add to Meal Plan</h2>

                    <div className="add_to_plan">
                        <DateSelector
                            SetActiveDate={(date: Date) => setActivePlanDate(date)}
                        />

                        <div className="dates">
                            {dates.map((value, index) => {
                                return (
                                    <div key={index} className="date_entry">
                                        <p>
                                            {value.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default FoodEditModal;