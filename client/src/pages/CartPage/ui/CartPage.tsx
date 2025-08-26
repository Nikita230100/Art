import { clearCartThunk, deleteCartThunk, getCartThunk } from '@/entities/cart/api/cartThunkApi';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import './CartPage.css';
import { Trash2 } from 'lucide-react';
import { NavLink } from 'react-router';
import { Alert } from 'react-bootstrap';

export function CartPage(): React.JSX.Element {
  const cart = useAppSelector((state) => state.cart.cart);
  const isLoading = useAppSelector((state) => state.cart.isLoading);
  const dispatch = useAppDispatch();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
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

  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  if (isLoading) {
    return <div className="loading">Загрузка корзины...</div>;
  }

  if (!cart || !cart.items) {
    return <div className="empty-cart">Корзина пуста</div>;
  }
  if (!cart?.items || cart?.items.length === 0) {
    return <div className="empty-cart">Корзина пуста</div>;
  }
  const deleteCart = async (artId: number): Promise<void> => {
    const response = await dispatch(deleteCartThunk({ artId }));
    if (response.payload?.statusCode === 200) {
      setSuccess('Товар удален из корзины');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } else {
      setError('Ошибка при удалении из корзины');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const handleOrder = (): void => {
    setSuccess('Ваш заказ успешно оформлен!, ожидайте уведомление на электронную почту');
    setTimeout(() => {
      setSuccess('');
    }, 3000);

    setTimeout(() => {
      dispatch(clearCartThunk());
    }, 3000);
  };
  return (
    <div className="cart-page">
      <h1 className="cart-title">Корзина</h1>
      {error && (
        <Alert variant="danger" style={alertStyle}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="light" style={alertStyle}>
          {success}
        </Alert>
      )}
      <div className="cart-container">
        <div className="cart-items">
          {cart?.items.map((item) => (
            <div key={`${item.artId}-${item.id}`} className="cart-item">
              <NavLink to={`/art/${item.Art.id}`}>
                <div className="cart-item-image">
                  <img src={item.Art.img} alt={item.Art.name} className="art-image" />
                </div>
              </NavLink>
              <div className="cart-item-details">
                <h3 className="art-title">{item.Art.name}</h3>
                <p className="art-price">
                  Цена: <strong>{item.Art.price} ₽</strong>
                </p>
              </div>

              <button
                onClick={() => deleteCart(item.artId)}
                className="remove-btn"
                aria-label="Удалить товар">
                <Trash2 size={28} strokeWidth={2.25} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-sidebar">
          <div className="order-summary">
            <div className="summary-row">
              <span>Итого:</span>
              <span className="summary-total">{cart?.total} ₽</span>
            </div>
            <button className="btn btn-primary" onClick={handleOrder}>
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
