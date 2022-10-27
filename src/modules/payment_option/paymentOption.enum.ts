export const PaymentOptionType: { [x: string]: 'PIX' | 'BANK_ACCOUNT' | 'OTHER' } = {
  PIX: 'PIX',
  BANK_ACCOUNT: 'BANK_ACCOUNT',
  OTHER: 'OTHER',
};

export type PaymentOptionType = typeof PaymentOptionType[keyof typeof PaymentOptionType];

export const PaymentOptionSubType: { [x: string]: 'CPF_CNPJ' | 'RANDOM_KEY' | 'PHONE_NUMBER' | 'EMAIL' } = {
  CPF_CNPJ: 'CPF_CNPJ',
  RANDOM_KEY: 'RANDOM_KEY',
  PHONE_NUMBER: 'PHONE_NUMBER',
  EMAIL: 'EMAIL',
};

export type PaymentOptionSubType = typeof PaymentOptionSubType[keyof typeof PaymentOptionSubType];
