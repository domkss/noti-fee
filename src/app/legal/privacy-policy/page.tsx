import Link from "next/link";
import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid";

const PrivacyPolicy = () => {
  return (
    <div className="flex min-h-screen flex-row justify-center">
      <div className="container mb-6 flex flex-col p-4">
        <div>
          <Link href="/">
            <div className="mb-5 flex items-center">
              <ChevronDoubleLeftIcon title="ABC" height={20} width={20} />
              <span className="text-nowrap">Go Back</span>
            </div>
          </Link>
          <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
          <p className="font-bold">Last Updated: 2024.06.22</p>
          <p className="font-semibold">Version: 1</p>

          <section className="mb-6 mt-4">
            <h2 className="mb-2 text-xl font-semibold">Introduction</h2>
            <p>
              Thank you for using NotiFee! This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our website and services. Please read this privacy policy carefully. If you
              do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Information We Collect</h2>
            <p>
              We may collect personal information that you voluntarily provide to us when setting up notifications on
              NotiFee. This information may include:
            </p>
            <ul className="list-inside list-disc">
              <li>Email address</li>
              <li>Notification preferences</li>
              <li>Transaction details related to the purchase of credits, including billing information</li>
            </ul>
            <p>
              We may also automatically collect certain information about your device and usage patterns when you access
              or interact with our website.
            </p>
            <h2 className="my-2 text-xl font-semibold">Cradit Card Information</h2>
            <p>
              We do not collect or store credit/debit card information. <br />
              This information is only processed by our payment processor{" "}
              <a href="https://stripe.com/" className="text-blue-500">
                Stripe
              </a>{" "}
              through their secure payment gateway.
            </p>

            <h2 className="my-2 text-xl font-semibold">Analytics by Stripe</h2>
            <p>
              We use Stripe for payment, analytics, and other business services. Stripe collects identifying information
              about the devices that connect to its services. <br />
              Stripe uses this information to operate and improve the services it provides to us, including for fraud
              detection. <br />
              You can learn more about Stripe and read its privacy policy at{" "}
              <a className="text-blue-500 hover:underline" href="https://stripe.com/privacy">
                https://stripe.com/privacy
              </a>
              .
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Use of Information</h2>
            <p>We use the information we collect in the following ways:</p>
            <ul className="list-inside list-disc">
              <li>To provide, operate, and maintain the NotiFee service.</li>
              <li>To improve, personalize, and expand our service.</li>
              <li>To understand and analyze how you use our service.</li>
              <li>
                To communicate with you, either directly or through one of our partners, including for customer service,
                to provide updates and information relating to the service, and for marketing and promotional purposes.
              </li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Disclosure of Information</h2>
            <p>We may disclose your personal information to third parties only in the following circumstances:</p>
            <ul className="list-inside list-disc">
              <li>With your consent.</li>
              <li>To comply with legal obligations.</li>
              <li>To protect and defend the rights or property of NotiFee.</li>
              <li>To prevent or investigate possible wrongdoing in connection with the service.</li>
              <li>To prevent fraudulent transactions.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Data Security</h2>
            <p>
              We take reasonable measures to protect your personal information from unauthorized access, use,
              alteration, or destruction.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Your Data Protection Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-inside list-disc">
              <li>The right to access – You have the right to request copies of your personal data.</li>
              <li>
                The right to rectification – You have the right to request that we correct any information you believe
                is inaccurate or complete information you believe is incomplete.
              </li>
              <li>
                The right to erasure – You have the right to request that we erase your personal data, under certain
                conditions.
              </li>
              <li>
                The right to restrict processing – You have the right to request that we restrict the processing of your
                personal data, under certain conditions.
              </li>
              <li>
                The right to object to processing – You have the right to object to our processing of your personal
                data, under certain conditions.
              </li>
              <li>
                The right to data portability – You have the right to request that we transfer the data that we have
                collected to another organization, or directly to you, under certain conditions.
              </li>
            </ul>
            <p>
              If you make a request, we have one month to respond to you. If you would like to exercise any of these
              rights, please contact us at our provided contact information.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="list-inside list-disc">
              <li>
                Email:{" "}
                <a href="mailto:support@notifee.com" className="text-blue-500 hover:underline">
                  support@notifee.com
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
