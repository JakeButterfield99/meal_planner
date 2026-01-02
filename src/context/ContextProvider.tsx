import { ReactNode } from "react"
import { MealPlanProvider } from "./MealPlanContext"
import { FoodProvider } from "./FoodContext"
import { ModalProvider } from "./ModalContext"
import { RecipeProvider } from "./RecipeContext"

interface IProps {
    children: ReactNode,
}
const ContextProvider = (props: IProps) => {
    return (
        <ModalProvider>
            <RecipeProvider>
                <FoodProvider>
                    <MealPlanProvider>
                        {props.children}
                    </MealPlanProvider>
                </FoodProvider>
            </RecipeProvider>
        </ModalProvider>
    )
}

export default ContextProvider;