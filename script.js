const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function getSavedTheme() {
  try {
    return localStorage.getItem("portfolio-theme");
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  root.dataset.theme = theme;

  const dark = theme === "dark";

  themeIcon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";

  themeToggle.setAttribute(
    "aria-label",
    dark ? "Switch to light mode" : "Switch to dark mode",
  );

  themeToggle.title = dark ? "Switch to light mode" : "Switch to dark mode";

  document.querySelector('meta[name="theme-color"]').content = dark
    ? "#171716"
    : "#f8f7f3";
}

applyTheme(getSavedTheme() || (systemTheme.matches ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch {}

  applyTheme(nextTheme);
});

systemTheme.addEventListener("change", (event) => {
  if (!getSavedTheme()) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

const typedName = document.getElementById("typed-name");
const nameText = "Jay Mendoza";
const professionText = document.getElementById("profession-text");

const professions = ["IT STUDENT", "WEB DEVELOPER", "PROBLEM SOLVER"];

let nameIndex = 0;
let professionIndex = 0;
let characterIndex = 0;
let deleting = false;

typedName.textContent = "";
professionText.textContent = "";

function typeName() {
  if (nameIndex < nameText.length) {
    typedName.textContent += nameText.charAt(nameIndex);
    nameIndex++;
    setTimeout(typeName, 120);
  }
}

function animateProfession() {
  const current = professions[professionIndex];

  if (!deleting) {
    characterIndex++;
    professionText.textContent = current.slice(0, characterIndex);

    if (characterIndex >= current.length) {
      deleting = true;
      setTimeout(animateProfession, 1500);
      return;
    }

    setTimeout(animateProfession, 100);
    return;
  }

  characterIndex--;
  professionText.textContent = current.slice(0, characterIndex);

  if (characterIndex <= 0) {
    deleting = false;
    professionIndex = (professionIndex + 1) % professions.length;
    setTimeout(animateProfession, 350);
    return;
  }

  setTimeout(animateProfession, 50);
}

typeName();
setTimeout(animateProfession, 1200);

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.querySelector("i").className = "fa-solid fa-bars";
}

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );

  menuToggle.querySelector("i").className = open
    ? "fa-solid fa-xmark"
    : "fa-solid fa-bars";
});

function setActiveLink(id) {
  navItems.forEach((link) => {
    const active = link.getAttribute("href") === `#${id}`;

    link.classList.toggle("active", active);

    if (active) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href").slice(1);
    setActiveLink(id);
    closeMenu();
  });
});

let scrollPending = false;

function updateActiveSection() {
  if (!sections.length) return;

  const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 220);
  let currentSection = sections[0];

  for (const section of sections) {
    if (section.offsetTop <= marker) {
      currentSection = section;
    } else {
      break;
    }
  }

  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 5
  ) {
    currentSection = sections[sections.length - 1];
  }

  setActiveLink(currentSection.id);
  scrollPending = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollPending) {
      window.requestAnimationFrame(updateActiveSection);
      scrollPending = true;
    }
  },
  { passive: true },
);

window.addEventListener("resize", updateActiveSection);
window.addEventListener("load", updateActiveSection);
updateActiveSection();

const filterButtons = document.querySelectorAll(".filters button");
const certificateCards = document.querySelectorAll(".certificate-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    certificateCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

document.querySelectorAll(".certificate-preview img").forEach((img) => {
  function showFallback() {
    const preview = img.closest(".certificate-preview");
    preview.classList.add("image-missing");

    const fallback = preview.querySelector(".fallback");

    if (fallback) {
      fallback.textContent = "Certificate image not found";
    }
  }

  img.addEventListener("error", showFallback);

  if (img.complete && img.naturalWidth === 0) {
    showFallback();
  }
});

const modal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image");
const modalClose = document.getElementById("modal-close");
let previousFocus = null;

function openModal(img) {
  if (!img || !img.complete || !img.naturalWidth) return;

  previousFocus = document.activeElement;
  modalImage.src = img.currentSrc || img.src;
  modalImage.alt = img.alt;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalImage.removeAttribute("src");
  document.body.style.overflow = "";

  if (previousFocus) previousFocus.focus();
}

document.querySelectorAll(".certificate-preview").forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.querySelector("img"));
  });
});

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`,
  );

  window.location.href = `mailto:jaymendoza806@gmail.com?subject=${subject}&body=${body}`;
});
