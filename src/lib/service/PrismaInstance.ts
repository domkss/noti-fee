import { PrismaClient } from "@prisma/client";

class PrismaInstance {
  private static instance: PrismaClient;

  private constructor() {}

  static getInstance() {
    if (!PrismaInstance.instance) {
      PrismaInstance.instance = new PrismaClient();
    }
    return PrismaInstance.instance;
  }
}

export default PrismaInstance;
