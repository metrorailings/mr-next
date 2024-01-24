import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({

	_id: {
		type: Number
	},

	orderId: {
		type: Number
	},

	text: String,

	category: {
		type: String,
		enum: ["new", "task", "shop"],
		default: "new"
	},

	assignTo: {
		type: String
	},

	assignFrom: {
		type: String
	},

	dates: {
		created: Date,
		modified: Date
	},

	author: String

}, { collection: 'notes' })

NoteSchema.set("timestamps", true)
NoteSchema.set("toJSON", { virtuals: true })
NoteSchema.set("toObject", { virtuals: true })

module.exports = {
	NOTE: (mongoose.models?.Note || mongoose.model("Note", NoteSchema)),
	noteSchema: NoteSchema
};