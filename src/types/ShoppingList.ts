export interface ListItem {
    id?: number;
    item: string;
    checked: boolean;
}

export type ShoppingList = ListItem[];