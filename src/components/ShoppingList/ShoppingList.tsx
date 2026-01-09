import { useState } from 'react';
import { toast } from 'react-toastify';

import { ListItem } from '../../types/ShoppingList';
import listService from '../../services/list.service';
import { useMealPlan } from '../../context/MealPlanContext';

import ListEntry from './ListEntry';

import CloseIcon from '@mui/icons-material/Close';
import DownloadingIcon from '@mui/icons-material/Downloading';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useList } from '../../context/ListContext';

interface IProps {
    open: boolean,
    setOpen: Function,
}
const ShoppingList = (props: IProps) => {
    const planContext = useMealPlan();
    const listContext = useList();

    const [loading, setLoading] = useState<boolean>(false);

    function CheckListItem(entry: ListItem) {
        if (!entry.id) return;
        listService.CheckListEntry(entry.id, !entry.checked)
            .then(val => { listContext.setListItems(val) })
            .catch(err => console.log("CheckListItem err", err));
    }

    function RemoveListItem(entry: ListItem) {
        if (!entry.id) return;
        listService.RemoveListEntry(entry.id)
            .then(val => { listContext.setListItems(val) })
            .catch(err => console.log("RemoveListItem err", err));
    }

    function IgnoreListItem(entry: ListItem) {
        if (!entry.id) return;
        listService.IgnoreListEntry(entry.id)
            .then(val => { listContext.setListItems(val) })
            .catch(err => console.log("IgnoreListItem err", err));
    }

    function GenerateList() {
        setLoading(true);
        listService.GenerateList()
            .then((data) => {
                toast("Shopping List Generated");
                console.log("Generated list:", data);
                listContext.setListItems(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log("GenerateList error=", err);
            });
    }

    function ClearList() {
        setLoading(true);
        listService.ClearList()
            .then((data) => {
                toast("Shopping List Cleared");
                listContext.setListItems(data);
                setLoading(false);
            })
            .catch(err => console.log("ClearList err", err));
    }

    function AddToAnyList() {
        listService.AddToAnyList()
            .then(() => {
                toast("AnyList Updated");
            })
            .catch(err => console.log("AddToAnyList err", err));
    }

    return (
        <div className={`shopping_list ${props.open && 'open'}`}>
            <div className="header">
                <h1>Shopping List</h1>
                <CloseIcon
                    onClick={() => props.setOpen(!props.open)}
                />
            </div>

            <div className="list">
                {loading &&
                    <div className="loading">
                        <DownloadingIcon />
                        <h3>Generating List</h3>
                    </div>
                }

                {!loading && listContext.listItems.length === 0 && (
                    <h3>List Empty</h3>
                )}

                {!loading && listContext.listItems.map((value, index) => (
                    <ListEntry
                        key={index}
                        entry={value}
                        onCheck={() => CheckListItem(value)}
                        onIgnore={() => IgnoreListItem(value)}
                        onRemove={() => RemoveListItem(value)}
                    />
                ))}
            </div>

            <div className="buttons">
                <div
                    title="Generate Shopping List"
                    className="button btn_left"
                    onClick={GenerateList}
                >
                    <RotateLeftIcon />
                </div>

                <div
                    title="Add Shopping List to AnyList"
                    className="button middle"
                    onClick={AddToAnyList}
                >
                    <AddCircleOutlineIcon />
                    Add to AnyList
                </div>

                <div
                    title="Clear Shopping List"
                    className="button btn_right"
                    onClick={ClearList}
                >
                    <DeleteIcon />
                </div>
            </div>
        </div>
    )
}

export default ShoppingList;