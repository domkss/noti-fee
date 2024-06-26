import "server-only";
import { PrismaClient } from "@prisma/client";
import Logger from "../utility/Logger";
import { getErrorMessage } from "../utility/UtilityFunctions";

class PrismaInstance {
  private static instance: PrismaClient;

  private constructor() {}

  static async getInstance(): Promise<PrismaClient> {
    if (!this.instance) {
      try {
        Logger.info("Creating new Prisma instance");
        this.instance = new PrismaClient();
        await this.instance.$connect();
      } catch (error) {
        Logger.error(`Error connecting to Prisma: ${getErrorMessage(error)}`);
        throw new Error("Could not connect to Prisma");
      }
    }
    return this.instance;
  }
}

export default PrismaInstance;
