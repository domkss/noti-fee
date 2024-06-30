import Link from "next/link";
import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid";

const TermsOfUse = () => {
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
          <h1 className="mb-6 text-3xl font-bold">NotiFee Terms of Service</h1>
          <p className="font-bold">Last Updated: 2024.06.22</p>
          <p className="font-semibold">Version: 1</p>
          <section className="mb-6 mt-4">
            <p>
              Welcome to NotiFee! By using our service, you agree to comply with and be bound by the following terms of
              use. Please review the following terms carefully. If you do not agree to these terms, you should not use
              this service.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Definitions</h2>
            <ul className="list-inside list-disc">
              <li>
                <strong>Service:</strong> NotiFee, an online exchange and cryptocurrency transfer fee notifier service.
              </li>
              <li>
                <strong>User:</strong> Any individual or entity using NotiFee.
              </li>
              <li>
                <strong>Content:</strong> All information, text, images, data, links, software, or other material made
                available through the Service.
              </li>
              <li>
                <strong>Credits:</strong> The defined amount of message credits purchased by the User, used for sending
                notifications through NotiFee.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Acceptance of Terms</h2>
            <p>
              By accessing or using NotiFee, you agree to be bound by these Terms of Use and our Privacy Policy. If you
              do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Eligibility</h2>
            <p>
              You must be at least 18 years old to use NotiFee. By using the Service, you represent and warrant that you
              are at least 18 years old and that you have the legal capacity to enter into a binding agreement.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Use of the Service</h2>
            <p>
              You agree to use the Service in compliance with all applicable laws and regulations. You are solely
              responsible for your conduct and any data, text, information, graphics, photos, profiles, audio and video
              clips, links, and other content that you submit, post, and display on the Service.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Account Registration</h2>
            <p>
              The registration process for NotiFee consists of setting up your first notification for a specific fee
              target on a specific exchange with a specific network for a specific currency type. When you set up this
              notification, a transactional verification email is sent to your provided email address. By verifying your
              intent through this email, your notification is activated, and you can then purchase credits for your
              account.
            </p>
            <p className="mt-2">
              Abusing transactional verification emails to spam people who are not trying to use the service by
              providing their email address is strictly prohibited.
            </p>
          </section>
          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Data Handling Acknowledgement</h2>
            <p>
              By setting up a notification, you acknowledge and agree that NotiFee will handle and store the data you
              provide during this setup process.
            </p>
            <p>
              This data may include personal information such as your email address and notification preferences.
              NotiFee is committed to protecting your privacy and will handle your data in accordance with the General
              Data Protection Regulation (GDPR) and other applicable data protection laws.
            </p>
            <p>
              Your data will be used solely for the purpose of providing the NotiFee service, including sending you
              notifications as requested. We do not share your data with third parties unless required by law or
              necessary for the provision of our service. You have the right to access, rectify, or delete your personal
              data held by NotiFee. For more information on how we handle your data, please refer to our{" "}
              <a href="/legal/privacy-policy" className="text-blue-500 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Purchase and Use of Credits</h2>
            <p>
              NotiFee operates on a one-time payment system where you pay once for a defined amount of message credits.
              These credits can be used at any time while the Service is available to the public. By accepting these
              Terms of Use and clicking the pay button, you acknowledge these terms.
            </p>
            <p>
              The cost of credits is subject to change at any time without notice. The price you pay for credits is the
              price displayed at the time of purchase.
            </p>
            <p>
              You can purchase credits through the NotiFee website using a credit card. NotiFee uses a third-party
              payment provider to process payments securely.
            </p>
            <h3 className="mt-2">
              <strong>Notification Activation Costs</strong>
            </h3>
            <p>
              Each notification activation costs 1 message credit. If you set up more than 5 notifications within a day,
              an additional credit will be charged for every verification email sent to you. Example: If you set up 8
              notifications within a day, you will be charged 8 credits for the notifications activations and 3 credits
              for the verification emails above the 5 free verification email, totaling 11 credits.
            </p>
            <h3 className="mt-2text-xl font-bold text-red-500">Important: Credits are non-refundable!</h3>
            <p>
              Credits purchased are non-refundable and cannot be converted back to real money. Once credits are
              purchased, they are bound to the user account and can only be used through that account. We do not offer
              refunds for unused credits or any other reason. Please consider this before purchasing any.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Service Availability</h2>
            <p>
              NotiFee does not guarantee that the Service will be available forever. The Service can be terminated at
              any time in the future without further notification.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">License</h2>
            <p>
              NotiFee grants you a limited, non-exclusive, non-transferable, and revocable license to use the Service
              solely for your own personal or business use in accordance with these Terms of Use.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-inside list-disc">
              <li>Use the Service for any illegal or unauthorized purpose.</li>
              <li>Modify, adapt, translate, or reverse engineer any portion of the Service.</li>
              <li>
                Use any robot, spider, site search/retrieval application, or other automated device, process, or means
                to access, retrieve, scrape, or index any portion of the Service.
              </li>
              <li>
                Upload, post, email, transmit, or otherwise make available any content that infringes any patent,
                trademark, trade secret, copyright, or other proprietary rights of any party.
              </li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Intellectual Property</h2>
            <p>
              All content on NotiFee, including but not limited to design, text, graphics, logos, icons, images, audio
              clips, and software, is the property of NotiFee or its content suppliers and is protected by international
              copyright laws. Unauthorized use of any content is strictly prohibited.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Termination</h2>
            <p>
              NotiFee reserves the right to terminate or suspend your account and access to the Service at its sole
              discretion, without notice and liability, for conduct that it believes violates these Terms of Use or is
              harmful to other users of the Service, NotiFee, or third parties, or for any other reason.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Disclaimer of Warranties</h2>
            <p>
              The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. NotiFee makes no
              warranty that the Service will meet your requirements or be available on an uninterrupted, secure, or
              error-free basis. NotiFee makes no warranty regarding the quality of any products, services, or
              information purchased or obtained through the Service.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, NotiFee shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
              indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-inside list-disc">
              <li>Your use or inability to use the Service;</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein;</li>
              <li>Any interruption or cessation of transmission to or from the Service.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Governing Law</h2>
            <p>
              These Terms of Use and any action related thereto will be governed by the laws of the jurisdiction in
              which NotiFee operates without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless NotiFee, its affiliates, officers, directors, employees,
              and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt,
              and expenses (including but not limited to attorney&apos;s fees) arising from: (i) your use of and access
              to the Service; (ii) your violation of any term of these Terms of Use; (iii) your violation of any
              third-party right, including without limitation any copyright, property, or privacy right; or (iv) any
              claim that your use of the Service caused damage to a third party.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Third-Party Services</h2>
            <p>
              The Service may include links to third-party websites or services that are not owned or controlled by
              NotiFee. NotiFee has no control over, and assumes no responsibility for, the content, privacy policies, or
              practices of any third-party websites or services. You acknowledge and agree that NotiFee shall not be
              responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or
              in connection with use of or reliance on any such content, goods, or services available on or through any
              such websites or services.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Severability</h2>
            <p>
              If any provision of these Terms of Use is found to be invalid or unenforceable by a court of competent
              jurisdiction, the remaining provisions of these Terms will remain in full force and effect.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Entire Agreement</h2>
            <p>
              These Terms of Use, along with the Privacy Policy, constitute the entire agreement between you and NotiFee
              regarding the use of the Service, superseding any prior agreements between you and NotiFee relating to
              your use of the Service.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Changes to the Terms of Use</h2>
            <p>
              NotiFee reserves the right to modify these Terms of Use at any time. If we make changes to these terms, we
              will provide notice of such changes by updating the date at the top of these Terms of Use. Your continued
              use of the Service after any such changes constitutes your acceptance of the new Terms of Use.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Use, please contact us at{" "}
              <a href="mailto:support@notifee.com" className="text-blue-500 hover:underline">
                support@notifee.com
              </a>
              .
            </p>
          </section>

          <section>
            <p className="mt-4 text-sm text-gray-600">
              By using NotiFee, you acknowledge that you have read, understood, and agree to be bound by these Terms of
              Use.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
