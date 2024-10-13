import { OrganizationSwitcher, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

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
          <SignedOut>
            <SignInButton>
              <Button>Sign in</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
