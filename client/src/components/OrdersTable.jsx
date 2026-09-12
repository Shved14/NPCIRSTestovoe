import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'

import api from '../api/api'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

function OrdersTable() {
    const gridApiRef = useRef(null)

    const [customers, setCustomers] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [editingOrder, setEditingOrder] = useState(null)
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({
        customer_id: '',
        title: '',
        order_date: '',
        amount: '',
        quantity: '',
    })

    const loadCustomers = useCallback(async () => {
        try {
            const response = await api.get('/customers', {
                params: {
                    limit: 100,
                    offset: 0,
                },
            })

            setCustomers(response.data.rows)
        } catch (error) {
            console.error(
                'Ошибка загрузки покупателей:',
                error,
            )
        }
    }, [])

    const loadOrders = useCallback(async () => {
        try {
            const response = await api.get('/orders', {
                params: {
                    limit: 15,
                    offset: 0,
                },
            })

            if (gridApiRef.current) {
                gridApiRef.current.setGridOption(
                    'rowData',
                    response.data.rows,
                )
            }
        } catch (error) {
            console.error(
                'Ошибка загрузки заказов:',
                error,
            )
        }
    }, [])

    useEffect(() => {
        loadCustomers()
    }, [loadCustomers])

    const handleEdit = useCallback((order) => {
        setEditingOrder(order)

        setForm({
            customer_id: String(order.customer_id),
            title: order.title || '',
            order_date: order.order_date || '',
            amount: String(order.amount ?? ''),
            quantity: String(order.quantity ?? ''),
        })

        setModalOpen(true)
    }, [])

    const handleDelete = useCallback(
        async (order) => {
            const confirmed = window.confirm(
                `Удалить заказ №${order.id}?`,
            )

            if (!confirmed) return

            try {
                await api.delete(`/orders/${order.id}`)

                await loadOrders()
            } catch (error) {
                console.error(
                    'Ошибка удаления заказа:',
                    error,
                )

                const message =
                    error.response?.data?.message ||
                    'Не удалось удалить заказ'

                alert(message)
            }
        },
        [loadOrders],
    )

    const columnDefs = useMemo(
        () => [
            {
                field: 'id',
                headerName: 'ID',
                width: 80,
            },
            {
                field: 'customer_id',
                headerName: 'ID покупателя',
                width: 130,
            },
            {
                field: 'title',
                headerName: 'Название',
                flex: 1,
                minWidth: 180,
            },
            {
                field: 'order_date',
                headerName: 'Дата заказа',
                width: 140,
            },
            {
                field: 'amount',
                headerName: 'Сумма',
                width: 120,
            },
            {
                field: 'quantity',
                headerName: 'Количество',
                width: 120,
            },
            {
                headerName: 'Действия',
                width: 190,
                sortable: false,
                filter: false,
                cellRenderer: (params) => (
                    <div className="table-actions">
                        <button
                            type="button"
                            className="table-button edit"
                            onClick={() =>
                                handleEdit(params.data)
                            }
                        >
                            Изменить
                        </button>

                        <button
                            type="button"
                            className="table-button delete"
                            onClick={() =>
                                handleDelete(params.data)
                            }
                        >
                            Удалить
                        </button>
                    </div>
                ),
            },
        ],
        [handleEdit, handleDelete],
    )

    const onGridReady = useCallback(
        async (params) => {
            gridApiRef.current = params.api

            await loadOrders()
        },
        [loadOrders],
    )

    const openCreateModal = () => {
        setEditingOrder(null)

        setForm({
            customer_id: '',
            title: '',
            order_date: '',
            amount: '',
            quantity: '',
        })

        setModalOpen(true)
    }

    const closeModal = () => {
        if (saving) return

        setModalOpen(false)
        setEditingOrder(null)
    }

    const handleChange = (event) => {
        const { name, value } = event.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        setSaving(true)

        try {
            const payload = {
                customer_id: Number(form.customer_id),
                title: form.title.trim(),
                order_date: form.order_date,
                amount: Number(form.amount),
                quantity: Number(form.quantity),
            }

            if (editingOrder) {
                await api.put(
                    `/orders/${editingOrder.id}`,
                    payload,
                )
            } else {
                await api.post('/orders', payload)
            }

            closeModal()

            await loadOrders()
        } catch (error) {
            console.error(
                'Ошибка сохранения заказа:',
                error,
            )

            const message =
                error.response?.data?.message ||
                'Не удалось сохранить заказ'

            alert(message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <div className="table-toolbar">
                <button
                    type="button"
                    className="primary-button"
                    onClick={openCreateModal}
                >
                    + Добавить заказ
                </button>
            </div>

            <div
                className="ag-theme-quartz orders-grid"
            >
                <AgGridReact
                    columnDefs={columnDefs}
                    onGridReady={onGridReady}
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                    }}
                    domLayout="autoHeight"
                />
            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>
                                {editingOrder
                                    ? 'Редактировать заказ'
                                    : 'Добавить заказ'}
                            </h3>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form
                            className="order-form"
                            onSubmit={handleSubmit}
                        >
                            <label>
                                Покупатель

                                <select
                                    name="customer_id"
                                    value={form.customer_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Выберите покупателя
                                    </option>

                                    {customers.map((customer) => (
                                        <option
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Название

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    maxLength={200}
                                    required
                                />
                            </label>

                            <label>
                                Дата заказа

                                <input
                                    type="date"
                                    name="order_date"
                                    value={form.order_date}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Сумма

                                <input
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </label>

                            <label>
                                Количество

                                <input
                                    type="number"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    min="1"
                                    step="1"
                                    required
                                />
                            </label>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Отмена
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? 'Сохранение...'
                                        : 'Сохранить'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default OrdersTable