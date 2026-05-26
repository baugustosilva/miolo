(() => {
  const stripRows = document.getElementById("stripRows");
  const hoverTitle = document.getElementById("hoverTitle");
  const homeLightbox = document.getElementById("home-lightbox");
  const lightboxTrack = document.getElementById("home-lightbox-track");
  const lightboxImage = document.getElementById("home-lightbox-img");
  const lightboxCaption = document.getElementById("home-lightbox-caption");
  const lightboxPrevPreview = document.getElementById("home-lightbox-prev-preview");
  const lightboxNextPreview = document.getElementById("home-lightbox-next-preview");
  const lightboxClose = document.getElementById("home-lightbox-close");
  const lightboxPrev = document.getElementById("home-lightbox-prev");
  const lightboxNext = document.getElementById("home-lightbox-next");
  const aboutOverlay = document.getElementById("about-overlay");
  const btnAbout = document.getElementById("nav-about-btn");
  const btnClose = document.getElementById("nav-close-btn");

  const pageCategory = document.body.dataset.category;
  const pageCategoryTitle = document.body.dataset.categoryTitle || pageCategory || "";
  const allEssays = window.MIOLO_DATA?.essays || [];
  const categoryEssays = allEssays.filter((essay) => essay.category === pageCategory);

  const imageMeta = [];
  const imageTitles = {};
  const essayByImageFile = new Map();

  categoryEssays.forEach((essay) => {
    const knownImages = [essay.heroSrc, essay.coverSrc, ...(essay.images || [])].filter(Boolean);
    knownImages.forEach((src) => {
      essayByImageFile.set(getImageFileName(src), essay);
      imageTitles[getImageFileName(src)] = essay.title;
    });
  });

  const stripImageEntries = buildStripImageEntries();
  const stripImages = stripImageEntries.map((entry) => entry.src);

  let lastLayoutKey = "";
  let resizeFrame = 0;
  let lateralAnimationFrame = null;
  let lateralVelocity = 0;
  let lateralSegmentWidths = [];
  let lateralOffsets = [];
  let lateralRowTracks = [];
  let lateralLoopBaseSegment = 4;
  let isHoveringItem = false;
  let activeGalleryImages = [];
  let activeGalleryTitle = "";
  let activeGalleryIndex = 0;
  let lightboxTouchStartX = 0;
  let lightboxTouchStartY = 0;
  let lightboxProxy = null;
  let lightboxOpeningToken = 0;

  function getImageFileName(src) {
    return String(src || "").split("/").pop();
  }

  function normalizeImageFileName(fileName) {
    return String(fileName || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-_\s]/g, "")
      .toLocaleLowerCase("pt-BR");
  }

  function resolveMediaPath(src) {
    const value = String(src || "");
    if (!value) return value;
    if (/^(?:[a-z]+:|\/\/|\/|\.\.?\/)/i.test(value)) return value;
    return `../${value}`;
  }

  function dedupeSources(sources) {
    const seen = new Set();
    return sources.filter((src) => {
      const key = normalizeImageFileName(getImageFileName(src));
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getEssayGridSources(essay) {
    return dedupeSources([
      essay.heroSrc,
      essay.coverSrc,
      ...(essay.images || [])
    ].filter(Boolean));
  }

  function buildStripImageEntries() {
    const targetCount = pageCategory === "produto" ? 14 : Math.max(categoryEssays.length, 18);
    const essayPools = categoryEssays.map((essay) => ({
      essay,
      sources: getEssayGridSources(essay),
      cursor: 0
    })).filter((entry) => entry.sources.length);

    const entries = [];
    const used = new Set();

    while (entries.length < targetCount) {
      let addedInRound = 0;

      essayPools.forEach((entry) => {
        while (entry.cursor < entry.sources.length) {
          const src = entry.sources[entry.cursor];
          entry.cursor += 1;
          const key = normalizeImageFileName(getImageFileName(src));
          if (!key || used.has(key)) continue;
          used.add(key);
          entries.push({ src, essay: entry.essay });
          addedInRound += 1;
          break;
        }
      });

      if (!addedInRound) break;
    }

    return entries;
  }

  function getRowGapValue() {
    const value = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--row-gap"));
    return Number.isFinite(value) ? value : 0;
  }

  function hideHoverTitle() {
    hoverTitle?.classList.remove("is-visible");
  }

  function renderTitle(title) {
    if (!hoverTitle) return;
    hoverTitle.innerHTML = "";
    const word = document.createElement("span");
    word.className = "hover-title__word";
    word.textContent = title;
    hoverTitle.appendChild(word);
  }

  function openAbout() {
    if (!aboutOverlay || !btnAbout || !btnClose) return;
    hideHoverTitle();
    isHoveringItem = false;
    lateralVelocity = 0;
    stopLateralScrollLoop();
    aboutOverlay.classList.add("active");
    btnAbout.style.display = "none";
    btnClose.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeAbout() {
    if (!aboutOverlay || !btnAbout || !btnClose) return;
    aboutOverlay.classList.remove("active");
    btnAbout.style.display = "block";
    btnClose.style.display = "none";
    document.body.style.overflow = "";
  }

  function isAboutActive() {
    return aboutOverlay?.classList.contains("active");
  }

  function isLightboxActive() {
    return homeLightbox?.classList.contains("active");
  }

  function getEssayForImage(src) {
    return essayByImageFile.get(getImageFileName(src)) || null;
  }

  function getImageTitle(src) {
    const fileName = getImageFileName(src);
    return imageTitles[fileName] || getEssayForImage(src)?.title || pageCategoryTitle;
  }

  function getGalleryForItem(item) {
    const essay = getEssayForImage(item.dataset.imageSrc || "");
    return essay?.images?.length ? essay.images : [item.dataset.imageSrc].filter(Boolean);
  }

  function getGalleryTitleForItem(item) {
    const essay = getEssayForImage(item.dataset.imageSrc || "");
    return essay?.title || getImageTitle(item.dataset.imageSrc || "");
  }

  function getGalleryStartIndex(item, gallery) {
    const fileName = getImageFileName(item.dataset.imageSrc || "");
    const normalizedFileName = normalizeImageFileName(fileName);
    const exactIndex = gallery.findIndex((src) => getImageFileName(src) === fileName);
    if (exactIndex >= 0) return exactIndex;
    const normalizedIndex = gallery.findIndex((src) => normalizeImageFileName(getImageFileName(src)) === normalizedFileName);
    return normalizedIndex >= 0 ? normalizedIndex : 0;
  }

  function getWrappedGalleryIndex(index) {
    if (!activeGalleryImages.length) return 0;
    return (index + activeGalleryImages.length) % activeGalleryImages.length;
  }

  function updateLightboxPreview(image, index) {
    if (!image) return;
    if (activeGalleryImages.length <= 1) {
      image.classList.add("is-hidden");
      image.removeAttribute("src");
      return;
    }
    image.src = resolveMediaPath(activeGalleryImages[getWrappedGalleryIndex(index)]);
    image.alt = "";
    image.classList.remove("is-hidden");
  }

  function updateLightboxImage() {
    if (!lightboxImage || !activeGalleryImages.length) return;
    const src = activeGalleryImages[getWrappedGalleryIndex(activeGalleryIndex)];
    lightboxImage.src = resolveMediaPath(src);
    lightboxImage.alt = activeGalleryTitle || "Imagem da galeria";
    if (lightboxCaption) {
      lightboxCaption.textContent = activeGalleryTitle.toLocaleUpperCase("pt-BR");
      lightboxCaption.hidden = !activeGalleryTitle;
    }
    updateLightboxPreview(lightboxPrevPreview, activeGalleryIndex - 1);
    updateLightboxPreview(lightboxNextPreview, activeGalleryIndex + 1);
  }

  function removeLightboxProxy() {
    if (!lightboxProxy) return;
    lightboxProxy.remove();
    lightboxProxy = null;
  }

  function getLightboxTargetRect(sourceImage, initialRect) {
    const measuredRect = lightboxImage?.getBoundingClientRect();
    if (measuredRect?.width && measuredRect?.height) return measuredRect;

    const overlayRect = homeLightbox?.getBoundingClientRect();
    const ratio = (lightboxImage?.naturalWidth && lightboxImage?.naturalHeight)
      ? lightboxImage.naturalWidth / lightboxImage.naturalHeight
      : (sourceImage?.naturalWidth && sourceImage?.naturalHeight)
        ? sourceImage.naturalWidth / sourceImage.naturalHeight
        : initialRect.width / initialRect.height;
    const maxWidth = window.innerWidth * 0.84;
    const maxHeight = window.innerHeight * 0.84;
    let width = maxHeight * ratio;
    let height = maxHeight;

    if (width > maxWidth) {
      width = maxWidth;
      height = width / ratio;
    }

    return {
      top: (overlayRect?.top || 0) + (((overlayRect?.height || window.innerHeight) - height) / 2),
      left: (overlayRect?.left || 0) + (((overlayRect?.width || window.innerWidth) - width) / 2),
      width,
      height
    };
  }

  function finishLightboxOpening() {
    homeLightbox?.classList.remove("is-opening");
    if (!lightboxProxy) return;
    const proxy = lightboxProxy;
    lightboxProxy = null;
    proxy.addEventListener("transitionend", (event) => {
      if (event.target === proxy && event.propertyName === "opacity") proxy.remove();
    });
    proxy.classList.add("is-fading");
    window.setTimeout(() => proxy.remove(), 900);
  }

  function animateLightboxOpen(item, sourceRect, sourceSrc) {
    if (!homeLightbox || !lightboxImage) return;
    removeLightboxProxy();
    const sourceImage = item.querySelector("img");
    const initialRect = sourceRect || sourceImage?.getBoundingClientRect();

    if (!sourceImage || !initialRect?.width || !initialRect?.height) {
      finishLightboxOpening();
      return;
    }

    const proxy = document.createElement("img");
    proxy.className = "home-lightbox__zoom-proxy";
    proxy.src = sourceSrc || sourceImage.currentSrc || sourceImage.src;
    proxy.alt = "";
    proxy.style.top = `${initialRect.top}px`;
    proxy.style.left = `${initialRect.left}px`;
    proxy.style.width = `${initialRect.width}px`;
    proxy.style.height = `${initialRect.height}px`;
    document.body.appendChild(proxy);
    lightboxProxy = proxy;
    proxy.getBoundingClientRect();

    const targetRect = getLightboxTargetRect(sourceImage, initialRect);
    if (!targetRect.width || !targetRect.height) {
      finishLightboxOpening();
      return;
    }

    proxy.style.top = `${targetRect.top}px`;
    proxy.style.left = `${targetRect.left}px`;
    proxy.style.width = `${targetRect.width}px`;
    proxy.style.height = `${targetRect.height}px`;
    finishLightboxOpening();
  }

  function openLightbox(item) {
    if (!homeLightbox || !item) return;
    const gallery = getGalleryForItem(item);
    if (!gallery.length) return;

    const openingToken = lightboxOpeningToken + 1;
    lightboxOpeningToken = openingToken;
    const sourceImage = item.querySelector("img");
    const sourceRect = sourceImage?.getBoundingClientRect();
    const sourceSrc = sourceImage?.currentSrc || sourceImage?.src || "";

    activeGalleryImages = gallery;
    activeGalleryTitle = getGalleryTitleForItem(item);
    activeGalleryIndex = getGalleryStartIndex(item, gallery);

    hideHoverTitle();
    isHoveringItem = false;
    updateLightboxImage();
    homeLightbox.classList.add("active", "is-opening");
    document.body.style.overflow = "hidden";

    lateralVelocity = 0;
    stopLateralScrollLoop();

    if (openingToken === lightboxOpeningToken && isLightboxActive()) {
      animateLightboxOpen(item, sourceRect, sourceSrc);
    }
  }

  function closeLightbox() {
    if (!homeLightbox) return;
    lightboxOpeningToken += 1;
    removeLightboxProxy();
    homeLightbox.classList.remove("is-opening");
    homeLightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function moveLightbox(delta) {
    if (homeLightbox?.classList.contains("is-opening")) return;
    if (!activeGalleryImages.length) return;
    activeGalleryIndex = getWrappedGalleryIndex(activeGalleryIndex + delta);
    updateLightboxImage();
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function loadMeta(src, essay = null) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({
        src,
        essay,
        width: image.naturalWidth,
        height: image.naturalHeight,
        ratio: image.naturalWidth / image.naturalHeight
      });
      image.onerror = reject;
      image.src = resolveMediaPath(src);
    });
  }

  async function ensureMeta() {
    if (imageMeta.length) return imageMeta;
    const results = await Promise.allSettled(
      stripImageEntries.map((entry) => loadMeta(entry.src, entry.essay))
    );
    results.forEach((result) => {
      if (result.status === "fulfilled") imageMeta.push(result.value);
    });
    return imageMeta;
  }

  function getConfig() {
    if (window.innerWidth <= 640) return { mobile: true };
    return { mobile: false, segmentCopies: 9 };
  }

  function resetLateralState() {
    if (lateralAnimationFrame) {
      cancelAnimationFrame(lateralAnimationFrame);
      lateralAnimationFrame = null;
    }
    lateralVelocity = 0;
    lateralSegmentWidths = [];
    lateralOffsets = [];
    lateralRowTracks = [];
  }

  function createStripItem(imageData, index) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const rowHeight = stripRows.querySelector(".lateral-track")?.getBoundingClientRect().height
      || ((stripRows.getBoundingClientRect().height - getRowGapValue()) / 2)
      || window.innerHeight * 0.25;

    figure.className = "strip-item";
    figure.style.setProperty("--item-width", `${imageData.ratio * rowHeight}px`);
    figure.dataset.imageSrc = imageData.src;
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `Abrir galeria ${imageData.essay?.title || getImageTitle(imageData.src) || "do ensaio"}`);
    image.src = resolveMediaPath(imageData.src);
    image.alt = "";
    image.loading = index < 8 ? "eager" : "lazy";
    image.decoding = "async";
    figure.appendChild(image);
    figure.addEventListener("click", () => openLightbox(figure));
    figure.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openLightbox(figure);
    });
    return figure;
  }

  function getItemRect(item) {
    return item.getBoundingClientRect();
  }

  function showHoverTitle(item) {
    if (!hoverTitle) return;
    const title = getGalleryTitleForItem(item);
    if (!title) {
      hideHoverTitle();
      return;
    }

    const rect = getItemRect(item);
    const stripRect = stripRows.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const titleWidth = rect.width;
    const titleLength = title.trim().length || 1;
    const baseFontSize = 13;
    const minFontSize = 9;
    const estimatedCharWidth = baseFontSize * 0.9;
    const availableWidth = Math.max(48, titleWidth - 8);
    const fittedFontSize = Math.max(
      minFontSize,
      Math.min(baseFontSize, availableWidth / (titleLength * estimatedCharWidth))
    );
    const titleLeft = centerX - (titleWidth / 2);
    const titleRight = centerX + (titleWidth / 2);
    const leftClip = Math.max(0, stripRect.left - titleLeft);
    const rightClip = Math.max(0, titleRight - stripRect.right);
    const placement = item.dataset.titlePlacement || "top";
    const top = placement === "bottom"
      ? Math.min(window.innerHeight - 56, rect.bottom + 14)
      : Math.max(56, rect.top - 28);

    renderTitle(title.toLocaleUpperCase("pt-BR"));
    hoverTitle.style.fontSize = `${fittedFontSize}px`;
    hoverTitle.style.left = `${centerX}px`;
    hoverTitle.style.width = `${titleWidth}px`;
    hoverTitle.style.top = `${top}px`;
    hoverTitle.style.clipPath = `inset(-20px ${rightClip}px -20px ${leftClip}px)`;
    hoverTitle.classList.add("is-visible");
  }

  function measureLateralSegments() {
    if (window.innerWidth <= 640) return;
    lateralRowTracks = Array.from(stripRows.querySelectorAll(".lateral-row-track"));
    lateralSegmentWidths = lateralRowTracks.map((rowTrack) => {
      const segments = rowTrack.querySelectorAll(".lateral-segment");
      if (segments.length < 2) return 0;
      return segments[1].offsetLeft - segments[0].offsetLeft;
    });
    lateralOffsets = lateralSegmentWidths.map((width, index) => {
      const currentOffset = lateralOffsets[index];
      return Number.isFinite(currentOffset) ? currentOffset : 0;
    });
    updateLateralTrackPosition();
  }

  function updateLateralTrackPosition() {
    lateralRowTracks.forEach((rowTrack, index) => {
      const segmentWidth = lateralSegmentWidths[index];
      if (!segmentWidth) return;
      const offset = lateralOffsets[index] || 0;
      const wrappedOffset = ((offset % segmentWidth) + segmentWidth) % segmentWidth;
      rowTrack.style.transform = `translate3d(${-(segmentWidth * lateralLoopBaseSegment) - wrappedOffset}px, 0, 0)`;
    });
  }

  function runLateralScrollLoop() {
    if (lateralAnimationFrame || window.innerWidth <= 640) return;
    const step = () => {
      if (Math.abs(lateralVelocity) < 0.05 || !lateralSegmentWidths.length) {
        lateralAnimationFrame = null;
        return;
      }
      lateralOffsets = lateralOffsets.map((offset) => offset + lateralVelocity);
      updateLateralTrackPosition();
      lateralAnimationFrame = requestAnimationFrame(step);
    };
    lateralAnimationFrame = requestAnimationFrame(step);
  }

  function stopLateralScrollLoop() {
    if (!lateralAnimationFrame) return;
    cancelAnimationFrame(lateralAnimationFrame);
    lateralAnimationFrame = null;
  }

  function handleLateralMouseMove(event) {
    if (window.innerWidth <= 640) return;
    if (isAboutActive() || isLightboxActive() || isHoveringItem) return;
    const zoneWidth = Math.max(140, window.innerWidth * 0.16);
    const maxSpeed = 32;
    let velocity = 0;

    if (event.clientX < zoneWidth) {
      const strength = 1 - (event.clientX / zoneWidth);
      velocity = -maxSpeed * strength;
    } else if (event.clientX > window.innerWidth - zoneWidth) {
      const strength = 1 - ((window.innerWidth - event.clientX) / zoneWidth);
      velocity = maxSpeed * strength;
    }

    lateralVelocity = velocity;

    if (velocity === 0) {
      stopLateralScrollLoop();
      return;
    }

    runLateralScrollLoop();
  }

  function handleLateralMouseLeave() {
    isHoveringItem = false;
    hideHoverTitle();
    lateralVelocity = 0;
    stopLateralScrollLoop();
  }

  function bindLateralScroll() {
    document.removeEventListener("mousemove", handleLateralMouseMove);
    document.removeEventListener("mouseleave", handleLateralMouseLeave);

    if (window.innerWidth <= 640) {
      lateralVelocity = 0;
      stopLateralScrollLoop();
      return;
    }

    document.addEventListener("mousemove", handleLateralMouseMove);
    document.addEventListener("mouseleave", handleLateralMouseLeave);
  }

  function bindAboutControls() {
    if (!aboutOverlay || !btnAbout || !btnClose) return;
    btnAbout.addEventListener("click", openAbout);
    btnClose.addEventListener("click", closeAbout);
    aboutOverlay.addEventListener("click", (event) => {
      if (event.target === aboutOverlay) closeAbout();
    });
  }

  function bindLightboxControls() {
    if (!homeLightbox) return;
    lightboxClose?.addEventListener("click", closeLightbox);
    lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
    lightboxNext?.addEventListener("click", () => moveLightbox(1));
    lightboxPrevPreview?.addEventListener("click", () => moveLightbox(-1));
    lightboxNextPreview?.addEventListener("click", () => moveLightbox(1));

    homeLightbox.addEventListener("click", (event) => {
      if (event.target === homeLightbox) closeLightbox();
    });

    lightboxTrack?.addEventListener("touchstart", (event) => {
      const touch = event.touches[0];
      lightboxTouchStartX = touch.clientX;
      lightboxTouchStartY = touch.clientY;
    }, { passive: true });

    lightboxTrack?.addEventListener("touchend", (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - lightboxTouchStartX;
      const deltaY = touch.clientY - lightboxTouchStartY;
      if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      moveLightbox(deltaX < 0 ? 1 : -1);
    }, { passive: true });

    document.addEventListener("keydown", (event) => {
      if (isAboutActive() && event.key === "Escape") {
        closeAbout();
        return;
      }
      if (!isLightboxActive()) return;
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        moveLightbox(-1);
      } else if (event.key === "ArrowRight") {
        moveLightbox(1);
      }
    });
  }

  function bindHoverTitles() {
    stripRows.querySelectorAll(".strip-item").forEach((item) => {
      if (item.dataset.hoverBound === "true") return;

      item.addEventListener("mouseenter", () => {
        if (window.innerWidth <= 640) return;
        if (isAboutActive() || isLightboxActive()) return;
        isHoveringItem = true;
        lateralVelocity = 0;
        stopLateralScrollLoop();
        item.dataset.titlePlacement = item.dataset.loopRow === "1" ? "bottom" : "top";
        showHoverTitle(item);
      });

      item.addEventListener("mouseleave", () => {
        if (window.innerWidth <= 640) return;
        isHoveringItem = false;
        hideHoverTitle();
      });

      item.addEventListener("focus", () => {
        item.dataset.titlePlacement = item.dataset.loopRow === "1" ? "bottom" : "top";
        showHoverTitle(item);
      });

      item.addEventListener("blur", () => {
        hideHoverTitle();
      });

      item.dataset.hoverBound = "true";
    });
  }

  async function renderStrip() {
    const config = getConfig();
    const layoutKey = `${window.innerWidth}x${window.innerHeight}:${config.mobile ? "mobile" : "lateral"}:${pageCategory}`;
    const meta = await ensureMeta();
    const visibleItems = shuffle(meta);
    const fragment = document.createDocumentFragment();

    resetLateralState();
    stripRows.innerHTML = "";

    if (config.mobile) {
      visibleItems.forEach((imageData, index) => {
        fragment.appendChild(createStripItem(imageData, index));
      });
      stripRows.appendChild(fragment);
      bindLateralScroll();
      lastLayoutKey = layoutKey;
      return;
    }

    const rows = [[], []];
    visibleItems.forEach((imageData, index) => {
      rows[index % 2].push(imageData);
    });

    rows.forEach((rowItems, rowIndex) => {
      const lateralTrack = document.createElement("div");
      const rowTrack = document.createElement("div");
      lateralTrack.className = "lateral-track";
      rowTrack.className = "lateral-row-track";

      for (let segment = 0; segment < config.segmentCopies; segment += 1) {
        const segmentEl = document.createElement("div");
        segmentEl.className = "lateral-segment";

        rowItems.forEach((imageData, index) => {
          const clone = createStripItem(imageData, index);
          clone.dataset.loopSegment = String(segment);
          clone.dataset.loopRow = String(rowIndex);
          const cloneImage = clone.querySelector("img");
          if (cloneImage) {
            cloneImage.loading = "eager";
            cloneImage.addEventListener("load", measureLateralSegments, { once: true });
            cloneImage.addEventListener("error", measureLateralSegments, { once: true });
          }
          segmentEl.appendChild(clone);
        });

        rowTrack.appendChild(segmentEl);
      }

      lateralTrack.appendChild(rowTrack);
      fragment.appendChild(lateralTrack);
    });

    stripRows.appendChild(fragment);
    requestAnimationFrame(() => {
      requestAnimationFrame(measureLateralSegments);
    });
    bindLateralScroll();
    bindHoverTitles();
    lastLayoutKey = layoutKey;
  }

  function handleResize() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      const config = getConfig();
      const nextLayoutKey = `${window.innerWidth}x${window.innerHeight}:${config.mobile ? "mobile" : "lateral"}:${pageCategory}`;
      if (nextLayoutKey === lastLayoutKey) return;
      renderStrip();
    });
  }

  bindAboutControls();
  bindLightboxControls();
  renderStrip();
  window.addEventListener("resize", handleResize);
})();
