import { useEffect, useState } from 'react';
import foodService from '../services/food.service';

import { Food, MealType } from '../types/MealPlan';
import FoodEntry from '../components/Food/FoodEntry';

import '../styles/food.css';
import { useFood } from '../context/FoodContext';
import FoodEditModal from '../modals/FoodEditModal';
import TypeSelector from '../components/Food/TypeSelector';


const FoodPage = () => {
    const context = useFood();

    const [editFoodModal, setEditFoodModal] = useState<boolean>(false);

    useEffect(() => {
        context.RefreshFood();
    }, []);

    useEffect(() => {
        if (!context.activeFood) return;
        setEditFoodModal(true);
    }, [context.activeFood]);

    const foodList = context.food.filter(food => {
        console.log("FILTER", food.name, food.tags, context.activeType);

        if (context.activeType == undefined) return true;
        if (!food.tags) return false;
        return (food.tags.includes(context.activeType));
    });

    return (
        <section id="food_page">
            <FoodEditModal
                isOpen={editFoodModal}
                setIsOpen={setEditFoodModal}
            />

            <TypeSelector />

            <div id='food_list'>
                {foodList.map((value, index) => {
                    return (
                        <FoodEntry
                            key={index}
                            food={value}
                        />
                    )
                })}
            </div>
        </section>
    )
}

export default FoodPage;