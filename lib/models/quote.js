import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema({

	_id: {
		type: String
	},
	orderId: Number,

	quoteStatus: {
		type: String,
		enum: ['open', 'finalized']
	},

	termsFileHandle: String,

	dates: {
		created: Date,
		finalized: Date
	},

	users: {
		creator: String,
		finalizer: String
	},

	// All the properties listed from here onward will be parsed from whatever order this quote represents
	sales: {
		header: String,
		assignees: [String],
		quoteSeq: 0,
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
		city: String,
		state: String,
		zipCode: String,
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
	},

	text: {
		additionalDescription: String
	},

	pricing: {
		subtotal: Number,
		tax: Number,
		fee: Number,
		orderTotal: Number,
	},

}, { collection: 'quotes' })

QuoteSchema.set('timestamps', true)
QuoteSchema.set('toJSON', { virtuals: true })
QuoteSchema.set('toObject', { virtuals: true })

QuoteSchema.post('findOne', (doc) => {
	const designKeys = Object.keys(doc.design);

	for (let i = 0; i < designKeys.length; i += 1) {
		if ( !(doc.design[designKeys[i]]) ) {
			delete doc.design[designKeys[i]];
			delete doc.designDescription[designKeys[i]];
		}
	}
});

module.exports = (mongoose.models?.Quote || mongoose.model('Quote', QuoteSchema));