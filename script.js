// DOM Elements
const form = document.getElementById('wifi-form');
const wifiNameInput = document.getElementById('wifi-name');
const wifiPasswordInput = document.getElementById('wifi-password');
const encryptionSelect = document.getElementById('encryption-type');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const clearBtn = document.getElementById('clear-btn');
const qrContainer = document.getElementById('qr-container');
const qrWrapper = document.getElementById('qr-wrapper');
const loading = document.getElementById('loading');
const credentialsPreview = document.getElementById('credentials-preview');
const togglePasswordBtn = document.getElementById('toggle-password');
const wifiNameError = document.getElementById('wifi-name-error');
const wifiPasswordError = document.getElementById('wifi-password-error');

// Event Listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  generateQRCode();
});
wifiNameInput.addEventListener('input', validateForm);
wifiPasswordInput.addEventListener('input', validateForm);
encryptionSelect.addEventListener('change', validateForm);
copyBtn.addEventListener('click', copyCredentials);
downloadBtn.addEventListener('click', downloadQRCode);
clearBtn.addEventListener('click', clearForm);
togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

// Form Validation
function validateForm() {
  const ssid = wifiNameInput.value.trim();
  const password = wifiPasswordInput.value.trim();
  const encryption = encryptionSelect.value;

  let isValid = ssid !== '';

  wifiNameError.textContent = ssid ? '' : 'WiFi name is required';
  wifiPasswordError.textContent = '';

  if (encryption !== 'None' && !password) {
    wifiPasswordError.textContent = 'Password is required for this encryption';
    isValid = false;
  }

  generateBtn.disabled = !isValid;
  copyBtn.disabled = !isValid;
}

// Generate QR Code
function generateQRCode() {
  const ssid = wifiNameInput.value.trim();
  const password = wifiPasswordInput.value.trim();
  const encryption = encryptionSelect.value;

  if (!ssid) return;

  const qrText = `WIFI:T:${encryption};S:${ssid};P:${password};;`;

  qrContainer.innerHTML = ''; // Clear previous content
  qrContainer.appendChild(loading); // Re-append loading
  qrContainer.appendChild(qrWrapper); // Re-append wrapper
  loading.classList.remove('hidden');
  qrWrapper.classList.add('hidden');

  setTimeout(() => {
    const qr = new QRious({
      element: document.getElementById('qr-code'),
      value: qrText,
      size: 200,
      foreground: '#14b8a6', // Teal color
      background: '#ffffff',
    });

    loading.classList.add('hidden');
    qrWrapper.classList.remove('hidden');
    qrWrapper.classList.add('visible');
    downloadBtn.disabled = false;

    // Update credentials preview
    credentialsPreview.innerHTML = `
      <strong>SSID:</strong> ${ssid}<br>
      <strong>Password:</strong> ${password || 'None'}<br>
      <strong>Encryption:</strong> ${encryption}
    `;
  }, 500); // Simulate loading
}

// Copy Credentials
function copyCredentials() {
  const ssid = wifiNameInput.value.trim();
  const password = wifiPasswordInput.value.trim();
  const encryption = encryptionSelect.value;

  if (!ssid) {
    alert('Please enter WiFi name (SSID)!');
    return;
  }

  const text = `SSID: ${ssid}\nPassword: ${password || 'None'}\nEncryption: ${encryption}`;
  navigator.clipboard.writeText(text).then(() => {
    alert('WiFi credentials copied to clipboard!');
  });
}

// Download QR Code
function downloadQRCode() {
  const qrCanvas = qrWrapper.querySelector('canvas');
  if (!qrCanvas) {
    alert('Generate a QR code first!');
    return;
  }

  const link = document.createElement('a');
  link.href = qrCanvas.toDataURL();
  link.download = 'wifi-qrcode.png';
  link.click();
}

// Clear Form
function clearForm() {
  form.reset();
  qrContainer.innerHTML = '';
  qrContainer.appendChild(loading);
  qrContainer.appendChild(qrWrapper);
  credentialsPreview.innerHTML = '';
  loading.classList.add('hidden');
  qrWrapper.classList.add('hidden');
  generateBtn.disabled = true;
  copyBtn.disabled = true;
  downloadBtn.disabled = true;
  wifiNameError.textContent = '';
  wifiPasswordError.textContent = '';
}

// Toggle Password Visibility
function togglePasswordVisibility() {
  const type = wifiPasswordInput.type === 'password' ? 'text' : 'password';
  wifiPasswordInput.type = type;
  togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
}