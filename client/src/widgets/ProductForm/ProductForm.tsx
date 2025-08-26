import { useState } from 'react';
import styles from './ProductForm.module.css';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { createArtThunk } from '@/entities/art/api/artThunkApi';
import { Alert } from 'react-bootstrap';
// Моковые данные для селектов
const PRODUCT_TYPES = [
  'Картина',
  'Статуэтка',
  'Скульптура',
  'Фотография',
  'Графика',
  'Принт',
  'Коллаж',
  'Инсталляция',
  'Декоративное панно',
  'Репродукция',
];

const STYLES = [
  'Абстракция',
  'Реализм',
  'Минимализм',
  'Импрессионизм',
  'Экспрессионизм',
  'Поп-арт',
  'Сюрреализм',
  'Кубизм',
  'Модерн',
  'Концептуализм',
  'Граффити',
  'Классицизм',
  'Романтизм',
  'Барокко',
  'Ренессанс',
];

const MATERIALS = [
  'Холст',
  'Бумага',
  'Керамика',
  'Металл',
  'Дерево',
  'Мрамор',
  'Бронза',
  'Гипс',
  'Стекло',
  'Текстиль',
  'Акрил',
  'Масло',
  'Акварель',
  'Гуашь',
  'Пастель',
  'Темпера',
  'Смешанная техника',
];

const COLORS = [
  { hex: '#FF0000', name: 'Красный' },
  { hex: '#00FF00', name: 'Зеленый' },
  { hex: '#0000FF', name: 'Синий' },
  { hex: '#FFFF00', name: 'Желтый' },
  { hex: '#FF00FF', name: 'Пурпурный' },
  { hex: '#00FFFF', name: 'Голубой' },
  { hex: '#000000', name: 'Черный' },
  { hex: '#FFFFFF', name: 'Белый' },
  { hex: '#808080', name: 'Серый' },
  { hex: '#FFA500', name: 'Оранжевый' },
  { hex: '#800080', name: 'Фиолетовый' },
  { hex: '#A52A2A', name: 'Коричневый' },
  { hex: '#FFC0CB', name: 'Розовый' },
  { hex: '#F5F5DC', name: 'Бежевый' },
  { hex: '#40E0D0', name: 'Бирюзовый' },
  { hex: '#FFD700', name: 'Золотой' },
  { hex: '#C0C0C0', name: 'Серебряный' },
];

const INITIAL_INPUTS_DATA = {
  type: '',
  name: '',
  description: '',
  width: '',
  height: '',
  depth: '',
  mainColor: '',
  style: '',
  material: '',
  quantity: '',
  price: '',

  isLimitedEdition: false,
};

import type { IArt } from '@/entities/art/model/types';

interface ProductFormProps {
  initialData?: IArt;
  onSubmit?: (formData: IArt, file?: File) => Promise<void>;
  submitButtonText?: string;
  title?: string;
}

export default function ProductForm({
  initialData,
  onSubmit,
  submitButtonText = 'Добавить товар',
  title = 'Добавление нового товара',
}: ProductFormProps): React.JSX.Element {
  const [inputs, setInputs] = useState(initialData || INITIAL_INPUTS_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialData?.img || null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (): void => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Обработчик изменения полей формы
  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const { name, value, type } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : name === 'price' || name === 'quantity' || name === 'width' || name === 'height'
          ? Number(value)
          : value,
    }));
  };

  // Обработчик выбора цвета
  const handleColorSelect = (color: { hex: string; name: string }): void => {
    setInputs((prev) => ({
      ...prev,
      mainColor: color.name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Проверяем обязательные поля
      const requiredFields = ['type', 'name', 'width', 'height', 'price'];
      const missingFields = requiredFields.filter((field) => !inputs[field as keyof typeof inputs]);

      if (missingFields.length > 0) {
        throw new Error(`Пожалуйста, заполните все обязательные поля: ${missingFields.join(', ')}`);
        setSuccess('Пожалуйста, заполните все обязательные поля');
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }

      // Проверяем числовые поля
      const numericFields = ['width', 'height', 'depth', 'price', 'quantity'];
      const invalidFields = numericFields.filter((field) => {
        const value = inputs[field as keyof typeof inputs];
        return value === '' || Number(value) <= 0;
      });

      if (invalidFields.length > 0) {
        throw new Error(
          `Пожалуйста, укажите корректные значения для полей: ${invalidFields.join(', ')}`,
        );
      }

      // Преобразуем данные в формат IRawArtData
      const artData = {
        type: inputs.type,
        name: inputs.name,
        description: inputs.description,
        width: Number(inputs.width),
        height: Number(inputs.height),
        depth: Number(inputs.depth),
        mainColor: inputs.mainColor,
        style: inputs.style,
        material: inputs.material,
        quantity: Number(inputs.quantity),
        price: Number(inputs.price),
        isLimitedEdition: inputs.isLimitedEdition,
      };

      // Получаем файл, если он есть
      const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (onSubmit) {
        await onSubmit(artData as IArt, file);
      } else {
        const response = await dispatch(createArtThunk({ artData, file })).unwrap();
        // если успешно добавлен, то выводим сообщение и перенаправляем на страницу с товарами
        if (response.statusCode === 201) {
          setSuccess('Товар успешно добавлен');
          setTimeout(() => {
            setSuccess('');
          }, 3000);
          navigate('/lk-seller');
        } else {
          setError('Произошла ошибка при добавлении товара');
          setTimeout(() => {
            setError('');
          }, 3000);
        }
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании товара');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.productFormContainer}>
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
      <div className={styles.productFormHeader}>
        <h2 className={styles.productFormTitle}>{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.productForm}>
        <div className={styles.formGrid}>
          {/* Колонка с изображением */}
          <div className={styles.imageColumn}>
            <div className={styles.imageUpload}>
              {preview ? (
                <img src={preview} alt="Превью товара" className={styles.imagePreview} />
              ) : (
                <div className={styles.imagePlaceholder}>Изображение товара</div>
              )}
              <div className={styles.uploadContainer}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" className={styles.uploadButton}>
                  {preview ? 'Изменить изображение' : 'Загрузить изображение'}
                </label>
              </div>
              {error && <p className={styles.errorText}>{error}</p>}
            </div>
          </div>

          {/* Колонка с формой */}
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="type">Тип товара</label>
              <select id="type" name="type" value={inputs.type} onChange={onChangeHandler} required>
                <option value="">Выберите тип</option>
                {PRODUCT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="name">Название товара</label>
              <input
                type="text"
                id="name"
                name="name"
                value={inputs.name}
                onChange={onChangeHandler}
                required
                placeholder="Например: Картина 'Рассвет'"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                value={inputs.description}
                onChange={onChangeHandler}
                rows={4}
                placeholder="Подробное описание товара..."
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="width">Ширина (см)</label>
                <input
                  type="number"
                  id="width"
                  name="width"
                  value={inputs.width}
                  onChange={onChangeHandler}
                  min="1"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="height">Высота (см)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={inputs.height}
                  onChange={onChangeHandler}
                  min="1"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="depth">Глубина (см)</label>
                <input
                  type="number"
                  id="depth"
                  name="depth"
                  value={inputs.depth}
                  onChange={onChangeHandler}
                  min="1"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="style">Стиль</label>
              <select
                id="style"
                name="style"
                value={inputs.style}
                onChange={onChangeHandler}
                required>
                <option value="">Выберите стиль</option>
                {STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="material">Материал</label>
              <select
                id="material"
                name="material"
                value={inputs.material}
                onChange={onChangeHandler}
                required>
                <option value="">Выберите материал</option>
                {MATERIALS.map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Основной цвет</label>
              <div className={styles.colorPickerContainer}>
                <div className={styles.colorPalette}>
                  {COLORS.map((color) => (
                    <div
                      key={color.hex}
                      className={`${styles.colorRectangle} ${
                        inputs.mainColor === color.name ? styles.selected : ''
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColorSelect(color)}
                      title={color.name}>
                      {inputs.mainColor === color.name && (
                        <span className={styles.checkIcon}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price">Цена (₽)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={inputs.price}
                  onChange={onChangeHandler}
                  required
                  min="1"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="quantity">Количество</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={inputs.quantity}
                  onChange={onChangeHandler}
                  min="1"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isLimitedEdition"
                  checked={inputs.isLimitedEdition}
                  onChange={onChangeHandler}
                />
                Ограниченный тираж
              </label>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={() => navigate(-1)} className={styles.cancelButton}>
            Отмена
          </button>
          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? 'Сохранение...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
