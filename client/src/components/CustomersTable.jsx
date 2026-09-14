import {useCallback, useMemo, useRef, useState} from 'react'
import {AgGridReact} from 'ag-grid-react'
import {
    ModuleRegistry, InfiniteRowModelModule,
} from 'ag-grid-community'

import api from '../api/api'
import {getApiErrorMessage} from '../utils/apiError'
import ConfirmModal from './ConfirmModal'

ModuleRegistry.registerModules([InfiniteRowModelModule])

function CustomersTable({onCustomersChanged}) {
    const gridApiRef = useRef(null)

    const [totalRows, setTotalRows] = useState(0)
    const [loading, setLoading] = useState(false)
    const [tableError, setTableError] = useState('')

    const [modalOpen, setModalOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)

    const [deleteTarget, setDeleteTarget] = useState(null)

    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [formError, setFormError] = useState('')

    const [form, setForm] = useState({
        name: '', registered_on: '', credit_limit: '', priority: 1,
    })

    const refreshTable = useCallback(() => {
        if (!gridApiRef.current) return

        setTableError('')
        gridApiRef.current.refreshInfiniteCache()
    }, [])

    const handleEdit = useCallback((customer) => {
        setFormError('')
        setEditingCustomer(customer)

        setForm({
            name: customer.name || '',
            registered_on: customer.registered_on || '',
            credit_limit: String(customer.credit_limit ?? ''),
            priority: customer.priority,
        })

        setModalOpen(true)
    }, [])

    const handleDelete = useCallback((customer) => {
        setDeleteTarget(customer)
    }, [])

    const confirmDelete = useCallback(async () => {
        if (!deleteTarget) return

        const customerId = deleteTarget.id

        setTableError('')
        setDeleteTarget(null)
        setDeletingId(customerId)

        try {
            await api.delete(`/customers/${customerId}`)

            onCustomersChanged()
            refreshTable()
        } catch (error) {
            console.error('Ошибка удаления покупателя:', error)

            setTableError(getApiErrorMessage(error, 'Не удалось удалить покупателя',),)
        } finally {
            setDeletingId(null)
        }
    }, [deleteTarget, onCustomersChanged, refreshTable])

    const columnDefs = useMemo(() => [{
        field: 'id', headerName: 'ID', width: 90,
    }, {
        field: 'name', headerName: 'Имя', flex: 1, minWidth: 180,
    }, {
        field: 'registered_on', headerName: 'Дата регистрации', width: 180,
    }, {
        field: 'credit_limit', headerName: 'Кредитный лимит', width: 180,
    }, {
        field: 'priority', headerName: 'Priority',
    }, {
        headerName: 'Действия', width: 190, sortable: false, filter: false, cellRenderer: (params) => {
            const isDeleting = deletingId === params.data?.id

            return (<div className="table-actions">
                <button
                    type="button"
                    className="table-button edit"
                    onClick={() => handleEdit(params.data)}
                    disabled={isDeleting}
                >
                    Изменить
                </button>

                <button
                    type="button"
                    className="table-button delete"
                    onClick={() => handleDelete(params.data)}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Удаление...' : 'Удалить'}
                </button>
            </div>)
        },
    }], [handleEdit, handleDelete, deletingId])

    const onGridReady = useCallback((params) => {
        gridApiRef.current = params.api

        const dataSource = {
            getRows: async (gridParams) => {
                setLoading(true)
                setTableError('')

                try {
                    const startRow = gridParams.startRow
                    const endRow = gridParams.endRow

                    const limit = endRow - startRow
                    const offset = startRow

                    const response = await api.get('/customers', {
                        params: {
                            limit, offset,
                        },
                    })

                    const {rows, total} = response.data

                    setTotalRows(total)

                    gridParams.successCallback(rows, total)
                } catch (error) {
                    console.error('Ошибка загрузки покупателей:', error)

                    setTableError(getApiErrorMessage(error, 'Не удалось загрузить покупателей',),)

                    gridParams.failCallback()
                } finally {
                    setLoading(false)
                }
            },
        }

        params.api.setGridOption('datasource', dataSource)
    }, [])

    const openCreateModal = () => {
        setFormError('')
        setEditingCustomer(null)

        setForm({
            name: '', registered_on: '', credit_limit: '', priority: 1,
        })

        setModalOpen(true)
    }

    const closeModal = () => {
        if (saving) return

        setModalOpen(false)
        setEditingCustomer(null)
        setFormError('')
    }

    const handleChange = (event) => {
        const {name, value} = event.target

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
                name: form.name.trim(),
                registered_on: form.registered_on,
                credit_limit: Number(form.credit_limit),
                priority: Number(form.priority),
            }

            if (editingCustomer) {
                await api.put(`/customers/${editingCustomer.id}`, payload,)
            } else {
                await api.post('/customers', payload)
            }

            onCustomersChanged()
            closeModal()

            setModalOpen(false)
            setEditingCustomer(null)

            refreshTable()
        } catch (error) {
            console.error('Ошибка сохранения покупателя:', error)

            setFormError(getApiErrorMessage(error, 'Не удалось сохранить покупателя',),)
        } finally {
            setSaving(false)
        }
    }

    const visibleRows = Math.min(totalRows || 1, 15)

    const rowHeight = 31
    const headerHeight = 32

    const gridHeight = visibleRows * rowHeight + headerHeight + 2

    return (<>
        <div className="table-toolbar">
            <button
                type="button"
                className="primary-button"
                onClick={openCreateModal}
                disabled={loading}
            >
                + Добавить покупателя
            </button>
        </div>

        {tableError && (<div className="table-error">
            <span>{tableError}</span>

            <button
                type="button"
                onClick={refreshTable}
            >
                Повторить
            </button>
        </div>)}

        {loading && totalRows === 0 && (<div className="table-status">
            Загрузка покупателей...
        </div>)}

        {!loading && !tableError && totalRows === 0 && (<div className="table-status">
            Покупатели отсутствуют
        </div>)}

        <div
            className="ag-theme-quartz"
            style={{
                width: '100%', height: `${gridHeight}px`,
            }}
        >
            <AgGridReact
                columnDefs={columnDefs}
                rowModelType="infinite"
                cacheBlockSize={15}
                maxBlocksInCache={5}
                onGridReady={onGridReady}
                defaultColDef={{
                    sortable: true, resizable: true,
                }}
            />
        </div>

        {modalOpen && (<div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>
                        {editingCustomer ? 'Редактировать покупателя' : 'Добавить покупателя'}
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
                        Имя

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            maxLength={30}
                            required
                            disabled={saving}
                        />
                    </label>

                    <label>
                        Дата регистрации

                        <input
                            type="date"
                            name="registered_on"
                            value={form.registered_on}
                            onChange={handleChange}
                            required
                            disabled={saving}
                        />
                    </label>

                    <label>
                        Кредитный лимит

                        <input
                            type="number"
                            name="credit_limit"
                            value={form.credit_limit}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                            disabled={saving}
                        />
                    </label>

                    <label>
                        Priority

                        <input
                            type="number"
                            name="priority"
                            value={form.priority}
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
                            disabled={saving}
                        >
                            {saving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>)}

        <ConfirmModal
            open={Boolean(deleteTarget)}
            title="Удалить покупателя?"
            message={deleteTarget ? `Вы действительно хотите удалить покупателя «${deleteTarget.name}»?` : ''}
            loading={deletingId !== null}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
        />
    </>)
}

export default CustomersTable