import { useEffect, useRef } from 'react';

import planService from '../services/plan.service';
import foodService from '../services/food.service';
import { Food, MealType } from '../types/MealPlan';
import { useMealPlan } from '../context/MealPlanContext';
import { useFood } from '../context/FoodContext';

import { GetTypeText } from '../utils/food';
import { GetDateKey, GetDateText } from '../utils/date';
import { ASSIGNED_OPTIONS, Option, TYPE_OPTIONS } from '../utils/form';

import { Formik, FormikErrors, FormikProps, FormikValues } from 'formik';
import { toast } from 'react-toastify';

import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Modal from 'react-modal';

function MapFoodOptions(food: Food[]): Option[] {
    const options: Option[] = food.map(food => ({
        value: food.id,
        label: food.name,
    }));
    return options
};

interface IProps {
    isOpen: boolean,
    setIsOpen: Function,
}
const AddPlanItemModal = (props: IProps) => {
    const mealContext = useMealPlan();
    const foodContext = useFood();
    const formRef = useRef<FormikProps<FormikValues>>(null);

    // Refresh food list when modal opens
    useEffect(() => {
        if (!props.isOpen) return;
        foodContext.RefreshFood();
    }, [props.isOpen]);

    // The form has been submitted
    function OnSubmit(values: FormikValues) {
        if (!mealContext.mealPlan?.id || !mealContext.activePlanDate)
            return;

        planService.AddListItem(
            mealContext.mealPlan.id,
            GetDateKey(mealContext.activePlanDate),
            values.food.value,
            values.type.value,
            values.assigned.value
        ).then(() => {
            toast(`Item added to list`);
            mealContext.RefreshMealPlan();
        })

        CloseModal();
    }

    function CloseModal() {
        mealContext.setActivePlanDate(undefined);
        props.setIsOpen(false);
    }

    function SubmitForm() {
        if (!formRef.current) return;
        formRef.current.handleSubmit();
    }

    function ValidateForm(values: FormikValues): FormikErrors<any> {
        const errors: FormikErrors<any> = {};
        if (!values.food)
            errors.food = "Please select a food item";
        if (!values.type)
            errors.type = "Please select a meal type";
        if (!values.assigned)
            errors.assigned = "Please select an assignee";
        return errors;
    }

    async function CreateFoodOption(input: string): Promise<Option> {
        return new Promise<Option>(async (resolve, reject) => {
            foodService.CreateFood(input)
                .then(val => {
                    toast(`Created Item: ${input}`);
                    resolve({ value: val.id, label: val.name });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    let date_str = mealContext.activePlanDate ? GetDateText(mealContext.activePlanDate) : "";

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={CloseModal}
            className="plan_item_modal"
        >
            <div className='header'>
                <h2>Add Plan Item</h2>
                <h3>{date_str}</h3>
            </div>

            <Formik
                innerRef={formRef}
                validate={ValidateForm}
                onSubmit={values => OnSubmit(values)}
                initialValues={{
                    food: null,
                    type: null,
                    assigned: null
                }}
            >
                {({ values, errors, setFieldValue }) => (
                    <form>
                        <div className="field">
                            <label>Food</label>
                            <CreatableSelect
                                name='food'
                                value={values.food}
                                onChange={(option) => setFieldValue('food', option)}
                                onCreateOption={async (input: string) => {
                                    const option = await CreateFoodOption(input);
                                    if (!option) return;
                                    setFieldValue('food', option);
                                }}
                                isSearchable={true}
                                options={MapFoodOptions(foodContext.food)}
                            />
                            {errors.food &&
                                <p className='error'>{`${errors.food}`}</p>
                            }
                        </div>

                        <div className="field">
                            <label>Type</label>
                            <Select
                                name='type'
                                value={values.type}
                                onChange={(option) => setFieldValue('type', option)}
                                isSearchable={true}
                                options={TYPE_OPTIONS}
                            />
                            {errors.type &&
                                <p className='error'>{`${errors.type}`}</p>
                            }
                        </div>

                        <div className="field">
                            <label>Assigned To</label>
                            <Select
                                name='assigned'
                                value={values.assigned}
                                onChange={(option) => setFieldValue('assigned', option)}
                                isSearchable={true}
                                options={ASSIGNED_OPTIONS}
                            />
                            {errors.assigned &&
                                <p className='error'>{`${errors.assigned}`}</p>
                            }
                        </div>
                    </form>
                )}
            </Formik>

            <div className="buttons">
                <button className='alt_button' onClick={CloseModal}>
                    CLOSE
                </button>
                <button onClick={SubmitForm} type='submit'>
                    ADD
                </button>
            </div>

        </Modal>
    )
}

export default AddPlanItemModal;