import { GetWeekDates } from "../../utils/date";
import { useMealPlan } from "../../context/MealPlanContext";

import DateSelector from "./DateSelector";
import PlanList from "./PlanList";

import ListAltIcon from '@mui/icons-material/ListAlt';

interface IProps {
    shoppingListOpen: boolean,
    setShoppingListOpen: Function,
}
const MealPlan = (props: IProps) => {
    const context = useMealPlan();

    function SetActiveMonday(date: Date) {
        context.setActiveMonday(date);
    }

    // Sync the displayed dates to active monday
    let dates: Date[] = [];
    if (context.activeMonday)
        dates = GetWeekDates(context.activeMonday);

    return (
        <div id="meal_plan">
            <div className="header">
                <DateSelector
                    SetActiveDate={SetActiveMonday}
                />
                <div
                    className={`list_btn ${props.shoppingListOpen && 'hide'}`}
                    onClick={() => props.setShoppingListOpen(true)}
                >
                    <ListAltIcon />
                </div>
            </div>

            {dates.map((value, index) => {
                return (
                    <PlanList
                        key={index}
                        date={value}
                    />
                )
            })}
        </div>
    )
}

export default MealPlan;