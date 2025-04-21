import { isAthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const isUserAuthenticated = await isAthenticated();

  if (isUserAuthenticated) {
    redirect("/");
  }
  return (
    <div className="auth-layout">
      {children} <Toaster />
    </div>
  );
}

export default AuthLayout;
