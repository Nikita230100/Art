import { useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import styles from './OrdersList.module.css';

interface Order {
  id: number;
  cardId: number;
  total: number;
  status: string;
  paid: boolean;
  address: string;
  trackingNumber: number;
}

const mockOrders: Order[] = [
  {
    id: 1,
    cardId: 1,
    total: 1000,
    status: 'Новый',
    paid: false,
    address: 'ул. Пушкина, 1',
    trackingNumber: 1234567890,
  },
  {
    id: 2,
    cardId: 2,
    total: 2000,
    status: 'Оплачено',
    paid: true,
    address: 'ул. Ленина, 2',
    trackingNumber: 1234567891,
  },
  {
    id: 3,
    cardId: 3,
    total: 3000,
    status: 'Отправлен',
    paid: true,
    address: 'ул. Гагарина, 3',
    trackingNumber: 1234567892,
  },
  {
    id: 4,
    cardId: 4,
    total: 4000,
    status: 'Доставлен',
    paid: false,
    address: 'ул. Кирова, 4',
    trackingNumber: 1234567893,
  },
  {
    id: 5,
    cardId: 5,
    total: 5000,
    status: 'Подтвержден',
    paid: false,
    address: 'ул. Гагарина, 3',
    trackingNumber: 1234567892,
  },
];

export default function OrdersList(): React.JSX.Element {
  const alertStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    width: '80%',
    maxWidth: '500px',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'grey',
  };
  const [error, setError] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);

  const scrollLeft = (): void => {
    if (scrollContainerRef.current) {
      const cardWidth = 280;
      scrollContainerRef.current.scrollBy({ left: -cardWidth * 3, behavior: 'smooth' });
    }
  };

  const scrollRight = (): void => {
    if (scrollContainerRef.current) {
      const cardWidth = 280;
      scrollContainerRef.current.scrollBy({ left: cardWidth * 3, behavior: 'smooth' });
    }
  };

  const handleScroll = (): void => {
    if (scrollContainerRef.current) {
      setShowLeftButton(scrollContainerRef.current.scrollLeft > 0);
    }
  };

  const handleOrderClick = (): void => {
    setError('Функционал находится в разработке');
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  return (
    <div className={styles.ordersListContainer}>
      {error && (
        <Alert variant="light" style={alertStyle}>
          {error}
        </Alert>
      )}
      <div className={styles.ordersListHeader}>
        <h2 className={styles.ordersListTitle}>Мои заказы</h2>
      </div>

      <div className={styles.ordersScrollArea}>
        {showLeftButton && (
          <button
            className={`${styles.scrollButton} ${styles.left}`}
            onClick={scrollLeft}
            aria-label="Показать предыдущие заказы">
            &lt;
          </button>
        )}

        <div
          className={styles.ordersScrollContainer}
          ref={scrollContainerRef}
          onScroll={handleScroll}>
          {mockOrders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderCardImage}>
                <img
                  src={
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThenT3sbJcrzrJ_7zHGMwmgq2LPUpkrVWmjg&s'
                  }
                  alt={'Картинка'}
                />
              </div>
              <h3>Заказ #{order.id}</h3>
              <p className={styles.orderCardTotal}>{order.total} ₽</p>
              <p className={styles.orderCardPaid}>Оплачено: {order.paid ? 'Да' : 'Нет'}</p>
              <p className={styles.orderCardStatus}>Статус: {order.status}</p>
              {order.status === 'Новый' && (
                <button className={styles.orderCardStatusButton} onClick={() => handleOrderClick()}>
                  Принять
                </button>
              )}

              <button className={styles.orderCardButton} onClick={() => handleOrderClick()}>
                Подробнее
              </button>
            </div>
          ))}
        </div>

        {mockOrders.length > 3 && (
          <button
            className={`${styles.scrollButton} ${styles.right}`}
            onClick={scrollRight}
            aria-label="Показать следующие заказы">
            &gt;
          </button>
        )}
      </div>
    </div>
  );
}
