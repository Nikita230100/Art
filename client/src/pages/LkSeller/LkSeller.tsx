import SellerInfo from '@/widgets/SellerInfo/SellerInfo';
import ProductList from '@/widgets/ProductList/ProductList';
import OrdersList from '@/widgets/OrdersList/OrdersList';
import './LkSeller.css';
import { useState } from 'react';
export default function LkSeller(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  return (
    <div className="lk-seller-page">
      <h1>Личный кабинет продавца</h1>
      <div className="lk-seller-container">
        <div className="lk-seller-info">
          <SellerInfo />
        </div>

        <div className="lk-seller-main-content">
          <div className="tab-nav">
            <button
              onClick={() => setActiveTab('products')}
              className={`tab-nav-item ${activeTab === 'products' ? 'active' : ''}`}>
              Товары
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`tab-nav-item ${activeTab === 'orders' ? 'active' : ''}`}>
              Заказы
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'products' ? <ProductList /> : <OrdersList />}
          </div>
        </div>
      </div>
    </div>
  );
}
