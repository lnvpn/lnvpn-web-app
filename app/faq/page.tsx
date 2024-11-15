import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface IAppProps {}

export default function FAQ() {
  return (
    <div className="text-text dark:text-darkText">
      <main className="relative flex flex-col gap-4 items-center bg-bg dark:bg-darkBg px-5 flex-grow font-bold">
        <h1 className="text-6xl font-bold text-text dark:text-darkText my-10">
          FAQ
        </h1>
        <div className="grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h2 className="text-2xl flex justify-center my-4 font-bold text-text dark:text-darkText">
              VPN
            </h2>
            <Accordion
              className="w-full lg:w-[unset]"
              type="single"
              collapsible
            >
              <AccordionItem className="lg:w-[500px] max-w-full" value="item-0">
                <AccordionTrigger>Why is this VPN so special?</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-decimal pl-4">
                    <li>
                      <strong>Keys Generated in Your Browser:</strong> You
                      create your WireGuard connection keys directly in your web
                      browser. This means your private key is generated on your
                      device and never leaves it.
                    </li>
                    <li>
                      <strong>
                        Direct Communication with the VPN Endpoint:
                      </strong>{" "}
                      Your browser communicates directly with the VPN server to
                      set up the connection. There&rsquo;s no middleman handling
                      your keys or data.
                    </li>
                    <li>
                      <strong>Enhanced Privacy and Security:</strong> Since your
                      private key never touches our backend servers,
                      there&rsquo;s a much lower risk of it being intercepted or
                      compromised. You have full control over your security
                      credentials.
                    </li>
                  </ul>
                  <p>
                    In simple terms, our VPN ensures that your sensitive
                    information stays with you, giving you an extra layer of
                    protection and peace of mind.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-1">
                <AccordionTrigger>Why should I use a VPN?</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-decimal pl-4">
                    <li>
                      <strong>Security:</strong> A VPN encrypts your internet
                      connection, making it more difficult for hackers to
                      intercept your data. This can be especially useful when
                      using public Wi-Fi networks.
                    </li>
                    <li>
                      <strong>Privacy:</strong> A VPN can help protect your
                      online privacy by hiding your IP address and online
                      activity from your ISP and other third parties.
                    </li>
                    <li>
                      <strong>Access to restricted content:</strong> Depending
                      on your location, certain websites and online services may
                      be blocked. A VPN can help you access these services by
                      routing your traffic through a server in a different
                      location.
                    </li>
                    <li>
                      <strong>Bypassing censorship:</strong> In some countries,
                      the government censors certain websites and online
                      services. A VPN can help you bypass these restrictions and
                      access the internet freely.
                    </li>
                  </ul>
                  <p>
                    It&rsquo;s important to note that VPNs are not a silver
                    bullet for online privacy and security. It&rsquo;s still
                    important to use strong passwords, enable two-factor
                    authentication, and be cautious when clicking on links or
                    downloading files.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-2">
                <AccordionTrigger>What is this?</AccordionTrigger>
                <AccordionContent>
                  With LNVPN we&rsquo;ve built a very simple VPN pay-as-you-go
                  service paid via Bitcoin Lightning. Instead of paying around
                  $5 every month with your credit card for the privilege of
                  using a VPN service occasionally, we provide you with a VPN
                  connection on servers in different countries for one hour for
                  only 10 cents in US$ -- paid via ⚡!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-3">
                <AccordionTrigger>How does it work?</AccordionTrigger>
                <AccordionContent>
                  Very simple: On this website, you automatically generate
                  WireGuard VPN keys via JavaScript inside of your browser.
                  After selecting a country and the validity of your connection,
                  click &quot;Get Invoice&quot; to get a QR code, which you can
                  scan with a Bitcoin Lightning wallet like{" "}
                  <a
                    href="https://phoenix.acinq.co/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Phoenix
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://bluewallet.io/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    BlueWallet
                  </a>
                  . After payment, the website presents a new QR code and the
                  message &quot;PAID&quot;. Scan it with the WireGuard App on{" "}
                  <a href="https://play.google.com/store/apps/details?id=com.wireguard.android&hl=de&gl=US">
                    Android Google Play
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://apps.apple.com/us/app/wireguard/id1441195209"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Apple App Store
                  </a>
                  . On your PC or Mac, download the WireGuard config file from{" "}
                  <a
                    href="https://www.wireguard.com/install/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WireGuard for Windows and MacOS
                  </a>
                  .
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-4">
                <AccordionTrigger>
                  What services did you use to build this, which VPN service do
                  you use?
                </AccordionTrigger>
                <AccordionContent>
                  We use LDK and getAlby for your Lightning integration. On the
                  VPN endpoints, we don’t use a commercial VPN service. We have
                  our own servers in each country for each endpoint.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-5">
                <AccordionTrigger>
                  What data do you store about your users? How anonymous is
                  this? What privacy do you offer?
                </AccordionTrigger>
                <AccordionContent>
                  On the lnvpn.net website, we don’t use cookies and we only
                  store the first half of your IP address in our webserver logs.
                  For example, the IP 1.12.123.234 would be stored as 1.12.0.0.
                  On the VPN endpoints, we store your WireGuard public key, the
                  PSK, and the total amount of bandwidth you used. While you
                  maintain an active connection to a LNVPN VPN endpoint, we have
                  to keep your IP address in memory, but after 5 minutes of
                  inactivity, we remove your IP address from memory. We never
                  store it on disk. Payments are only possible via Bitcoin
                  Lightning, so we don’t know where the money comes from. We
                  only verify if an invoice was paid or not. If you use the
                  “Send via email” feature for your WireGuard configuration, the
                  email is sent via{" "}
                  <a
                    href="https://sendgrid.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Sendgrid
                  </a>
                  .
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-6">
                <AccordionTrigger>
                  What happens after the timeframe I paid my VPN for?
                </AccordionTrigger>
                <AccordionContent>
                  You won’t be able to transfer any data over the VPN connection
                  anymore. Your VPN client may indicate that it is still
                  connected, but no data will pass through.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-7">
                <AccordionTrigger>
                  Is there a data transfer limit?
                </AccordionTrigger>
                <AccordionContent>
                  <h6>Currently, we have four data plans:</h6>
                  <ul className="list-disc pl-4">
                    <li>1 hour = 5GB</li>
                    <li>1 day = 25GB</li>
                    <li>1 week = 75GB</li>
                    <li>1 month = 200GB</li>
                    <li>3 months = 450GB</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-8">
                <AccordionTrigger>Do you offer an API?</AccordionTrigger>
                <AccordionContent>
                  Yes, we do! If you want to use LNVPN for your application to
                  provide VPN tunnels, please visit:{" "}
                  <a
                    className="dark:text-main text-text underline"
                    href="https://lnvpn.net/api/documentation"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://lnvpn.net/api/documentation
                  </a>
                  .
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-9">
                <AccordionTrigger>Who built this?</AccordionTrigger>
                <AccordionContent>
                  Berlin Bitcoiners with Love ❤️.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-10"
              >
                <AccordionTrigger>Where do I get support?</AccordionTrigger>
                <AccordionContent>
                  We have a anonymous Telegram channel for support:{" "}
                  <a
                    className="dark:text-main text-text underline"
                    href="https://t.me/+IKTR7ZYTuEJhZWEy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Join via invite link
                  </a>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <h2 className="text-2xl flex justify-center my-4 font-bold text-text dark:text-darkText">
              Phone Numbers
            </h2>
            <Accordion
              className="w-full lg:w-[unset]"
              type="single"
              collapsible
            >
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-91"
              >
                <AccordionTrigger>
                  Why should I use a burner phone number?
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-decimal pl-4">
                    <li>
                      <strong>Privacy:</strong> By using a disposable phone
                      number, you can protect your personal phone number and
                      keep it private. This is useful when giving your phone
                      number to strangers or when signing up for online accounts
                      where you don’t want to share your real phone number.
                    </li>
                    <li>
                      <strong>Security:</strong> Disposable phone numbers can
                      help protect against spam calls, phishing attacks, and
                      other types of phone scams. If you receive a suspicious
                      call or text on a disposable number, you can simply
                      discard it and get a new one.
                    </li>
                    <li>
                      <strong>Temporary use:</strong> One-time phone numbers are
                      ideal for temporary or short-term use, such as when you
                      need a phone number for a specific purpose or for a
                      limited time.
                    </li>
                    <li>
                      <strong>Convenience:</strong> Disposable phone numbers are
                      convenient when you don’t want to give out your personal
                      phone number, or when you need a phone number for a
                      specific purpose without the hassle of getting a new SIM
                      card or phone line.
                    </li>
                  </ul>
                  <p>
                    Overall, one-time use phone numbers can be a useful tool for
                    protecting your privacy and security, particularly when
                    engaging in online activities where you want to keep your
                    personal information private.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-8">
                <AccordionTrigger>What is this?</AccordionTrigger>
                <AccordionContent>
                  Receive service activations in a few clicks, anonymously 🎉
                  <ol className="list-decimal pl-4">
                    <li>Pick a Country & Service</li>
                    <li>Pay the Lightning Network invoice</li>
                    <li>Receive the SMS you requested.</li>
                  </ol>
                  <p>
                    Note that if you have not received an SMS code successfully,
                    your payment will be canceled automatically, and funds will
                    return to your wallet. No refund needed!
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-9">
                <AccordionTrigger>How does the refund work?</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-4">
                    <li>
                      When the invoice is paid by the user, it’s not finalized
                      but HELD by the Lightning Node.
                    </li>
                    <li>
                      For receive orders, only when an activation code is
                      successfully received, the invoice is SETTLED.
                    </li>
                    <li>
                      For send orders, only when the SMS status is &quot;sent or
                      delivered,&rdquo; the invoice is SETTLED.
                    </li>
                    <li>
                      If no code is received within 20 minutes, the invoice will
                      be CANCELED, and funds will automatically return to the
                      user’s wallet.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <h2 className="text-2xl flex justify-center my-4 font-bold text-text dark:text-darkText">
              Affiliate Program
            </h2>
            <Accordion
              className="w-full lg:w-[unset]"
              type="single"
              collapsible
            >
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-101"
              >
                <AccordionTrigger>
                  What is the LNVPN Affiliate Program?
                </AccordionTrigger>
                <AccordionContent>
                  The LNVPN Affiliate Program allows you to earn Bitcoin by
                  referring new customers to our services. When someone signs up
                  using your unique referral link and makes a purchase, you earn
                  a 15% commission in Bitcoin.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-102"
              >
                <AccordionTrigger>
                  How do I join the Affiliate Program?
                </AccordionTrigger>
                <AccordionContent>
                  Simply sign up for our program and get your unique referral
                  link. Share this link with your friends, family, and followers
                  to start earning.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-103"
              >
                <AccordionTrigger>How much can I earn?</AccordionTrigger>
                <AccordionContent>
                  You earn a 15% commission for every user you refer who makes a
                  purchase. There&rsquo;s no limit to how much you can earn! The
                  more users you refer, the more you make.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-104"
              >
                <AccordionTrigger>When and how do I get paid?</AccordionTrigger>
                <AccordionContent>
                  Payouts are made monthly. As soon as you&apos;ve earned up to
                  100k Sats, you&apos;ll receive your earnings in Bitcoin to
                  your specified wallet address.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-105"
              >
                <AccordionTrigger>How can I check my balance?</AccordionTrigger>
                <AccordionContent>
                  To check your balance, simply visit our Partners page and
                  enter the Bitcoin address you provided when joining the
                  affiliate program in the designated input field. After
                  clicking on the &quot;Check Balance&quot; button, your current
                  balance in satoshis and the number of orders associated with
                  your referral code will be displayed right below.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-110"
              >
                <AccordionTrigger>
                  What if I have more questions about the Affiliate Program?
                </AccordionTrigger>
                <AccordionContent>
                  Feel free to reach out to our Telegram channel. We&apos;re
                  here to help and answer any questions you might have.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
}
