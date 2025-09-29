import mongoose from "mongoose";


const loanDetailSchema = new mongoose.Schema(
    {
        loanNumber: { type: String, required: true },
        customerName: { type: String, required: true },
        productName: { type: String, required: true },
        totalAmount: { type: Number, required: true },
        monthlyPaidAmount: { type: Number, required: true },
        remainingAmount: { type: Number, required: true },
        latePayment: { type: String },
        invoice: { type: String },      // Cloudinary URL
        geoLocation: { type: String },
        shopDetails: { type: String },  // Cloudinary URL
        // status: { type: String, required: true }
    },
    {timestamps : true},
)

export default mongoose.model("LoanDetails", loanDetailSchema);