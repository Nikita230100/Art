import { useRef, useState, useEffect } from "react";
import "./CartItemList.css";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {
  getAllItemsInOneCartThunk,
  deleteCartItemThunk,
  updateCartItemThunk,
} from "@/entities/cartItem/api/cartItemThunkApi";
import { Modal } from "@/shared/ui/Modal/Modal";

interface CartItemListProps {
  cartId: number;
}

export function CartItemList({ cartId }: CartItemListProps): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cartItem } = useAppSelector((state) => state.cartItem);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cartItemToDelete, setCartItemToDelete] = useState<number | null>(null);
  const [qty, setQty] = useState<Record<number, number>>({});

  useEffect(() => {
    const CartItems = async (): Promise<void> => {
      try {
        setIsLoading(true);
        await dispatch(getAllItemsInOneCartThunk(cartId)).unwrap();
      } catch (err) {
        console.error("Failed to fetch cart items:", err);
        setError("Failed to fetch cart items");
      } finally {
        setIsLoading(false);
      }
    };
    CartItems();
  }, [dispatch, cartId]);

  useEffect(() => {
    if (cartItem) {
      const initialQty = cartItem.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {} as Record<number, number>);
      setQty(initialQty);
    }
  }, [cartItem]);

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await dispatch(deleteCartItemThunk(id)).unwrap();
      setIsDeleteModalOpen(false);
      setCartItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete item from cart:", error);
    }
  };

  const handleQuantityChange = (id: number, value: number): void => {
    setQty((prev) => ({
      ...prev,
      [id]: Math.max(1, value),
    }));
  };

  const updateQuantity = async (id: number): Promise<void> => {
    try {
      const itemToUpdate = cartItem?.find((item) => item.id === id);
      if (!itemToUpdate) return;

      await dispatch(
        updateCartItemThunk({
          id: itemToUpdate.id,
          cartId: itemToUpdate.cartId,
          artId: itemToUpdate.artId,
          quantity: qty[id],
          priceAtPurchase: itemToUpdate.priceAtPurchase,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleScroll = (): void => {
    if (scrollContainerRef.current) {
      setShowLeftButton(scrollContainerRef.current.scrollLeft > 0);
    }
  };

  const scrollLeft = (): void => {
    if (scrollContainerRef.current) {
      const cardWidth = 280;
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 3,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (): void => {
    if (scrollContainerRef.current) {
      const cardWidth = 280;
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 3,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return <div className="loading">Загрузка корзины...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <div className="cart-list-container">
        <div className="cart-header">
          <h2>Товары в корзине</h2>
        </div>

        <div className="cart-scroll-area">
          {showLeftButton && (
            <button
              className="scroll-button left"
              onClick={scrollLeft}
              aria-label="Показать предыдущие товары"
            >
              &lt;
            </button>
          )}

          <div
            className="cart-scroll-container"
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            {cartItem?.length === 0 ? (
              <div className="empty-cart">Ваша корзина пуста</div>
            ) : (
              cartItem?.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-image-container">
                    <img
                      src={item.art?.img}
                      alt={item.art?.name}
                      className="cart-item-image"
                      onClick={() => navigate(`/product/${item.artId}`)}
                    />
                  </div>
                  <div className="cart-item-info">
                    <h3 className="cart-item-title">{item.art?.name}</h3>
                    <p className="cart-item-price">{item.art?.price} ₽</p>

                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleQuantityChange(item.id, qty[item.id] - 1)
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={qty[item.id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        onBlur={() => updateQuantity(item.id)}
                        className="quantity-input"
                      />
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleQuantityChange(item.id, qty[item.id] + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <p className="cart-item-total">
                      Итого:{" "}
                      {(item.art?.price || 0) * (qty[item.id] || item.quantity)}{" "}
                      ₽
                    </p>
                  </div>

                  <div className="cart-item-actions">
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setCartItemToDelete(item.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItem?.length > 3 && (
            <button
              className="scroll-button right"
              onClick={scrollRight}
              aria-label="Показать следующие товары"
            >
              &gt;
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCartItemToDelete(null);
        }}
        onConfirm={() => cartItemToDelete && handleDelete(cartItemToDelete)}
        title="Удалить товар из корзины"
        content="Вы уверены, что хотите удалить этот товар из корзины?"
        confirmText="Удалить"
        cancelText="Отменить"
      />
    </>
  );
}
