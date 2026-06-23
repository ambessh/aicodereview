import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const { amount, plan } = await req.json();

  const order = await razorpay.orders.create({
    amount: amount * 100, // paise mein
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: { plan },
  });

  return NextResponse.json({ orderId: order.id, amount: order.amount });
}