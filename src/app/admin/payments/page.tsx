import React from "react";
import { prisma } from "@/lib/prisma";
import AdminPaymentsClient from "@/components/admin/AdminPaymentsClient";

export default async function AdminPaymentsPage() {
  const payments = await prisma.upiPayment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          businesses: {
            select: { name: true, slug: true },
          },
        },
      },
    },
  });

  const settings = await prisma.platformSetting.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white tracking-tight">
          UPI Payments &amp; Verification 🇮🇳
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Verify 12-digit UTR numbers submitted by customers and configure your receiver UPI ID.
        </p>
      </div>

      <AdminPaymentsClient initialPayments={payments} initialSettings={settings} />
    </div>
  );
}
