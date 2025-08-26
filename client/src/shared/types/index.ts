// Тип данных для успешного ответа от сервера
export interface IApiResponseSuccess<T> {
  data: T;
  message: string;
  statusCode: number;
  error: null;
}

// Тип данных для ответа от сервера в случае ошибки
export interface IApiResponseReject {
  data: null;
  message: string;
  statusCode: number;
  error: string;
}
