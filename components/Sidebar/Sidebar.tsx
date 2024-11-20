import Link from "next/link";
import { FilesIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  return (
    <div>
      <div id="sidebar" className="w-36 flex flex-col gap-2 ml-4">
        <Link href="/dashboard/files">
          <Button variant="ghost" className="w-full flex gap-2 justify-start">
            <FilesIcon /> All Files
          </Button>
        </Link>

        <Link href="/dashboard/favorites">
          <Button variant="ghost" className="w-full flex gap-2 justify-start">
            <StarIcon /> Favorites
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar