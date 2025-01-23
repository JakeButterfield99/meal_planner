import { NavLink, Outlet } from "react-router-dom";

const DefaultLayout = () => {
    return (
        <div id="layout">
            <header>
                <p>Jonk Meal Planner</p>
            </header>

            <main>
                <aside>
                    <NavLink to='/'>
                        <p>Dashboard</p>
                    </NavLink>
                </aside>

                <Outlet />
            </main>
        </div>
    )
}

export default DefaultLayout;