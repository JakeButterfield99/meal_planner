import CloseIcon from '@mui/icons-material/Close';

import { ShoppingList as IShoppingList } from '../types/ShoppingList';
import { useEffect, useState } from 'react';
import listService from '../services/list.service';
import { useMealPlan } from '../context/MealPlanContext';

const TEST_ITEMS: IShoppingList = [
    { item: "Coffee", checked: false }, { item: "Parsley", checked: false }, { item: "Orange", checked: false },
    { item: "Apple", checked: false }, { item: "MSG", checked: false }, { item: "Carrot", checked: false },
];

interface IProps {
    open: boolean,
    setOpen: Function,
}
const ShoppingList = (props: IProps) => {
    const planContext = useMealPlan();

    const [listItems, setListItems] = useState<IShoppingList>(TEST_ITEMS);

    function CheckListItem(idx: number) {
        let items = [...listItems];
        items[idx].checked = !items[idx].checked;
        setListItems(items);
    }

    function GenerateList() {
        if (!planContext.mealPlan) return;
        listService.GenerateList(planContext.mealPlan.id)
            .then((data) => {
                console.log("Generated list:", data);
                setListItems(data);
            })
            .catch((err) => {
                console.log("GenerateList error=", err);
            });
    }

    async function GetShoppingList() {
        const list = await listService.GetShoppingList();
        setListItems(list);
    }
    useEffect(() => { GetShoppingList(); }, [])

    return (
        <div id='shopping_list' className={`${props.open && 'open'}`}>
            <div className="header">
                <h1>Shopping List</h1>
                <CloseIcon
                    onClick={() => props.setOpen(!props.open)}
                />
            </div>

            <div className="list">
                {listItems.map((value, index) => (
                    <div
                        key={index}
                        className="entry"
                        onClick={() => CheckListItem(index)}
                    >
                        <input
                            type='checkbox'
                            checked={false}
                            readOnly
                            onClick={(e) => e.preventDefault()}
                        />
                        <p>{value.item}</p>
                    </div>
                ))}
            </div>

            <div className="buttons">
                <button onClick={GenerateList}>
                    Generate Shopping List
                </button>

                <button className="alt_button">
                    Add to AnyList
                </button>
            </div>
        </div>
    )
}

export default ShoppingList;