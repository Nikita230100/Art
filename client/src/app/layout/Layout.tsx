import { Footer, Header } from '@/widgets';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { Outlet } from 'react-router';
import { refreshTokensThunkBuyer } from '@/entities/buyer';
import { refreshTokensThunk } from '@/entities/seller/api/sellerThunkApi';

export function Layout(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { seller } = useAppSelector((state) => state.seller);
  const { buyer } = useAppSelector((state) => state.buyer);

  useEffect(() => {
    const userType = localStorage.getItem('userType');

    if (userType === 'seller' || seller) {
      dispatch(refreshTokensThunk());
    } else if (userType === 'buyer' || buyer) {
      dispatch(refreshTokensThunkBuyer());
    }
  }, [dispatch]);

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
