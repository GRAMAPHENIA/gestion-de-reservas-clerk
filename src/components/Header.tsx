"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Tooltip from "./Tooltip";

export default function Header() {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton>
          <Tooltip text="Iniciar sesión">
            <button className="bg-zinc-500/10 hover:bg-zinc-500/20 transition-colors border border-zinc-800 p-2 rounded-b-xl cursor-pointer">
              <Image src="/icons/log-in.svg" alt="Iniciar sesión" width={24} height={24} className="fill-zinc-200" />
            </button>
          </Tooltip>
        </SignInButton>
        <SignUpButton>
          <Tooltip text="Registrarse">
            <button className="bg-zinc-500/10 hover:bg-zinc-500/20 transition-colors border border-zinc-800 p-2 rounded-b-xl cursor-pointer">
              <Image src="/icons/user-plus.svg" alt="Registrarse" width={24} height={24} className="fill-zinc-200" />
            </button>
          </Tooltip>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton showName={true} />
      </SignedIn>
    </header>
  );
}
