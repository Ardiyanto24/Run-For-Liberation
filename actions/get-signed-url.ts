// actions/get-signed-url.ts

"use server";

import { getSignedUrl } from "@/lib/supabase";
import { getTreasurySignedUrl } from "@/lib/supabase";

export async function getPaymentProofSignedUrl(
  rawPath: string | null
): Promise<string | null> {
  if (!rawPath) return null;
  return getSignedUrl("payment-proofs", rawPath);
}

export async function getDonationProofSignedUrl(
  rawPath: string | null
): Promise<string | null> {
  if (!rawPath) return null;
  return getSignedUrl("donation-proofs", rawPath);
}

export async function getTreasuryIncomeSignedUrl(
  rawPath: string | null
): Promise<string | null> {
  if (!rawPath) return null;
  return getTreasurySignedUrl("treasury-income-proofs", rawPath);
}

export async function getTreasuryExpenseSignedUrl(
  rawPath: string | null
): Promise<string | null> {
  if (!rawPath) return null;
  return getTreasurySignedUrl("treasury-expense-proofs", rawPath);
}