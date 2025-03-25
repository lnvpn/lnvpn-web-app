import mongoose, { Document, Model } from "mongoose";

interface IOrder extends Document {
  partnerCode: string;
  amount: number;
  orderType?: string; // 'vpn' or 'esim'
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    partnerCode: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    orderType: {
      type: String,
      enum: ["vpn", "esim"],
      default: "vpn", // Default to 'vpn' for backward compatibility
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
