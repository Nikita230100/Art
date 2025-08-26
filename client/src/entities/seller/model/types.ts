// Тип данных для авторизации пользователя
export interface ISignInData {
  email: string;
  password: string;
}

// Тип данных для регистрации пользователя
export interface ISignUpData extends ISignInData {
  username: string;
}

// Тип данных для пользователя
export type SellerType = {
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
  role: 'buyer' | 'seller';
  accessToken?: string;
  refreshToken?: string;
};

// Тип данных для пользователя с токеном
export type SellerWithTokenType = {
  seller: SellerType | null;
  accessToken: string;
};
