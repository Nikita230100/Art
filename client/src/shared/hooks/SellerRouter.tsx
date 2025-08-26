import { Outlet, Navigate } from "react-router";
import { CLIENT_ROUTES } from "../enums/clientRoutes";
import { useAuthSeller } from "../hooks/useAuthSeller";
import { useAppSelector } from "../hooks/useAppSelector";

export const SellerRouter = (): React.JSX.Element => {
    const { isAuthenticatedSeller } = useAuthSeller();
    const { isInitialized } = useAppSelector((store) => store.seller);
    const userType = localStorage.getItem('userType');

    // Если тип пользователя не seller - сразу редирект
    if (userType && userType !== 'seller') {
        return <Navigate to={CLIENT_ROUTES.HOME} replace />;
    }

    // Если ещё не инициализировано, но в localStorage есть seller
    if (!isInitialized && userType === 'seller') {
        return <div>Loading seller...</div>;
    }

    return isAuthenticatedSeller ? <Outlet /> : <Navigate to={CLIENT_ROUTES.SIGN_IN} replace />;
};