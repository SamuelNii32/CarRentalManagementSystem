function openAddVehicleModal() {
  document.getElementById("vehicleForm").reset();
  document.getElementById("modalTitle").innerText = "Add Vehicle";
  const modal = document.getElementById("vehicleModal");
  modal.classList.add("show");
}

function closeVehicleModal() {
  const modal = document.getElementById("vehicleModal");
  modal.classList.remove("show");
}

function saveVehicle() {
  const form = document.getElementById("vehicleForm");
  const formData = new FormData(form);

  const availableValue = formData.get("available") === "true";
  formData.set("available", availableValue);

  const vehicleId = form.querySelector('input[name="_id"]')?.value; // Fix here

  const url = vehicleId ? `/admin/vehicle/${vehicleId}` : "/admin/vehicle";
  const method = vehicleId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .catch((error) => {
      showToast("Error", error.message);
    });
}

function editVehicle(id) {
  // Fetch vehicle data from server or from the page data
  fetch(`/admin/vehicle/${id}`)
    .then((res) => res.json())
    .then((vehicle) => {
      const form = document.getElementById("vehicleForm");
      form._id.value = vehicle._id;
      form.name.value = vehicle.name;
      form.year.value = vehicle.year;
      form.registrationNumber.value = vehicle.registrationNumber;
      form.type.value = vehicle.type;
      form.fuel.value = vehicle.fuel;
      form.seats.value = vehicle.seats;
      form.pricePerDay.value = vehicle.pricePerDay;
      // Show modal
      document.getElementById("modalTitle").innerText = "Edit Vehicle";
      document.getElementById("vehicleModal").classList.add("show");

      // Handle image preview
      const imgPreview = document.getElementById("currentImagePreview");
      if (vehicle.imageUrl) {
        imgPreview.src = vehicle.imageUrl;
        imgPreview.style.display = "block";
      } else {
        imgPreview.style.display = "none";
      }
    })
    .catch((err) => {
      showToast("Error", "Failed to load vehicle data.");
    });
}

// Listen for image input changes to update preview
document
  .querySelector('input[name="image"]')
  .addEventListener("change", function (event) {
    const imgPreview = document.getElementById("currentImagePreview");
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imgPreview.src = e.target.result;
        imgPreview.style.display = "block";
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  });

let vehicleIdToDelete = null;

function deleteVehicle(id) {
  vehicleIdToDelete = id;
  const deleteModal = document.getElementById("deleteModal");
  deleteModal.classList.add("show");
}

function closeDeleteModal() {
  const deleteModal = document.getElementById("deleteModal");
  deleteModal.classList.remove("show");
  vehicleIdToDelete = null;
}

function confirmDelete() {
  if (!vehicleIdToDelete) return;

  fetch(`/admin/vehicle/${vehicleIdToDelete}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .catch((error) => {
      showToast("Error", error.message);
    })
    .finally(() => {
      closeDeleteModal();
    });
}

function showToast(title, message) {
  const toast = document.getElementById("toast");
  document.getElementById("toastTitle").innerText = title;
  document.getElementById("toastDescription").innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
