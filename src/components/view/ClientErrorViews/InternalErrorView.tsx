import Link from "next/link";
import Image from "next/image";

export default function InternalErrorView() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center p-4">
        <Image src="/icons/service_down_logo.svg" width={280} height={280} alt="Page not found" />

        <div className="my-4 text-center">
          The service is currently unavailable.
          <br />
          Please try again later.
        </div>
        <Link className="rounded bg-cyan-500 px-4 py-2 font-semibold text-white hover:bg-cyan-600" href="/">
          Go to Main Page
        </Link>
      </div>
    </div>
  );
}
