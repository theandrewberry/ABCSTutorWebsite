console.log("formScript.js loaded");

const EMAILJS_SERVICE_ID = 'service_a7fpyzi';
const EMAILJS_TEMPLATE_ID = 'template_3ah8k1d';
const EMAILJS_PUBLIC_KEY = 'AXlAGwjHEX5EDr2js';

emailjs.init(EMAILJS_PUBLIC_KEY);

document.getElementById('tutoringForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const form = document.getElementById('tutoringForm');
    
    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
        .then(function(response) {
            console.log("Email successfully sent!", response.status, response.text);
            document.getElementById('responseMessage').innerText = 'Thank you for your request!';
            form.reset();
        }, function(error) {
            console.error("Failed to send email:", error);
            document.getElementById('responseMessage').innerText = 'Failed to send your request. Please try again.';
        });
});

const fileInput = document.getElementById('file');
const fileChosen = document.getElementById('file-chosen');

fileInput.addEventListener('change', function() {
    if (fileInput.files.length > 0) {
        fileChosen.textContent = Array.from(fileInput.files).map(file => file.name).join(', ');
    } else {
        fileChosen.textContent = 'No file chosen';
    }
});

// PayPal and Venmo Buttons
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '0.01' // Replace with actual amount
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            document.getElementById('paymentResponseMessage').innerText = 'Payment completed by ' + details.payer.name.given_name;
        });
    },
    onError: function(err) {
        document.getElementById('paymentResponseMessage').innerText = 'Payment failed. Please try again.';
    },
    onClick: (data) => {
        const fundingSource = data.fundingSource;
        if (fundingSource === 'venmo') {
            document.getElementById('paymentResponseMessage').innerText = 'Payment completed with Venmo';
        }
    }
}).render('#paypal-button-container');

// Zelle Payment Instructions
function showZelleInstructions() {
    document.getElementById('paymentResponseMessage').innerText = 'To pay with Zelle, please send the payment to email@example.com and include your name and order details in the notes.';
}
