import { ListItem } from "../../types/ShoppingList";

import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';

interface IProps {
    entry: ListItem,
    onCheck: Function,
    onIgnore: Function,
    onRemove: Function,
}
const ListEntry = (props: IProps) => {
    function CheckItem() {
        props.onCheck();
    }

    function RemoveItem() {
        props.onRemove();
    }

    function IgnoreItem() {
        props.onIgnore();
    }

    return (
        <div title={props.entry.item} className="entry">
            <input
                type='checkbox'
                checked={props.entry.checked}
                readOnly
                onClick={(e) => {
                    e.preventDefault();
                    CheckItem();
                }}
            />

            <p onClick={CheckItem}>
                {props.entry.item}
            </p>

            <div
                title="Ignore Item"
                onClick={IgnoreItem}
            >
                <NotificationsPausedIcon />
            </div>

            <div
                title="Remove From List"
                onClick={RemoveItem}
            >
                <DeleteIcon />
            </div>
        </div>
    )
}
export default ListEntry;