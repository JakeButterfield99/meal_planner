import { useEffect, useState } from 'react';

import { ShoppingList as IShoppingList, ListItem } from '../../types/ShoppingList';
import listService from '../../services/list.service';
import { useMealPlan } from '../../context/MealPlanContext';

import ListEntry from './ListEntry';

import CloseIcon from '@mui/icons-material/Close';
import DownloadingIcon from '@mui/icons-material/Downloading';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


interface IProps {
    open: boolean,
    setOpen: Function,
}
const ShoppingList = (props: IProps) => {
    const planContext = useMealPlan();

    const [loading, setLoading] = useState<boolean>(false);
    const [listItems, setListItems] = useState<IShoppingList>([]);

    function CheckListItem(entry: ListItem) {
        if (!entry.id) return;
        listService.CheckListEntry(entry.id, !entry.checked)
            .then(val => { setListItems(val) })
            .catch(err => console.log("CheckListItem err", err));
    }

    function RemoveListItem(entry: ListItem) {
        if (!entry.id) return;
        listService.RemoveListEntry(entry.id)
            .then(val => { setListItems(val) })
            .catch(err => console.log("RemoveListItem err", err));
    }

    function IgnoreListItem(entry: ListItem) {
        if (!entry.id) return;
        listService.IgnoreListEntry(entry.id)
            .then(val => { setListItems(val) })
            .catch(err => console.log("IgnoreListItem err", err));
    }

    function GenerateList() {
        if (!planContext.mealPlan) return;
        setLoading(true);
        listService.GenerateList(planContext.mealPlan.id)
            .then((data) => {
                console.log("Generated list:", data);
                setListItems(data);
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
                setListItems(data);
                setLoading(false);
            })
            .catch(err => console.log("ClearList err", err));
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
                {loading &&
                    <div className="loading">
                        <DownloadingIcon />
                    </div>
                }

                {!loading && listItems.length === 0 && (
                    <h3>List Empty</h3>
                )}

                {!loading && listItems.map((value, index) => (
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
                    className="button"
                    onClick={GenerateList}
                >
                    <RotateLeftIcon />
                </div>

                <div
                    title="Clear Shopping List"
                    className="button middle"
                    onClick={ClearList}
                >
                    <DeleteIcon />
                </div>

                <div
                    title="Add Shopping List to AnyList"
                    className="button"
                    onClick={ClearList}
                >
                    <AddCircleOutlineIcon />
                    Add to AnyList
                </div>
            </div>
        </div>
    )
}

export default ShoppingList;