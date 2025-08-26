// Тип данных для авторизации пользователя
export interface ISignInData {
  email: string;
  password: string;
}

// Тип данных для регистрации пользователя
export interface ISignUpData extends ISignInData {
  username: string;
  phone: string;
}

// Тип данных для пользователя
export type BuyerType = {
  id: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
};

// Тип данных для пользователя с токеном
export type BuyerWithTokenType = {
  buyer: BuyerType | null;
  accessToken: string;
};
