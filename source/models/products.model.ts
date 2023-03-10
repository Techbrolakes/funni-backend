import { Schema } from 'mongoose';

export const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        image: { type: String, required: true },
        overview: { type: String, required: true },
        details: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);
