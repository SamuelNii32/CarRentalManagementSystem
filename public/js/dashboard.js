// Data
const revenueData = [
  { month: "Jan", revenue: 15000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 22000 },
  { month: "Apr", revenue: 19000 },
  { month: "May", revenue: 25000 },
  { month: "Jun", revenue: 28000 },
];

const rentalData = [
  { month: "Jan", rentals: 45 },
  { month: "Feb", rentals: 52 },
  { month: "Mar", rentals: 61 },
  { month: "Apr", rentals: 58 },
  { month: "May", rentals: 67 },
  { month: "Jun", rentals: 73 },
];

let activityData = [
  {
    action: "New rental booking",
    customer: "John Doe",
    vehicle: "Toyota Camry 2023",
    time: "2 hours ago",
  },
  {
    action: "Vehicle returned",
    customer: "Sarah Smith",
    vehicle: "Honda Accord 2022",
    time: "4 hours ago",
  },
  {
    action: "New customer registered",
    customer: "Mike Johnson",
    vehicle: "-",
    time: "6 hours ago",
  },
  {
    action: "Maintenance completed",
    customer: "-",
    vehicle: "BMW X5 2023",
    time: "1 day ago",
  },
];

function updateLastUpdated() {
  const now = new Date();
  const formatted = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("lastUpdated").textContent = formatted;
}

function renderRevenueChart() {
  const ctx = document.getElementById("revenueChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: revenueData.map((item) => item.month),
      datasets: [
        {
          label: "Revenue",
          data: revenueData.map((item) => item.revenue),
          backgroundColor: "#3B82F6",
          borderColor: "#2563EB",
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) =>
              `Revenue: $${context.parsed.y.toLocaleString()}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => "$" + value.toLocaleString(),
          },
          grid: { color: "#E5E7EB" },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
}

function renderRentalChart() {
  const ctx = document.getElementById("rentalChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: rentalData.map((item) => item.month),
      datasets: [
        {
          label: "Rentals",
          data: rentalData.map((item) => item.rentals),
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#10B981",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Rentals: ${context.parsed.y}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#E5E7EB" },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
}

function renderActivity() {
  const activityList = document.getElementById("activityList");
  activityList.innerHTML = "";

  activityData.forEach((activity) => {
    const item = document.createElement("div");
    item.className = "activity-item";

    const content = document.createElement("div");
    content.className = "activity-content";

    const actionP = document.createElement("p");
    actionP.textContent = activity.action;

    const detailsP = document.createElement("p");
    let details = [];
    if (activity.customer !== "-")
      details.push(`Customer: ${activity.customer}`);
    if (activity.vehicle !== "-") details.push(`Vehicle: ${activity.vehicle}`);
    detailsP.textContent = details.join(" • ");

    content.appendChild(actionP);
    if (details.length > 0) content.appendChild(detailsP);

    const timeSpan = document.createElement("span");
    timeSpan.className = "activity-time";
    timeSpan.textContent = activity.time;

    item.appendChild(content);
    item.appendChild(timeSpan);
    activityList.appendChild(item);
  });
}

function updateMetrics(metrics) {
  const metricValues = document.querySelectorAll(".metric-value");
  if (metrics.vehicles) metricValues[0].textContent = metrics.vehicles;
  if (metrics.rentals) metricValues[1].textContent = metrics.rentals;
  if (metrics.customers) metricValues[2].textContent = metrics.customers;
  if (metrics.revenue)
    metricValues[3].textContent = `$${metrics.revenue.toLocaleString()}`;
}

function addActivity(activity) {
  activityData.unshift(activity);
  activityData = activityData.slice(0, 4);
  renderActivity();
}

function initDashboard() {
  updateLastUpdated();
  renderRevenueChart();
  renderRentalChart();
  renderActivity();

  setInterval(updateLastUpdated, 300000); // every 5 minutes
}

document.addEventListener("DOMContentLoaded", () => {
  initDashboard();

  // Expose API globally if needed
  window.DashboardAPI = {
    updateMetrics,
    addActivity,
    refreshCharts: () => {
      renderRevenueChart();
      renderRentalChart();
    },
  };
});
