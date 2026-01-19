import { PlanItem } from '../../types/MealPlan';

import { useMealPlan } from '../../context/MealPlanContext';
import { useModal } from '../../context/ModalContext';

import planService from '../../services/plan.service';

import { toast } from 'react-toastify';

import DeleteIcon from '@mui/icons-material/Delete';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes'
import CreateIcon from '@mui/icons-material/Create';;

interface IProps {
    item: PlanItem,
    onNoteEdit: Function,
}
const PlanNote = (props: IProps) => {
    const mealContext = useMealPlan();
    const modalContext = useModal();

    const is_active = mealContext.activePlanItem?.id === props.item.id;

    function ToggleActive() {
        if (is_active)
            return mealContext.setActivePlanItem(undefined);
        mealContext.setActivePlanItem(props.item);
    }

    function ConfirmRemoveEntry() {
        planService.DeleteListItem(props.item.id)
            .then(() => {
                toast(`Removed Note`);
                mealContext.setActivePlanItem(undefined);
                mealContext.RefreshMealPlan();
            })
            .catch(err => console.log("ConfirmRemoveEntry", err));
    }

    function RemoveEntry(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();

        modalContext.show({
            title: "Are you sure?",
            text: `Do you want to remove the note`,
            confirm_cb: () => ConfirmRemoveEntry(),
            cancel_cb: () => { },
        });
    }

    return (
        <div className="plan_entry note" onClick={ToggleActive}>
            <SpeakerNotesIcon className='icon' />
            <div className="notes">
                <p>{props.item.notes}</p>
            </div>

            {is_active &&
                <>
                    <div className='actions'>
                        <div className='button' onClick={() => props.onNoteEdit()}>
                            <CreateIcon />
                            <p>Edit</p>
                        </div>
                        <div className='button red' onClick={RemoveEntry}>
                            <DeleteIcon />
                            <p>Remove</p>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default PlanNote;