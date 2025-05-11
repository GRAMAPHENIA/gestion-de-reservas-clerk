"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import UserButton from "./UserButtonCustom";
import Image from "next/image";
import Tooltip from "./Tooltip";
import Sidebar from "./Sidebar";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 h-16 border-b border-white/10">
      {/* Lado izquierdo: menú */}
      <Sidebar />

      {/* Lado derecho: inbox y avatar */}
      <div className="flex items-center gap-4">
        <SignedIn>
          <button className="p-2 rounded-lg hover:bg-zinc-500/20 transition-colors border border-zinc-800 cursor-pointer">
            <Image src="/icons/inbox.svg" alt="Mensajes" width={16} height={16} className="fill-zinc-200" />
          </button>
          <UserButton />

        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Tooltip text="Iniciar sesión">
              <button className="bg-zinc-500/10 hover:bg-zinc-500/20 transition-colors border border-zinc-800 p-2 rounded-lg cursor-pointer">
                <Image src="/icons/log-in.svg" alt="Iniciar sesión" width={16} height={16} className="fill-zinc-200" />
              </button>
            </Tooltip>
          </SignInButton>
          <SignUpButton>
            <Tooltip text="Registrarse">
              <button className="bg-zinc-500/10 hover:bg-zinc-500/20 transition-colors border border-zinc-800 p-2 rounded-lg cursor-pointer">
                <Image src="/icons/user-plus.svg" alt="Registrarse" width={16} height={16} className="fill-zinc-200" />
              </button>
            </Tooltip>
          </SignUpButton>
        </SignedOut>
      </div>
    </header>
  );
}
