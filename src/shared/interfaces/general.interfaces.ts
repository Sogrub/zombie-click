export interface IZombie {
  image: string;
  top: number;
  left: number;
}

export interface IUpgrade {
  imagen: string;
  text: string;
  increment: number;
  cost: number;
  action: (upgrade: IUpgrade) => void;
}