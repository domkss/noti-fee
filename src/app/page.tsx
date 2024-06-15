"use client";
import NotificationSetupForm from "@/components/view/NotificationSetupForm";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row ">
      <NotificationSetupForm />
      <div className="w-full bg-blue-100 p-10">
        <div className="flex w-full max-w-lg flex-col divide-y divide-slate-100 rounded-xl bg-slate-100">
          <Disclosure as="div" className="p-6" defaultOpen={true}>
            <DisclosureButton className="group flex w-full items-center justify-between">
              <span className="text-sm font-medium text-black group-data-[hover]:text-black">
                What is your refund policy?
              </span>
              <ChevronDownIcon className="size-5 fill-black group-data-[open]:rotate-180 group-data-[hover]:fill-black" />
            </DisclosureButton>
            <DisclosurePanel className="mt-2 text-sm text-black">Lorem Ipsum</DisclosurePanel>
          </Disclosure>
          <Disclosure as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between">
              <span className="text-sm/6 font-medium text-black group-data-[hover]:text-black/80">
                Do you offer technical support?
              </span>
              <ChevronDownIcon className="size-5 fill-black group-data-[open]:rotate-180 group-data-[hover]:fill-black" />
            </DisclosureButton>
            <DisclosurePanel className="mt-2 text-sm text-black">No.</DisclosurePanel>
          </Disclosure>
        </div>
      </div>
    </main>
  );
}
