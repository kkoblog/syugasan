export interface ZodiacSign {
  name: string;
  symbol: string;
  element: '火' | '土' | '風' | '水';
  dateRange: string;
  color: string;
  opposite: string;
}

export type ZodiacSigns = {
  [key: string]: ZodiacSign;
}

export interface User {
  id: string;
  name: string;
  sign: string;
  position: { x: number; y: number } | null;
  placedOppositeSign?: string;
}

export interface ZodiacMapProps {
  users: User[];
  selectedSign: string | null;
  onSignSelect: (sign: string | null) => void;
  onUserPlaced: (user: User, position: { x: number; y: number }) => void;
  onUserRemove: (userId: string) => void;
}