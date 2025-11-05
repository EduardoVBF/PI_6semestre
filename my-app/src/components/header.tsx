"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import React from "react";

function Header() {
  const [name, setName] = React.useState("Visitante");
  const { data: session } = useSession();
  const router = useRouter();

  const extractNameFromEmail = (email: string) => {
    const namePart = email.split("@")[0];
    const nameCapitalized =
      namePart.charAt(0).toUpperCase() + namePart.slice(1);
    return nameCapitalized;
  };

  React.useEffect(() => {
    if (session?.user?.email) {
      const extractedName = extractNameFromEmail(session.user.email);
      setName(extractedName);
    }
  }, [session]);

  return (
    <div className="z-5 flex justify-between w-full h-15 px-3 lg:px-8 bg-gradient-to-r from-primary-purple to-fuchsia-800 drop-shadow-3xl mb-2">
      <div className="flex items-center gap-2 py-2 cursor-pointer">
        <h1
          className="text-2xl lg:text-4xl font-extrabold text-white"
          onClick={() => router.push("/home")}
        >
          FROTINIX
        </h1>
      </div>
      <div className="pr-0 py-2 flex gap-x-2 items-center w-fit justify-end">
        <div className="flex gap-x-2 items-center">
          <p className="text-white text-sm lg:text-base w-fit whitespace-nowrap capitalize">{`Olá, ${name || "Visitante"}`}</p>
        </div>
        <Button
          className="w-1/4 h-8 bg-[#cccccc] hover:bg-[#ffffff] text-black cursor-pointer shadow-md rounded-xl hover:shadow-xl px-8 py-3"
          onClick={async () => {
            await signOut({ callbackUrl: "/" });
          }}
        >
          Sair
        </Button>
      </div>
    </div>
  );
}
export default Header;
