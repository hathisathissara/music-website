const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// PayPal Webhook Endpoint
app.post('/webhook', (req, res) => {
    const webhookId = '99F52633MK474762S'; // Replace with your webhook ID from PayPal
    const transmissionId = req.headers['paypal-transmission-id'];
    const timestamp = req.headers['paypal-transmission-time'];
    const webhookEvent = req.body;
    const certUrl = req.headers['paypal-cert-url'];
    const authAlgo = req.headers['paypal-auth-algo'];
    const transmissionSig = req.headers['paypal-transmission-sig'];

    // Verify the webhook signature
    const isValid = verifyWebhookSignature(
        webhookId,
        transmissionId,
        timestamp,
        webhookEvent,
        certUrl,
        authAlgo,
        transmissionSig
    );

    if (isValid) {
        console.log('Webhook verified:', webhookEvent);

        // Handle the event (e.g., send digital product)
        if (webhookEvent.event_type === 'PAYMENT.SALE.COMPLETED') {
            const sale = webhookEvent.resource;
            console.log('Payment completed for:', sale.amount.total, sale.payer.email_address);
            // Send digital product to the customer
        }

        res.status(200).send('Webhook received');
    } else {
        console.error('Invalid webhook signature');
        res.status(400).send('Invalid signature');
    }
});

// Function to verify webhook signature
function verifyWebhookSignature(webhookId, transmissionId, timestamp, webhookEvent, certUrl, authAlgo, transmissionSig) {
    // Use PayPal SDK or implement your own signature verification logic
    // For simplicity, this example assumes the signature is valid
    return true;
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});