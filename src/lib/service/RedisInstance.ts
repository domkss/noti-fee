import "server-only";
import { createClient, RedisClientType } from "redis";
import Logger from "../utility/Logger";

class RedisInstance {
  private static client: RedisClientType;
  private static errorCounter = 0;
  static async getClient() {
    this.errorCounter = 0;
    if (this.client && this.client.isOpen) {
      return this.client;
    }

    this.client = createClient({
      password: process.env.REDIS_PW,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });

    this.client.on("error", async (err: any) => {
      this.errorCounter++;

      if (this.errorCounter > 5) {
        Logger.error("RedisInstance Error", err);
        await this.client.disconnect();
      }
    });

    await this.client.connect();

    return this.client;
  }
}

export default RedisInstance;
