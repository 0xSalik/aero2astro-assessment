"use client";
import { Button } from "../ui/button";
import { ModeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { Code } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky z-10 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="gap-6 text-lg w-full font-medium flex flex-row md:items-center md:gap-5 lg:gap-6">
        <a href="/" className="font-semibold text-2xl">
          Aero2Astro{" "}
        </a>
      </nav>
      <div className="flex w-full mr-auto gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="flex items-center gap-2 ml-auto">
          <ModeToggle />
          <Button variant={"outline"} size={"icon"}>
            <Link href="https://github.com/0xSalik/" target="_blank">
              <Code className="w-4 h-4 p-0" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
