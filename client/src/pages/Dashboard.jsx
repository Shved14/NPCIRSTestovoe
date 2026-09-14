import {useState} from 'react'

import CustomersTable from '../components/CustomersTable'
import OrdersTable from '../components/OrdersTable'

function Dashboard() {
    const [customersVersion, setCustomersVersion] = useState(0)

    const handleCustomersChanged = () => {
        setCustomersVersion((prev) => prev + 1)
    }

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

                <CustomersTable
                    onCustomersChanged={handleCustomersChanged}
                />
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h2>Заказы</h2>
                </div>

                <OrdersTable
                    customersVersion={customersVersion}
                />
            </section>
        </div>
    )
}

export default Dashboard