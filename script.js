// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        
        // Remove active class from all tabs and buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked button and corresponding tab
        button.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

let currentQRCode = null;

// Generate QR Code based on type
function generateQR(type) {
    let qrData = '';
    
    if (type === 'link') {
        const linkInput = document.getElementById('link-input').value.trim();
        if (!linkInput) {
            alert('Please enter a URL');
            return;
        }
        qrData = linkInput;
    } 
    else if (type === 'whatsapp') {
        const whatsappNumber = document.getElementById('whatsapp-input').value.trim().replace(/[^0-9+]/g, '');
        if (!whatsappNumber) {
            alert('Please enter a WhatsApp number');
            return;
        }
        const message = document.getElementById('whatsapp-message').value.trim();
        qrData = `https://wa.me/${whatsappNumber.replace('+', '')}`;
        if (message) {
            qrData += `?text=${encodeURIComponent(message)}`;
        }
    }
    
    createQRCode(qrData);
}

// Create QR Code
function createQRCode(data) {
    // Clear previous QR code
    const qrCanvas = document.getElementById('qr-canvas');
    qrCanvas.innerHTML = '';
    
    // Create new QR code
    try {
        currentQRCode = new QRCode(qrCanvas, {
            text: data,
            width: 300,
            height: 300,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Show QR result and hide placeholder
        setTimeout(() => {
            document.getElementById('qr-placeholder').style.display = 'none';
            document.getElementById('qr-result').classList.remove('hidden');
        }, 100);
    } catch (error) {
        console.error('QR Code Error:', error);
        alert('Error generating QR code: ' + error.message);
    }
}

// Download QR Code
function downloadQR() {
    if (!currentQRCode) {
        alert('Please generate a QR code first');
        return;
    }
    
    const canvas = document.querySelector('#qr-canvas canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } else {
        alert('Unable to download QR code');
    }
}

// Clear QR Code
function clearQR() {
    const qrCanvas = document.getElementById('qr-canvas');
    qrCanvas.innerHTML = '';
    currentQRCode = null;
    
    // Show placeholder and hide result
    document.getElementById('qr-placeholder').style.display = 'block';
    document.getElementById('qr-result').classList.add('hidden');
    
    // Clear all inputs
    document.getElementById('link-input').value = '';
    document.getElementById('whatsapp-input').value = '';
    document.getElementById('whatsapp-message').value = '';
}

// Allow Enter key to generate QR code
document.getElementById('link-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateQR('link');
});

document.getElementById('whatsapp-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateQR('whatsapp');
});
