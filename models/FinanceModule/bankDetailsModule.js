import mongoose from "mongoose";


const bankDetailsSchema = new mongoose.Schema( 
    {
        customerId : { type : String, trim: true, required: true},
        spouseName: { type: String, trim: true, required: true},
        familyMember : { type: String, trim: true, required: true},
        bankName: { type: String, trim: true, required: true},
        branchName: {type: String, trim: true, required: true},
        accountNo: {type: String, trim: true, required: true},
        ifscCode: {type: String, trim: true, required: true}, 
    },
    { timestamps: true}
)

export default mongoose.model("bankDetails", bankDetailsSchema);