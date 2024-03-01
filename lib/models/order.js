import mongoose from 'mongoose';

import { noteSchema } from 'lib/models/note';
import { fileSchema } from 'lib/models/file';

const OrderSchema = new mongoose.Schema({

	_id: {
		type: Number
	},

	customer: {
		name: {
			type: String,
			required: true
		},
		company: String,
		emails: [String],
		areaCode: String,
		phoneOne: String,
		phoneTwo: String,
		address: String,
		aptSuiteNo: String,
		city: String,
		state: {
			type: String,
			enum: ["NJ", "NY", "PA"],
		},
		zipCode: String,
		nickname: String
	},

	design: {
		type: {
			type: String
		},
		post: String,
		handrailing: String,
		postEnd: String,
		postCap: String,
		ada: String,
		color: String,

		picketSize: String,
		picketStyle: String,
		centerDesign: String,
		collars: String,
		baskets: String,
		valence: String,

		cableSize: String,
		glassType: String,
		glassBuild: String
	},

	designDescription: {
		type: {
			type: String
		},
		post: String,
		handrailing: String,
		postEnd: String,
		postCap: String,
		ada: String,
		color: String,

		picketSize: String,
		picketStyle: String,
		centerDesign: String,
		collars: String,
		baskets: String,
		valence: String,

		cableSize: String,
		glassType: String,
		glassBuild: String
	},

	dimensions: {
		length: Number,
		finishedHeight: Number
	},

	installation: {
		platformType: {
			type: String,
			enum: ["concrete", "wood", "lime", "stone", "fiber", "earth", "other"]
		},
		coverPlates: Boolean
	},

	pricing: {
		pricePerFoot: Number,
		additionalPrice: Number,
		isTaxApplied: Boolean,
		isTariffApplied: Boolean,
		depositAmount: Number,
		subTotal: Number,
		tax: Number,
		tariff: Number,
		orderTotal: Number,
		shopBonus: Number
	},

	status: {
		type: String,
		enum: ["closed", "prospect", "pending", "material", "layout", "welding", "grinding", "painting", "install", "closing", "cancelled"]
	},

	text: {
		agreement: [String],
		additionalDescription: String
	},

	payments: {
		balanceRemaining: Number,
		cards: [Object],
		charges: [Object],
	},

	modHistory: [{
		user: String,
		date: Date,
		reason: String
	}],

	dates: {
		created: Date,
		lastModified: Date,
		finalized: Date,
		due: Date
	},

	users: {
		creator: String,
		lastModifier: String
	},

	notes: [noteSchema],
	files: [fileSchema],

	migrated: Boolean,

}, { collection: 'orders' })

OrderSchema.set("timestamps", true)
OrderSchema.set("toJSON", { virtuals: true })
OrderSchema.set("toObject", { virtuals: true })

module.exports = (mongoose.models?.Order || mongoose.model("Order", OrderSchema));