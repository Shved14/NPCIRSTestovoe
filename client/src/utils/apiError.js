export function getApiErrorMessage(
    error,
    fallbackMessage = 'Произошла ошибка',
) {
    return (
        error.response?.data?.message ||
        fallbackMessage
    )
}