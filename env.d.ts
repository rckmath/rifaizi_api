declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
  }

  interface IDatabase {
    DATABASE_URL: string;
  }
}
