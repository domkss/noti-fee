import { PrismaClient } from "@prisma/client";

class PrismaInstance {
  private static instance: PrismaClient;

  private constructor() {}

  static async getInstance(): Promise<PrismaClient> {
    if (!this.instance) {
      this.instance = new PrismaClient();
      await this.instance.$connect();
    }
    return this.instance;
  }
}

export default PrismaInstance;
