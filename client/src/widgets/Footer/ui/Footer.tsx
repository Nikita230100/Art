import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { Mail, Info, Bell } from 'lucide-react';
import styles from './Footer.module.css';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Alert } from 'react-bootstrap';
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsModalOpen(true);
    setEmail('');
  };
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
  const handleClose = (): void => {
    setIsModalOpen(false);
    setSuccess('Подписка отменена');
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  return (
    <footer className={styles.footer}>
      {success && <Alert style={alertStyle}>{success}</Alert>}
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <NavLink to={CLIENT_ROUTES.HOME} className={styles.logo}>
              <span className={styles.logoPrimary}>Art</span>Market
            </NavLink>
            <p className={styles.description}>
              Маркетплейс искусства для дизайнеров интерьера и ценителей искусства
            </p>
            <p className={styles.copyright}>&copy; {currentYear} ArtMarket. Все права защищены.</p>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>
              <Info className={styles.sectionTitleIcon} /> Помощь
            </h3>
            <nav className={styles.nav}>
              <NavLink to={CLIENT_ROUTES.NOT_FOUND} className={styles.link}>
                Доставка и оплата
              </NavLink>
              <NavLink to={CLIENT_ROUTES.NOT_FOUND} className={styles.link}>
                Возврат и обмен
              </NavLink>
              <NavLink to={CLIENT_ROUTES.NOT_FOUND} className={styles.link}>
                Частые вопросы
              </NavLink>
              <NavLink to={CLIENT_ROUTES.NOT_FOUND} className={styles.link}>
                Отзывы клиентов
              </NavLink>
            </nav>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>
              <Mail className={styles.sectionTitleIcon} /> Контакты
            </h3>
            <address className={styles.address}>
              <p>
                Email:{' '}
                <a
                  href="mailto:info@artmarket.com"
                  style={{ color: 'blue', textDecoration: 'underline' }}>
                  info@artmarket.com
                </a>
              </p>
              <p>
                Телефон:{' '}
                <a href="tel:+79991234567" style={{ color: 'blue', textDecoration: 'underline' }}>
                  +7 (999) 123-45-67
                </a>
              </p>

              <p>Адрес: г. Москва, ул. Арбат, 10</p>
              <div className={styles.social}>
                <p className={styles.socialTitle}>Соцсети:</p>
                <div className={styles.socialLinks}>
                  <a
                    href="https://pinterest.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}>
                    Pinterest
                  </a>
                </div>
              </div>
            </address>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>
              <Bell className={styles.sectionTitleIcon} /> Подписка
            </h3>
            <p className={styles.description}>
              Получайте подборки картин под ваш стиль раз в неделю
            </p>
            <form onSubmit={handleSubmit} className={styles.subscribeForm}>
              <input
                type="email"
                placeholder="Ваш email"
                className={styles.subscribeInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.subscribeButton}>
                Подписаться
              </button>
            </form>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={() => setIsModalOpen(false)}
        title="Подписка оформлена"
        content="Спасибо! Вы успешно подписались на наши новости."
        confirmText="Закрыть"
        cancelText="Отменить подписку"
      />
    </footer>
  );
};

export default Footer;
