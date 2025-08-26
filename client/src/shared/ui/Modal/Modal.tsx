import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

// Тип пропсов модального окна
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
    confirmText?: string;
    cancelText?: string;
}

// Модальное окно
export function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    content,
    confirmText = 'Удалить',
    cancelText = 'Отменить'
}: ModalProps): React.JSX.Element | null {

    // Ссылка на overlay
    const overlayRef = useRef<HTMLDivElement>(null);

    // Закрытие модального окна при нажатии на Escape   
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return (): void => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Закрытие модального окна при клике на overlay
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (event.target === overlayRef.current) {
            onClose();
        }
    };

    // Если модальное окно не открыто, возвращаем null
    if (!isOpen) return null;

    return (
        <div
            className={styles.overlay}
            ref={overlayRef}
            onClick={handleOverlayClick}
        >
            <div className={styles.modal}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.content}>{content}</div>
                <div className={styles.buttons}>
                    <button
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.button} ${styles.confirmButton}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
} 