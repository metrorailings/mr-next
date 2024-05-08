import mongoose, { Schema } from 'mongoose';

import Note from 'lib/models/note';
import File from 'lib/models/file';

const OrderSchema = new mongoose.Schema({

	_id: {
		type: Number
	},

	order: {
		header: String
	},

	customer: {
		name: {
			type: String,
			required: true
		},
		company: String,
		email: [String],
		areaCode: String,
		phoneOne: String,
		phoneTwo: String,
		address: String,
		aptSuiteNo: String,
		city: String,
		state: String,
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
		isFeeApplied: Boolean,
		depositAmount: Number,
		subtotal: Number,
		tax: Number,
		fee: Number,
		orderTotal: Number,
		shopBonus: Number
	},

	status: {
		type: String,
		enum: ["closed", "prospect", "pending", "planning", "layout", "welding", "grinding", "painting", "install", "closing", "cancelled"]
	},

	text: {
		agreement: [String],
		additionalDescription: String
	},

	payments: {
		balanceRemaining: Number,
		customer: Object,
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
		quoted: Date,
		finalized: Date,
		due: Date
	},

	users: {
		creator: String,
		lastModifier: String
	},

	notes: [{ type: Schema.Types.Number, ref: 'Notes' }],
	files: [{ type: Schema.Types.Number, ref: 'File' }],

	migrated: Boolean,

}, { collection: 'orders' })

OrderSchema.set('timestamps', true)
OrderSchema.set('toJSON', { virtuals: true })
OrderSchema.set('toObject', { virtuals: true })

OrderSchema.post('findOne', (doc) => {
	const designKeys = Object.keys(doc.design);

	for (let i = 0; i < designKeys.length; i += 1) {
		if ( !(doc.design[designKeys[i]]) ) {
			delete doc.design[designKeys[i]];
			delete doc.designDescription[designKeys[i]];
		}
	}
});

module.exports = (mongoose.models?.Order || mongoose.model('Order', OrderSchema));