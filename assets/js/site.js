(() => {
  function shuffle(items) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function renderHeroStrip() {
    const host = document.querySelector("[data-hero-strip]");
    if (!host || !window.MIOLO_DATA || !window.MIOLO_DATA.heroStrip) return;

    const covers = shuffle(window.MIOLO_DATA.heroStrip).slice(0, Math.min(window.MIOLO_DATA.heroStrip.length, 10));
    const track = document.createElement("div");
    track.className = "hero-strip__track";

    const naturalWidths = new Map();

    function resetHover() {
      Array.from(track.children).forEach((child) => {
        child.style.transform = "";
        child.classList.remove("is-active");
      });
    }

    covers.forEach((cover, index) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");

      figure.className = "hero-strip__item";
      image.src = cover.src;
      image.alt = cover.alt || "";
      image.loading = index < 6 ? "eager" : "lazy";
      image.decoding = "async";

      image.addEventListener("load", () => {
        const ratio = image.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 0.8;
        naturalWidths.set(figure, ratio);
        const stripHeight = host.getBoundingClientRect().height || 180;
        figure.style.width = `${Math.max(88, stripHeight * ratio)}px`;
      }, { once: true });

      figure.addEventListener("mouseenter", () => {
        const items = Array.from(track.children);
        const activeIndex = items.indexOf(figure);
        const scale = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hero-scale")) || 1.42;
        const rect = figure.getBoundingClientRect();
        const offset = ((rect.width * scale) - rect.width) / 2;

        resetHover();

        items.forEach((item, itemIndex) => {
          if (itemIndex < activeIndex) {
            item.style.transform = `translate3d(${-offset}px, 0, 0)`;
          } else if (itemIndex > activeIndex) {
            item.style.transform = `translate3d(${offset}px, 0, 0)`;
          } else {
            item.style.transform = `scale(${scale})`;
            item.classList.add("is-active");
          }
        });
      });

      figure.addEventListener("mouseleave", resetHover);

      figure.appendChild(image);
      track.appendChild(figure);
    });

    host.innerHTML = "";
    host.appendChild(track);
  }

  function bindLightbox() {
    const galleryImages = document.querySelectorAll("[data-lightbox] img");
    if (!galleryImages.length) return;

    const lightbox = document.createElement("div");
    const frame = document.createElement("div");
    const image = document.createElement("img");
    const close = document.createElement("button");

    lightbox.className = "lightbox";
    frame.className = "lightbox__frame";
    close.className = "lightbox__close";
    close.type = "button";
    close.setAttribute("aria-label", "Fechar imagem");
    close.textContent = "×";

    close.addEventListener("click", () => lightbox.classList.remove("is-open"));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.classList.remove("is-open");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") lightbox.classList.remove("is-open");
    });

    frame.appendChild(image);
    lightbox.appendChild(close);
    lightbox.appendChild(frame);
    document.body.appendChild(lightbox);

    galleryImages.forEach((galleryImage) => {
      galleryImage.addEventListener("click", () => {
        image.src = galleryImage.currentSrc || galleryImage.src;
        image.alt = galleryImage.alt || "";
        lightbox.classList.add("is-open");
      });
    });
  }

  renderHeroStrip();
  bindLightbox();
})();
