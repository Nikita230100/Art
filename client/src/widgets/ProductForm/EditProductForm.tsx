import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { updateArtThunk } from '@/entities/art/api/artThunkApi';
import ProductForm from './ProductForm';
import type { IArt } from '@/entities/art/model/types';
import { Alert } from 'react-bootstrap';
export default function EditProductForm(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

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

  const art = useAppSelector((state) => state.art.arts.find((art) => art.id === Number(id)));

  useEffect(() => {
    if (!art) {
      setError('Произведение не найдено');
    }
    setIsLoading(false);
  }, [art]);

  const handleSubmit = async (formData: IArt, file?: File): Promise<void> => {
    try {
      if (!art) return;
      const updatedArt: IArt = {
        ...art,
        ...formData,
      };

      const response = await dispatch(updateArtThunk({ artData: updatedArt, file })).unwrap();

      if (response.statusCode === 200) {
        setSuccess('Товар успешно обновлен');
        setTimeout(() => {
          setSuccess('');
        }, 3000);
        navigate('/lk-seller');
      } else {
        setError('Произошла ошибка при обновлении товара');
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating art:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при обновлении товара');
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!art) {
    return <div>Произведение не найдено</div>;
  }

  return (
    <div>
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
      <ProductForm
        initialData={art}
        onSubmit={handleSubmit}
        submitButtonText="Сохранить изменения"
        title="Редактирование товара"
      />
    </div>
  );
}
