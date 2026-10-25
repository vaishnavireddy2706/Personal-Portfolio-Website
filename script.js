
"use strict";

// ======================================
// 1. MOBILE NAVIGATION
// ======================================

const menuButton = document.getElementById("menu-btn");
const navigation = document.getElementById("nav-links");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

// ======================================
// 2. DARK / LIGHT MODE
// ======================================

const themeButton = document.getElementById("theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  const isLight = theme === "light";

  document.body.classList.toggle("light-theme", isLight);

  if (themeButton) {
    themeButton.textContent = isLight ? "🌙" : "☀️";
    themeButton.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );
    themeButton.title = isLight ? "Dark mode" : "Light mode";
  }

  if (themeColor) {
    themeColor.content = isLight ? "#f4f7fc" : "#0b1020";
  }
}

// Restore the saved theme, or use dark mode by default.
let savedTheme = "dark";

try {
  savedTheme = localStorage.getItem("portfolio-theme") || "dark";
} catch {
  // Continue with dark mode if browser storage is unavailable.
}

applyTheme(savedTheme);

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-theme")
      ? "dark"
      : "light";

    applyTheme(nextTheme);

    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch {
      // The theme still works for this page if storage is unavailable.
    }
  });
}

// ======================================
// 3. TYPING ANIMATION
// ======================================

const typingText = document.getElementById("typing-text");

if (typingText) {
  const roles = [
    "Aspiring Web Developer",
    "Computer Science Student",
    "Creative UI Designer",
    "Programmer"
  ];

  // Respect visitors who prefer reduced motion.
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reducedMotion) {
    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = true;

    function typeRole() {
      const currentRole = roles[roleIndex];

      if (deleting) {
        characterIndex--;
      } else {
        characterIndex++;
      }

      typingText.textContent = currentRole.slice(0, characterIndex);

      let delay = deleting ? 45 : 85;

      if (!deleting && characterIndex === currentRole.length) {
        delay = 1300;
        deleting = true;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 300;
      }

      window.setTimeout(typeRole, delay);
    }

    window.setTimeout(typeRole, 1200);
  }
}

// ======================================
// 4. SCROLL REVEAL ANIMATIONS
// ======================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  // Enable hidden initial states only when observation is supported.
  document.documentElement.classList.add("js-reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

// ======================================
// 5. PROJECT CATEGORY FILTERS
// ======================================

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      const matches =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      card.hidden = !matches;
    });
  });
});

// ======================================
// 6. PROJECT DETAILS POPUP
// ======================================

const projectModal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

// Keep project information in one place for easy editing.
const projectDetails = {
  grocery: {
    title: "Grocery Shopping UI",
    description:
      "A responsive grocery shopping interface for browsing daily-use products.",
    technologies: ["HTML", "CSS", "JavaScript"],
    highlights: [
      "Organized product categories",
      "Responsive shopping interface",
      "Clean and user-friendly layout"
    ]
  },

  calculator: {
    title: "Smart Calculator",
    description:
      "A calculator web app designed for quick arithmetic calculations.",
    technologies: ["HTML", "CSS", "JavaScript"],
    highlights: [
      "Basic arithmetic operations",
      "Responsive calculator layout",
      "Input validation and error handling"
    ]
  },

  chatbot: {
    title: "AI Small Business Assistant",
    description:
      "A Flask-based chatbot project intended to help small businesses with common questions.",
    technologies: ["Python", "Flask", "HTML", "CSS"],
    highlights: [
      "Web-based chat interface",
      "Server-side message handling",
      "Designed for future AI integration"
    ]
  },

  design: {
    title: "Creative UI Designs",
    description:
      "A collection of wireframes and interface concepts focused on usability.",
    technologies: ["UI/UX", "Figma"],
    highlights: [
      "Wireframe development",
      "Responsive screen layouts",
      "Visual design exploration"
    ]
  }
};

document.querySelectorAll(".details-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projectDetails[button.dataset.project];

    if (!project || !projectModal || !modalContent || !modalTitle) {
      return;
    }

    modalTitle.textContent = project.title;
    modalContent.replaceChildren();

    const description = document.createElement("p");
    description.textContent = project.description;
    modalContent.appendChild(description);

    const techHeading = document.createElement("h3");
    techHeading.textContent = "Technologies";
    modalContent.appendChild(techHeading);

    const techText = document.createElement("p");
    techText.textContent = project.technologies.join(" · ");
    modalContent.appendChild(techText);

    const highlightsHeading = document.createElement("h3");
    highlightsHeading.textContent = "Key Features";
    modalContent.appendChild(highlightsHeading);

    const list = document.createElement("ul");

    project.highlights.forEach((highlight) => {
      const item = document.createElement("li");
      item.textContent = highlight;
      list.appendChild(item);
    });

    modalContent.appendChild(list);

    if (typeof projectModal.showModal === "function") {
      projectModal.showModal();
    }
  });
});

if (modalClose && projectModal) {
  modalClose.addEventListener("click", () => {
    projectModal.close();
  });

  // Clicking the backdrop closes the dialog.
  projectModal.addEventListener("click", (event) => {
    if (event.target === projectModal) {
      projectModal.close();
    }
  });
}

// ======================================
// 7. CONTACT FORM
// ======================================

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

// Replace this example address with your real email address.
const contactEmail = "yourmail@example.com";

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please complete all fields.";
      return;
    }

    const subject = `Portfolio message from ${name}`;
    const body =
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `Message:\n${message}`;

    const mailto =
      `mailto:${contactEmail}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    formStatus.textContent =
      "Opening your email application. Please review and send your message.";

    // Opens the visitor's configured email app; it does not send automatically.
    window.location.href = mailto;
  });
}

// ======================================
// 8. BACK TO TOP BUTTON
// ======================================

const backToTop = document.getElementById("back-to-top");

if (backToTop) {
  function updateBackToTop() {
    backToTop.classList.toggle("visible", window.scrollY > 350);
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  updateBackToTop();

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// ======================================
// 9. AUTOMATIC FOOTER YEAR
// ======================================

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
