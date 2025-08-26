import axios, {
    type AxiosInstance,
    type AxiosResponse,
    type AxiosError,
    type InternalAxiosRequestConfig
} from 'axios';
import { AUTH_BUYER_API_ROUTES } from '../enums/buyerApiRoutes';

// Расширение InternalAxiosRequestConfig для добавления свойства sent
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    sent?: boolean;
};

// Создание экземпляра axios с базовой конфигурацией + получение URL из .env
export const axiosInstanceBuyer: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API}`,
    withCredentials: true
});

// Глобальная переменнная для хранения токена доступа
let accessTokenBuyer: string = '';

// Функция установки токена доступа
export function setAccessTokenBuyer(token: string): void {
    accessTokenBuyer = token;
}

// Интерсептор для обработки запросов (добавление HTTP заголовка)
axiosInstanceBuyer.interceptors.request.use(
    (config: ExtendedAxiosRequestConfig): ExtendedAxiosRequestConfig => {
        if (config.headers && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${accessTokenBuyer}`
        }
 // Если данные - FormData, устанавливаем правильный Content-Type
 if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
}
        return config;
    }
);

// Интерсептор для обработки ответов и ошибок
axiosInstanceBuyer.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError) => {
        //  Хранение информации о предыдущем запросе
        const prevRequest: ExtendedAxiosRequestConfig | undefined = error.config;

        // Проверка статуса ответа и метки предыдущего запроса
        if (error.response?.status === 403 && prevRequest && !prevRequest.sent) {
            try {
                // Делаем запрос для обновления пары токенов
                const response = await axiosInstanceBuyer.get(AUTH_BUYER_API_ROUTES.REFRESH_TOKENS_BUYER);

                // Получаем новый токен из ответа
                accessTokenBuyer = response.data.data.accessToken;

                // Устанавливаем метку повторного запроса
                prevRequest.sent = true;

                if (prevRequest.headers) {
                    prevRequest.headers.Authorization = `Bearer ${accessTokenBuyer}`
                }

                // Повторная отправка запроса
                return axiosInstanceBuyer(prevRequest)
            } catch (refreshError) {
                // При ошибке обновления токена очищаем токен
                accessTokenBuyer = '';
                return Promise.reject(refreshError)
            }
        }

        // Если ошибка 401 - очищаем токен
        if (error.response?.status === 401) {
            accessTokenBuyer = '';
        }

        return Promise.reject(error);
    }
);