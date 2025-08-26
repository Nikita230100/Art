import type { IArt } from '@/entities/art/model/types';

// Тип данных для задачи (когда создаем задачу)
export interface IRawCartItemData {
  cartId: number;
  artId: number;
  quantity: number;
  priceAtPurchase: number;
}

// Тип данных для задачи с id, authorId, createdAt, updatedAt
export interface ICartItem extends IRawCartItemData {
  id: number;
  art?: IArt; // Связанные данные о произведении искусства
  createdAt?: string;
  updatedAt?: string;
}

// Тип данных для массива задач
export type ArrayCartItemsType = ICartItem[];
