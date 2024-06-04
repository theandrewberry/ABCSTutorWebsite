console.log("formScript.js loaded");

document.getElementById('tutoringForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('subject', document.getElementById('subject').value);
    formData.append('details', document.getElementById('details').value);
    formData.append('suggestedDates', document.getElementById('suggestedDates').value);

    const files = document.getElementById('file').files;
    for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
    }

    setTimeout(() => {
        document.getElementById('responseMessage').innerText = 'Thank you for your request!';
        document.getElementById('tutoringForm').reset();
    }, 500);
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