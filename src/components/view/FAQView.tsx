import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

export default function FAQView() {
  return (
    <div className="flex w-full flex-col divide-y divide-slate-300">
      <div className="p-4 text-xl font-semibold">Frequently Asked Questions:</div>
      <Disclosure as="div" className="p-6" defaultOpen={true}>
        <DisclosureButton className="group flex w-full items-center justify-between">
          <span className="text-md flex items-center font-medium text-black group-data-[hover]:text-black">
            What is NotiFee?
          </span>

          <ChevronDownIcon className="size-5 fill-black group-data-[open]:rotate-180 group-data-[hover]:fill-black" />
        </DisclosureButton>
        <DisclosurePanel className="text-md mt-2 text-gray-800">
          A notification service that sends you an email when the transaction fee of the cryptocurrency you are
          interested in reaches a certain threshold.
          <br />
          This can help you save money on transactions and exchange withdrawal fees.
        </DisclosurePanel>
      </Disclosure>
      <Disclosure as="div" className="p-6">
        <DisclosureButton className="group flex w-full items-center justify-between">
          <span className="text-md font-medium text-black group-data-[hover]:text-black/80">
            What is the Cost of using the service?
          </span>
          <ChevronDownIcon className="size-5 fill-black group-data-[open]:rotate-180 group-data-[hover]:fill-black" />
        </DisclosureButton>
        <DisclosurePanel className="text-md mt-2 text-gray-800">
          With a one-time <span className="font-bold text-red-500 line-through">($15)</span>
          <span className="font-bold text-green-600"> $9.99 </span>purchase, you can set up 200 notifications. <br />
          The purchase is linked to your email address and valid until you reach the 200 notification limit.
          <br />
          This small payment helps us cover the costs of running the service and in most cases can be offset by savings
          on your first exchange withdrawal.
        </DisclosurePanel>
      </Disclosure>
      <Disclosure as="div" className="p-6">
        <DisclosureButton className="group flex w-full items-center justify-between">
          <span className="text-md font-medium text-black group-data-[hover]:text-black/80">
            What informations do you store?
          </span>
          <ChevronDownIcon className="size-5 fill-black group-data-[open]:rotate-180 group-data-[hover]:fill-black" />
        </DisclosureButton>
        <DisclosurePanel className="text-md mt-2 text-gray-800">
          We only store your email address and the notification settings you set up.
          <br /> Credit card information is processed by Stripe, a third-party payment provider, and is not stored on
          our servers.
        </DisclosurePanel>
      </Disclosure>
      <Disclosure as="div" className="p-6">
        <DisclosureButton className="group flex w-full items-center justify-between">
          <span className="text-md font-medium text-black group-data-[hover]:text-black/80">
            What exchanges are supported?
          </span>
          <ChevronDownIcon className="size-5 fill-black group-data-[open]:rotate-180 group-data-[hover]:fill-black" />
        </DisclosureButton>
        <DisclosurePanel className="text-md mt-2 text-gray-800">
          We provide email notifications for withdrawal fee changes on Binance, the world&apos;s leading exchange.
          <br />
          More exchanges will be supported in the future.
        </DisclosurePanel>
      </Disclosure>
      <Disclosure as="div" className="p-6">
        <DisclosureButton className="group flex w-full items-center justify-between">
          <span className="text-md font-medium text-black group-data-[hover]:text-black/80">
            Is transaction fee tracking supported on native blockchains?
          </span>
          <ChevronDownIcon className="size-5 fill-black group-data-[open]:rotate-180 group-data-[hover]:fill-black" />
        </DisclosureButton>
        <DisclosurePanel className="text-md mt-2 text-gray-800">
          We are working on adding support for setting up notifications for native blockchain fee changes.
        </DisclosurePanel>
      </Disclosure>
      <Disclosure as="div" className="p-6">
        <DisclosureButton className="group flex w-full items-center justify-between">
          <span className="text-md font-medium text-black group-data-[hover]:text-black/80">
            Terms of Use and Privacy Policy
          </span>
          <ChevronDownIcon className="size-5 fill-black group-data-[open]:rotate-180 group-data-[hover]:fill-black" />
        </DisclosureButton>
        <DisclosurePanel className="text-md mt-2 text-gray-800">
          The Terms of Use can be found{" "}
          <a href="/legal/termsofuse" className="text-blue-500">
            here
          </a>{" "}
          and the Privacy Policy can be found{" "}
          <a href="/legal/privacy-policy" className="text-blue-500">
            here
          </a>
          .
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
