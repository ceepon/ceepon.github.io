// 1. Initialize EmailJS
const YOUR_PUBLIC_KEY = 'AYAC6GU15yG6Hh2Kz';
const YOUR_SERVICE_ID = 'service_fo6tuy5';
const YOUR_TEMPLATE_ID = 'template_g1usc3p';
emailjs.init(YOUR_PUBLIC_KEY);

let generatedOTP;
let isVerified = false;
let resendTimer = 0;

// --- OTP Logic (EmailJS) ---

function startResendTimer() {
    const sendBtn = document.getElementById('send-otp-btn');
    resendTimer = 30;
    sendBtn.disabled = true;

    const interval = setInterval(() => {
        resendTimer--;
        if (resendTimer > 0) {
            sendBtn.innerText = `Resend in ${resendTimer}s`;
        } else {
            clearInterval(interval);
            sendBtn.disabled = false;
            sendBtn.innerText = "Resend OTP";
        }
    }, 1000);
}

function sendOTP() {
    const emailField = document.getElementById('contact-email');
    const nameField = document.querySelector('input[name="name"]');
    const phoneField = document.querySelector('input[name="phone"]');
    const messageField = document.querySelector('textarea[name="message"]'); // Get Message
    const otpGroup = document.getElementById('otp-group');

    // Validation: Require Name, Email, and Message
    if (!nameField.value || !emailField.checkValidity()) {
        alert("Please fill in your Name and Email before requesting an OTP.");
        return;
    }

    generatedOTP = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date(new Date().getTime() + 15 * 60000);
    const timeString = expiry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // --- CAPTURING ALL DATA FOR EMAILJS ---
    const templateParams = {
        to_email: emailField.value,
        user_name: nameField.value,        // Matches {{user_name}}
        user_phone: phoneField.value || "NA", // Matches {{user_phone}}
        user_message: messageField.value || "NA",  // Matches {{user_message}}
        otp_code: generatedOTP,
        time: timeString
    };

    emailjs.send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, templateParams)
        .then(() => {
            alert(`OTP sent! Valid until ${timeString}.`);
            otpGroup.style.display = 'flex';
            startResendTimer();
        }, (error) => {
            console.error("EmailJS Error:", error);
            alert("Failed to send OTP.");
        });
}

function verifyOTP() {
    const userInput = document.getElementById('otp-input').value;
    const submitBtn = document.getElementById('submit-btn');
    const emailField = document.getElementById('contact-email');
    const nameField = document.querySelector('input[name="name"]');
    const phoneField = document.querySelector('input[name="phone"]');
    const messageField = document.querySelector('textarea[name="message"]');
    const otpGroup = document.getElementById('otp-group');
    const sendBtn = document.getElementById('send-otp-btn');

    if (userInput == generatedOTP) {
        alert("Email Verified!");
        isVerified = true;
        submitBtn.disabled = false;
        otpGroup.style.display = 'none';

        // Lock all fields so they can't be changed after verification
        emailField.readOnly = true;
        nameField.readOnly = true;
        phoneField.readOnly = true;
        //messageField.readOnly = true;

        sendBtn.innerText = "Verified ✓";
        sendBtn.disabled = true;
        resendTimer = 0;
    } else {
        alert("Invalid OTP.");
    }
}

// --- Formspree & Download Logic remains the same ---
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!isVerified) {
            alert("Please verify your email first.");
            return;
        }

        const btn = document.getElementById('submit-btn');
        const downloadText = btn.querySelector('.download-text');
        const loadingText = btn.querySelector('.loading-text');

        if(downloadText) downloadText.style.display = 'none';
        if(loadingText) loadingText.style.display = 'inline';
        btn.disabled = true;

        try {
            const formData = new FormData(this);

            const formResponse = await fetch('https://formspree.io/f/xpqoakga', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (formResponse.ok) {
                const link = document.createElement('a');
                link.href = 'assets/docs/resume-sample.pdf';
                link.download = 'Ceepon_Pradhan_CV.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                alert('Message sent! Your download has started.');
                form.reset();
                btn.innerText = "Sent Successfully";
            } else {
                throw new Error('Formspree failed');
            }
        } catch (error) {
            alert('Error sending message. Please try again.');
            btn.disabled = false;
        } finally {
            if(loadingText) loadingText.style.display = 'none';
        }
    });
});
























