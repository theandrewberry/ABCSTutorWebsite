console.log("formScript.js loaded");

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_a7fpyzi';
const EMAILJS_TEMPLATE_ID = 'template_3ah8k1d';
const EMAILJS_USER_ID = 'your_user_id'; // Replace with your EmailJS user ID

// Maximum allowed size for attachments (in bytes)
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5 MB

document.getElementById('tutoringForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        details: document.getElementById('details').value,
        suggestedDates: document.getElementById('suggestedDates').value,
    };

    const files = document.getElementById('file').files;
    let totalSize = 0;

    for (let i = 0; i < files.length; i++) {
        totalSize += files[i].size;
        if (totalSize > MAX_ATTACHMENT_SIZE) {
            document.getElementById('responseMessage').innerText = 'Total file size exceeds 5 MB limit.';
            return;
        }
    }

    if (files.length > 0) {
        const zip = new JSZip();
        for (let i = 0; i < files.length; i++) {
            zip.file(files[i].name, files[i]);
        }

        try {
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            console.log("Zip Blob Size:", zipBlob.size);

            if (zipBlob.size > MAX_ATTACHMENT_SIZE) {
                document.getElementById('responseMessage').innerText = 'Compressed file size exceeds 5 MB limit.';
                return;
            }

            const reader = new FileReader();

            reader.onload = function(e) {
                const attachments = [{
                    content: e.target.result.split(',')[1],
                    filename: 'attachments.zip',
                    type: zipBlob.type,
                    disposition: 'attachment'
                }];

                sendEmail(formData, attachments);
            };

            reader.readAsDataURL(zipBlob);
        } catch (error) {
            console.error("Failed to generate zip file:", error);
            document.getElementById('responseMessage').innerText = 'Failed to process attachments. Please try again.';
        }
    } else {
        sendEmail(formData, []);
    }
});

function sendEmail(formData, attachments) {
    const templateParams = {
        ...formData,
        attachments: JSON.stringify(attachments)
    };

    console.log("Sending email with the following data:", templateParams);

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_USER_ID)
        .then(function(response) {
            console.log("Email successfully sent!", response.status, response.text);
            document.getElementById('responseMessage').innerText = 'Thank you for your request!';
            document.getElementById('tutoringForm').reset();
        }, function(error) {
            console.error("Failed to send email:", error);
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
