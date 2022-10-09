export const UserRoleType: { [x: string]: 'COMMON' | 'ADMIN' } = {
  COMMON: 'COMMON',
  ADMIN: 'ADMIN',
};

export type UserRoleType = typeof UserRoleType[keyof typeof UserRoleType];
