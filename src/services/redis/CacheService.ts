import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";

dotenv.config();

class CacheService {
  private _client: RedisClientType;

  constructor() {
    this._client = createClient({
      socket: {
        host: process.env.REDIS_HOST as string,
        port: parseInt(process.env.REDIS_PORT as string, 10),
      },
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_CACHE_DB as string, 10),
    });

    this._client.on("error", (error) => {
      console.error("Redis Client Error:", error);
    });

    this._client.connect().catch(console.error);
  }

  async set(
    key: string,
    value: string,
    expirationInSecond = 1800
  ): Promise<void> {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key: string): Promise<string> {
    const result = await this._client.get(key);

    if (result === null) throw new Error("Cache not found");

    return result;
  }

  async delete(key: string): Promise<number> {
    return this._client.del(key);
  }
}

export default CacheService;
