export const RaffleOptionIndicator: { [x: string]: 'AVAILABLE' | 'RESERVED' | 'AWAITING_PAYMENT' | 'OWNED' } = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  OWNED: 'OWNED',
};

export type RaffleOptionIndicator = typeof RaffleOptionIndicator[keyof typeof RaffleOptionIndicator];
