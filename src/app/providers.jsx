"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/react";

export function Providers({ children, themeProps }) {
  const router = useRouter();

  return (
    <NextThemesProvider {...themeProps}>
      <HeroUIProvider navigate={router.push}>
        <ToastProvider/>
        {children}
      </HeroUIProvider>
    </NextThemesProvider>
    
  );
}
