"use client";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/loader"; // use o seu loader
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status, data: session } = useSession() as {
    status: "authenticated" | "unauthenticated" | "loading";
    data: (Session & { accessToken?: string }) | null;
  };
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isHomePage = pathname === "/";

  console.log("AuthGuard - status:", status, "pathname:", pathname);
  console.log("AuthGuard - session:", session);

  useEffect(() => {
    if (
      (status === "unauthenticated" && !session?.accessToken) &&
      !isLoginPage &&
      !isRegisterPage &&
      !isHomePage
    ) {
      router.push("/login");
    }
  }, [status, isLoginPage, isRegisterPage, isHomePage, router, session]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Se for a página de login, não bloqueia
  if (isLoginPage || isRegisterPage || isHomePage) return <>{children}</>;

  if (session && session.accessToken) {
    return <>{children}</>;
  }

  // Só mostra o conteúdo se autenticado
  if (status === "authenticated") return <>{children}</>;

  // Se não autenticado, não mostra nada (aguardando redirect)
  return null;
}
