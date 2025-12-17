import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        sparse: true,  // Allows multiple undefined/null values
        unique: true,
        lowercase: true,
        trim: true,
        default: undefined  // Use undefined instead of null
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    city: {
        type: String,
        required: false,
        trim: true
    },
    course: {
        type: String,
        required: false,
        trim: true
    },
    dob: {
        type: Date,
        required: false
    },
    address: {
        type: String,
        required: false,
        trim: true
    },
    education: {
        type: String,
        required: false,
        trim: true
    },
    status: {
        type: String,
        enum: ['Complete', 'Pending'],
        default: 'Pending',
    },
    remark: { 
        type: String, 
        default: "" 
    },
    // OTP verification fields
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastOtpSent: {
        type: Date,
        default: null
    },
    // Frontend form fields
    levelOfEducation: {
        type: String,
        default: ""
    },
    coursePreferred: {
        type: String,
        default: ""
    },
    citiesPreferred: {
        type: String,
        default: ""
    },
    collegeName: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    }
}, { 
    timestamps: true 
});

// Create indexes
userSchema.index({ email: 1 }, { sparse: true, unique: true });
userSchema.index({ phone: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

// Function to fix existing data
export async function fixUserData() {
    try {
        // Drop old email index if exists
        try {
            await User.collection.dropIndex("email_1");
            console.log('Dropped old email index');
        } catch (error) {
            console.log('Old email index not found or already dropped');
        }
        
        // Fix null emails to undefined
        const nullResult = await User.updateMany(
            { email: null },
            { $unset: { email: "" } }
        );
        console.log(`Fixed ${nullResult.modifiedCount} users with null email`);
        
        // Fix empty string emails to undefined
        const emptyResult = await User.updateMany(
            { email: "" },
            { $unset: { email: "" } }
        );
        console.log(`Fixed ${emptyResult.modifiedCount} users with empty email`);
        
        // Recreate indexes
        await User.createIndexes();
        console.log('Indexes recreated successfully');
    } catch (error) {
        console.error('Error fixing user data:', error);
    }
}

export default User;