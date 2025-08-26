import { useState, useEffect } from 'react';
import { getFavoritesThunk, deleteFavoriteThunk } from '@/entities/favorites/api/favoriteThunkApi';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import './Favorites.css';
import { Loader } from '@/shared/ui/Loader/Loader';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Link } from 'react-router';
import { addToCartThunk } from '@/entities/cart/api/cartThunkApi';
import { Alert } from 'react-bootstrap';

type SortField = 'name' | 'price';
type SortDirection = 'asc' | 'desc';

export const Favorites = (): React.ReactNode => {
  const { favorites, isLoading, error } = useAppSelector((state) => state.favorites);
  const dispatch = useAppDispatch();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [favoriteToDelete, setFavoriteToDelete] = useState<number | null>(null);
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
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  useEffect(() => {
    dispatch(getFavoritesThunk());
  }, [dispatch]);

  const handleSort = (field: SortField): void => {
    setSortField(field);
    setSortDirection((prev) => (sortField === field ? (prev === 'asc' ? 'desc' : 'asc') : 'asc'));
  };

  const handleRemoveClick = (favoriteId: number): void => {
    setFavoriteToDelete(favoriteId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (favoriteToDelete) {
      try {
        await dispatch(deleteFavoriteThunk(favoriteToDelete)).unwrap();
      } catch (error) {
        console.error('Error deleting favorite:', error);
      } finally {
        setShowDeleteModal(false);
        setFavoriteToDelete(null);
      }
    }
  };

  const handleCancelDelete = (): void => {
    setShowDeleteModal(false);
    setFavoriteToDelete(null);
  };

  const addToCart = async (artId: number): Promise<void> => {
    const response = await dispatch(addToCartThunk(artId));
    if (response.payload?.statusCode === 200) {
      setSuccess('Товар добавлен в корзину');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } else {
      setErr('Ошибка при добавлении в корзину');
      setTimeout(() => {
        setErr('');
      }, 3000);
    }
  };

  const sortedFavorites = [...favorites].sort((a, b) => {
    const aValue = a.Art[sortField];
    const bValue = b.Art[sortField];
    const direction = sortDirection === 'asc' ? 1 : -1;

    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });

  const getSortIndicator = (field: SortField): React.ReactNode => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return (
      <div className="favorites-loading">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="favorites-error">Ошибка: {error}</div>;
  }

  return (
    <div className="center">
      <div className="favorites-container">
        {err && (
          <Alert variant="light" style={alertStyle}>
            {err}
          </Alert>
        )}
        {success && (
          <Alert variant="light" style={alertStyle}>
            {success}
          </Alert>
        )}
        <div className="favorites-header">
          {sortedFavorites.length > 0 && (
            <div className="favorites-sort">
              {(['name', 'price'] as SortField[]).map((field) => (
                <button key={field} className="favorite-button" onClick={() => handleSort(field)}>
                  {
                    {
                      name: 'Название',
                      price: 'Цена',
                    }[field]
                  }{' '}
                  {getSortIndicator(field)}
                </button>
              ))}
            </div>
          )}
        </div>

        {sortedFavorites.length > 0 ? (
          <div className="favorites-list">
            {sortedFavorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card">
                <Link to={`/art/${favorite.Art.id}`}>
                  {favorite.Art.img && (
                    <img
                      src={favorite.Art.img}
                      alt={favorite.Art.name}
                      className="favorite-image"
                    />
                  )}
                </Link>
                <div className="favorite-name">{favorite.Art.name}</div>
                <div className="favorite-content">
                  <div className="favorite-price">{favorite.Art.price} ₽</div>

                  <div className="favorite-details">
                    <div className="favorite-detail">
                      <span>
                        Размер: {favorite.Art.width}×{favorite.Art.height} см
                      </span>
                    </div>
                  </div>

                  <div className="favorite-actions">
                    <button
                      className="favorite-button favorite-buy"
                      onClick={() => addToCart(favorite.Art.id)}>
                      Купить
                    </button>
                    <button
                      className="favorite-button favorite-remove"
                      onClick={() => handleRemoveClick(favorite.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="favorite-empty">
            <p>Список избранных товаров пуст</p>
          </div>
        )}

        <Modal
          isOpen={showDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Подтверждение удаления"
          content="Вы уверены, что хотите удалить этот товар из избранного?"
          confirmText="Удалить"
          cancelText="Отменить"
        />
      </div>
    </div>
  );
};
