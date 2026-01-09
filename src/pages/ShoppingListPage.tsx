import ShoppingList from "../components/ShoppingList/ShoppingList";

const ShoppingListPage = () => {
    return (
        <section id="shopping_list_page">
            <ShoppingList
                open={true}
                setOpen={() => { }}
            />
        </section>
    )
}
export default ShoppingListPage;