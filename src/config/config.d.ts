// src/config/config.d.ts
export interface Config {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: string;
  use_env_variable?: string;
}

export interface Configurations {
  development: Config;
  test: Config;
  production: Config;
}
