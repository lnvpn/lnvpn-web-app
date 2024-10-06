// models/partner.ts
import mongoose, { Document, Model } from "mongoose";

interface IPartner extends Document {
  payoutAddress: string;
  custom_code: string;
}

const partnerSchema = new mongoose.Schema<IPartner>(
  {
    payoutAddress: {
      type: String,
      required: true,
    },
    custom_code: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Partner: Model<IPartner> =
  mongoose.models.Partner || mongoose.model<IPartner>("Partner", partnerSchema);

export default Partner;
