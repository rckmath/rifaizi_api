export const RaffleStatus: { [x: string]: 'CREATED' | 'IN_PROGRESS' | 'TO_DRAW' | 'DRAWN' | 'DELIVERED' | 'CANCELED' } = {
  CREATED: 'CREATED',
  IN_PROGRESS: 'IN_PROGRESS',
  TO_DRAW: 'TO_DRAW',
  DRAWN: 'DRAWN',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED',
};

export type RaffleStatus = typeof RaffleStatus[keyof typeof RaffleStatus];

export const RaffleListingFilter: { [x: string]: 'MINE' | 'PARTICIPATING' } = {
  MINE: 'MINE',
  PARTICIPATING: 'PARTICIPATING',
};

export type RaffleListingFilter = typeof RaffleListingFilter[keyof typeof RaffleListingFilter];
