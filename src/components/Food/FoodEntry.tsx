import { useFood } from '../../context/FoodContext';
import { Food } from '../../types/MealPlan';

import placeholder_img from '../../assets/placeholder_img.jpg';
import { GetImage } from '../../utils/image';

interface IProps {
    food: Food,
}
const FoodEntry = (props: IProps) => {
    const context = useFood();

    function SelectFood() {
        context.setActiveFood(props.food);
    }

    let image = placeholder_img;
    if (props.food.image)
        image = GetImage(props.food.image);

    return (
        <div className="food_entry" onClick={SelectFood}>
            <img src={image} />
            <h3>{props.food.name}</h3>
        </div>
    )
}

export default FoodEntry;