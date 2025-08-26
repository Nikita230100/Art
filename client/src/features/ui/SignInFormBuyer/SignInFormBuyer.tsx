import { type ISignInData } from '@/entities/buyer';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/shared/hooks';
import { changeHandler } from '@/shared/utils';
import { signInThunkBuyer } from '@/entities/buyer';
import './SignInFormBuyer.css';
import { Alert } from 'react-bootstrap';

// Начальные значения для формы авторизации
const initialValues: ISignInData = {
  email: '',
  password: '',
};

export function SignInFormBuyer(): React.JSX.Element {
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

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [inputs, setInputs] = useState<ISignInData>(initialValues);

  async function onSubmitHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    try {
      event.preventDefault();

      await dispatch(signInThunkBuyer(inputs)).unwrap();
      localStorage.setItem('userType', 'buyer');

      navigate('/');
    } catch (error: unknown) {
      const err = error as {
        statusCode?: number;
        message?: string;
        error?: string;
      };
      if (err?.statusCode === 400 || err?.error === 'Invalid password') {
        setError('Неверный логин или пароль');
      } else {
        setError('Произошла ошибка при входе');
      }
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }

  return (
    <div className="signin-buyer-container">
      {error && (
        <Alert variant="light" style={alertStyle}>
          {error}
        </Alert>
      )}
      <h1 className="signin-header">Вход в систему для покупателя</h1>
      <form className="signin-buyer-form" onSubmit={onSubmitHandler}>
        <div className="signin-buyer-input-group">
          <label className="signin-buyer-label">Email</label>
          <input
            className="signin-buyer-input"
            onChange={(event) => changeHandler(event, setInputs)}
            value={inputs.email}
            name="email"
            type="email"
            placeholder="Введите ваш email"
            autoFocus
            required
          />
        </div>

        <div className="signin-buyer-input-group">
          <label className="signin-buyer-label">Пароль</label>
          <input
            className="signin-buyer-input"
            onChange={(event) => changeHandler(event, setInputs)}
            value={inputs.password}
            name="password"
            type="password"
            placeholder="Введите пароль"
            required
          />
        </div>

        <button
          className="signin-buyer-button"
          type="submit"
          disabled={inputs.email === '' || inputs.password === ''}>
          Войти
        </button>
      </form>
    </div>
  );
}
