"use client";

import { UserButton as ClerkUserButton } from "@clerk/nextjs";

export default function UserButton() {
  return (
    <ClerkUserButton
      appearance={{
        elements: {
          avatarBox: "rounded-full border border-zinc-800",
        },
      }}
    />
  );
}
