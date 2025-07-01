document.addEventListener("DOMContentLoaded", function () {
  let activeSection = "dashboard";

  const navItems = document.querySelectorAll(".nav-item[data-section]");
  const contentSections = document.querySelectorAll(".content-section");
  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("overlay");
  const mobileToggle = document.getElementById("mobileToggle");

  // Handle nav clicks
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const section = item.getAttribute("data-section");
      setActiveSection(section);
    });
  });

  // Handle mobile toggle
  mobileToggle.addEventListener("click", function () {
    const sidebarOpen = sidebar.classList.toggle("mobile-open");
    overlay.classList.toggle("show");

    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    // ✅ Hide the hamburger when sidebar is open
    mobileToggle.style.display = sidebarOpen ? "none" : "block";
  });

  overlay.addEventListener("click", function () {
    closeMobileSidebar();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMobileSidebar();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMobileSidebar();
    }
  });

  function setActiveSection(section) {
    activeSection = section;

    navItems.forEach((item) => {
      const itemSection = item.getAttribute("data-section");
      item.classList.toggle("active", itemSection === section);
    });

    contentSections.forEach((sectionDiv) => {
      sectionDiv.classList.toggle("active", sectionDiv.id === section);
    });

    if (window.innerWidth <= 768) {
      closeMobileSidebar();
    }
  }

  function closeMobileSidebar() {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";

    // ✅ Show the hamburger again when sidebar closes
    mobileToggle.style.display = "block";
  }

  // Start on dashboard by default
  setActiveSection("dashboard");
});
