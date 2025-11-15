import { useEffect, useState } from 'react';
import foodService from '../services/food.service';

import { Food } from '../types/MealPlan';
import FoodEntry from '../components/Food/FoodEntry';

import '../styles/food.css';
import { useFood } from '../context/FoodContext';
import FoodEditModal from '../modals/FoodEditModal';


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

    return (
        <section id="food_page">
            <FoodEditModal
                isOpen={editFoodModal}
                setIsOpen={setEditFoodModal}
            />

            <div id='food_list'>
                {context.food.map((value, index) => {
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