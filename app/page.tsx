import Link from "next/link";
import Marquee from "react-fast-marquee";
import type { Metadata } from "next";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://lnvpn.net",
  },
};

export default function Home() {
  const features = [
    {
      title: "Strict No Logs Policy",
      text: "We respect your privacy and never log user activity or connection data on our infrastructure.",
    },
    {
      title: "Bitcoin Payments",
      text: "Enjoy complete anonymity with Bitcoin payments. Lightning Network enabled for instant, low-fee transactions.",
    },
    {
      title: "Absolutely No KYC",
      text: "We never request personal data. No account creation, no email needed, or identity checks—just secure connectivity.",
    },
    {
      title: "Worldwide Coverage",
      text: "VPN servers across numerous countries and eSIM connectivity available in over 200 destinations globally.",
    },
    {
      title: "Instant Activation",
      text: "Your service activates immediately upon payment—no delays, no waiting, and no manual approvals required.",
    },
    {
      title: "Flexible Pricing Options",
      text: "Select from hourly, daily, weekly, or quarterly VPN plans, plus multiple convenient eSIM data packages.",
    },
  ];

  return (
    <main className="relative flex flex-col items-center bg-bg dark:bg-darkBg flex-grow font-bold">
      {/* Hero Section - With grid background pattern */}
      <section className="w-full dark:bg-secondaryBlack bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] py-20 px-5 border-b-4 border-border dark:border-darkBorder">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-Space_Grotesk text-6xl font-extrabold tracking-wide lg:text-7xl mb-6">
            Digital Privacy, <br />
            On Your Terms
          </h1>
          <p className="text-xl md:text-3xl max-w-2xl mb-10 dark:text-darkText font-sans">
            No logging. No account. No KYC.
            <br />
            Pay with Bitcoin for complete anonymity.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="default"
              size="lg"
              asChild
              className="text-black h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl"
            >
              <Link href="/vpn">
                Get VPN <span className="mx-1">•</span> $0.10{" "}
                <FaArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button
              variant="neutral"
              size="lg"
              asChild
              className="text-black h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl"
            >
              <Link href="/esim">
                Get eSIM <span className="mx-1">•</span> $0.99{" "}
                <FaArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=" dark:bg-darkBg  bg-bg py-20 font-base lg:py-[100px]">
        <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Privacy-First Services Without Compromise
        </h2>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            return (
              <div
                className="border-border dark:border-darkBorder dark:bg-secondaryBlack shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-white p-6"
                key={i}
              >
                <h4 className="text-xl font-bold">{feature.title}</h4>
                <p className="font-normal text-base leading-relaxed">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <Marquee
        className=" border-y-border dark:border-y-darkBorder dark:border-darkBorder dark:bg-secondaryBlack border-y-2 bg-white py-3 font-base sm:py-5 overflow-hidden"
        direction="left"
      >
        {Array(10)
          .fill("xd")
          .map((x, id) => {
            return (
              <div className="flex items-center" key={id}>
                <span className="mx-8 text-xl font-heading sm:text-2xl lg:text-4xl">
                  NO ACCOUNT NEEDED
                </span>
              </div>
            );
          })}
      </Marquee>

      {/* Pricing Section - With header background */}
      <section className="border-b-border dark:border-b-darkBorder dark:bg-secondaryBlack inset-0 flex w-full flex-col items-center justify-center border-b-2 bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] font-base">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 lg:py-[100px]">
          <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
            Simple Pricing, Maximum Privacy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3  gap-8 max-w-5xl mx-auto">
            {/* VPN Pricing */}
            <div className="border-border dark:border-darkBorder dark:bg-secondaryBlack shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-white  p-5">
              <h3 className="text-2xl font-bold mb-2 text-center">VPN</h3>
              <p className="text-center mb-4 font-sans">
                Secure, no-log service
              </p>

              <div className="text-4xl font-bold text-center mb-6">
                $0.10 <span className="text-lg font-normal">/hour</span>
              </div>

              <ul className="space-y-2 mb-8 font-sans">
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> Multiple country
                  endpoints
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> No activity logging
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> Bitcoin payments
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> Hourly to quarterly
                  plans
                </li>
              </ul>

              <Button
                variant="default"
                size="lg"
                asChild
                className="w-full text-black"
              >
                <Link href="/vpn">Get VPN</Link>
              </Button>
            </div>

            {/* eSIM Pricing */}
            <div className="border-border dark:border-darkBorder dark:bg-secondaryBlack shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-white p-5">
              <h3 className="text-2xl font-bold mb-2 text-center">eSIM</h3>
              <p className="text-center mb-4 font-sans">Global connectivity</p>

              <div className="text-4xl font-bold text-center mb-6">
                $0.99 <span className="text-lg font-normal">/plan</span>
              </div>

              <ul className="space-y-2 mb-8 font-sans">
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> 200+ countries coverage
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> No ID verification
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> Instant delivery
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> Multiple data packages
                </li>
              </ul>

              <Button
                variant="default"
                size="lg"
                asChild
                className="w-full text-black"
              >
                <Link href="/esim">Get eSIM</Link>
              </Button>
            </div>

            {/* Phone Numbers Pricing */}
            <div className="border-border dark:border-darkBorder dark:bg-secondaryBlack shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-white p-5">
              <h3 className="text-2xl font-bold mb-2 text-center">
                Phone Numbers
              </h3>
              <p className="text-center mb-4 font-sans">
                Disposable verification
              </p>

              <div className="text-4xl font-bold text-center mb-6">
                $0.50 <span className="text-lg font-normal">/number</span>
              </div>

              <ul className="space-y-2 mb-8 font-sans">
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> Multiple countries
                  available
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> Many different services
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> Instant activation
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-main mr-2" /> Perfect for sign-ups &
                  2FA
                </li>
              </ul>

              <Button
                variant="default"
                size="lg"
                asChild
                className="w-full text-black"
              >
                <Link href="/phone-numbers">Get Phone Number</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="dark:bg-darkBg bg-bg py-20 font-base lg:py-[100px]">
        <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="w-full  md:w-[700px] max-w-full grid  px-5">
          <Accordion className="text-base sm:text-lg" type="single" collapsible>
            <AccordionItem
              className="w-full md:w-[700px] max-w-full"
              value="item-0"
            >
              <AccordionTrigger>
                How does LNVPN protect my privacy?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  LN VPN ensures complete privacy with our truly no-log VPN
                  service. Your browser communicates directly with our endpoints
                  without going through a central backend, ensuring your private
                  keys stay always on your side. Combined with Bitcoin payments,
                  your identity remains completely anonymous. Your browsing
                  activity, location, and personal details stay private.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="lg:w-[700px] max-w-full" value="item-2">
              <AccordionTrigger>
                Why should I use an anonymous eSIM?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Traditional mobile carriers require ID verification and track
                  your every move. Our anonymous eSIMs work in over 200
                  countries without requiring personal information. Pay with
                  Bitcoin, activate instantly, and enjoy mobile data without
                  compromising your identity. Perfect for travel and maintaining
                  privacy while connected.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="lg:w-[700px] max-w-full" value="item-3">
              <AccordionTrigger>
                What can I do with disposable phone numbers?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Our disposable phone numbers are perfect for online
                  verification without exposing your real phone number. Use them
                  for account sign-ups and anywhere you need to receive SMS but
                  want to protect your privacy. Choose from multiple countries
                  and services and receive messages instantly.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="lg:w-[700px] max-w-full" value="item-4">
              <AccordionTrigger>
                How do Bitcoin payments enhance my privacy?
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Bitcoin payments break the link between your financial
                  identity and our services. Unlike credit cards or PayPal,
                  Bitcoin transactions don&apos;t require personal information.
                  We use Lightning Network for instant, low-fee transactions,
                  ensuring that your payment methods don&apos;t compromise the
                  privacy of our services.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Second Marquee */}
      <Marquee
        className="border-y-border dark:border-y-darkBorder dark:border-darkBorder dark:bg-secondaryBlack border-y-2 bg-white py-3 font-base sm:py-5 overflow-hidden"
        direction="right"
      >
        {Array(10)
          .fill("xd")
          .map((x, id) => {
            return (
              <div className="flex items-center" key={id}>
                <span className="mx-8 text-xl font-heading sm:text-2xl lg:text-4xl">
                  KYC IS THE ILLICIT ACTIVITY
                </span>
              </div>
            );
          })}
      </Marquee>

      {/* Final CTA  */}
      <section className="border-b-border dark:border-b-darkBorder dark:bg-secondaryBlack inset-0 flex w-full flex-col items-center justify-center border-b-2 bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] font-base">
        <div className="mx-auto w-full max-w-5xl px-5 py-20 lg:py-[100px]">
          <h2 className="text-5xl font-bold  text-center tracking-wide  font-Space_Grotesk mb-6 dark:text-main">
            Join Our Community
          </h2>
          <p className="text-xl text-center mb-8 dark:text-darkText max-w-xl mx-auto font-bold">
            Learn more about our services or become an affiliate partner and
            earn Bitcoin for every referral.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="default" size="lg" asChild className="text-black">
              <Link href="/affiliate">Affiliate Program</Link>
            </Button>
            <Button variant="neutral" size="lg" asChild className="text-black">
              <Link href="/faq">Our FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
