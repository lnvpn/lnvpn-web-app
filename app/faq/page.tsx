import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export interface IAppProps {}

export default function FAQ() {
  return (
    <div className="text-text dark:text-darkText">
      <main className="relative flex flex-col gap-4 items-center bg-bg dark:bg-darkBg px-5 flex-grow font-bold">
        <h1 className="my-10 text-shadow-neo scroll-m-20 font-Space_Grotesk text-5xl font-extrabold tracking-wide text-main lg:text-6xl">
          FAQ
        </h1>
        <div className="grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-2121"
              >
                <AccordionTrigger>Are you a reseller?</AccordionTrigger>
                <AccordionContent>
                  No, we are not a reseller. We own and operate all our
                  infrastructure in each country, ensuring full control and
                  maximum privacy for our users.
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
                  We use LDK for our Lightning integration. On the VPN
                  endpoints, we don’t use a commercial VPN service. We have our
                  own servers in each country for each endpoint. LNVPN uses the
                  Wireguard open source VPN protocol.
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
                  PSK, and the total amount of bandwidth you used. While you’re
                  connected to our VPN, the endpoint temporarily keeps your IP
                  address in memory to maintain the connection. If there’s no
                  activity for 5 minutes, the IP address is automatically
                  deleted. We never store it on any disk or permanent storage.
                  Payments are only possible via Bitcoin Lightning, so we don’t
                  know where the money comes from. We only verify if an invoice
                  was paid or not. We are not able to link your payment to an
                  endpoint. If you use the “Send via email” feature for your
                  WireGuard configuration, the email is sent via{" "}
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
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-61"
              >
                <AccordionTrigger>
                  Do you have an uptime dashboard?
                </AccordionTrigger>
                <AccordionContent>
                  Yes we do! You can check the status of our VPN servers at any
                  time on our{" "}
                  <Link
                    className="dark:text-main text-text underline"
                    href="https://kuma.ln-tweetbot.com/status/lnvpn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    status page
                  </Link>
                  .
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-7">
                <AccordionTrigger>
                  Is there a data transfer limit?
                </AccordionTrigger>
                <AccordionContent>
                  <h6>Currently, we have four data plans:</h6>
                  <ul className="list-disc pl-4">
                    <li>1 hour = 10GB</li>
                    <li>1 day = 50GB</li>
                    <li>1 week = 150GB</li>
                    <li>1 month = 300GB</li>
                    <li>3 months = 800GB</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-8">
                <AccordionTrigger>Do you offer an API?</AccordionTrigger>
                <AccordionContent>
                  Yes, we do! If you want to use LNVPN for your application to
                  provide VPN tunnels, please visit:{" "}
                  <Link
                    className="dark:text-main text-text underline"
                    href="https://lnvpn.net/api/documentation"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://lnvpn.net/api/documentation
                  </Link>
                  .
                </AccordionContent>
              </AccordionItem>

              <AccordionItem className="lg:w-[500px] max-w-full" value="item-9">
                <AccordionTrigger>Who built this?</AccordionTrigger>
                <AccordionContent>
                  Berlin Bitcoiners with Love ❤️.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <h2 className="text-2xl flex justify-center my-4 font-bold text-text dark:text-darkText">
              eSIM
            </h2>
            <Accordion
              className="w-full lg:w-[unset]"
              type="single"
              collapsible
            >
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-500"
              >
                <AccordionTrigger>What is an eSIM?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    An eSIM is a digital SIM that allows you to activate a
                    mobile data plan without using a physical SIM card.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* 1. Compatibility */}
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-501"
              >
                <AccordionTrigger>
                  Which devices are compatible with eSIM?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Many newer smartphones, tablets, and wearables now include
                    eSIM functionality. Popular brands like Apple (iPhone XS and
                    later), Samsung (Galaxy S20 and later), and Google Pixel
                    (Pixel 3 and newer) typically support eSIM. However, it’s
                    always best to check the exact model specifications or
                    consult with your carrier for confirmation.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* eSIM vs Data Bundles */}
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-510"
              >
                <AccordionTrigger>
                  What is the difference between an eSIM and a data bundle?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    An <strong>eSIM</strong> is a digital SIM profile that you
                    can install on your phone, allowing you to switch between
                    carriers without using a physical SIM card. However, an eSIM
                    alone does not provide mobile data—you need a{" "}
                    <strong>data bundle </strong>
                    assigned to your eSIM to access the internet.
                  </p>
                  <p>
                    You can <strong>install</strong> an eSIM anywhere in the
                    world, but the <strong>data bundle </strong>
                    will only <strong>activate</strong> once you connect to a
                    supported mobile network in the designated country or
                    region. For example, if you purchase an Australian data
                    bundle while in Germany, you can install the eSIM
                    immediately, but the data bundle will only start working
                    once you reach Australia and connect to an Australian
                    carrier.
                  </p>
                  <p>
                    If you travel frequently, you may need multiple data bundles
                    for different regions or choose a global plan that covers
                    multiple countries.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Local vs. Regional vs. Global eSIMs */}
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-511"
              >
                <AccordionTrigger>Do eSIMs support roaming?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Whether an eSIM supports roaming depends on the type of eSIM
                    plan you purchase:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Local eSIMs:</strong> These are designed for use
                      in a single country and{" "}
                      <strong>do not support roaming</strong>. They only work
                      when connected to a mobile network in their designated
                      country.
                    </li>
                    <li>
                      <strong>Regional eSIMs:</strong> These cover multiple
                      countries within a specific region (e.g., Europe, Asia,
                      North America). They allow you to use data in different
                      countries within the region without needing a new eSIM or
                      bundle.
                    </li>
                    <li>
                      <strong>Global eSIMs:</strong> These work across multiple
                      regions and often support data usage in dozens of
                      countries worldwide. They are ideal for travelers visiting
                      multiple countries in different regions.
                    </li>
                  </ul>
                  <p>
                    If you need coverage in multiple countries, check whether
                    your eSIM plan supports roaming or if you need to switch
                    between different regional bundles.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 2. How to Set Up an eSIM */}
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-502"
              >
                <AccordionTrigger>
                  How do I install or set up my eSIM plan?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    After purchasing an eSIM plan, you will receive a QR code or
                    activation code. Go to your device’s cellular settings,
                    select <strong>“Add Cellular Plan”</strong> (or similar),
                    then scan the QR code or enter the activation code.
                  </p>
                  <p>
                    You can <strong>install</strong> the eSIM from anywhere, but
                    your <strong>data bundle</strong>
                    will only <strong>activate</strong> once you connect to a
                    supported mobile network in the bundle’s designated country
                    or region.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 3. Switching Between Profiles */}
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-503"
              >
                <AccordionTrigger>
                  Can I store multiple eSIM profiles on one device?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Yes. Many eSIM-enabled devices let you store multiple eSIM
                    profiles (like a home SIM, a travel SIM, or a work SIM) so
                    you can switch between them in your settings without
                    swapping physical cards. However, most devices can only use
                    one eSIM profile at a time.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 4. Coverage and Network Quality */}
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-504"
              >
                <AccordionTrigger>
                  Does an eSIM have the same coverage and speeds as a physical
                  SIM?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Yes. eSIM service is provided over the same network
                    infrastructure as a traditional physical SIM. Your coverage,
                    data speeds, and call quality depend on the carrier you
                    choose and their network strength in your location.
                  </p>
                </AccordionContent>
              </AccordionItem>
              {/* 4. Coverage and Network Quality */}
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-505"
              >
                <AccordionTrigger>
                  Can I add multiple bundles to one eSIM?
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Yes, you can add multiple data bundles to the same eSIM and
                    use them as needed. Just go to your eSIM profile page and
                    add multiple bundles. The bundles are actived as soon as
                    your reach the country of the bundle.
                    <br />
                    <strong>
                      Note: Not every bundle is compatible with every eSIM.
                      Somethimes you need a new eSIM profile.
                    </strong>
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 6. Security and Privacy */}
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-506"
              >
                <AccordionTrigger>Is eSIM secure to use?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Yes. eSIM profiles are securely encrypted and stored on a
                    dedicated chip within your device. Activation usually
                    requires secure credentials, such as a QR code or activation
                    code, which helps ensure your information remains protected.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 7. Troubleshooting */}
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-50808"
              >
                <AccordionTrigger>
                  Can’t connect my eSIM on Android
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    If you’re having issues with your internet connection, check
                    if all your settings are set up correctly.
                  </p>
                  <p>
                    Make sure that Data Roaming is turned on under settings.
                  </p>
                  <p>To update the Access Point Name (APN):</p>
                  <ol className="list-decimal pl-5">
                    <li>
                      Go to Settings &gt; Network &amp; Internet section &gt;
                      Mobile Networks &gt; Access Point Names
                    </li>
                    <li>Click “+” or “ADD”</li>
                    <li>Enter the new APN settings</li>
                    <li>Hit “Save”</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-50909"
              >
                <AccordionTrigger>
                  Can’t connect my eSIM on iOS/iPhone
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    If you’re having connectivity issues with your eSIM on iOS,
                    make sure you have completed all the steps to access data as
                    per the instructions given on your eSIM app/website.
                  </p>
                  <p>
                    Check the supported network on your eSIM app/website and
                    follow these steps to connect:
                  </p>
                  <ol className="list-decimal pl-5">
                    <li>Go to Settings &gt; Cellular/Mobile</li>
                    <li>Click on your eSIM under Cellular Plans</li>
                    <li>Navigate to Network Selection and disable Automatic</li>
                    <li>Select the correct network</li>
                  </ol>
                  <p>
                    Alternatively, try updating your APN settings and check if
                    your data roaming is turned on.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-51010"
              >
                <AccordionTrigger>How do I set up my APN?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    All of our eSIMs have an automatic Access Point Name (APN)
                    and so manual programming is not necessary.
                  </p>
                  <p>
                    However, if you want to check or manually configure the APN,
                    follow these steps:
                  </p>
                  <strong>iOS:</strong>
                  <ol className="list-decimal pl-5">
                    <li>Go to Settings</li>
                    <li>Select Mobile/Cellular Data</li>
                    <li>Under Mobile/Cellular Data plans, select your eSIM</li>
                    <li>Go to Mobile/Cellular Data Network</li>
                    <li>
                      In the APN field, type <code>data.esim</code>
                    </li>
                  </ol>
                  <strong>Android:</strong>
                  <ol className="list-decimal pl-5">
                    <li>Go to Settings</li>
                    <li>Select Network &amp; Internet section</li>
                    <li>Choose Mobile Networks</li>
                    <li>Go to Access Point Names</li>
                    <li>
                      Enter the new APN settings: <code>data.esim</code>
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-508"
              >
                <AccordionTrigger>
                  Where can I find my eSIM number?
                </AccordionTrigger>
                <AccordionContent>
                  <p>Your eSIM number can be found in the following ways:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      <strong>On your first eSIM purchase:</strong> If you
                      purchased a bundle or an eSIM for the first time, you will
                      be redirected to your eSIM profile page, where you can
                      find your eSIM number.
                    </li>

                    <li>
                      <strong>In your phone&apos;s eSIM settings:</strong>{" "}
                      Navigate to your mobile phone&apos;s settings and look for
                      the eSIM details under the network or SIM card settings.
                    </li>
                    <li>
                      <strong>On your Lightning invoice:</strong> If you have
                      already an eSIM profile with us and you add a new bundle
                      to it, look at your Lightning invoice for the eSIM number:
                      <br />
                      <code className="bg-gray-100 p-1 rounded">
                        Buying eSIM: esim_1GB_7D_ROC_V2 for 8932042000006857011
                      </code>
                      <br />
                      The last part is your eSIM number.
                    </li>
                  </ol>
                  <p></p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                className="lg:w-[500px] max-w-full"
                value="item-509"
              >
                <AccordionTrigger>Who is your eSIM provider?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Our eSIM provider is eSIM Go Limited, 8 North Bar Street,
                    Banbury, Oxfordshire, England, OX16 0TB, United Kingdom. ICO
                    registration number is ZB002633.
                  </p>
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
                  using your unique referral link and makes a VPN (eSIM
                  following soon) purchase , you earn a 15% commission in
                  Bitcoin.
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
                  VPN purchase. There&rsquo;s no limit to how much you can earn!
                  The more users you refer, the more you make.
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
          <div>
            <h2 className="text-2xl flex justify-center my-4 font-bold text-text dark:text-darkText">
              Support
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
                <AccordionTrigger>How to contact you?</AccordionTrigger>
                <AccordionContent>
                  <p className="my-2">
                    We have a Telegram channel for general questions:{" "}
                    <a
                      className="dark:text-main text-text underline"
                      href="https://t.me/+IKTR7ZYTuEJhZWEy"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Join via invite link
                    </a>
                  </p>

                  <p className="my-2">
                    Or reach out via DM on Telegram:{" "}
                    <a
                      className="dark:text-main text-text underline"
                      href="https://t.me/lnvpn"
                      target="_blank"
                      rel="noreferrer"
                    >
                      lnvpn
                    </a>
                  </p>
                  <p className="my-2">
                    You can also contact us via DM on X:{" "}
                    <a
                      className="dark:text-main text-text underline"
                      href="https://x.com/ln_VPN"
                      target="_blank"
                      rel="noreferrer"
                    >
                      ln_vpn
                    </a>
                  </p>

                  <p className="my-2">
                    Finally, you can email us at:{" "}
                    <a
                      className="dark:text-main text-text underline"
                      href="mailto:info@lnvpn.com"
                    >
                      info at lnvpn.com
                    </a>
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
}
