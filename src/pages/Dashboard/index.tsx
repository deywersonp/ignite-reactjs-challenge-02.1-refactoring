import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

type AddFood = {
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
};

type FoodProps = {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
};

function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [editingFood, setEditingFood] = useState({} as FoodProps);

  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isEditFoodModalOpen, setIsEditFoodModalOpen] = useState(false);

  function toggleAddFoodModal() {
    setIsAddFoodModalOpen(!isAddFoodModalOpen);
  };

  function toggleEditFoodModal() {
    setIsEditFoodModalOpen(!isEditFoodModalOpen);
  };

  function handleEditFood(food: FoodProps) {
    setEditingFood(food);
    setIsEditFoodModalOpen(true);
  };

  async function handleAddFood(food: AddFood) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.error(err);
    }
  };

  async function handleUpdateFood(food: FoodProps) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food }
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.error(err);
    }
  };

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  };

  useEffect(() => {
    async function getAllFoods() {
      try {
        const response = await api.get('/foods');
        setFoods(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getAllFoods();
  }, []);

  return (
    <>
      <Header openModal={toggleAddFoodModal} />
      <ModalAddFood
        isOpen={isAddFoodModalOpen}
        setIsOpen={toggleAddFoodModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditFoodModalOpen}
        setIsOpen={toggleEditFoodModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
