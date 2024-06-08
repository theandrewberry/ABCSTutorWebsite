console.log("formScript.js loaded");

document.getElementById('tutoringForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Gather form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        details: document.getElementById('details').value,
        suggestedDates: document.getElementById('suggestedDates').value,
    };

    // Handle file attachments
    const files = document.getElementById('file').files;
    const attachments = [];

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(e) {
                attachments.push({
                    content: e.target.result.split(',')[1], // Remove the Base64 prefix
                    filename: file.name,
                    type: file.type,
                    disposition: 'attachment'
                });

                // Check if all files are processed
                if (attachments.length === files.length) {
                    sendEmail(formData, attachments);
                }
            };

            reader.readAsDataURL(file); // Convert file to Base64
        }
    } else {
        sendEmail(formData, attachments);
    }
});

function sendEmail(formData, attachments) {
    const templateParams = {
        ...formData,
        attachments: JSON.stringify(attachments)
    };

    emailjs.send('service_a7fpyzi', 'template_3ah8k1d', templateParams)
        .then(function(response) {
            document.getElementById('responseMessage').innerText = 'Thank you for your request!';
            document.getElementById('tutoringForm').reset();
        }, function(error) {
            document.getElementById('responseMessage').innerText = 'Failed to send your request. Please try again.';
        });
}

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
