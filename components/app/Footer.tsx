import Link from "next/link";
import * as React from "react";

export default function Footer() {
  return (
    <div className="flex justify-center items-center bg-bg dark:bg-darkBg py-2 text-lg">
      <Link
        href="https://t.me/+x_j8zikjnqhiODIy"
        target="_blank"
        rel="noopener noreferrer"
      >
        Telegram
      </Link>
      &ensp;|&ensp;
      <Link
        href="https://lnvpn.net/api/documentation"
        target="_blank"
        rel="noopener noreferrer"
      >
        API
      </Link>
    </div>
  );
}
