function initSlideshows() {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  const track = $(".slideshow-track");
  const slideItems = $$(".slide-item");
  const paginationDots = $$(".pagination-dot");
  const prevBtns = $$(".prev");
  const nextBtns = $$(".next");
  const slideTransitionTime = 0.3;
  const autoPlayTimeInterval = 3000;
  const slideshows = document.querySelectorAll(".slideshow");

  slideshows.forEach((slideshow) => {
    const slideItems = slideshow.querySelectorAll(".slide-item");
    const slideCount = slideItems.length;
    const track = slideshow.querySelector(".slideshow-track");
    track.style.transition = `transform ${slideTransitionTime}s ease`;

    // Tạo div chứa pagination
    const pagination = document.createElement("div");
    pagination.className = "slideshow-pagination";

    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement("span");
      dot.className = "pagination-dot";
      if (i === 0) {
        dot.classList.add("active");
      }
      pagination.appendChild(dot);
    }

    // Append pagination vào cuối slideshow
    slideshow.appendChild(pagination);
  });

  prevBtns.forEach((prevBtn) => {
    prevBtn.addEventListener("click", function () {
      handleSlideShow(this);
    });
  });

  nextBtns.forEach((nextBtn) => {
    nextBtn.addEventListener("click", function () {
      handleSlideShow(this);
    });
  });

  function handleSlideShow(btn) {
    const btnType = btn.classList.contains("prev")
      ? "prev"
      : btn.classList.contains("next")
      ? "next"
      : "none";

    const slideShow = btn.closest(".slideshow");
    const track = slideShow.querySelector(".slideshow-track");
    const slideItems = slideShow.querySelectorAll(".slide-item");
    const paginationDots = slideShow.querySelectorAll(".pagination-dot");
    const length = paginationDots.length;

    // Nếu đang animating thì không xử lý nữa
    if (track.dataset.animating === "true") return;

    const activeDot = slideShow.querySelector(".pagination-dot.active");
    const index = Array.from(paginationDots).indexOf(activeDot);
    const nextIndex = (index + 1) % length;
    const prevIndex = (index + length - 1) % length;
    const lastItem = slideItems[length - 1].cloneNode(true);
    const firstItem = slideItems[0].cloneNode(true);

    activeDot.classList.remove("active");

    if (btnType === "next") {
      paginationDots[nextIndex].classList.add("active");
      track.dataset.animating = "true";

      if (nextIndex === 0) {
        // to first item
        track.appendChild(firstItem);
        track.style.transition = `transform ${slideTransitionTime}s ease`;
        track.style.transform = `translateX(-${length * 100}%)`;

        track.addEventListener(
          "transitionend",
          function handler() {
            track.removeEventListener("transitionend", handler);
            track.style.transition = "none";

            requestAnimationFrame(() => {
              track.style.transform = `translateX(0%)`;
              track.removeChild(firstItem);

              requestAnimationFrame(() => {
                track.style.transition = `transform ${slideTransitionTime}s ease`;
                track.dataset.animating = "false";
              });
            });
          },
          { once: true }
        );
      } else {
        track.style.transition = `transform ${slideTransitionTime}s ease`;
        track.style.transform = `translateX(-${nextIndex * 100}%)`;

        track.addEventListener(
          "transitionend",
          function handler() {
            track.removeEventListener("transitionend", handler);
            track.dataset.animating = "false";
          },
          { once: true }
        );
      }
      return { old: slideItems[index], current: slideItems[nextIndex] };
    } else if (btnType === "prev") {
      paginationDots[prevIndex].classList.add("active");
      track.dataset.animating = "true";

      if (prevIndex === length - 1) {
        // to last item
        track.insertBefore(lastItem, track.firstChild); // clone cuối vào đầu
        track.style.transition = "none";
        track.style.transform = `translateX(-100%)`; // tới clone

        // Force layout reflow
        void track.offsetWidth;

        track.style.transition = `transform ${slideTransitionTime}s ease`;
        track.style.transform = `translateX(0%)`;

        track.addEventListener(
          "transitionend",
          function handler() {
            track.removeEventListener("transitionend", handler);

            track.style.transition = "none";

            requestAnimationFrame(() => {
              track.removeChild(lastItem);
              track.style.transform = `translateX(-${(length - 1) * 100}%)`;

              requestAnimationFrame(() => {
                track.style.transition = `transform ${slideTransitionTime}s ease`;
                track.dataset.animating = "false";
              });
            });
          },
          { once: true }
        );
      } else {
        track.style.transition = `transform ${slideTransitionTime}s ease`;
        track.style.transform = `translateX(-${prevIndex * 100}%)`;

        track.addEventListener(
          "transitionend",
          function handler() {
            track.removeEventListener("transitionend", handler);
            track.dataset.animating = "false";
          },
          { once: true }
        );
      }
      return { old: slideItems[index], current: slideItems[prevIndex] };
    }
  }

  // auto play
  setInterval(() => {
    $$(".slideshow").forEach((slideshow) => {
      if (slideshow.dataset.autoplay === "true") {
        const nextBtn = slideshow.querySelector(".next");
        if (nextBtn) nextBtn.dispatchEvent(new Event("click"));
      }
    });
  }, autoPlayTimeInterval);

  $$(".slideshow").forEach((slideshow) => {
    slideshow.dataset.autoplay = "true";

    slideshow.addEventListener("mouseenter", () => {
      slideshow.dataset.autoplay = "false";
    });

    slideshow.addEventListener("mouseleave", () => {
      slideshow.dataset.autoplay = "true";
    });
  });
}
