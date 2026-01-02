import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet';

import 'semantic-ui-css/semantic.min.css'
import './styles/index.css'
import './styles/components.css'
import './styles/modal.css'

import router from './router.tsx';

import Modal from 'react-modal';
Modal.setAppElement('#root');

import favicon from './assets/favicon.ico';
import ContextProvider from './context/ContextProvider.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Helmet>
			<title>Meal Planner</title>
			<link rel='icon' type='image/png' href={favicon} sizes='24x24' />
		</Helmet>

		<ToastContainer />

		<ContextProvider>
			<RouterProvider router={router} />
		</ContextProvider>
	</StrictMode>,
);