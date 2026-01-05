import React, { ReactNode, useContext, useEffect, useState } from "react";

import { ShoppingList as IShoppingList, ListItem } from '../types/ShoppingList';

import listService from "../services/list.service";

export interface IListContext {
    listItems: IShoppingList,
    setListItems: Function,
}

const ListContext = React.createContext<IListContext | undefined>(undefined);

export const ListProvider = ({ children }: { children: ReactNode }) => {
    const [listItems, setListItems] = useState<IShoppingList>([]);

    async function GetShoppingList() {
        const list = await listService.GetShoppingList();
        setListItems(list);
    }
    useEffect(() => { GetShoppingList(); }, []);

    return (
        <ListContext.Provider value={{
            listItems,
            setListItems
        }}>
            {children}
        </ListContext.Provider>
    )
}

export const useList = (): IListContext => {
    const context = useContext(ListContext);
    if (!context)
        throw new Error('useList must be used within a ListProvider');
    return context;
};