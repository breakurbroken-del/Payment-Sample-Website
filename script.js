let users = JSON.parse(localStorage.getItem("users")) || [];
let requests = JSON.parse(localStorage.getItem("requests")) || [];

const ADMIN_ID = "signupadmin";
const ADMIN_PASS = "signinlogin";

function saveData() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("requests", JSON.stringify(requests));
}

function registerUser() {
  let mobile = document.getElementById("mobile").value;
  let password = document.getElementById("password").value;

  if (!mobile || !password) {
    alert("Enter mobile & password");
    return;
  }

  users.push({ mobile, password });
  saveData();

  alert("Registered Successfully");
}

function loginUser() {
  let mobile = document.getElementById("mobile").value;
  let password = document.getElementById("password").value;

  if (mobile === ADMIN_ID && password === ADMIN_PASS) {
    document.getElementById("authBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";

    loadAdmin();
    return;
  }

  let found = users.find(u => u.mobile === mobile && u.password === password);

  if (!found) {
    alert("Invalid Login");
    return;
  }

  localStorage.setItem("currentUser", mobile);

  document.getElementById("authBox").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  loadHistory();
}

function submitPayment() {
  let utr = document.getElementById("utr").value;
  let screenshot = document.getElementById("screenshot").files[0];

  if (!utr) {
    alert("Please enter UTR / Transaction ID");
    return;
  }

  if (!screenshot) {
    alert("Please upload payment screenshot");
    return;
  }

  let user = localStorage.getItem("currentUser");

  requests.push({
    mobile: user,
    utr: utr,
    status: "Pending",
    reason: ""
  });

  saveData();

  document.getElementById("message").innerHTML =
  "Your payment request has been submitted successfully. Our management team is reviewing your payment. Please wait patiently.";

  loadHistory();
}

function loadHistory() {
  let user = localStorage.getItem("currentUser");

  let data = requests.filter(r => r.mobile === user);

  let html = "";

  data.forEach(r => {
    html += `
      <div class="requestBox">
        <p><b>UTR:</b> ${r.utr}</p>
        <p><b>Status:</b> ${r.status}</p>
        <p><b>Reason:</b> ${r.reason}</p>
      </div>
    `;
  });

  document.getElementById("history").innerHTML = html;
}

function loadAdmin() {
  document.getElementById("userCount").innerText = users.length;

  let usersHtml = "";

  users.forEach(u => {
    usersHtml += `<p>${u.mobile}</p>`;
  });

  document.getElementById("allUsers").innerHTML = usersHtml;

  let html = "";

  requests.forEach((r, index) => {
    html += `
      <div class="requestBox">
        <p><b>Mobile:</b> ${r.mobile}</p>
        <p><b>UTR:</b> ${r.utr}</p>
        <p><b>Status:</b> ${r.status}</p>

        <button onclick="approve(${index})">Accept</button>
        <button onclick="reject(${index})">Reject</button>
      </div>
    `;
  });

  document.getElementById("requests").innerHTML = html;
}

function approve(index) {
  requests[index].status = "Accepted";
  saveData();
  loadAdmin();
}

function reject(index) {
  let reason = prompt("Enter Reject Reason");

  requests[index].status = "Rejected";
  requests[index].reason = reason;

  saveData();
  loadAdmin();
}

function updatePaymentSettings() {
  let upi = document.getElementById("newUpi").value;
  let qr = document.getElementById("newQr").files[0];

  if (upi) {
    document.getElementById("upiText").innerText = "UPI ID: " + upi;
  }

  if (qr) {
    let reader = new FileReader();

    reader.onload = function(e) {
      document.getElementById("qrImage").src = e.target.result;
      localStorage.setItem("savedQR", e.target.result);
    }

    reader.readAsDataURL(qr);
  }

  alert("Updated Successfully");
}

window.onload = function() {
  let savedQR = localStorage.getItem("savedQR");

  if (savedQR) {
    document.getElementById("qrImage").src = savedQR;
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}
