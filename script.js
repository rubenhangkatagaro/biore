document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // MOBILE NAVIGATION
  // =========================

  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuBtn.textContent = isOpen ? "×" : "☰";
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuBtn.textContent = "☰";
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // =========================
  // ACTIVE NAVIGATION LINK
  // =========================

  const navItems = document.querySelectorAll("#navLinks a");
  const sections = document.querySelectorAll("main section[id]");

  function updateNavigation() {
    let current = "home";

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 180) {
        current = section.id;
      }
    });

    navItems.forEach(link => {
      const active =
        link.getAttribute("href") === "#" + current;

      link.classList.toggle("active", active);
    });
  }

  window.addEventListener("scroll", updateNavigation, {
    passive: true
  });

  updateNavigation();

  // =========================
  // TYPING ANIMATION
  // =========================

  const nameElement = document.getElementById("typedName");
  const aboutElement = document.getElementById("aboutText");

  function typeText(element, text, speed, callback) {
    if (!element) {
      if (callback) callback();
      return;
    }

    let index = 0;
    element.textContent = "";
    element.classList.add("typing-cursor");

    function typeNext() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(typeNext, speed);
      } else {
        element.classList.remove("typing-cursor");
        if (callback) callback();
      }
    }

    typeNext();
  }

  if (nameElement && aboutElement) {
    const nameText = nameElement.textContent.trim();
    const aboutText = aboutElement.textContent.trim();

    typeText(nameElement, nameText, 75, () => {
      setTimeout(() => {
        typeText(aboutElement, aboutText, 10);
      }, 300);
    });
  }

  // =========================
  // SCROLL REVEAL ANIMATION
  // =========================

  const revealElements = document.querySelectorAll(".reveal");
  const skillsSection = document.querySelector(".skills-section");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

    if (skillsSection) {
      const skillsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            skillsSection.classList.add("visible");
            skillsObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2
      });

      skillsObserver.observe(skillsSection);
    }
  } else {
    revealElements.forEach(element => {
      element.classList.add("show");
    });

    if (skillsSection) {
      skillsSection.classList.add("visible");
    }
  }

  // =========================
  // PROJECT POPUP / MODAL
  // =========================

  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription =
    document.getElementById("modalDescription");
  const modalTags = document.getElementById("modalTags");
  const modalClose = document.getElementById("modalClose");
  const modalDone = document.getElementById("modalDone");

  let lastFocused = null;

  function openProject(card) {
    if (!modal) return;

    lastFocused = card;

    if (modalTitle) {
      modalTitle.textContent = card.dataset.title || "Project";
    }

    if (modalDescription) {
      modalDescription.textContent =
        card.dataset.description || "Project details.";
    }

    if (modalTags) {
      modalTags.replaceChildren();

      (card.dataset.tags || "")
        .split(",")
        .filter(Boolean)
        .forEach(label => {
          const tag = document.createElement("span");

          tag.className = "tag";
          tag.textContent = label.trim();

          modalTags.appendChild(tag);
        });
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (modalClose) modalClose.focus();
  }

  function closeProject() {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      openProject(card);
    });

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProject(card);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeProject);
  }

  if (modalDone) {
    modalDone.addEventListener("click", closeProject);
  }

  if (modal) {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeProject();
      }
    });
  }

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      modal &&
      modal.classList.contains("open")
    ) {
      closeProject();
    }
  });

  // =========================
  // CONTACT FORM
  // =========================

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();

      const name =
        document.getElementById("senderName")?.value.trim() || "";

      const email =
        document.getElementById("senderEmail")?.value.trim() || "";

      const message =
        document.getElementById("senderMessage")?.value.trim() || "";

      const status = document.getElementById("form-status");

      if (!name || !email || !message) {
        if (status) {
          status.textContent = "Please complete all fields.";
        }
        return;
      }

      const subject = encodeURIComponent(
        "Portfolio message from " + name
      );

      const body = encodeURIComponent(
        "Name: " + name +
        "\nEmail: " + email +
        "\n\nMessage:\n" + message
      );

      if (status) {
        status.textContent =
          "Opening your email app. Please send the message there.";
      }

      window.location.href =
        "mailto:reynhilbiore477@gmail.com?subject=" +
        subject + "&body=" + body;
    });
  }

  // =========================
  // BACK TO TOP BUTTON
  // =========================

  const backTop = document.getElementById("backTop");

  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("show", window.scrollY > 400);
    }, {
      passive: true
    });

    backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // =========================
  // AUTOMATIC FOOTER YEAR
  // =========================

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // =========================
  // DESKTOP GLOWING CURSOR
  // =========================

  if (
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches
  ) {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");

    if (dot && ring) {
      let x = -100;
      let y = -100;
      let rx = -100;
      let ry = -100;

      document.addEventListener("mousemove", event => {
        x = event.clientX;
        y = event.clientY;

        dot.style.left = x + "px";
        dot.style.top = y + "px";

        document.body.classList.add("cursor-ready");
      });

      function moveRing() {
        rx += (x - rx) * 0.18;
        ry += (y - ry) * 0.18;

        ring.style.left = rx + "px";
        ring.style.top = ry + "px";

        requestAnimationFrame(moveRing);
      }

      moveRing();

      document
        .querySelectorAll("a, button, .project-card")
        .forEach(element => {
          element.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-hover");
          });

          element.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-hover");
          });
        });

      document.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-ready");
      });

      document.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-ready");
      });
    }
  }
});
