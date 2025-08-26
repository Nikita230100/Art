import type { SetStateAction } from 'react';

// Функция для изменения состояния
export function changeHandler<T>(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setState: (value: SetStateAction<T>) => void
): void {
    const { name, value } = event.target;

    setState((prev: T) => ({
        ...prev,
        [name]: value,
    }));
}