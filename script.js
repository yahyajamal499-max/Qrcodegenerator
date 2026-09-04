/* =====================================
   QR STUDIO
   Generator + Scanner
===================================== */


/* =====================================
   ELEMENTS
===================================== */

const generatorTab =
    document.getElementById("generatorTab");

const scannerTab =
    document.getElementById("scannerTab");

const generatorSection =
    document.getElementById("generatorSection");

const scannerSection =
    document.getElementById("scannerSection");

const formContainer =
    document.getElementById("formContainer");

const generateBtn =
    document.getElementById("generateBtn");

const qrcodeElement =
    document.getElementById("qrcode");

const emptyState =
    document.getElementById("emptyState");

const downloadBtn =
    document.getElementById("downloadBtn");

const copyBtn =
    document.getElementById("copyBtn");

const typeButtons =
    document.querySelectorAll(".type-btn");


/* =====================================
   CURRENT TYPE
===================================== */

let currentType = "text";

let generatedData = "";

let qrCodeObject = null;

let scanner = null;

let scannerRunning = false;


/* =====================================
   TAB SWITCHING
===================================== */

generatorTab.addEventListener("click", () => {

    generatorTab.classList.add("active");

    scannerTab.classList.remove("active");

    generatorSection.classList.remove("hidden");

    scannerSection.classList.add("hidden");

});


scannerTab.addEventListener("click", () => {

    scannerTab.classList.add("active");

    generatorTab.classList.remove("active");

    scannerSection.classList.remove("hidden");

    generatorSection.classList.add("hidden");

});


/* =====================================
   TYPE BUTTONS
===================================== */

typeButtons.forEach(button => {

    button.addEventListener("click", () => {

        typeButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentType =
            button.dataset.type;

        renderForm();

    });

});


/* =====================================
   FORM GENERATOR
===================================== */

function renderForm() {

    let html = "";

    switch (currentType) {


        /* TEXT */

        case "text":

            html = `
                <div class="form-group">

                    <label>Text</label>

                    <textarea
                        id="textInput"
                        placeholder="Enter any text..."
                    ></textarea>

                </div>
            `;

            break;


        /* URL */

        case "url":

            html = `
                <div class="form-group">

                    <label>Website URL</label>

                    <input
                        type="url"
                        id="urlInput"
                        placeholder="https://example.com"
                    >

                </div>
            `;

            break;


        /* EMAIL */

        case "email":

            html = `
                <div class="form-group">

                    <label>Email Address</label>

                    <input
                        type="email"
                        id="emailInput"
                        placeholder="name@example.com"
                    >

                </div>

                <div class="form-group">

                    <label>Subject</label>

                    <input
                        type="text"
                        id="emailSubject"
                        placeholder="Email subject"
                    >

                </div>

                <div class="form-group">

                    <label>Message</label>

                    <textarea
                        id="emailMessage"
                        placeholder="Your email message..."
                    ></textarea>

                </div>
            `;

            break;


        /* PHONE */

        case "phone":

            html = `
                <div class="form-group">

                    <label>Phone Number</label>

                    <input
                        type="tel"
                        id="phoneInput"
                        placeholder="+92 300 1234567"
                    >

                </div>
            `;

            break;


        /* WIFI */

        case "wifi":

            html = `
                <div class="form-group">

                    <label>Wi-Fi Network Name</label>

                    <input
                        type="text"
                        id="wifiSSID"
                        placeholder="My WiFi"
                    >

                </div>

                <div class="form-group">

                    <label>Password</label>

                    <input
                        type="text"
                        id="wifiPassword"
                        placeholder="WiFi password"
                    >

                </div>

                <div class="form-group">

                    <label>Security</label>

                    <select id="wifiSecurity">

                        <option value="WPA">
                            WPA / WPA2
                        </option>

                        <option value="WEP">
                            WEP
                        </option>

                        <option value="nopass">
                            No Password
                        </option>

                    </select>

                </div>
            `;

            break;


        /* VCARD */

        case "vcard":

            html = `
                <div class="form-group">

                    <label>Full Name</label>

                    <input
                        type="text"
                        id="contactName"
                        placeholder="John Smith"
                    >

                </div>

                <div class="form-group">

                    <label>Phone</label>

                    <input
                        type="tel"
                        id="contactPhone"
                        placeholder="+92 300 1234567"
                    >

                </div>

                <div class="form-group">

                    <label>Email</label>

                    <input
                        type="email"
                        id="contactEmail"
                        placeholder="john@example.com"
                    >

                </div>

                <div class="form-group">

                    <label>Organization</label>

                    <input
                        type="text"
                        id="contactOrganization"
                        placeholder="Company name"
                    >

                </div>
            `;

            break;

    }

    formContainer.innerHTML = html;

}


/* =====================================
   GENERATE QR
===================================== */

generateBtn.addEventListener("click", generateQR);


function generateQR() {

    let data = "";


    switch (currentType) {


        /* TEXT */

        case "text":

            data =
                document.getElementById("textInput").value.trim();

            break;


        /* URL */

        case "url":

            data =
                document.getElementById("urlInput").value.trim();

            if (
                data &&
                !data.startsWith("http://") &&
                !data.startsWith("https://")
            ) {

                data = "https://" + data;

            }

            break;


        /* EMAIL */

        case "email": {

            const email =
                document.getElementById("emailInput").value.trim();

            const subject =
                document.getElementById("emailSubject").value.trim();

            const message =
                document.getElementById("emailMessage").value.trim();

            if (email) {

                data =
                    `mailto:${email}`;

                const params = [];

                if (subject) {

                    params.push(
                        `subject=${encodeURIComponent(subject)}`
                    );

                }

                if (message) {

                    params.push(
                        `body=${encodeURIComponent(message)}`
                    );

                }

                if (params.length) {

                    data += "?" + params.join("&");

                }

            }

            break;
        }


        /* PHONE */

        case "phone": {

            const phone =
                document.getElementById("phoneInput").value.trim();

            data = `tel:${phone}`;

            break;
        }


        /* WIFI */

        case "wifi": {

            const ssid =
                document.getElementById("wifiSSID").value.trim();

            const password =
                document.getElementById("wifiPassword").value;

            const security =
                document.getElementById("wifiSecurity").value;

            data =
                `WIFI:T:${security};S:${escapeWifi(ssid)};P:${escapeWifi(password)};;`;

            break;
        }


        /* CONTACT */

        case "vcard": {

            const name =
                document.getElementById("contactName").value.trim();

            const phone =
                document.getElementById("contactPhone").value.trim();

            const email =
                document.getElementById("contactEmail").value.trim();

            const organization =
                document
                    .getElementById("contactOrganization")
                    .value
                    .trim();

            data =
`BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${organization}
TEL:${phone}
EMAIL:${email}
END:VCARD`;

            break;
        }

    }


    if (!data || data === "tel:") {

        alert("Please enter some information first.");

        return;

    }


    generatedData = data;


    /* Clear previous QR */

    qrcodeElement.innerHTML = "";


    /* Create QR */

    qrCodeObject =
        new QRCode(qrcodeElement, {

            text: data,

            width: 240,

            height: 240,

            colorDark: "#111111",

            colorLight: "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H

        });


    qrcodeElement.style.display = "block";

    emptyState.style.display = "none";


    downloadBtn.disabled = false;

    copyBtn.disabled = false;

}


/* =====================================
   WIFI ESCAPE
===================================== */

function escapeWifi(value) {

    return value
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/:/g, "\\:");

}


/* =====================================
   DOWNLOAD QR
===================================== */

downloadBtn.addEventListener("click", () => {

    const img =
        qrcodeElement.querySelector("img");

    if (!img) {

        alert("Generate a QR code first.");

        return;

    }


    const link =
        document.createElement("a");

    link.href = img.src;

    link.download =
        "qr-code.png";

    link.click();

});


/* =====================================
   COPY GENERATED CONTENT
===================================== */

copyBtn.addEventListener("click", async () => {

    if (!generatedData) return;

    try {

        await navigator.clipboard.writeText(
            generatedData
        );

        const original =
            copyBtn.innerText;

        copyBtn.innerText =
            "✓ Copied!";

        setTimeout(() => {

            copyBtn.innerText =
                original;

        }, 1500);

    } catch {

        alert("Could not copy the content.");

    }

});


/* =====================================
   SCANNER ELEMENTS
===================================== */

const startScannerBtn =
    document.getElementById("startScannerBtn");

const scanEmpty =
    document.getElementById("scanEmpty");

const scanResult =
    document.getElementById("scanResult");

const resultText =
    document.getElementById("resultText");

const copyResultBtn =
    document.getElementById("copyResultBtn");

const openResultBtn =
    document.getElementById("openResultBtn");

let scannedValue = "";


/* =====================================
   START CAMERA
===================================== */

startScannerBtn.addEventListener(
    "click",
    startScanner
);


function startScanner() {

    if (scannerRunning) {

        return;

    }


    scanner =
        new Html5Qrcode("reader");


    const config = {

        fps: 10,

        qrbox: {
            width: 250,
            height: 250
        }

    };


    scanner
        .start(

            {
                facingMode: "environment"
            },

            config,

            onScanSuccess,

            onScanFailure

        )
        .then(() => {

            scannerRunning = true;

            startScannerBtn.innerText =
                "📷 Camera Active";

        })
        .catch(error => {

            console.error(error);

            alert(
                "Unable to access the camera. Please allow camera permission."
            );

        });

}


/* =====================================
   SCAN SUCCESS
===================================== */

function onScanSuccess(decodedText) {

    scannedValue =
        decodedText;


    resultText.innerText =
        decodedText;


    scanEmpty.classList.add("hidden");

    scanResult.classList.remove("hidden");


    /* Automatically stop after successful scan */

    if (scanner && scannerRunning) {

        scanner
            .stop()
            .then(() => {

                scannerRunning = false;

                startScannerBtn.innerText =
                    "📷 Scan Again";

            })
            .catch(error => {

                console.log(error);

            });

    }

}


/* =====================================
   SCAN FAILURE
===================================== */

function onScanFailure(error) {

    // Ignore continuous scan failures.
    // This happens while camera is searching.

}


/* =====================================
   COPY SCANNED RESULT
===================================== */

copyResultBtn.addEventListener(
    "click",
    async () => {

        if (!scannedValue) return;

        try {

            await navigator.clipboard.writeText(
                scannedValue
            );

            const original =
                copyResultBtn.innerText;

            copyResultBtn.innerText =
                "✓ Copied!";

            setTimeout(() => {

                copyResultBtn.innerText =
                    original;

            }, 1500);

        } catch {

            alert("Could not copy.");

        }

    }
);


/* =====================================
   OPEN SCANNED URL
===================================== */

openResultBtn.addEventListener(
    "click",
    () => {

        if (!scannedValue) return;


        let url =
            scannedValue;


        /* Handle URLs */

        if (
            url.startsWith("http://") ||
            url.startsWith("https://")
        ) {

            window.open(
                url,
                "_blank"
            );

            return;

        }


        /* Handle tel */

        if (url.startsWith("tel:")) {

            window.location.href =
                url;

            return;

        }


        /* Handle mailto */

        if (url.startsWith("mailto:")) {

            window.location.href =
                url;

            return;

        }


        alert(
            "This QR code does not contain a web URL."
        );

    }
);


/* =====================================
   IMAGE QR SCANNER
===================================== */

const qrImageInput =
    document.getElementById("qrImageInput");


qrImageInput.addEventListener(
    "change",
    async (event) => {

        const file =
            event.target.files[0];

        if (!file) return;


        const imageScanner =
            new Html5Qrcode("reader");


        try {

            const result =
                await imageScanner.scanFile(
                    file,
                    true
                );


            onScanSuccess(result);


        } catch (error) {

            alert(
                "No QR code was found in this image."
            );

        }

    }
);


/* =====================================
   INITIAL FORM
===================================== */

renderForm();