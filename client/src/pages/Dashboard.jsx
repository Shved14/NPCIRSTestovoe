import CustomersTable from '../components/CustomersTable'
import OrdersTable from '../components/OrdersTable'

function Dashboard() {
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Клиенты и заказы</h1>
                <p>
                    Управление покупателями и заказами
                </p>
            </div>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Покупатели</h2>
                </div>

                <CustomersTable />
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Заказы</h2>
                </div>

                <OrdersTable />
            </section>
        </div>
    )
}

export default Dashboard