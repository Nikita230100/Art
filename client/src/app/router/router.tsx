import { BrowserRouter, Routes, Route } from 'react-router';
import { HomePage, NotFound, SignInPage, SignUpPage, BuyerProfile } from '@/pages';
import { Layout } from '../layout/Layout';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { GuardRouter, PublicRouter } from '@/shared/hocs';
import { ArtListTest } from '@/entities/art/ui/ArtListTest';
import { SellerRouter } from '@/shared/hooks/SellerRouter';
import LkSeller from '@/pages/LkSeller/LkSeller';
import ProductForm from '@/widgets/ProductForm/ProductForm';
import EditProductForm from '@/widgets/ProductForm/EditProductForm';
import UpdateProfileSeller from '@/features/ui/UpdateProfileSeller/UpdateProfileSeller';
import { BuyerRouter } from '@/shared/hooks/BuyerRouter';
import OneArtPage from '@/pages/OneArtPage';
import { CartPage } from '@/pages/CartPage/ui/CartPage';
import UpdateProfileBuyer from '@/features/ui/UpdateProfileBuyer/UpdateProfileBuyer';
import { Favorites } from '@/widgets';

// Роутер
export function Router(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={CLIENT_ROUTES.HOME} element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path={CLIENT_ROUTES.ONE_ART} element={<OneArtPage />} />
          {/* Публичные маршруты */}
          <Route element={<PublicRouter />}>
            <Route path={CLIENT_ROUTES.SIGN_IN} element={<SignInPage />} />
            <Route path={CLIENT_ROUTES.SIGN_UP} element={<SignUpPage />} />
            <Route path={CLIENT_ROUTES.ART_LIST} element={<ArtListTest />} />
          </Route>

          {/* Приватные маршруты */}
          <Route element={<GuardRouter />}></Route>

          {/* Маршруты только для продавцов */}
          <Route element={<SellerRouter />}>
            <Route path={CLIENT_ROUTES.LK_SELLER} element={<LkSeller />} />
            <Route path={CLIENT_ROUTES.PRODUCT_FORM} element={<ProductForm />} />
            <Route path={`${CLIENT_ROUTES.PRODUCT_FORM}/:id`} element={<EditProductForm />} />
            <Route path={CLIENT_ROUTES.UPDATE_PROFILE_SELLER} element={<UpdateProfileSeller />} />
          </Route>

          {/* Маршруты только для покупателей */}
          <Route element={<BuyerRouter />}>
            <Route path={CLIENT_ROUTES.CART} element={<CartPage />} />
            <Route path={CLIENT_ROUTES.BUYER_PROFILE} element={<BuyerProfile />} />
            <Route path={CLIENT_ROUTES.FAVORITES} element={<Favorites />} />
            <Route path={CLIENT_ROUTES.UPDATE_PROFILE_BUYER} element={<UpdateProfileBuyer />} />
          </Route>

          <Route path={CLIENT_ROUTES.NOT_FOUND} element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
