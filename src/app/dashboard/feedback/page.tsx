import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FeedbackInboxClient from "@/components/feedback/FeedbackInboxClient";

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams?: { branchId?: string };
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const business = searchParams?.branchId
    ? await prisma.business.findFirst({
        where: { id: searchParams.branchId, userId: user.id },
        include: {
          feedbacks: {
            orderBy: { createdAt: "desc" },
          },
        },
      })
    : await prisma.business.findFirst({
        where: { userId: user.id },
        include: {
          feedbacks: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

  if (!business) redirect("/dashboard/settings");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Negative Review Shield Inbox 🛡️
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Private customer complaints captured before being posted to Google. Resolve them directly!
          </p>
        </div>
      </div>

      <FeedbackInboxClient feedbacks={business.feedbacks} />
    </div>
  );
}
