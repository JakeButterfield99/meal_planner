import CloseIcon from '@mui/icons-material/Close';

import { ListItem } from '../types/ShoppingList';
import { useState } from 'react';

const TEST_ITEMS: ListItem[] = [
    { name: "Coffee", checked: false }, { name: "Parsley", checked: false }, { name: "Orange", checked: false },
    { name: "Apple", checked: false }, { name: "MSG", checked: false }, { name: "Carrot", checked: false },
];

interface IProps {
    open: boolean,
    setOpen: Function,
}
const ShoppingList = (props: IProps) => {
    const [listItems, setListItems] = useState<ListItem[]>(TEST_ITEMS);

    function CheckListItem(idx: number) {
        let items = [...listItems];
        items[idx].checked = !items[idx].checked;
        setListItems(items);
    }

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
                            checked={value.checked}
                            readOnly
                            onClick={(e) => e.preventDefault()}
                        />
                        <p>{value.name}</p>
                    </div>
                ))}
            </div>

            <div className="buttons">
                <button>
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