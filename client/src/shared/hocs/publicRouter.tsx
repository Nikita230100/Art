import { Outlet, Navigate } from "react-router";
import { useAuthSeller } from "../hooks/useAuthSeller";
import { CLIENT_ROUTES } from "../enums/clientRoutes";

import { useAuthBuyer } from "../hooks/useAuthBuyer";

// Компонент для защиты публичных маршрутов
export const PublicRouter = (): React.JSX.Element => {
    const { isAuthenticatedSeller } = useAuthSeller();
    const { isAuthenticatedBuyer } = useAuthBuyer();
    const userType = localStorage.getItem('userType');

    // Если есть информация о типе пользователя, но авторизация ещё не проверена
    if (userType && !isAuthenticatedSeller && !isAuthenticatedBuyer) {
        return <div>Checking auth...</div>;
    }

    // Если любой пользователь авторизован - редирект
    if (isAuthenticatedSeller || isAuthenticatedBuyer) {
        return <Navigate to={CLIENT_ROUTES.HOME} replace />;
    }

    return <Outlet />
};