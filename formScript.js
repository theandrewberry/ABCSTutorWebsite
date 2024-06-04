console.log("formScript.js loaded");

document.getElementById('tutoringForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        details: document.getElementById('details').value,
        suggestedDates: document.getElementById('suggestedDates').value
    };

    emailjs.send('service_a7fpyzi', 'template_3ah8k1d', formData)
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        document.getElementById('responseMessage').innerText = 'Thank you for your request!';
        document.getElementById('tutoringForm').reset();
    }, function(error) {
        console.log('FAILED...', error);
        document.getElementById('responseMessage').innerText = 'There was an error sending your request. Please try again.';
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
