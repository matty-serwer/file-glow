import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <div className="border-b bg-background sticky top-0 z-50 bg-blue-50">
      <div className="container mx-auto flex items-center justify-between h-14">
        <div className="flex items-center gap-x-2">
          FileGlow
        </div>
        <div className="flex items-center gap-x-2">
          <OrganizationSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  );
}
