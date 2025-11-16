import { useRef } from 'react';

import { Formik, FormikErrors, FormikProps, FormikValues } from 'formik';
import Modal from 'react-modal';
import Select from 'react-select';

import { ASSIGNED_OPTIONS, TYPE_OPTIONS } from '../utils/form';
import { GetDateText } from '../utils/date';

interface IProps {
    isOpen: boolean,
    setIsOpen: Function,
    date?: Date,
    onSubmit: Function,
}
const AddFoodPlanModal = (props: IProps) => {
    const formRef = useRef<FormikProps<FormikValues>>(null);

    function ValidateForm(values: FormikValues): FormikErrors<any> {
        const errors: FormikErrors<any> = {};
        if (!values.type)
            errors.type = "Please select a meal type";
        if (!values.assigned)
            errors.assigned = "Please select an assignee";
        return errors;
    }

    function OnSubmit(values: FormikValues) {
        const type = values.type.value;
        const assigned = values.assigned.value;
        props.onSubmit(type, assigned);
    }

    function CloseModal() {
        props.setIsOpen(false);
    }

    function SubmitForm() {
        if (!formRef.current) return;
        formRef.current.handleSubmit();
    }

    let date_str = props.date ? GetDateText(props.date) : "";

    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={CloseModal}
            className="add_food_modal"
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
                    type: null,
                    assigned: null,
                }}
            >
                {({ values, errors, setFieldValue, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
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

            <div className='buttons'>
                <button onClick={CloseModal}>
                    Cancel
                </button>
                <button className='alt_button' onClick={SubmitForm}>
                    Add
                </button>
            </div>
        </Modal>
    )
}

export default AddFoodPlanModal;