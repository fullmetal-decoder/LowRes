// ==========================================================
// LowRes | script.js
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  setupHeaderHide();
  setupNav();
  setupSlider();
  setupForm();
  setYear();
});

// ----------------------------------------------------------
// 1. Header disappears once you scroll, returns at the top
// ----------------------------------------------------------
function setupHeaderHide() {
  var header = document.getElementById("siteHeader");
  var threshold = 40; // pixels scrolled before hiding

  function check() {
    if (window.scrollY > threshold) {
      header.classList.add("is-hidden");
    } else {
      header.classList.remove("is-hidden");
    }
  }

  window.addEventListener("scroll", check, { passive: true });
  check();
}

// ----------------------------------------------------------
// 2. Navigation: mobile menu + dropdown (click / touch / keyboard)
// ----------------------------------------------------------
function setupNav() {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  var dropdownItem = document.querySelector(".has-dropdown");
  var dropdownBtn = document.querySelector(".dropdown-btn");

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  dropdownBtn.addEventListener("click", function () {
    var open = dropdownItem.classList.toggle("open");
    dropdownBtn.setAttribute("aria-expanded", open);
  });

  // Close the dropdown when clicking anywhere else
  document.addEventListener("click", function (e) {
    if (!dropdownItem.contains(e.target)) {
      dropdownItem.classList.remove("open");
      dropdownBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Close menus with Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      dropdownItem.classList.remove("open");
      nav.classList.remove("open");
      dropdownBtn.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Close the mobile menu after picking a link
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ----------------------------------------------------------
// 3. Hero slider: slow auto-slide, dots, arrows, swipe
// ----------------------------------------------------------
function setupSlider() {
  var slider = document.getElementById("slider");
  var track = document.getElementById("slides");
  var slides = track.children;
  var dotsBox = document.getElementById("dots");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");

  var AUTO_DELAY = 4000; // ms each slide stays (change this to go faster or slower)
  var current = 0;
  var timer = null;

  // Build one dot per slide
  var dots = [];
  for (var i = 0; i < slides.length; i++) {
    var dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.dataset.index = i;
    dot.addEventListener("click", function () {
      goTo(Number(this.dataset.index));
      restartAuto();
    });
    dotsBox.appendChild(dot);
    dots.push(dot);
  }

  function goTo(index) {
    // Wrap around at both ends
    current = (index + slides.length) % slides.length;
    track.style.transform = "translateX(-" + current * 100 + "%)";
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });
  }

  function startAuto() {
    timer = setInterval(function () {
      goTo(current + 1);
    }, AUTO_DELAY);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  prevBtn.addEventListener("click", function () {
    goTo(current - 1);
    restartAuto();
  });

  nextBtn.addEventListener("click", function () {
    goTo(current + 1);
    restartAuto();
  });

  // Pause while the mouse is over the slider
  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);

  // Swipe support for phones
  var startX = 0;
  slider.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener("touchend", function (e) {
    var diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      goTo(diff < 0 ? current + 1 : current - 1);
      restartAuto();
    }
  });

  // Skip auto-sliding if the visitor prefers reduced motion
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  goTo(0);
  if (!reduce) {
    startAuto();
  }
}

// ----------------------------------------------------------
// 4. Booking form: live traveler count + simple validation
// ----------------------------------------------------------
function setupForm() {
  var form = document.getElementById("bookingForm");
  var range = document.getElementById("travelers");
  var output = document.getElementById("travelersOut");
  var message = document.getElementById("formMessage");

  range.addEventListener("input", function () {
    output.textContent = range.value;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var fields = form.querySelectorAll("[required]");
    var allGood = true;

    fields.forEach(function (field) {
      var empty = field.value.trim() === "";
      var badEmail = field.type === "email" && field.value.indexOf("@") === -1;
      var bad = empty || badEmail;
      field.classList.toggle("invalid", bad);
      if (bad) allGood = false;
    });

    if (!allGood) {
      message.textContent = "Please fill in every field with a valid value.";
      message.classList.add("error");
      return;
    }

    var name = document.getElementById("name").value.trim();
    var place = document.getElementById("destination").value;
    message.classList.remove("error");
    message.textContent = "Thanks, " + name + "! We got your request for " + place + ".";
    form.reset();
    output.textContent = range.value;
  });
}

// ----------------------------------------------------------
// 5. Footer year
// ----------------------------------------------------------
function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}
