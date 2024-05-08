import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({

	_id: {
		type: Number
	},

	type: {
		type: String,
		enum: ["stripe", "other"],
	},

	orderId: {
		type: Number,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	tax: {
		type: Number,
		defaultValue: 0
	},
	fee: {
		type: Number,
		defaultValue: 0
	},

	initiatedBy: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},

	stripeMetadata: Object,
	imageMetadata: Object,
	state: String,

}, { collection: 'payments' });

PaymentSchema.set('timestamps', true)
PaymentSchema.set('toJSON', { virtuals: true })
PaymentSchema.set('toObject', { virtuals: true })

module.exports = (mongoose.models?.Payment || mongoose.model('Payment', PaymentSchema));