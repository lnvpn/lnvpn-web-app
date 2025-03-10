import Link from "next/link";

import MobileDrawer from "@/components/app/MobileDrawer";

import { ThemeSwitcher } from "@/components/app/ThemeSwitcher";

import { Logo } from "./Logo";

function Navbar() {
  return (
    <nav className="sticky top-0 z-20 mx-auto flex h-[88px] w-full items-center border-b-4 border-border dark:border-darkNavBorder bg-white dark:bg-secondaryBlack px-5 m500:h-16">
      <div className="mx-auto flex  w-[1300px] dark:text-darkText text-text max-w-full items-center justify-between">
        <MobileDrawer />

        <div className="flex justify-center gap-10">
          <Link
            className="text-4xl w-[172px] m900:w-6/12 font-heading m500:w-4/12 m500:text-xl"
            href={"/"}
          >
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-10 m900:hidden">
          <Link className="text-xl font-base" href="/">
            VPN
          </Link>

          <Link className="text-xl font-base" href="/esim">
            eSIM
          </Link>
          <Link className="text-xl font-base" href="/phone-numbers">
            <span className="block lg:hidden">SMS</span>
            <span className="hidden lg:block">Phone Numbers</span>
          </Link>
          <Link className="text-xl font-base" href="/faq">
            FAQ
          </Link>
          <Link className="text-xl font-base" href="/partners">
            Partners
          </Link>
        </div>

        <div className="flex w-[250px] items-center justify-end gap-5 m800:w-[unset] m400:gap-3">
          <a
            target="_blank"
            href="https://github.com/lnvpn"
            className="m800:hidden flex items-center justify-center rounded-base border-2 border-border shadow-nav dark:shadow-navDark dark:border-darkBorder p-2 transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none dark:hover:shadow-none"
          >
            <svg
              className="h-6 w-6 m500:h-4 m500:w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
            >
              <path
                className="fill-text dark:fill-darkText"
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
              />
            </svg>
          </a>
          <a
            target="_blank"
            href="https://twitter.com/ln_vpn"
            className="m800:hidden flex items-center justify-center rounded-base border-2 border-border shadow-nav dark:shadow-navDark dark:border-darkBorder p-2 transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none dark:hover:shadow-none"
          >
            <svg
              className="h-6 w-6 m500:h-4 m500:w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                className="fill-text dark:fill-darkText"
                d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
              />
            </svg>
          </a>
          <a
            target="_blank"
            href="https://nostr.at/npub1qmw7jhczdr8yqy5t7u72d6z4v7u9va5gaff0ynwd2u6wwlzs7tvs694er8"
            className="m800:hidden flex items-center justify-center rounded-base border-2 border-border shadow-nav dark:shadow-navDark dark:border-darkBorder p-2 transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none dark:hover:shadow-none"
          >
            <svg
              className="w-6 h-6 text-black dark:fill-darkText "
              fill="currentColor"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* NOSTR Icon Path */}
              <path d="M684.72 485.57c.22 12.59-11.93 51.47-38.67 81.3-26.74 29.83-56.02 20.85-58.42 20.16s-3.09-4.46-7.89-3.77-9.6 6.17-18.86 7.2-17.49 1.71-26.06-1.37c-4.46.69-5.14.71-7.2 2.24s-17.83 10.79-21.6 11.47c0 7.2-1.37 44.57 0 55.89s3.77 25.71 7.54 36 2.74 10.63 7.54 9.94 13.37.34 15.77 4.11c2.4 3.77 1.37 6.51 5.49 8.23s60.69 17.14 99.43 19.2c26.74.69 42.86 2.74 52.12 19.54 1.37 7.89 7.54 13.03 11.31 14.06s8.23 2.06 12 5.83 1.03 8.23 5.49 11.66c4.46 3.43 14.74 8.57 25.37 13.71 10.63 5.14 15.09 13.37 15.77 16.11s1.71 10.97 1.71 10.97-8.91 0-10.97-2.06-2.74-5.83-2.74-5.83-6.17 1.03-7.54 3.43.69 2.74-7.89.69-11.66-3.77-18.17-8.57c-6.51-4.8-16.46-17.14-25.03-16.8 4.11 8.23 5.83 8.23 10.63 10.97s8.23 5.83 8.23 5.83l-7.2 4.46s-4.46 2.06-14.74-.69-11.66-4.46-12.69-10.63 0-9.26-2.74-14.4-4.11-15.77-22.29-21.26c-18.17-5.49-66.52-21.26-100.12-24.69s-22.63-2.74-28.11-1.37-15.77 4.46-26.4-1.37c-10.63-5.83-16.8-13.71-17.49-20.23s-1.71-10.97 0-19.2 3.43-19.89 1.71-26.74-14.06-55.89-19.89-64.12c-13.03 1.03-50.74-.69-50.74-.69s-2.4-.69-17.49 5.83-36.48 13.76-46.77 19.93-14.4 9.7-16.12 13.13c.12 3-1.23 7.72-2.79 9.06s-12.48 2.42-12.48 2.42-5.85 5.86-8.25 9.97c-6.86 9.6-55.2 125.14-66.52 149.83-13.54 32.57-9.77 27.43-37.71 27.43s-8.06.3-8.06.3-12.34 5.88-16.8 5.88-18.86-2.4-26.4 0-16.46 9.26-23.31 10.29-4.95-1.34-8.38-3.74c-4-.21-14.27-.12-14.27-.12s1.74-6.51 7.91-10.88c8.23-5.83 25.37-16.11 34.63-21.26s17.49-7.89 23.31-9.26 18.51-6.17 30.51-9.94 19.54-8.23 29.83-31.54 50.4-111.43 51.43-116.23c.63-2.96 3.73-6.48 4.8-15.09.66-5.35-2.49-13.04 1.71-22.63 10.97-25.03 21.6-20.23 26.4-20.23s17.14.34 26.4-1.37 15.43-2.74 24.69-7.89 11.31-8.91 11.31-8.91l-19.89-3.43s-18.51.69-25.03-4.46-15.43-15.77-15.43-15.77l-7.54-7.2 1.03 8.57s-5.14-8.91-6.51-10.29-8.57-6.51-11.31-11.31-7.54-25.03-7.54-25.03l-6.17 13.03-1.71-18.86-5.14 7.2-2.74-16.11-4.8 8.23-3.43-14.4-5.83 4.46-2.4-10.29-5.83-3.43s-14.06-9.26-16.46-9.6-4.46 3.43-4.46 3.43l1.37 12-12.2-6.27-7-11.9s2.36 4.01-9.62 7.53c-20.55 0-21.89-2.28-24.93-3.94-1.31-6.56-5.57-10.11-5.57-10.11h-20.57l-.34-6.86-7.89 3.09.69-10.29h-14.06l1.03-11.31h-8.91s3.09-9.26 25.71-22.97 25.03-16.46 46.29-17.14c21.26-.69 32.91 2.74 46.29 8.23s38.74 13.71 43.89 17.49c11.31-9.94 28.46-19.89 34.29-19.89 1.03-2.4 6.19-12.33 17.96-17.6 35.31-15.81 108.13-34 131.53-35.54 31.2-2.06 7.89-1.37 39.09 2.06 31.2 3.43 54.17 7.54 69.6 12.69 12.58 4.19 25.03 9.6 34.29 2.06 4.33-1.81 11.81-1.34 17.83-5.14 30.69-25.09 34.72-32.35 43.63-41.95s20.14-24.91 22.54-45.14 4.46-58.29-10.63-88.12-28.8-45.26-34.63-69.26c-5.83-24-8.23-61.03-6.17-73.03 2.06-12 5.14-22.29 6.86-30.51s9.94-14.74 19.89-16.46c9.94-1.71 17.83 1.37 22.29 4.8 4.46 3.43 11.65 6.28 13.37 10.29.34 1.71-1.37 6.51 8.23 8.23 9.6 1.71 16.05 4.16 16.05 4.16s15.64 4.29 3.11 7.73c-12.69 2.06-20.52-.71-24.29 1.69s-7.21 10.08-9.61 11.1-7.2.34-12 4.11-9.6 6.86-12.69 14.4-5.49 15.77-3.43 26.74 8.57 31.54 14.4 43.2c5.83 11.66 20.23 40.8 24.34 47.66s15.77 29.49 16.8 53.83 1.03 44.23 0 54.86-10.84 51.65-35.53 85.94c-8.16 14.14-23.21 31.9-24.67 35.03-1.45 3.13-3.02 4.88-1.61 7.65 4.62 9.05 12.87 22.13 14.71 29.22 2.29 6.64 6.99 16.13 7.22 28.72Z" />
            </svg>
          </a>

          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
