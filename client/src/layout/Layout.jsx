import {NavLink, Outlet} from "react-router-dom";

function Layout(){
    return(
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    DashBoard
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/"
                             className={({isActive})=>
                    isActive ? 'nav-link active': 'nav-link'
                    }>
                        Customers & Orders
                    </NavLink>
                </nav>
            </aside>
            <main className="main-content">
                <Outlet/>
            </main>
        </div>
    )
}

export default Layout