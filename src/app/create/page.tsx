import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

/**
 * /create — No longer a self-service page.
 * All merchants are onboarded by the Super Admin or Marketing Agents.
 * Authenticated merchants go to /dashboard to customize their card.
 * Unauthenticated visitors go to /login.
 */
export default async function CreatePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "BUSINESS_OWNER") {
    redirect("/dashboard");
  }

  if (user.role === "MARKETING_AGENT") {
    redirect("/agent");
  }

  if (user.role === "SUPER_ADMIN") {
    redirect("/admin");
  }

  redirect("/login");
}
