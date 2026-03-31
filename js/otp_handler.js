// 1. Initialize EmailJS with your Public Key
// Get this from: Account > API Keys > Public Key
const YOUR_PUBLIC_KEY ='AYAC6GU15yG6Hh2Kz'
const YOUR_SERVICE_ID = 'service_fo6tuy5'
const YOUR_TEMPLATE_ID ='template_g1usc3p'
emailjs.init(YOUR_PUBLIC_KEY);

let generatedOTP;

function sendOTP() {
    const emailField = document.getElementById('contact-email');
    const sendBtn = document.getElementById('send-otp-btn');
    const otpGroup = document.getElementById('otp-group');

    if (!emailField.checkValidity()) {
        alert("Please enter a valid email address.");
        return;
    }

    // 1. Generate 4-digit OTP
    generatedOTP = Math.floor(1000 + Math.random() * 9000);

    // 2. Calculate Expiry Time (Current time + 15 minutes)
    // This provides the value for your {{time}} placeholder
    const expiry = new Date(new Date().getTime() + 15 * 60000);
    const timeString = expiry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 3. Prepare parameters exactly as named in your HTML template
    const templateParams = {
        to_email: emailField.value, // Recipient email
        otp_code: generatedOTP,     // Matches {{otp_code}}
        time: timeString            // Matches {{time}}
    };

    // 4. Send the email via EmailJS
    emailjs.send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, templateParams)
        .then(() => {
            alert(`OTP sent! Valid until ${timeString}.`);
            otpGroup.style.display = 'flex';
            sendBtn.innerText = "Resend OTP";
        }, (error) => {
            console.error("EmailJS Error:", error);
            alert("Failed to send OTP. Please check your console.");
        });
}


function verifyOTP() {
    const userInput = document.getElementById('otp-input').value;
    const submitBtn = document.getElementById('submit-btn');
    const downloadBtn = document.getElementById('final-download-btn');
    const emailField = document.getElementById('contact-email');
    const otpGroup = document.getElementById('otp-group');

    if (userInput == generatedOTP) {
        alert("Email Verified!");
        submitBtn.disabled = false;
        downloadBtn.style.display = 'inline-block';
        otpGroup.style.display = 'none';
        emailField.readOnly = true;
    } else {
        alert("Invalid OTP.");
    }
}
