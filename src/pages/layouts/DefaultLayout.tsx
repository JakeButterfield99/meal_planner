import { NavLink, Outlet } from "react-router-dom";

import HomeIcon from '@mui/icons-material/Home';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import FastfoodIcon from '@mui/icons-material/Fastfood';

const DefaultLayout = () => {
    return (
        <main>
            <aside>
                <HomeIcon className="home_icon" />

                <nav>
                    <NavLink to='/'>
                        <SpaceDashboardIcon />
                    </NavLink>

                    <NavLink to='/food'>
                        <FastfoodIcon />
                    </NavLink>
                </nav>
            </aside>

            <Outlet />
        </main>
    )
}

export default DefaultLayout;