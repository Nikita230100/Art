import { Outlet, Navigate } from "react-router";
import { useAuthSeller } from "../hooks/useAuthSeller";
import { CLIENT_ROUTES } from "../enums/clientRoutes";
import { useAuthBuyer } from "../hooks/useAuthBuyer";

export const GuardRouter = (): React.JSX.Element => {
    const { isAuthenticatedSeller } = useAuthSeller();
    const { isAuthenticatedBuyer } = useAuthBuyer();
    const userType = localStorage.getItem('userType');

    // Если есть информация о типе пользователя, но авторизация ещё не проверена
    if (userType && !isAuthenticatedSeller && !isAuthenticatedBuyer) {
        return <div>Checking auth...</div>;
    }

    // Если хотя бы один пользователь авторизован - разрешаем доступ
    if (isAuthenticatedSeller || isAuthenticatedBuyer) {
        return <Outlet />;
    }

    return <Navigate to={CLIENT_ROUTES.SIGN_IN} replace />;
};