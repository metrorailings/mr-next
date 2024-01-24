import mongoose from "mongoose";

import { hashWithSecret } from 'lib/utils';

const UserSchema = new mongoose.Schema({

	username: {
		type: String,
		unique: true,
		required: true
	},

	password: {
		type: String,
		required: true,
		transform: () => null
	},

	firstName: {
		type: String,
		required: true
	},

	lastName: String,

	access: {
		type: String,
		// enum: ["dashboard", "orders", "orderGeneral", "priority", "shopSchedule", "shopBoard", "finances", "keywords", "products", "galleryAdmin"]
	},

	landingPage: {
		type: String,
		enum: ["dashboard", "shopSchedule"],
		default: "dashboard"
	},

	role: {
		type: String,
		enum: ["shop", "admin"],
		default: "admin"
	},

	email: {
		type: String,
		lowercase: true,
		unique: true,
	},

	isActive: {
		type: Boolean,
		default: true
	},

}, { collection: "admins" });

UserSchema.pre("validate", function (next) {
	if (this.isNew) {
		if (this.password === undefined || this.password === null) {
			return next(new Error("No password defined"));
		}
	}
	return next();
})

UserSchema.pre("save", function (next) {
	const user = this;
	if (this.isModified("password") || this.isNew) {
		try {
			user.password = hashWithSecret(process.env.SECRET);
		} catch (error) {
			return next(error);
		}
	}
	return next()
})

UserSchema.methods.validatePassword = function (pw) {
	try {
		return (hashWithSecret(pw) === this.password);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

UserSchema.post("save", function () {
	// TODO: Send e-mail to new user
})

UserSchema.virtual("fullname").get(function () {
	return (this.first || '') + (this.last || '');
})

UserSchema.set("timestamps", true);
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

module.exports = (mongoose.models?.User || mongoose.model("User", UserSchema));