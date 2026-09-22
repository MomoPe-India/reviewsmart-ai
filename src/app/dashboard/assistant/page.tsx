import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewReplyClient from "@/components/assistant/ReviewReplyClient";

export default async function AssistantPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const business = await prisma.business.findFirst({
    where: { userId: user.id },
  });

  if (!business) redirect("/dashboard/settings");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            AI Review Reply Assistant 💬
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Google rewards businesses that reply quickly to reviews. Paste any review here and let Gemini AI draft a personalized owner reply in seconds.
          </p>
        </div>
      </div>

      <ReviewReplyClient business={business} />
    </div>
  );
}
