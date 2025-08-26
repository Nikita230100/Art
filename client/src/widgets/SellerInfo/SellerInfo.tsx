import { useAppSelector } from '@/shared/hooks/useAppSelector';
import './SellerInfo.css';
import { useNavigate } from 'react-router';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';

export default function SellerInfo(): React.JSX.Element {
  const { seller } = useAppSelector((state) => state.seller);
  const navigate = useNavigate();
  return (
    <>
      <div className="seller-info">
        <div className="seller-info__avatar-container">
          <img
            className="seller-info__avatar"
            src={
              seller?.avatar
                ? `${import.meta.env.VITE_API.replace('/api', '')}${seller.avatar}?v=${Date.now()}`
                : '../../../public/avatar.png'
            }
            alt="Аватар"
          />
        </div>
        <h1>{seller?.username}</h1>
        <p>{seller?.email}</p>
        <p>{seller?.phone}</p>
      </div>
      <div>
        <button
          className="seller-info__button"
          onClick={() => navigate(CLIENT_ROUTES.UPDATE_PROFILE_SELLER)}>
          Редактировать профиль
        </button>
      </div>
    </>
  );
}
