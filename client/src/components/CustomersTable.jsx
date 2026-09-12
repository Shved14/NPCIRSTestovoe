import { useCallback, useMemo, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
    ModuleRegistry,
    InfiniteRowModelModule,
} from 'ag-grid-community'

import api from '../api/api'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

ModuleRegistry.registerModules([InfiniteRowModelModule])

function CustomersTable() {
    const gridApiRef = useRef(null)

    const [totalRows, setTotalRows] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({
        name: '',
        registered_on: '',
        credit_limit: '',
    })

    const refreshTable = useCallback(() => {
        if (!gridApiRef.current) return

        gridApiRef.current.refreshInfiniteCache()
    }, [])

    const handleEdit = useCallback((customer) => {
        setEditingCustomer(customer)

        setForm({
            name: customer.name || '',
            registered_on: customer.registered_on || '',
            credit_limit: String(customer.credit_limit ?? ''),
        })

        setModalOpen(true)
    }, [])

    const handleDelete = useCallback(async (customer) => {
        const confirmed = window.confirm(
            `Удалить покупателя «${customer.name}»?`,
        )

        if (!confirmed) return

        try {
            await api.delete(`/customers/${customer.id}`)

            refreshTable()
        } catch (error) {
            console.error(
                'Ошибка удаления покупателя:',
                error,
            )

            const message =
                error.response?.data?.message ||
                'Не удалось удалить покупателя'

            alert(message)
        }
    }, [refreshTable])

    const columnDefs = useMemo(
        () => [
            {
                field: 'id',
                headerName: 'ID',
                width: 90,
            },
            {
                field: 'name',
                headerName: 'Имя',
                flex: 1,
                minWidth: 180,
            },
            {
                field: 'registered_on',
                headerName: 'Дата регистрации',
                width: 180,
            },
            {
                field: 'credit_limit',
                headerName: 'Кредитный лимит',
                width: 180,
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
                            onClick={() => handleEdit(params.data)}
                        >
                            Изменить
                        </button>

                        <button
                            type="button"
                            className="table-button delete"
                            onClick={() => handleDelete(params.data)}
                        >
                            Удалить
                        </button>
                    </div>
                ),
            },
        ],
        [handleEdit, handleDelete],
    )

    const onGridReady = useCallback((params) => {
        gridApiRef.current = params.api

        const dataSource = {
            getRows: async (gridParams) => {
                try {
                    const startRow = gridParams.startRow
                    const endRow = gridParams.endRow

                    const limit = endRow - startRow
                    const offset = startRow

                    const response = await api.get('/customers', {
                        params: {
                            limit,
                            offset,
                        },
                    })

                    const { rows, total } = response.data

                    setTotalRows(total)

                    gridParams.successCallback(
                        rows,
                        total,
                    )
                } catch (error) {
                    console.error(
                        'Ошибка загрузки покупателей:',
                        error,
                    )

                    gridParams.failCallback()
                }
            },
        }

        params.api.setGridOption(
            'datasource',
            dataSource,
        )
    }, [])

    const openCreateModal = () => {
        setEditingCustomer(null)

        setForm({
            name: '',
            registered_on: '',
            credit_limit: '',
        })

        setModalOpen(true)
    }

    const closeModal = () => {
        if (saving) return

        setModalOpen(false)
        setEditingCustomer(null)
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
                name: form.name.trim(),
                registered_on: form.registered_on,
                credit_limit: Number(form.credit_limit),
            }

            if (editingCustomer) {
                await api.put(
                    `/customers/${editingCustomer.id}`,
                    payload,
                )
            } else {
                await api.post('/customers', payload)
            }

            closeModal()
            refreshTable()
        } catch (error) {
            console.error(
                'Ошибка сохранения покупателя:',
                error,
            )

            const message =
                error.response?.data?.message ||
                'Не удалось сохранить покупателя'

            alert(message)
        } finally {
            setSaving(false)
        }
    }

    const visibleRows = Math.min(totalRows || 1, 15)

    const rowHeight = 31
    const headerHeight = 32

    const gridHeight =
        visibleRows * rowHeight + headerHeight + 2

    return (
        <>
            <div className="table-toolbar">
                <button
                    type="button"
                    className="primary-button"
                    onClick={openCreateModal}
                >
                    + Добавить покупателя
                </button>
            </div>

            <div
                className="ag-theme-quartz"
                style={{
                    width: '100%',
                    height: `${gridHeight}px`,
                }}
            >
                <AgGridReact
                    columnDefs={columnDefs}
                    rowModelType="infinite"
                    cacheBlockSize={15}
                    maxBlocksInCache={5}
                    onGridReady={onGridReady}
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                    }}
                />
            </div>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>
                                {editingCustomer
                                    ? 'Редактировать покупателя'
                                    : 'Добавить покупателя'}
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
                                Имя

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    maxLength={30}
                                    required
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

export default CustomersTable