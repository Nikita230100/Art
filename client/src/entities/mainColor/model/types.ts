export interface IMainColor {
  id: number;
  artId: number;
  colorId: number;
  Color: IColor;
}

export interface IColor {
  id: number;
  name: string;
  hex: string;
  pantone: string;
}
export type ArrayMainColorsType = IMainColor[];
