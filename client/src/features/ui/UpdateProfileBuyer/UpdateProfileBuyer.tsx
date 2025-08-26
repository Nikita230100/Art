import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { updateBuyerThunk } from '@/entities/buyer/api/buyerThunkApi';
import './UpdateProfileBuyer.css';

export default function UpdateProfileBuyer(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { buyer, loading, error } = useAppSelector((state) => state.buyer);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    avatar: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (buyer) {
      setFormData({
        username: buyer.username || '',
        email: buyer.email || '',
        phone: buyer.phone || '',
        avatar: null,
      });

      if (buyer.avatar) {
        setPreviewUrl(
          `${import.meta.env.VITE_API.replace('/api', '')}${buyer.avatar}?v=${Date.now()}`,
        );
      }
    }
  }, [buyer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    try {
      const resultAction = await dispatch(updateBuyerThunk(data)).unwrap();
      if (resultAction.data) {
        navigate(CLIENT_ROUTES.BUYER_PROFILE);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="update-profile">
      <h2>Редактирование профиля</h2>
      {error && <div className="update-profile__error">{error}</div>}
      <form onSubmit={handleSubmit} className="update-profile__form">
        <div className="update-profile__avatar">
          <img
            src={previewUrl || '../../../public/avatar.png'}
            alt="Avatar Preview"
            className="update-profile__avatar-preview"
          />
          <label className="update-profile__file-label">
            Выберите файл
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="update-profile__file-input"
            />
          </label>
        </div>

        <div className="update-profile__field">
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>

        <div className="update-profile__field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="update-profile__field">
          <label htmlFor="phone">Телефон</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="update-profile__buttons">
          <button type="submit" className="update-profile__submit" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          <button
            type="button"
            onClick={() => navigate(CLIENT_ROUTES.BUYER_PROFILE)}
            className="update-profile__cancel">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
