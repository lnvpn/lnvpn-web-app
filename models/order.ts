// models/order.ts
import mongoose, { Document, Model } from "mongoose";

interface IOrder extends Document {
  partnerCode: string;
  paidSatoshis: number;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    partnerCode: {
      type: String,
      required: true,
    },
    paidSatoshis: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
