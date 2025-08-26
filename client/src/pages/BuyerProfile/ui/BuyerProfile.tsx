import { useState } from 'react';
import { ShoppingCart, Heart, Clock, BarChart2, List } from 'lucide-react';
import { CartPage } from '@/pages/CartPage';
import { Subscriptions } from '@/widgets/Subscriptions';
import { Favorites } from '@/widgets/Favorites';
import { Orders } from '@/widgets/Orders';
import { Analytics } from '@/widgets/Analytics';
import './BuyerProfile.css';
import BuyerInfo from '@/widgets/BuyerInfo/BuyerInfo';

export const BuyerProfile = (): React.ReactNode => {
  const [activeTab, setActiveTab] = useState('cart');

  return (
    <div className="profile">
      <div className="profile__content">
        <div className="profile__main-content">
          <div>
            <BuyerInfo />

            <nav className="tabs">
              <button
                onClick={() => setActiveTab('cart')}
                className={`tabs__button ${activeTab === 'cart' ? 'tabs__button--active' : ''}`}>
                <ShoppingCart size={20} />
                <span>Корзина</span>
              </button>
              <button
                className={`tabs__button ${
                  activeTab === 'subscriptions' ? 'tabs__button--active' : ''
                }`}>
                <List size={20} />
                <span>Мои подписки</span>
                <span className="soon">скоро</span>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`tabs__button ${
                  activeTab === 'favorites' ? 'tabs__button--active' : ''
                }`}>
                <Heart size={20} />
                <span>Избранное</span>
              </button>
              <button
                className={`tabs__button ${activeTab === 'orders' ? 'tabs__button--active' : ''}`}>
                <Clock size={20} />
                <span>История заказов</span>
                <span className="soon">скоро</span>
              </button>
              <button
                className={`tabs__button ${
                  activeTab === 'analytics' ? 'tabs__button--active' : ''
                }`}>
                <BarChart2 size={20} />
                <span>Аналитика</span>
                <span className="soon">скоро</span>
              </button>
            </nav>
          </div>

          <div className="tab-content">
            {activeTab === 'cart' && <CartPage />}
            {activeTab === 'subscriptions' && <Subscriptions />}
            {activeTab === 'favorites' && <Favorites />}
            {activeTab === 'orders' && <Orders />}
            {activeTab === 'analytics' && <Analytics />}
          </div>
        </div>
      </div>
    </div>
  );
};
