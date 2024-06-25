import { PrismaClient } from "@prisma/client";
import Logger from "../utility/Logger";

class PrismaInstance {
  private static instance: PrismaClient;

  private constructor() {}

  static async getInstance(): Promise<PrismaClient> {
    if (!this.instance) {
      Logger.info("Creating new Prisma instance");
      this.instance = new PrismaClient();
      await this.instance.$connect();
    }
    return this.instance;
  }
}

export default PrismaInstance;
