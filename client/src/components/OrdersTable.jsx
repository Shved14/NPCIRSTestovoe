import {useCallback, useEffect, useMemo, useRef, useState,} from 'react'
import {AgGridReact} from 'ag-grid-react'
import {ClientSideRowModelModule, ModuleRegistry, RowSelectionModule,} from 'ag-grid-community'

import {getApiErrorMessage} from '../utils/apiError'

ModuleRegistry.registerModules([ClientSideRowModelModule, RowSelectionModule])

import api from '../api/api'
import ConfirmModal from './ConfirmModal'


function OrdersTable({customersVersion}) {
    const [rowData, setRowData] = useState([])
    const [customers, setCustomers] = useState([])
    const gridRef = useRef(null)
    const [selectedOrder, setSelectedOrder] = useState(null)


    const [loading, setLoading] = useState(true)
    const [customersLoading, setCustomersLoading] = useState(true)

    const [tableError, setTableError] = useState('')
    const [customersError, setCustomersError] = useState('')

    const [modalOpen, setModalOpen] = useState(false)
    const [editingOrder, setEditingOrder] = useState(null)

    const [deleteTarget, setDeleteTarget] = useState(null)

    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [formError, setFormError] = useState('')

    const [form, setForm] = useState({
        customer_id: '', title: '', order_date: '', amount: '', quantity: '',
    })

    const loadCustomers = useCallback(async () => {
        setCustomersLoading(true)
        setCustomersError('')

        try {
            const response = await api.get('/customers', {
                params: {
                    limit: 100, offset: 0,
                },
            })

            setCustomers(response.data.rows)
        } catch (error) {
            console.error('Ошибка загрузки покупателей:', error)

            setCustomersError(getApiErrorMessage(error, 'Не удалось загрузить покупателей',),)
        } finally {
            setCustomersLoading(false)
        }
    }, [])

    const loadOrders = useCallback(async () => {
        setLoading(true)
        setTableError('')

        try {
            const response = await api.get('/orders', {
                params: {
                    limit: 100, offset: 0,
                },
            })

            setRowData(response.data.rows)
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error)

            setTableError(getApiErrorMessage(error, 'Не удалось загрузить заказы',),)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadCustomers()
        loadOrders()
    }, [loadCustomers, loadOrders, customersVersion])

    const handleEdit = useCallback((order) => {
        setFormError('')
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

    const handleDelete = useCallback((order) => {
        setDeleteTarget(order)
    }, [])


    const handleEditSelected = useCallback(() => {
        if (!selectedOrder) return

        handleEdit(selectedOrder)
    }, [selectedOrder, handleEdit])

    const handleDeleteSelected = useCallback(() => {
        if (!selectedOrder) return

        handleDelete(selectedOrder)
    }, [selectedOrder, handleDelete])


    const confirmDelete = useCallback(async () => {
        if (!deleteTarget) return

        setTableError('')
        setDeletingId(deleteTarget.id)

        try {
            await api.delete(`/orders/${deleteTarget.id}`)
            setSelectedOrder(null)
            await loadOrders()
            setDeleteTarget(null)
        } catch (error) {
            console.error('Ошибка удаления заказа:', error)

            setDeleteTarget(null)
            setTableError(getApiErrorMessage(error, 'Не удалось удалить заказ'))
        } finally {
            setDeletingId(null)
        }
    }, [deleteTarget, loadOrders])


    const handleSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current?.api.getSelectedRows() || []

        setSelectedOrder(selectedRows[0] || null)
    }, [])

    const columnDefs = useMemo(() => [{
        field: 'id', headerName: 'ID', width: 80,
    }, {
        field: 'customer_id', headerName: 'Покупатель', width: 180, valueGetter: (params) => {
            const customer = customers.find((item) => item.id === params.data.customer_id)

            return customer?.name || `ID ${params.data.customer_id}`
        },
    }, {
        field: 'title', headerName: 'Название', flex: 1, minWidth: 180,
    }, {
        field: 'order_date', headerName: 'Дата заказа', width: 140,
    }, {
        field: 'amount', headerName: 'Сумма', width: 120,
    }, {
        field: 'quantity', headerName: 'Количество', width: 120,
    }], [])

    const openCreateModal = () => {
        if (customers.length === 0) {
            return
        }

        setFormError('')
        setEditingOrder(null)

        setForm({
            customer_id: '', title: '', order_date: '', amount: '', quantity: '',
        })

        setModalOpen(true)
    }

    const closeModal = () => {
        if (saving) return

        setModalOpen(false)
        setEditingOrder(null)
        setFormError('')
    }

    const handleChange = (event) => {
        const {
            name, value,
        } = event.target

        setForm((prev) => ({
            ...prev, [name]: value,
        }))

        setFormError('')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        setFormError('')
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
                await api.put(`/orders/${editingOrder.id}`, payload,)
            } else {
                await api.post('/orders', payload)
            }

            setModalOpen(false)
            setEditingOrder(null)

            await loadOrders()
        } catch (error) {
            console.error('Ошибка сохранения заказа:', error)

            setFormError(getApiErrorMessage(error, 'Не удалось сохранить заказ',),)
        } finally {
            setSaving(false)
        }
    }

    return (<>
        <div className="table-toolbar">
            <button
                type="button"
                className="primary-button"
                onClick={openCreateModal}
                disabled={loading || customersLoading || customers.length === 0}
            >
                + Добавить заказ
            </button>

            <button
                type="button"
                className="secondary-button"
                onClick={handleEditSelected}
                disabled={!selectedOrder || deletingId !== null}
            >
                Изменить
            </button>

            <button
                type="button"
                className="secondary-button"
                onClick={handleDeleteSelected}
                disabled={!selectedOrder || deletingId !== null}
            >
                Удалить
            </button>
        </div>

        {tableError && (<div className="table-error">
            <span>{tableError}</span>

            <button
                type="button"
                onClick={loadOrders}
            >
                Повторить
            </button>
        </div>)}

        {customersError && (<div className="table-status table-error">
            <span>{customersError}</span>

            <button
                type="button"
                className="retry-button"
                onClick={loadCustomers}
                disabled={customersLoading}
            >
                {customersLoading ? 'Загрузка...' : 'Повторить'}
            </button>
        </div>)}

        {loading && (<div className="table-status">
            Загрузка заказов...
        </div>)}

        {!loading && !tableError && rowData.length === 0 && (<div className="table-status">
            Заказы отсутствуют
        </div>)}

        {!loading && !tableError && rowData.length > 0 && (<div className="ag-theme-quartz orders-grid">
            <AgGridReact
                ref={gridRef}
                columnDefs={columnDefs}
                rowData={rowData}
                rowSelection={{mode: 'singleRow',}}
                onSelectionChanged={handleSelectionChanged}
                defaultColDef={{sortable: false, resizable: true,}}
                domLayout="autoHeight"
            />
        </div>)}


        {modalOpen && (<div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>
                        {editingOrder ? 'Редактировать заказ' : 'Добавить заказ'}
                    </h3>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={closeModal}
                        disabled={saving}
                    >
                        ×
                    </button>
                </div>

                {formError && (<div className="form-error">
                    {formError}
                </div>)}

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
                            disabled={saving || customersLoading || customers.length === 0}
                        >
                            <option value="">
                                {customersLoading ? 'Загрузка покупателей...' : 'Выберите покупателя'}
                            </option>

                            {customers.map((customer) => (<option
                                key={customer.id}
                                value={customer.id}
                            >
                                {customer.name}
                            </option>))}
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
                            disabled={saving}
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
                            disabled={saving}
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
                            disabled={saving}
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
                            disabled={saving}
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
                            disabled={saving || customersLoading || customers.length === 0}
                        >
                            {saving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>)}

        <ConfirmModal
            open={Boolean(deleteTarget)}
            title="Удалить заказ?"
            message={deleteTarget ? `Вы действительно хотите удалить заказ №${deleteTarget.id}?` : ''}
            loading={deletingId !== null}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
        />
    </>)
}

export default OrdersTable