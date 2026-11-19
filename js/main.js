/* Site behaviour: mobile menu, active link, footer year */
(function () {
  "use strict";
  const menuBtn = document.querySelector(".menu-btn");
  const links = document.querySelector(".nav-links");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.getAttribute("href").toLowerCase() === here) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
