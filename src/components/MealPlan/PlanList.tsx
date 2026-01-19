import { toast } from "react-toastify";
import { useMealPlan } from "../../context/MealPlanContext";
import { AddPlanItemType, MealPlan, MealTypeOrder, PlanItem } from "../../types/MealPlan";
import { GetDateKey, GetDateText } from "../../utils/date";

import PlanEntry from "./PlanEntry";

import AddIcon from '@mui/icons-material/Add';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { useOutsidePress } from "../../hooks/useOutsidePress";
import PlanNote from "./PlanNote";

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
	RequestAddPlanItem: Function,
}
const PlanList = (props: IProps) => {
	const context = useMealPlan();

	const [showMenu, setShowMenu] = useState<boolean>(false);
	const menuRef = useRef<HTMLUListElement>(null);
	useOutsidePress(menuRef, () => {
		setShowMenu(false);
	});

	let items: PlanItem[] = [];
	if (context.mealPlan)
		items = GetPlanItems(context.mealPlan, props.date);

	function AddPlanItem() {
		props.RequestAddPlanItem(props.date, AddPlanItemType.ITEM);
	}

	function AddPlanNote() {
		props.RequestAddPlanItem(props.date, AddPlanItemType.NOTE);
	}

	function EditPlanNote(item: PlanItem) {
		props.RequestAddPlanItem(props.date, AddPlanItemType.NOTE, item);
	}

	const planNotes = items.filter(item => item.type === null);
	const planItems = items.filter(item => item.type !== null);
	const sortedPlanItems = planItems.sort((a, b) => {
		if (!a.type || !b.type) return 0;
		return MealTypeOrder.indexOf(a.type) - MealTypeOrder.indexOf(b.type)
	});

	return (
		<div className="plan_list">
			<div className="date">
				<h2>{GetDateText(props.date)}</h2>
			</div>
			<div className="list_items">
				{planNotes.map((value, index) => (
					<PlanNote
						key={index}
						item={value}
						onNoteEdit={() => EditPlanNote(value)}
					/>
				))}
				{sortedPlanItems.map((value, index) => (
					<PlanEntry
						key={index}
						item={value}
						onNoteEdit={() => EditPlanNote(value)}
					/>
				))}

				<div className="add_container">
					{!showMenu && (
						<div className="add_btn" onClick={() => setShowMenu(true)}>
							<AddIcon />
						</div>
					)}

					{showMenu && (
						<ul className="popup_menu" ref={menuRef}>
							<li onClick={AddPlanItem}>+ Add Plan Item</li>
							<li onClick={AddPlanNote}>+ Add Note</li>
						</ul>
					)}
				</div>
			</div>
		</div>
	)
}

export default PlanList;