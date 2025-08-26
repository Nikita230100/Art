// Тип для элемента корзины
export interface ICartItem {
  id: number;
  artId: number;
  quantity: number;
  price: number;
  sum: number;
  Art: {
    id: number;
    name: string;
    img: string;
    price: number;
  };
}

// Тип для всей корзины
export interface ICart {
  items: ICartItem[];
  total: number;
  artId?: number;
}

// Тип состояния корзины в Redux
export type CartState = {
  data: ICart | null;
  isLoading: boolean;
  error: string | null;
};
