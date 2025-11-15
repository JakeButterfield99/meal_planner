import { toast } from "react-toastify";
import { useMealPlan } from "../../context/MealPlanContext";
import { MealPlan, PlanItem } from "../../types/MealPlan";
import { GetDateKey, GetDateText } from "../../utils/date";

import PlanEntry from "./PlanEntry";

import AddIcon from '@mui/icons-material/Add';

function GetPlanItems(mealPlan: MealPlan, date: Date): PlanItem[] {
	const items: PlanItem[] = [];
	const date_str = GetDateKey(date);

	if (!mealPlan.items)
		return [];

	mealPlan.items.forEach((value) => {
		if (value.date == date_str)
			items.push(value);
	});

	return items;
}

interface IProps {
	date: Date,
}
const PlanList = (props: IProps) => {
	const context = useMealPlan();

	let items: PlanItem[] = [];
	if (context.mealPlan)
		items = GetPlanItems(context.mealPlan, props.date);

	function AddPlanItem() {
		context.setActivePlanDate(props.date);

		toast("BIG TEST", {
			autoClose: false,
		});
	}

	return (
		<div className="plan_list">
			<div className="date">
				<h2>{GetDateText(props.date)}</h2>
			</div>
			<div className="list_items">
				{items.map((value, index) => {
					return (
						<PlanEntry
							key={index}
							image={value.food.image}
							name={value.food.name}
							assigned={value.assigned}
							type={value.type}
						/>
					)
				})}

				<div className="add_container">
					<div className="add_btn" onClick={AddPlanItem}>
						<AddIcon />
					</div>
				</div>
			</div>
		</div>
	)
}

export default PlanList;