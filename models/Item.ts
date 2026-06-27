import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  title: string;
  description: string;
  category: string;
  status: "hilang" | "ditemukan";
  location: string;
  image: string;
  imagePublicId: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: [true, "Judul wajib diisi"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Deskripsi wajib diisi"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Kategori wajib diisi"],
    },
    status: {
      type: String,
      enum: ["hilang", "ditemukan"],
      required: [true, "Status wajib diisi"],
    },
    location: {
      type: String,
      required: [true, "Lokasi wajib diisi"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);

export default Item;