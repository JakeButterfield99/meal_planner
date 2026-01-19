import { useRef } from 'react';

import planService from '../services/plan.service';
import { useMealPlan } from '../context/MealPlanContext';

import { GetDateKey, GetDateText } from '../utils/date';
import { PlanItem } from '../types/MealPlan';

import { Formik, FormikErrors, FormikProps, FormikValues } from 'formik';
import { toast } from 'react-toastify';

import Modal from 'react-modal';

interface IProps {
    isOpen: boolean,
    setIsOpen: Function,
    date?: Date,
    existingItem?: PlanItem,
}
const AddNoteModal = (props: IProps) => {
    const mealContext = useMealPlan();
    const formRef = useRef<FormikProps<FormikValues>>(null);

    const is_edit = (props.existingItem !== undefined || props.existingItem !== null);

    function RequestAddNote(values: FormikValues) {
        if (!mealContext.mealPlan?.id || !props.date)
            return;

        planService.AddNote(
            mealContext.mealPlan.id,
            GetDateKey(props.date),
            values.notes
        ).then(() => {
            toast(`Note created`);
            mealContext.RefreshMealPlan();
        })
    }

    function RequestEditNote(values: FormikValues) {
        if (!mealContext.mealPlan?.id || !props.date || !props.existingItem?.id)
            return;

        planService.EditNote(
            props.existingItem.id,
            values.notes
        ).then(() => {
            toast(`Note updated`);
            mealContext.RefreshMealPlan();
        })
    }


    function OnSubmit(values: FormikValues) {
        if (is_edit)
            RequestEditNote(values);
        else
            RequestAddNote(values);

        CloseModal();
    }

    function CloseModal() {
        props.setIsOpen(false);
    }

    function SubmitForm() {
        if (!formRef.current) return;
        formRef.current.handleSubmit();
    }

    function ValidateForm(values: FormikValues): FormikErrors<any> {
        const errors: FormikErrors<any> = {};
        if (!values.notes || values.notes === "")
            errors.notes = "Please enter a note";
        return errors;
    }

    let date_str = props.date ? GetDateText(props.date) : "";

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={CloseModal}
            className="plan_item_modal"
        >
            <div className='header'>
                <h2>{is_edit ? "Edit Note" : "Add Note"}</h2>
                <h3>{date_str}</h3>
            </div>

            <Formik
                innerRef={formRef}
                validate={ValidateForm}
                onSubmit={values => OnSubmit(values)}
                initialValues={{
                    notes: props.existingItem?.notes || null,
                }}
                enableReinitialize={true}
            >
                {({ values, errors, handleChange }) => (
                    <form>
                        <div className="field">
                            <label>Notes</label>
                            <textarea
                                name='notes'
                                value={values.notes || ""}
                                onChange={handleChange}
                                rows={4}
                            />
                            {errors.notes &&
                                <p className='error'>{`${errors.notes}`}</p>
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

export default AddNoteModal;