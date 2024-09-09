"use client";

import { useState, useEffect } from "react";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  DisclosurePanel,
  DisclosureButton,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPopup, setNotificationPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false); // Estado para controlar se o popup foi mostrado uma vez

  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      current: pathname === "/dashboard",
    },
    { name: "Matrizes", href: "/matrizes", current: pathname === "/matrizes" },
    {
      name: "Filhotes",
      href: "/filhotes",
      current: pathname.startsWith("/filhotes"),
      submenu: [
        { name: "Lista de FIlhotes", href: "/filhotes" },
        { name: "Desmama", href: "/desmama" },
      ],
    },
    { name: "Machos", href: "/machos", current: pathname === "/machos" },
  ];

  const userNavigation = [
    { name: "Perfil", href: "/profile" },
    { name: "Configurações", href: "/settings" },
    { name: "Sair", href: "#" },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session?.user && !hasShownPopup) {
        try {
          const res = await fetch("/api/filhotes/desmama");
          const data = await res.json();
          if (data.length > 0) {
            setNotifications(data);
            setNotificationPopup(true); // Exibir popup no login
            setHasShownPopup(true); // Sinaliza que o popup foi mostrado
          }
        } catch (error) {
          console.error("Erro ao buscar notificações de desmama:", error);
        }
      }
    };

    fetchNotifications();

    const handleMatrizAdded = () => {
      fetchNotifications();
    };

    window.addEventListener("matrizAdded", handleMatrizAdded);

    return () => {
      window.removeEventListener("matrizAdded", handleMatrizAdded);
    };
  }, [session, hasShownPopup]);

  const user = session?.user || { name: "Guest", email: "guest@example.com" };
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "G";

  const handleNotificationClick = () => {
    setNotificationPopup((prevState) => !prevState); // Alternar o estado do popup ao clicar no sino
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Image
                    className="h-9 w-9 invert"
                    src="/icon-cow.svg"
                    alt="Your Company"
                    width={36}
                    height={36}
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) =>
                      item.submenu ? (
                        <Menu as="div" className="relative" key={item.name}>
                          <MenuButton className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                            {item.name}
                          </MenuButton>
                          <MenuItems className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {item.submenu.map((subItem) => (
                              <MenuItem key={subItem.name}>
                                {({ active }) => (
                                  <Link
                                    href={subItem.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {subItem.name}
                                  </Link>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Menu>
                      ) : (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    onClick={handleNotificationClick} // Sempre permitir o clique para abrir o popup
                    className={`relative rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ${
                      notifications.length > 0
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="sr-only">Ver notificações</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
                    )}
                  </button>

                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Abrir menu do usuário</span>
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-500 text-white">
                          {userInitial}
                        </div>
                      </MenuButton>
                    </div>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          {({ active }) =>
                            item.name === "Sair" ? (
                              <button
                                onClick={() =>
                                  signOut({ callbackUrl: "/auth/login" })
                                }
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                                )}
                              >
                                {item.name}
                              </button>
                            ) : (
                              <Link
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </Link>
                            )
                          }
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Abrir menu principal</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-400">
                    {user.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">Ver notificações</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <DisclosureButton
                  as="button"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  Sair
                </DisclosureButton>
              </div>
            </div>
          </DisclosurePanel>

          {/* Popup de notificação saindo do sino */}
          {showNotificationPopup && notifications.length > 0 && (
            <div className="absolute right-16 top-16 bg-yellow-300 shadow-lg p-4 rounded-md border border-gray-200 z-50 transition-all transform translate-y-5 opacity-100">
              <h4 className="text-base font-semibold">Notificações</h4>
              <p className="text-base">
                {notifications.length} filhote(s) precisam ser desmamados.
              </p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => setNotificationPopup(false)}
                  className="mt-2 bg-slate-700 text-white px-3 py-1 rounded"
                >
                  Fechar
                </button>
                <Link href="/desmama">
                  <button
                    onClick={() => setNotificationPopup(false)}
                    className="mt-2 bg-slate-700 text-white px-3 py-1 rounded"
                  >
                    Ir para Desmama
                  </button>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </Disclosure>
  );
}
