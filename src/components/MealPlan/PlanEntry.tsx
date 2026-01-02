import { MealType, PlanItem } from '../../types/MealPlan';
import { GetTypeText } from '../../utils/food';
import { GetImage } from '../../utils/image';

import { useMealPlan } from '../../context/MealPlanContext';
import { useModal } from '../../context/ModalContext';
import { useFood } from '../../context/FoodContext';

import planService from '../../services/plan.service';

import { toast } from 'react-toastify';

import placeholder_img from '../../assets/placeholder_img.jpg';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

interface IProps {
    item: PlanItem,
}
const PlanEntry = (props: IProps) => {
    const mealContext = useMealPlan();
    const foodContext = useFood();
    const modalContext = useModal();

    const is_active = mealContext.activePlanItem?.id === props.item.id;

    let image = placeholder_img;
    if (props.item.food.image)
        image = GetImage(props.item.food.image);

    function ToggleActive() {
        if (is_active)
            return mealContext.setActivePlanItem(undefined);
        mealContext.setActivePlanItem(props.item);
    }

    function ShowRecipe(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
        if (!props.item.food) return;
        foodContext.setActiveRecipe(props.item.food);
    }

    function AddToShoppingCart(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
    }

    function ConfirmRemoveEntry() {
        planService.DeleteListItem(props.item.id)
            .then(() => {
                toast(`Removed Item: ${props.item.food.name}`);
                mealContext.setActivePlanItem(undefined);
                mealContext.RefreshMealPlan();
            })
            .catch(err => console.log("ConfirmRemoveEntry", err));
    }

    function RemoveEntry(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();

        modalContext.show({
            title: "Are you sure?",
            text: `Do you want to remove: ${props.item.food.name}?`,
            confirm_cb: () => ConfirmRemoveEntry(),
            cancel_cb: () => { },
        });
    }

    return (
        <div className="plan_entry" onClick={ToggleActive}>
            <img src={image} />
            <h3>{props.item.food.name}</h3>

            {is_active &&
                <div className='actions'>
                    <div className='button' onClick={ShowRecipe}>
                        <RestaurantIcon />
                        <p>Recipe</p>
                    </div>
                    <div className='button' onClick={AddToShoppingCart}>
                        <ShoppingCartIcon />
                        <p>Add to Shopping Cart</p>
                    </div>
                    <div className='button red' onClick={RemoveEntry}>
                        <DeleteIcon />
                        <p>Remove</p>
                    </div>
                </div>
            }

            <div className="context">
                <p className="assigned">
                    {props.item.assigned}
                </p>
                <p className="meal">
                    {GetTypeText(props.item.type)}
                </p>
            </div>
        </div>
    )
}

export default PlanEntry;