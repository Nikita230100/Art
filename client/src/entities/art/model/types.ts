// Тип данных для задачи (когда создаем задачу)
export interface IRawArtData {
  type: string;
  name: string;
  description: string;
  width: number;
  height: number;
  depth: number;
  mainColor: string;
  style: string;
  material: string;
  quantity: number;
  price: number;
  isLimitedEdition: boolean;
}

// Тип данных для задачи с id, authorId, createdAt, updatedAt
export interface IArt extends IRawArtData {
  id: number;
  img?: string;
  artistId?: number;
  isSold?: boolean;
  isActive?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Тип данных для массива задач
export type ArrayArtsType = IArt[];
