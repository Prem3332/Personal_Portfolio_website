document.documentElement.classList.add("js-enabled");

const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const navLinks = [...document.querySelectorAll(".primary-nav a")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(amount * 100, 100)}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".section-heading, .about-grid, .facts-row, .mindset-lede, .process-step, .skills-intro, .skill-group, .experience-card, .projects-intro, .project-card, .credential-column, .personal-inner, .contact-inner > h2, .contact-bottom, .quality-note-inner")
  .forEach((element) => {
    element.setAttribute("data-reveal", "");
    revealObserver.observe(element);
  });

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });

document.querySelectorAll("#about, #skills, #experience, #projects, #contact").forEach((section) => sectionObserver.observe(section));

const projects = {
  temple: {
    kicker: "01 / WEB APPLICATION · SEMESTER 7",
    title: "Temple & Pilgrimage Crowd Management",
    summary: "A web-based platform for monitoring and managing crowd flow at temples and pilgrimage sites.",
    meta: ["MERN stack", "Crowd management", "Web application"],
    idea: "Monitor and manage the movement of people through temple and pilgrimage spaces.",
    focus: "Crowd flow management in a MERN-based web application. Further implementation details can be added as the project is documented."
  },
  attendance: {
    kicker: "02 / COMPUTER VISION · SEMESTER 6",
    title: "Smart Face Attendance System",
    summary: "A computer-vision-based system for real-time face detection and identification to automate attendance logging.",
    meta: ["Python", "OpenCV", "Face detection"],
    idea: "Use face detection and identification as part of an attendance logging workflow.",
    focus: "Computer vision with Python and OpenCV. Dataset, recognition approach and validation details are not specified in the supplied project brief."
  },
  voice: {
    kicker: "03 / VOICE ASSISTANT · SEMESTER 6",
    title: "AI Voice Assistant Chatbot",
    summary: "A voice-controlled chatbot using speech recognition and Ollama LLMs, enabling task execution through natural-language commands.",
    meta: ["Python", "Ollama", "Speech recognition"],
    idea: "Connect spoken natural-language commands with an AI chatbot and task execution.",
    focus: "Voice interaction, speech recognition and Ollama. Specific models, supported tasks and evaluation results are not specified in the supplied project brief."
  },
  forensic: {
    kicker: "04 / RESEARCH PAPER · SEMESTER 6",
    title: "Forensic Tool for Cloud Storage",
    summary: "A system concept for secure cloud evidence acquisition using MD5/SHA hashing to support data integrity.",
    meta: ["Research paper", "Cloud storage", "MD5 / SHA"],
    idea: "Acquire cloud evidence while checking its integrity through cryptographic hashing.",
    focus: "Evidence acquisition and data integrity. The exact workflow, cloud provider and implementation details can be added when available."
  },
  wakeby: {
    kicker: "05 / MOBILE APP · SEMESTER 5",
    title: "WakeBy — GPS Location Alert App",
    summary: "A location-based Android and iOS app that alerts users when they enter a specified radius around a destination, with customizable alerts.",
    meta: ["Android", "iOS", "GPS"],
    idea: "Notify users when they approach a chosen destination within a user-defined radius.",
    focus: "Location-aware notifications and customizable alert behavior. The implementation framework is not specified in the supplied project brief."
  },
  coolclimate: {
    kicker: "06 / MOBILE · HACKATHON · SEMESTER 5",
    title: "Coolclimate Mobile App",
    summary: "A mobile app to track daily carbon footprints and suggest actionable lifestyle improvements.",
    meta: ["React Native", "Mobile", "Hackathon"],
    idea: "Help people understand daily carbon footprints and consider practical lifestyle changes.",
    focus: "Carbon-footprint tracking and recommendations. No impact metrics or specific calculation methodology were provided."
  }
};

const projectDialog = document.querySelector("#project-dialog");
const closeDialog = projectDialog.querySelector(".dialog-close");

function openProject(project) {
  document.querySelector("#dialog-kicker").textContent = project.kicker;
  document.querySelector("#dialog-title").textContent = project.title;
  document.querySelector("#dialog-summary").textContent = project.summary;
  document.querySelector("#dialog-idea").textContent = project.idea;
  document.querySelector("#dialog-focus").textContent = project.focus;
  const meta = document.querySelector("#dialog-meta");
  meta.replaceChildren(...project.meta.map((item) => {
    const tag = document.createElement("span");
    tag.textContent = item;
    return tag;
  }));
  projectDialog.showModal();
  closeDialog.focus();
}

document.querySelectorAll("[data-project]").forEach((card) => {
  card.addEventListener("click", () => openProject(projects[card.dataset.project]));
});

closeDialog.addEventListener("click", () => projectDialog.close());
projectDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    projectDialog.close();
  }
});
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) projectDialog.close();
});

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const message = String(formData.get("message")).trim();
  if (!name || !email || !message) {
    formStatus.textContent = "Please complete each field before preparing your email.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
  formStatus.textContent = "Opening your email app with the message ready to send.";
  window.location.href = `mailto:parmarprem2006@gmail.com?subject=${subject}&body=${body}`;
});

if (reducedMotion.matches) {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
}
