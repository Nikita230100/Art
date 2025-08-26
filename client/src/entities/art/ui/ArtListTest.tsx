// файл сгенерирован Курсором целиком

import { useEffect } from 'react';
import { getArtsThunk } from '@/entities/art/api/artThunkApi';
import type { IArt } from '../model/types';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { Loader } from '@/shared/ui/Loader/Loader';
import { createCartItemThunk } from '@/entities/cartItem/api/cartItemThunkApi';
import { getCartThunk } from '@/entities/cart/api/cartThunkApi';

export const ArtListTest = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { arts, isLoading } = useAppSelector((state) => state.art);

  useEffect(() => {
    dispatch(getArtsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  const handleAddToCart = (art: IArt): void => {
    dispatch(
      createCartItemThunk({
        cartId: 1,
        artId: art.id,
        quantity: 1,
        priceAtPurchase: art.price,
      }),
    );
  };

  return (
    <div>
      <h2>Art List</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <ul
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
          }}>
          {arts.map((art: IArt) => (
            <li
              key={art.id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '8px',
              }}>
              <div>
                <img
                  src={art.img}
                  alt={art.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              </div>
              <h3>{art.name}</h3>
              <p>{art.description}</p>
              <p>Price: ${art.price}</p>
              <p>ширина: {art.width}</p>
              <p>высота: {art.height}</p>
              <p>материал: {art.material}</p>
              <p>цвет: {art.mainColor}</p>
              <p>тип: {art.type}</p>
              <p>стиль: {art.style}</p>

              {art.img && (
                <img
                  src={art.img}
                  alt={art.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              )}
              <button onClick={() => handleAddToCart(art)}>Добавить в корзину</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
