import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: [2, 'Name must be at least 2 characters'],
        maxLength: [100, 'Name must be at most 100 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        minLength: [0, 'Price must be at least 0 characters'],
    },
    currency: {
        type: String,
        enum: ['USD', 'VND'],
        default: 'VND',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['news', 'finance', 'technology', 'entertainment', 'other'],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past',
        },
    },
    renewalDate: {
        type: Date,
        required: false,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Rewall date must be after start date',
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
}, { timestamps: true });

// Calculate renewalDate is missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.startDate.getDate() + renewalPeriods[this.frequency]);
    }

    // Update status if renewalDate has passed
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;