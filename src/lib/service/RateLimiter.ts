import { NextRequest, NextResponse } from "next/server";
import { StatusCodes as HTTPStatusCode } from "http-status-codes";
import Logger from "@/lib/utility/Logger";

type NextApiHandler = (req: NextRequest) => Promise<Response>;

enum RateLimiterType {
  EMAIL_SEND_FROM_IP,
  VERIFICATION_EMAIL,
}

class RateLimiter {
  windowSizeMs: number;
  maxRequests: number;
  idToWindows: Map<string, Array<number>>;
  static instances: Map<RateLimiterType, RateLimiter> = new Map<RateLimiterType, RateLimiter>();

  public static getInstance(
    type: RateLimiterType,
    config?: { windowSizeSec: number; maxRequests: number },
  ): RateLimiter {
    let instance = this.instances.get(type);
    if (!instance && config) {
      instance = new RateLimiter(config);
      this.instances.set(type, instance);
      return instance;
    } else if (!instance) {
      config = { windowSizeSec: 600, maxRequests: 50 };
      instance = new RateLimiter(config);
      this.instances.set(type, instance);
      return instance;
    }

    return instance;
  }

  private constructor(config: { windowSizeSec: number; maxRequests: number }) {
    this.windowSizeMs = config.windowSizeSec * 1000;
    this.maxRequests = config.maxRequests;
    this.idToWindows = new Map<string, Array<number>>();
  }
  public isRateLimited(id: string) {
    const now = Date.now();

    // get queue or initialize it
    let queue = this.idToWindows.get(id);
    if (!queue) {
      queue = [];
      this.idToWindows.set(id, queue);
    }

    // clear old windows
    while (queue.length > 0 && now - queue[0] > this.windowSizeMs) {
      queue.shift();
    }

    if (queue.length >= this.maxRequests) return true;

    // add current window to queue
    queue.push(now);

    return false;
  }

  public static IPRateLimitedEndpoint(IPRateLimiter: RateLimiter, handler: NextApiHandler): NextApiHandler {
    return async (req: NextRequest) => {
      try {
        const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "")
          .split(",")
          .shift()
          ?.trim();
        if (!ip || ip?.length === 0) throw new Error("IP address not found");

        const isRateLimited = IPRateLimiter.isRateLimited(ip);

        if (isRateLimited) {
          Logger.warn(`Rate limit reached for IP: ${ip}`);

          return NextResponse.json(
            { error: "You have reached the rate limit. Please try again later." },
            { status: HTTPStatusCode.TOO_MANY_REQUESTS },
          );
        }

        const response = await handler(req);
        return response;
      } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: HTTPStatusCode.INTERNAL_SERVER_ERROR });
      }
    };
  }
}

export { RateLimiter, RateLimiterType };
