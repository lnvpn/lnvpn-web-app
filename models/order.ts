import mongoose, { Document, Model } from "mongoose";

interface IOrder extends Document {
  partnerCode: string;
  amount: number;
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
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
