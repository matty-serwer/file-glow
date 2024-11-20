"use client";

import Link from "next/link";
import { FilesIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import clsx from "clsx";
const Sidebar = () => {

  const pathname = usePathname();
  return (
    <div id="sidebar" className="w-36 flex flex-col gap-2 ml-4">
      <Link href="/dashboard/files">
        <Button
          variant={"link"}
          className={clsx("w-full flex gap-2 justify-start",
            {
              "text-cyan-700": pathname.includes("/dashboard/files")
            })}
        >
          <FilesIcon /> All Files
        </Button>
      </Link>

      <Link href="/dashboard/favorites">
        <Button
          variant={"link"}
          className={clsx("w-full flex gap-2 justify-start",
            {
              "text-cyan-700": pathname.includes("/dashboard/favorites")
            })}
        >
          <StarIcon /> Favorites
        </Button>
      </Link>
    </div>
  )
}

export default Sidebar