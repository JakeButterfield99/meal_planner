import { GetFoodTypes, GetTypeText } from "../../utils/food";
import { useFood } from "../../context/FoodContext";

const TypeSelector = () => {
    const foodContext = useFood();

    const types = GetFoodTypes();

    function SelectType(value: number | undefined) {
        foodContext.setActiveType(value);
    }

    const is_all = (foodContext.activeType == undefined);

    return (
        <div className="type_selector">
            <div
                className={`option ${is_all && 'active'}`}
                onClick={() => SelectType(undefined)}
            >
                <p>All</p>
            </div>

            {types.map((value, index) => {
                const is_active = (foodContext.activeType == value);
                const text = GetTypeText(value);

                return (
                    <div
                        key={index}
                        className={`option ${is_active && 'active'}`}
                        onClick={() => SelectType(value)}
                    >
                        <p>{text}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default TypeSelector;