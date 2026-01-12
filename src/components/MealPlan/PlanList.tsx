import { toast } from "react-toastify";
import { useMealPlan } from "../../context/MealPlanContext";
import { MealPlan, MealTypeOrder, PlanItem } from "../../types/MealPlan";
import { GetDateKey, GetDateText } from "../../utils/date";

import PlanEntry from "./PlanEntry";

import AddIcon from '@mui/icons-material/Add';
import { useCallback } from "react";

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
	}

	const sortedItems = items.sort((a, b) => {
		return MealTypeOrder.indexOf(a.type) - MealTypeOrder.indexOf(b.type)
	});

	return (
		<div className="plan_list">
			<div className="date">
				<h2>{GetDateText(props.date)}</h2>
			</div>
			<div className="list_items">
				{sortedItems.map((value, index) => {
					return (
						<PlanEntry
							key={index}
							item={value}
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