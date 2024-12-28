import Form from '../models/form.models.js';
import crypto from 'crypto';

// Use a pre-defined key from environment variables for consistency
const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');  // Ensure you use the secret key securely
const algorithm = 'aes-256-cbc'; // AES encryption algorithm
const iv = crypto.randomBytes(16); // Initialization vector for AES

// Function to encrypt text using AES
const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
};

// Function to hash text using SHA-256
const hash = (text) => {
    return crypto.createHash('sha256').update(text).digest('hex');
};

class FormController {
    static async createForm(req, res) {
        const { Name, election_id, phone_no, email, party_name } = req.body;

        // Validate input
        if (!Name || !election_id || !phone_no || !email || !party_name) {
            return res.status(400).send({ status: 'failed', message: 'All fields are required' });
        }

        try {
            // Encrypt fields except party_name
            const encryptedName = encrypt(Name);
            const encryptedElectionId = encrypt(election_id);
            const encryptedPhoneNo = encrypt(phone_no);
            const encryptedEmail = encrypt(email);
            const hashedPartyName = hash(party_name); // Hash the party_name using SHA-256

            // Create a new form with encrypted data and hashed party_name
            const form = new Form({
                Name: encryptedName.encryptedData,
                election_id: encryptedElectionId.encryptedData,
                phone_no: encryptedPhoneNo.encryptedData,
                email: encryptedEmail.encryptedData,
                party_name: hashedPartyName, // Store the hashed party name
                iv: encryptedName.iv, // Store the iv for AES decryption
            });

            // Save the form to the database
            await form.save();

            res.status(201).send({ status: 'success', message: 'Form submitted successfully' });
        } catch (error) {
            console.error('Error submitting form:', error);
            res.status(500).send({ status: 'failed', message: 'Error submitting form' });
        }
    }
}

export default FormController;
