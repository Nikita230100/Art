import { useState } from 'react';
import type { ISignUpData } from '@/entities/seller/model/types';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/shared/hooks';
import { signUpThunk } from '@/entities/seller/api/sellerThunkApi';
import { changeHandler } from '@/shared/utils';
import { signUpThunkBuyer } from '@/entities/buyer';
import './SignUpForm.css';
import { Alert } from 'react-bootstrap';
// Тип данных для формы регистрации
interface ISignUpFormProps extends ISignUpData {
  confirmPassword: string;
  phone: string;
  role: string;
}

const initialValues: ISignUpFormProps = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  role: '',
};

export function SignUpForm(): React.JSX.Element {
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

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [inputs, setInputs] = useState<ISignUpFormProps>(initialValues);
  const [success, setSuccess] = useState('');

  async function onSubmitHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    try {
      event.preventDefault();

      if (inputs.password !== inputs.confirmPassword) {
        setError('Пароли не совпадают!');
        setTimeout(() => {
          setError('');
        }, 3000);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...signUpData } = inputs;

      if (inputs.role === 'seller') {
        const response = await dispatch(signUpThunk(signUpData)).unwrap();
        localStorage.setItem('userType', 'seller');
        if (response.statusCode === 201) {
          setSuccess('Регистрация прошла успешно!');
          setTimeout(() => {
            setSuccess('');
          }, 3000);
        }
      } else {
        const response = await dispatch(signUpThunkBuyer(signUpData)).unwrap();
        localStorage.setItem('userType', 'buyer');
        if (response.statusCode === 201) {
          setSuccess('Регистрация прошла успешно!');
          setTimeout(() => {
            setSuccess('');
          }, 3000);
        }
      }

      navigate('/');
    } catch (error: unknown) {
      const err = error as {
        statusCode?: number;
        message?: string;
        error?: string;
      };

      console.log('Error details:', {
        statusCode: err?.statusCode,
        message: err?.message,
        error: err?.error,
      });

      if (err?.error?.toLowerCase().includes('password')) {
        setError(
          'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры и спецсимволы',
        );
      } else if (err?.error?.toLowerCase().includes('email')) {
        setError('Введите корректный email адрес');
      } else if (err?.error?.toLowerCase().includes('phone')) {
        setError('Введите корректный номер телефона');
      } else {
        setError('Произошла ошибка при регистрации');
      }
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }

  return (
    <div className="signup-container">
      {error && (
        <Alert variant="light" style={alertStyle}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="light" style={alertStyle}>
          {success}
        </Alert>
      )}
      <h2 className="signup-header">Регистрация</h2>

      <form className="signup-form" onSubmit={onSubmitHandler}>
        <div className="form-input-group">
          <label className="form-label">Имя пользователя</label>
          <input
            className="form-input"
            onChange={(event) => changeHandler(event, setInputs)}
            value={inputs.username}
            name="username"
            type="text"
            placeholder="Введите ваше имя"
            autoFocus
          />
        </div>

        <div className="form-input-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            onChange={(event) => changeHandler(event, setInputs)}
            value={inputs.email}
            name="email"
            type="email"
            placeholder="example@mail.com"
          />
        </div>

        <div className="form-input-group">
          <label className="form-label">Пароль</label>
          <input
            className="form-input"
            onChange={(event) => changeHandler(event, setInputs)}
            value={inputs.password}
            name="password"
            type="password"
            placeholder="Придумайте пароль"
          />
          <p className="form-hint">
            Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры и
            спецсимволы
          </p>
        </div>

        <div className="form-input-group">
          <label className="form-label">Повторите пароль</label>
          <input
            className="form-input"
            onChange={(event) => changeHandler(event, setInputs)}
            value={inputs.confirmPassword}
            name="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
          />
        </div>

        <div className="form-input-group">
          <label className="form-label">Телефон</label>
          <input
            className="form-input"
            onChange={(event) => changeHandler(event, setInputs)}
            value={inputs.phone}
            name="phone"
            type="text"
            placeholder="+7 (999) 999-99-99"
          />
        </div>

        <div className="form-input-group">
          <label className="form-label">Роль</label>
          <select
            className="form-select"
            onChange={(event) => changeHandler(event, setInputs)}
            value={inputs.role}
            name="role"
            required>
            <option value="">Выберите роль</option>
            <option value="seller">Продавец</option>
            <option value="buyer">Покупатель</option>
          </select>
        </div>

        <button
          className="submit-button"
          type="submit"
          disabled={
            inputs.username === '' ||
            inputs.email === '' ||
            inputs.password === '' ||
            inputs.confirmPassword === '' ||
            inputs.role === ''
          }>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
