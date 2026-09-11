(function () {
  "use strict";

  var lenis = new Lenis({
    duration: 0.7,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
    wheelMultiplier: 1.15
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var navList = document.getElementById("navList");
  var navLinks = document.querySelectorAll("[data-nav]");
  var sections = document.querySelectorAll("main section[id]");

  /* Header background on scroll */
  function updateHeader() {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* mobile nav toggle */
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");

        var targetId = link.getAttribute("href");
        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { offset: -76 }); // -76 = --header-h
        }
      });
    });
  }

  /* Scroll-spy: highlight current section in nav */
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              var match = link.getAttribute("href") === "#" + id;
              link.classList.toggle("is-active", match);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal, .project__cell, .contact__row");
  if ("IntersectionObserver" in window && revealEls.length) {
    var reveal = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) {
      reveal.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* play button on videos */
  document.querySelectorAll('.project__video-wrap').forEach((wrapper) => {
  const video = wrapper.querySelector('.project__video');
  const playButton = wrapper.querySelector('.project__play');

  playButton.addEventListener('click', () => {
    video.play();
    playButton.style.display = 'none';
  });

  video.addEventListener('click', () => {
    if (!video.paused) {
      video.pause();
      playButton.style.display = 'flex';
    }
  });
});


  /* footer year */
  var backToTop = document.querySelector(".site-footer__top");
  if (backToTop) {
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      lenis.scrollTo(0);
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
