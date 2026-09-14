function ConfirmModal({
                          open,
                          title,
                          message,
                          confirmText = 'Удалить',
                          cancelText = 'Отмена',
                          loading = false,
                          onConfirm,
                          onCancel,
                      }) {
    if (!open) {
        return null
    }

    return (
        <div className="modal-overlay">
            <div
                className="confirm-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
            >

                <h3 id="confirm-modal-title">
                    {title}
                </h3>

                <p>
                    {message}
                </p>

                <div className="confirm-modal-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className="danger-button"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Удаление...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal