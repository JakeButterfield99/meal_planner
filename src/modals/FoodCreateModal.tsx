import Modal from 'react-modal';
import { Formik, FormikErrors, FormikProps, FormikValues } from 'formik';
import { useEffect, useRef } from 'react';
import foodService from '../services/food.service';
import { Food } from '../types/MealPlan';
import { toast } from 'react-toastify';
import { useFood } from '../context/FoodContext';

interface IProps {
    isOpen: boolean,
    setIsOpen: Function,
}
const FoodCreateModal = (props: IProps) => {
    const foodContext = useFood();
    const formRef = useRef<FormikProps<FormikValues>>(null);

    function CloseModal() {
        props.setIsOpen(false);
    }

    function ValidateForm(values: FormikValues): FormikErrors<any> {
        const errors: FormikErrors<any> = {};
        if (!values.name || values.name == "")
            errors.name = "Please enter a food name";
        return errors;
    }

    function OnSubmit(values: FormikValues) {
        foodService.CreateFood(values.name).then((value: Food) => {
            props.setIsOpen(false);
            toast(`Created food item: ${value.name}`);
            foodContext.setActiveFood(value);
        }).catch((err) => {
            console.log(err);
            toast("Couldn't create food item: ", err);
        })
    }

    function SubmitForm() {
        if (!formRef.current) return;
        formRef.current.handleSubmit();
    }

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={CloseModal}
            className="food_create_modal"
        >
            <div className="header">
                <h2>Create Food Item</h2>
            </div>

            <div className="content">
                <Formik
                    innerRef={formRef}
                    validate={ValidateForm}
                    onSubmit={values => OnSubmit(values)}
                    initialValues={{
                        name: "",
                    }}
                >
                    {({ values, errors, handleChange }) => (
                        <form>
                            <label>Food Name:</label>
                            <input
                                type='text'
                                name='name'
                                value={values.name}
                                onChange={handleChange}
                                autoFocus
                            />
                        </form>
                    )}
                </Formik>

            </div>

            <div className="buttons">
                <button onClick={CloseModal}>
                    Cancel
                </button>
                <button className='alt_button' onClick={SubmitForm} type='submit'>
                    Create
                </button>
            </div>
        </Modal>
    )
}

export default FoodCreateModal;