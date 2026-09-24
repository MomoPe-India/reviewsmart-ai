import React from "react";
import { prisma } from "@/lib/prisma";
import AdminPaymentsClient from "@/components/admin/AdminPaymentsClient";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  let payments: any[] = [];
  let settings: any = null;

  try {
    const [paymentsData, settingsData] = await Promise.all([
      prisma.upiPayment.findMany({
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
      }),
      prisma.platformSetting.findUnique({
        where: { id: "default" },
      }),
    ]);
    payments = paymentsData;
    settings = settingsData;
  } catch (err) {
    console.error("AdminPaymentsPage fetch error:", err);
  }

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
