import { useEffect, useState } from "react";
import { GetDaySuffix } from "../../utils/date";
import { useMealPlan } from "../../context/MealPlanContext";

function FormatWeekRange(monday: Date): string {
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const mondayDay = monday.getDate();
    const sundayDay = sunday.getDate();

    return `${mondayDay}${GetDaySuffix(mondayDay)}-${sundayDay}${GetDaySuffix(sundayDay)}`;
}

function GetNextMondays(count: number): Date[] {
    const mondays: Date[] = [];
    const today = new Date();
    const current = new Date(today);

    const dayOfWeek = current.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7; // handles Sunday as well
    current.setDate(current.getDate() - diffToMonday);
    mondays.push(new Date(current));

    for (let i = 1; i < count; i++) {
        const nextMonday = new Date(current);
        nextMonday.setDate(current.getDate() + i * 7);
        mondays.push(nextMonday);
    }

    return mondays;
}

const DATES_TO_LIST = 4
const THIS_WEEK_IDX = 0
const NEXT_WEEK_IDX = 1

interface IProps {
    SetActiveDate: Function,
}
const DateSelector = (props: IProps) => {
    const [activeIdx, setActiveIdx] = useState<number>(0);
    const dates = GetNextMondays(DATES_TO_LIST);

    useEffect(() => {
        const monday = dates[activeIdx];
        props.SetActiveDate(monday);
    }, [activeIdx])

    return (
        <div className="date_selector">
            {dates.map((value, index) => {
                const is_active = (activeIdx == index);
                let text = "";

                switch (index) {
                    case THIS_WEEK_IDX:
                        text = "THIS WEEK";
                        break;
                    case NEXT_WEEK_IDX:
                        text = "NEXT WEEK";
                        break;
                    default:
                        text = FormatWeekRange(value);
                        break;
                }

                return (
                    <div
                        key={index}
                        className={`option ${is_active && 'active'}`}
                        onClick={() => setActiveIdx(index)}
                    >
                        <p>{text}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default DateSelector;