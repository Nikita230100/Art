import { signOutThunkBuyer } from '@/entities/buyer/api/buyerThunkApi';
import { signOutThunk } from '@/entities/seller/api/sellerThunkApi';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { NavLink } from 'react-router';
import './Header.css';
import { Heart, LogOut, ShoppingCart, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/shared/ui/Modal/Modal';

export function Header(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const seller = useAppSelector((store) => store.seller.seller);
  const buyer = useAppSelector((store) => store.buyer.buyer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBuyerMenu, setShowBuyerMenu] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowBuyerMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoutClick = (): void => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = (): void => {
    try {
      if (seller) {
        dispatch(signOutThunk());
      } else if (buyer) {
        dispatch(signOutThunkBuyer());
      }
      localStorage.removeItem('userType');
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to={CLIENT_ROUTES.HOME}>
          АртМаркет
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to={CLIENT_ROUTES.HOME}>
                Главная
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav">
            {(seller || buyer) && (
              <>
                <div className="profile-logout-group">
                  {seller && (
                    <li className="nav-item">
                      <NavLink className="nav-link" to={CLIENT_ROUTES.LK_SELLER}>
                        <div className="seller_avatar-container">
                          <img
                            className="seller_avatar"
                            src={
                              seller?.avatar
                                ? `${import.meta.env.VITE_API.replace('/api', '')}${
                                    seller.avatar
                                  }?v=${Date.now()}`
                                : '../../../public/avatar.png'
                            }
                            alt="Аватар"
                          />
                        </div>
                      </NavLink>
                    </li>
                  )}
                  {buyer && (
                    <>
                      <li className="nav-item">
                        <NavLink className="nav-link" to={CLIENT_ROUTES.CART}>
                          <ShoppingCart size={28} strokeWidth={2} absoluteStrokeWidth />
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink className="nav-link" to={CLIENT_ROUTES.FAVORITES}>
                          <Heart size={28} strokeWidth={2} absoluteStrokeWidth />
                        </NavLink>
                      </li>
                      <li className="nav-item dropdown" ref={dropdownRef}>
                        <div className="nav-link" onClick={() => setShowBuyerMenu(!showBuyerMenu)}>
                          <div className="seller_avatar-container">
                            <img
                              className="seller_avatar"
                              src={
                                buyer?.avatar
                                  ? `${import.meta.env.VITE_API.replace('/api', '')}${
                                      buyer.avatar
                                    }?v=${Date.now()}`
                                  : '../../../public/avatar.png'
                              }
                              alt="Аватар"
                            />
                          </div>
                        </div>
                        {showBuyerMenu && (
                          <div className="dropdown-menu show">
                            <NavLink
                              className="dropdown-item"
                              to={CLIENT_ROUTES.BUYER_PROFILE}
                              onClick={() => setShowBuyerMenu(false)}>
                              <User size={16} className="dropdown-icon" />
                              Профиль
                            </NavLink>
                            <NavLink
                              className="dropdown-item"
                              to={CLIENT_ROUTES.UPDATE_PROFILE_BUYER}
                              onClick={() => setShowBuyerMenu(false)}>
                              <User size={16} className="dropdown-icon" />
                              Редактировать профиль
                            </NavLink>
                          </div>
                        )}
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <button onClick={handleLogoutClick} className="nav-link btn-logout">
                      <LogOut size={32} strokeWidth={2.25} absoluteStrokeWidth />
                    </button>
                  </li>
                </div>
              </>
            )}
            {!seller && !buyer && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to={CLIENT_ROUTES.SIGN_IN}>
                    Вход
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={CLIENT_ROUTES.SIGN_UP}>
                    Регистрация
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Подтверждение выхода"
        content="Вы действительно хотите выйти из системы?"
        confirmText="Выйти"
        cancelText="Отмена"
      />
    </nav>
  );
}
