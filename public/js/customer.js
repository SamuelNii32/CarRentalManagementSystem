function openAddCustomerModal() {
  document.getElementById("formModalTitle").innerText = "Add Customer";
  const form = document.getElementById("customerForm");
  form.reset();
  form.removeAttribute("data-id");
  form.setAttribute("data-mode", "add");
  const modal = document.getElementById("customerFormModal");
  modal.classList.remove("hidden");
  modal.classList.add("show");
}

function openEditCustomerModal(buttonElement) {
  const data = buttonElement.getAttribute("data-customer");
  console.log("Raw data-customer:", data);
  const customerData = JSON.parse(data);
  const form = document.getElementById("customerForm");
  document.getElementById("formModalTitle").innerText = "Edit Customer";

  // Fill form with customer data
  form.name.value = customerData.name || "";
  form.email.value = customerData.email || "";
  form.phone.value = customerData.phone || "";
  form.status.value = customerData.status || "New";
  form.address.value = customerData.address || "";
  form.joinDate.value = customerData.joinedAt
    ? new Date(customerData.joinedAt).toISOString().substring(0, 10)
    : "";

  form.rating.value = customerData.rating || 5.0;

  form.setAttribute("data-mode", "edit");
  form.setAttribute("data-id", customerData._id);

  const modal = document.getElementById("customerFormModal");
  modal.classList.remove("hidden");
  modal.classList.add("show");
}

function closeCustomerFormModal() {
  const modal = document.getElementById("customerFormModal");
  modal.classList.remove("show");
  modal.classList.add("hidden");
}

function openViewCustomerModal(customerId) {
  console.log("Fetching customer ID:", customerId);
  fetch(`/admin/customers/${customerId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((customer) => {
      console.log("Customer data:", customer);
      const container = document.querySelector(".customers-page");
      const viewBody = container.querySelector("#customerViewBody");
      viewBody.innerHTML = `
        <p><strong>Name:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phone}</p>
        <p><strong>Address:</strong> ${customer.address}</p>
        <p><strong>Status:</strong> ${customer.status}</p>
        <p><strong>Join Date:</strong> ${
          customer.joinedAt ? customer.joinedAt.substring(0, 10) : "N/A"
        }</p>
        
        <p><strong>Rating:</strong> ${customer.rating}</p>
        <p><strong>Total Rentals:</strong> ${customer.totalRentals}</p>
        <p><strong>Total Spent:</strong> $${customer.totalSpent}</p>
        <p><strong>Last Rental:</strong> ${customer.lastRental}</p>
      `;
      console.log(viewBody.innerHTML);
      const modal = container.querySelector("#customerViewModal");
      modal.classList.add("show");
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      showToast("Error", "Failed to load customer");
    });
}

function closeCustomerViewModal() {
  const container = document.querySelector(".customers-page");
  const modal = container.querySelector("#customerViewModal");
  modal.classList.remove("show");
}

function openDeleteConfirmationModal(customerId) {
  const modal = document.getElementById("deleteConfirmationModal");
  modal.setAttribute("data-id", customerId);
  modal.classList.remove("hidden");
  modal.classList.add("show");
}

function closeDeleteConfirmationModal() {
  const modal = document.getElementById("deleteConfirmationModal");
  modal.classList.remove("show");
  modal.classList.add("hidden");
}

function openViewRentalsModal(customerId) {
  const modal = document.getElementById("customerRentalsModal");
  document.getElementById("customerRentalsBody").innerHTML =
    "<p>Rental history will go here.</p>";
  modal.classList.remove("hidden");
  modal.classList.add("show");
}

function closeCustomerRentalsModal() {
  const modal = document.getElementById("customerRentalsModal");
  modal.classList.remove("show");
  modal.classList.add("hidden");
}

function showToast(title, message) {
  const toast = document.getElementById("toast");
  document.getElementById("toastTitle").innerText = title;
  document.getElementById("toastDescription").innerText = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 3000);
}

function saveCustomer() {
  const form = document.getElementById("customerForm");
  const mode = form.getAttribute("data-mode");
  const customerId = form.getAttribute("data-id");

  const customerData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    status: form.status.value,
    address: form.address.value.trim(),
    joinDate: form.joinDate.value,
    rating: parseFloat(form.rating.value),
  };

  let url = "/admin/customers";
  let method = "POST";

  if (mode === "edit" && customerId) {
    url = `/admin/customers/${customerId}`;
    method = "POST"; // or PUT depending on your backend, adapt accordingly
  }

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  })
    .then((res) => {
      if (res.ok) {
        showToast(
          "Success",
          `Customer ${mode === "edit" ? "updated" : "added"} successfully.`
        );
        closeCustomerFormModal();
        setTimeout(() => {
          // Reload page or update UI to reflect changes
          window.location.reload();
        }, 500);
      } else {
        throw new Error("Failed to save customer");
      }
    })
    .catch(() => {
      showToast("Error", "Error saving customer");
    });
}

function confirmDeleteCustomer() {
  const modal = document.getElementById("deleteConfirmationModal");
  const customerId = modal.getAttribute("data-id");

  fetch(`/admin/customers/${customerId}/delete`, {
    method: "POST",
  })
    .then((res) => {
      if (res.ok) {
        showToast("Success", "Customer deleted successfully.");
        closeDeleteConfirmationModal();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        throw new Error("Failed to delete customer");
      }
    })
    .catch(() => {
      showToast("Error", "Error deleting customer");
    });
}
