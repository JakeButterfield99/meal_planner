import { ReactNode } from "react"
import { MealPlanProvider } from "./MealPlanContext"
import { FoodProvider } from "./FoodContext"
import { ModalProvider } from "./ModalContext"
import { RecipeProvider } from "./RecipeContext"
import { ListProvider } from "./ListContext"

interface IProps {
    children: ReactNode,
}
const ContextProvider = (props: IProps) => {
    return (
        <ModalProvider>
            <RecipeProvider>
                <FoodProvider>
                    <MealPlanProvider>
                        <ListProvider>
                            {props.children}
                        </ListProvider>
                    </MealPlanProvider>
                </FoodProvider>
            </RecipeProvider>
        </ModalProvider>
    )
}

export default ContextProvider;