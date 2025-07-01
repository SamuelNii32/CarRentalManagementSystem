// Show "New Booking" modal
function openNewBookingModal() {
  const modal = document.getElementById("newBookingModal");
  document.getElementById("bookingForm").reset();
  modal.classList.add("show");
}

// Close "New Booking" modal
function closeNewBookingModal() {
  const modal = document.getElementById("newBookingModal");
  modal.classList.remove("show");
}

// Show rental details modal
function openRentalViewModal(rentalId) {
  const modal = document.getElementById("rentalViewModal");
  const modalBody = document.getElementById("rentalViewBody");

  modalBody.innerHTML = "<p>Loading...</p>";
  modal.classList.add("show");

  fetch(`/admin/rentals/${rentalId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load rental details");
      return res.json();
    })
    .then((rental) => {
      modalBody.innerHTML = `
        <p><strong>Customer:</strong> ${rental.customer.name}</p>
        <p><strong>Phone:</strong> ${rental.customer.phone}</p>
      <p><strong>Vehicle:</strong> ${rental.vehicle.name} (${
        rental.vehicle.year
      })</p>

        <p><strong>Rental Period:</strong> ${rental.startDate.substring(
          0,
          10
        )} to ${rental.endDate.substring(0, 10)}</p>
        <p><strong>Status:</strong> ${rental.status}</p>
        <p><strong>Total Amount:</strong> $${rental.totalAmount.toFixed(2)}</p>
      `;
    })
    .catch((error) => {
      modalBody.innerHTML = "<p>Error loading rental details.</p>";
      showToast("Error", error.message);
    });
}

// Close rental details modal
function closeRentalViewModal() {
  const modal = document.getElementById("rentalViewModal");
  modal.classList.remove("show");
}

// Toast helper function
function showToast(title, message, isError = false) {
  const toast = document.getElementById("toast");
  document.getElementById("toastTitle").innerText = title;
  document.getElementById("toastDescription").innerText = message;

  if (isError) {
    toast.classList.add("error");
  } else {
    toast.classList.remove("error");
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Handle booking form submission
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  fetch("/admin/rentals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to create booking");
      return res.json();
    })
    .then(() => {
      closeNewBookingModal();
      showToast("Success", "Rental booking created successfully.");

      window.location.reload();
    })
    .catch((err) => {
      showToast("Error", err.message, true);
    });
});

// Autofill phone number when customer selected
document
  .querySelector('select[name="customerId"]')
  .addEventListener("change", function () {
    const selectedCustomerId = this.value;
    const customer = window.customersData.find(
      (c) => c._id === selectedCustomerId
    );
    const phoneInput = document.querySelector('input[name="phone"]');
    if (customer && customer.phone) {
      phoneInput.value = customer.phone;
    } else {
      phoneInput.value = "";
    }
  });
