import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({

	blob: {
		url: String,
		pathname: String,
		uploadedAt: Date,
		size: Number
	},

	tags: [{
		type: String,
		enum: ['cable', 'glass']
	}],

	uploader: String,
	index: Number
}, { collection: 'gallery' });

GallerySchema.set('timestamps', true);
GallerySchema.set('toJSON', { virtuals: true });
GallerySchema.set('toObject', { virtuals: true });

module.exports = (mongoose.models?.Gallery || mongoose.model("Gallery", GallerySchema));