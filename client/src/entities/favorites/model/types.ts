import type { IArt } from '@/entities/art/model/types';

export interface IFavorite {
  id: number;
  userId: number;
  artId: number;
  Art: IArt;
}

export interface IFavoriteAdd {
  artId: number;
}

export type ArrayFavoritesType = IFavorite[];
