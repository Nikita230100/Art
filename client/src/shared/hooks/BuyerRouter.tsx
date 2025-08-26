import { Outlet, Navigate } from "react-router";
import { CLIENT_ROUTES } from "../enums/clientRoutes";
import { useAuthBuyer } from "../hooks/useAuthBuyer";
import { useAppSelector } from "../hooks/useAppSelector";

export const BuyerRouter = (): React.JSX.Element => {
    const { isAuthenticatedBuyer } = useAuthBuyer();
    const { isInitializedBuyer } = useAppSelector((store) => store.buyer);
    const userType = localStorage.getItem('userType');

    // Если тип пользователя не buyer - сразу редирект
    if (userType && userType !== 'buyer') {
        return <Navigate to={CLIENT_ROUTES.HOME} replace />;
    }

    // Если ещё не инициализировано, но в localStorage есть buyer
    if (!isInitializedBuyer && userType === 'buyer') {
        return <div>Loading buyer...</div>;
    }

    return isAuthenticatedBuyer ? <Outlet /> : <Navigate to={CLIENT_ROUTES.SIGN_IN} replace />;
};