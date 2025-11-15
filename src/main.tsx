import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { ToastContainer } from 'react-toastify';

import 'semantic-ui-css/semantic.min.css'
import './styles/index.css'
import './styles/components.css'
import './styles/modal.css'

import router from './router.tsx';
import { MealPlanProvider } from './context/MealPlanContext.tsx'
import { FoodProvider } from './context/FoodContext.tsx'

import Modal from 'react-modal';
Modal.setAppElement('#root');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer />
    <FoodProvider>
      <MealPlanProvider>
        <RouterProvider router={router} />
      </MealPlanProvider>
    </FoodProvider>
  </StrictMode>,
);