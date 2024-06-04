import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({

	_id: {
		type: Number
	},
	orderId: Number,

	status: {
		type: String,
		enum: ['open', 'finalized', 'cancelled']
	},

	category: {
		type: String,
		enum: ['quote', 'progress', 'final']
	},

	amount: Number,

	termsFileHandle: String,

	dates: {
		created: Date,
		finalized: Date
	},

	users: {
		creator: String,
		finalizer: String
	},

	paymentId: Number,

	// All the properties listed from here onward will be parsed from whatever order this invoice represents
	sales: {
		header: String,
		assignees: [{
			username: String
		}],
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

	payments: {
		cards: {
			type: [Object],
			default: []
		}
	},

	pricing: {
		subtotal: Number,
		tax: Number,
		fee: Number,
		orderTotal: Number
	},

}, { collection: 'invoices' })

InvoiceSchema.set('timestamps', true)
InvoiceSchema.set('toJSON', { virtuals: true })
InvoiceSchema.set('toObject', { virtuals: true })

InvoiceSchema.post('findOne', (doc) => {
	if (doc) {
		const designKeys = Object.keys(doc.design);

		for (let i = 0; i < designKeys.length; i += 1) {
			if ( !(doc.design[designKeys[i]]) ) {
				delete doc.design[designKeys[i]];
				delete doc.designDescription[designKeys[i]];
			}
		}
	}
});

module.exports = (mongoose.models?.Invoice || mongoose.model('Invoice', InvoiceSchema));