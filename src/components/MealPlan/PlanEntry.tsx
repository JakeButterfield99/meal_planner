import { MealType } from '../../types/MealPlan';
import { GetTypeText } from '../../utils/food';

import placeholder_img from '../../assets/placeholder_img.jpg';

interface IProps {
    image?: string,
    name: string,
    assigned: string,
    type: MealType,
}
const PlanEntry = (props: IProps) => {

    const image = props.image || placeholder_img;

    return (
        <div className="plan_entry">
            <img src={image} />
            <h3>{props.name}</h3>
            <div className="context">
                <p className="assigned">
                    {props.assigned}
                </p>
                <p className="meal">
                    {GetTypeText(props.type)}
                </p>
            </div>
        </div>
    )
}

export default PlanEntry;