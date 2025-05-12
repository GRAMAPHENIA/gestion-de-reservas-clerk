"use client";

import { useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón de menú en el header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-zinc-800/20 transition-colors border border-zinc-800 cursor-pointer"
      >
        <Image src="/icons/menu.svg" alt="Menú" width={16} height={16} className="fill-zinc-200" />
      </button> 

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-zinc-900 z-50 p-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-zinc-200">Menú</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-zinc-500/20 rounded-lg"
            >
              <Image src="/icons/close.svg" alt="Cerrar" width={16} height={16} className="fill-zinc-200" />
            </button>
          </div>
          {/* Aquí puedes agregar los elementos del menú */}
          <nav className="space-y-2">

            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-500/20 w-full border border-zinc-800 cursor-pointer">
              <Image src="/icons/dashboard.svg" alt="Dashboard" width={16} height={16} className="fill-zinc-200" />
              Dashboard
            </button>

            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-500/20 w-full border border-zinc-800 cursor-pointer">
              <Image src="/icons/calendar-days.svg" alt="Reservas" width={16} height={16} className="fill-zinc-200" />
              Reservas
            </button>


            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-500/20 w-full border border-zinc-800 cursor-pointer">
              <Image src="/icons/users.svg" alt="Clientes" width={16} height={16} className="fill-zinc-200" />
              Clientes
            </button>

          </nav>
        </div>
      )}

      {/* Overlay para cerrar el sidebar */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}
    </>
  );
}
