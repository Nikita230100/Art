import { type ISignInData } from '@/entities/seller';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '@/shared/hooks';
import { signInThunk } from '@/entities/seller/api/sellerThunkApi';
import { changeHandler } from '@/shared/utils';
import '../SignInFormBuyer/SignInFormBuyer.css';
import { Alert } from 'react-bootstrap';

const initialValues: ISignInData = {
  email: '',
  password: '',
};

export function SignInFormSeller(): React.JSX.Element {
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

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const [error, setError] = useState('');

  const [inputs, setInputs] = useState<ISignInData>(initialValues);

  async function onSubmitHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    try {
      event.preventDefault();

      await dispatch(signInThunk(inputs)).unwrap();
      localStorage.setItem('userType', 'seller');

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
      <h1 className="signin-header">Вход в систему для продавца</h1>
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
