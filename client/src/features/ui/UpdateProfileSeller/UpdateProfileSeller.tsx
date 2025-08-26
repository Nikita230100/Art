import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { useNavigate } from 'react-router';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { useRef, useState } from 'react';
import './UpdateProfileSeller.css';
import { useAppDispatch } from '@/shared/hooks';
import { updateSellerThunk } from '@/entities/seller/api/sellerThunkApi';
import { Alert } from 'react-bootstrap';

export default function UpdateProfileSeller(): React.JSX.Element {
  const { seller } = useAppSelector((state) => state.seller);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [formData, setFormData] = useState({
    username: seller?.username || '',
    email: seller?.email || '',
    phone: seller?.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(
    seller?.avatar
      ? `${import.meta.env.VITE_API.replace('/api', '')}${seller.avatar}?v=${Date.now()}`
      : '../../../public/avatar.png',
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>): void => {
          if (event.target?.result) {
            setAvatarPreview(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Ошибка при загрузке изображения');
        console.error('Error loading image:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!seller?.id) {
      setError('Продавец не найден');
      setTimeout(() => {
        setError('');
      }, 3000);
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);

      if (fileInputRef.current?.files?.[0]) {
        formDataToSend.append('avatar', fileInputRef.current.files[0]);
      } else if (seller.avatar) {
        formDataToSend.append('avatarUrl', seller.avatar);
      }

      const response = await dispatch(
        updateSellerThunk({
          id: seller.id.toString(),
          sellerData: formDataToSend,
        }),
      ).unwrap();

      if (response.statusCode === 200) {
        setError('Профиль успешно обновлен');
        setTimeout(() => {
          setError('');
        }, 3000);
        navigate(CLIENT_ROUTES.LK_SELLER);
      } else {
        setError('Произошла ошибка при обновлении профиля');
        setTimeout(() => {
          setError('');
        }, 3000);
      }

      dispatch({
        type: 'seller/updateProfile',
        payload: {
          username: formData.username,
          phone: formData.phone,
          email: formData.email,
          avatar: avatarPreview.includes('blob:') ? seller?.avatar : avatarPreview,
        },
      });

      navigate(CLIENT_ROUTES.LK_SELLER);
    } catch (err) {
      setError('Ошибка при обновлении профиля');
      console.error('Update error:', err);
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="update-profile-container">
      <h1>Редактирование профиля</h1>
      {error && (
        <Alert variant="light" style={alertStyle}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="update-profile-form">
        <div className="form-group">
          <label>Аватар</label>
          <div className="avatar-upload">
            <img
              src={avatarPreview || '../../../public/avatar.png'}
              alt="Аватар"
              className="avatar-preview"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              id="avatar-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="avatar-upload" className="avatar-upload-button">
              Выбрать изображение
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={30}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Телефон</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="\+?[\d\s-]{10,}"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(CLIENT_ROUTES.LK_SELLER)}
            className="cancel-button"
            disabled={isLoading}>
            Отмена
          </button>
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
}
