import { useEffect, useState } from 'react';
import { useFood } from '../context/FoodContext';

import FoodEntry from '../components/Food/FoodEntry';
import TypeSelector from '../components/Food/TypeSelector';
import FoodCreateModal from '../modals/FoodCreateModal';

import AddIcon from '@mui/icons-material/Add';

import '../styles/food.css';

const FoodPage = () => {
    const context = useFood();

    const [createFoodModal, setCreateFoodModal] = useState<boolean>(false);

    useEffect(() => {
        context.RefreshFood();
    }, []);

    const foodList = context.food.filter(food => {
        if (context.activeType == undefined) return true;
        if (!food.tags) return false;
        return (food.tags.includes(context.activeType));
    });

    return (
        <section id="food_page">
            <FoodCreateModal
                isOpen={createFoodModal}
                setIsOpen={setCreateFoodModal}
            />

            <div id='create_btn' onClick={() => setCreateFoodModal(true)}>
                <AddIcon />
            </div>

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