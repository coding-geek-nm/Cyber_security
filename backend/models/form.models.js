import mongoose from 'mongoose';

const  FormSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    election_id: {
        type: String,
        required: true,
    },
    phone_no: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    party_name:{
        type:String,
        required:true,
    }
}, { timestamps: true });

const Form= mongoose.model('Form', FormSchema);

export default Form;
