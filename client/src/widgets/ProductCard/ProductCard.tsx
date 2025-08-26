import type { IArt } from '@/entities/art/model/types';
import './ProductCard.css';
import { addToCartThunk } from '@/entities/cart/api/cartThunkApi';
import { HeartPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import {
  createFavoriteThunk,
  deleteFavoriteThunk,
  getFavoritesThunk,
} from '@/entities/favorites/api/favoriteThunkApi';
import { Alert } from 'react-bootstrap';

export const ProductCard: React.FC<{ art: IArt }> = ({ art }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);

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
  const [success, setSuccess] = useState('');

  const { buyer } = useAppSelector((state) => state.buyer);

  const handleAddToFavorite = (artId: number): void => {
    if (!buyer) {
      setSuccess('Войдите как покупатель');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      return;
    }
    dispatch(createFavoriteThunk({ artId }));
    dispatch(getFavoritesThunk());
  };

  const addToCart = async (): Promise<void> => {
    if (!buyer) {
      setSuccess('Войдите как покупатель');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      return;
    }
    const response = await dispatch(addToCartThunk(Number(art.id)));
    if (response.payload?.statusCode === 200) {
      setSuccess('Товар добавлен в корзину');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } else {
      setError('Ошибка при добавлении в корзину');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
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
      <div className="product-image-container1 rounded-0">
        <img
          onClick={() => navigate(`/art/${art.id}`)}
          src={art.img}
          className="product-image1"
          alt={art.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://restcentr.ru/images/noimage.jpg';
          }}
        />
        <div className="product-actions">
          <button onClick={addToCart} className="action-button buy-button">
            {buyer ? 'В корзину' : 'Купить'}
          </button>
          <button
            className="action-button wishlist-button"
            onClick={() => {
              if (!isClicked && buyer) {
                handleAddToFavorite(art.id);
                setIsClicked(!isClicked);
              } else {
                const favorite = favorites.find((favorite) => favorite.artId === art.id);
                if (favorite) {
                  dispatch(deleteFavoriteThunk(favorite.id));
                  setIsClicked(!isClicked);
                }
                dispatch(getFavoritesThunk());
              }
            }}>
            <HeartPlus size={18} fill={isClicked ? '#d86767' : 'none'} />
          </button>
        </div>
        <div
          className={`product-info ${isHovered ? 'visible' : ''}`}
          onClick={() => navigate(`/art/${art.id}`)}>
          <h3 className="product-title">{art.name}</h3>
          <div className="product-tags">
            <span>{art.type}</span>
            <span>
              {art.width}×{art.height} см
            </span>
            <span className="product-price1">{art.price.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>
    </div>
  );
};
