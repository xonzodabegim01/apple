(() => {
  "use strict";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  // 1. MOBIL MENYU

  const mobileToggle = $("#mobileToggle");
  const navLinks = $("#navLinks");

  mobileToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    mobileToggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$("#navLinks a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
  });

  // 2. MEGA MENU

  const mega = $("#megaMenu");
  const megaTitle = $("#megaTitle");
  const megaLinks = $("#megaLinks");

  const menuData = {
    Store: [
      ["Barcha mahsulotlar", "#all-products"],
      ["iPhone", "#iphone"],
      ["Mac", "#mac"],
      ["Aksessuarlar", "#accessories"]
    ],

    Mac: [
      ["MacBook Air", "#mac"],
      ["MacBook Pro", "#mac"],
      ["iMac", "#mac"],
      ["Mac mini", "#mac"]
    ],

    iPad: [
      ["iPad Pro", "#ipad"],
      ["iPad Air", "#ipad"],
      ["iPad mini", "#ipad"]
    ],

    iPhone: [
      ["iPhone 17 Pro", "#iphone"],
      ["iPhone 17", "#iphone"],
      ["iPhone Air", "#iphone"],
      ["iPhone 16", "#iphone"]
    ],

    Watch: [
      ["Apple Watch Series 11", "#watch"],
      ["Apple Watch Ultra 3", "#watch"],
      ["Apple Watch SE 3", "#watch"]
    ],

    AirPods: [
      ["AirPods Pro 3", "#airpods"],
      ["AirPods 4", "#airpods"],
      ["AirPods Max", "#airpods"]
    ]
  };

  function closeMega() {
    mega.classList.remove("open");
    mega.setAttribute("aria-hidden", "true");
  }

  function openMega(link) {
    if (window.innerWidth <= 760) return;

    const label = link.textContent.trim();
    const items = menuData[label];

    if (!items) {
      closeMega();
      return;
    }

    megaTitle.textContent = label + " bo‘limi";
    megaLinks.replaceChildren();

    items.forEach(([name, href]) => {
      const a = document.createElement("a");

      a.href = href;
      a.textContent = name;

      a.addEventListener("click", closeMega);

      megaLinks.appendChild(a);
    });

    mega.classList.add("open");
    mega.setAttribute("aria-hidden", "false");
  }

  $$("#navLinks a").forEach(link => {
    link.addEventListener("mouseenter", () => openMega(link));
  });

  mega.addEventListener("mouseleave", closeMega);

  // 3. QIDIRUV

  const searchPanel = $("#searchPanel");
  const bagPanel = $("#bagPanel");

  function closePanels() {
    searchPanel.classList.remove("open");
    bagPanel.classList.remove("open");
  }

  $("#searchToggle").addEventListener("click", () => {
    closePanels();
    closeMega();

    searchPanel.classList.toggle("open");

    if (searchPanel.classList.contains("open")) {
      $("#siteSearch").focus();
    }
  });

  // 4. SAVATCHA OCHISH

  $("#bagToggle").addEventListener("click", () => {
    closePanels();
    closeMega();

    bagPanel.classList.toggle("open");
  });

  // 5. MAHSULOT QIDIRISH

  $("#siteSearch").addEventListener("keydown", event => {
    if (event.key !== "Enter") return;

    const term = event.currentTarget.value
      .trim()
      .toLowerCase();

    if (!term) return;

    const cards = $$(".product-card");

    const match = cards.find(card =>
      (card.dataset.name || card.innerText)
        .toLowerCase()
        .includes(term)
    );

    if (match) {
      match.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      match.classList.add("search-highlight");

      setTimeout(() => {
        match.classList.remove("search-highlight");
      }, 1800);

      closePanels();
    } else {
      $("#searchHint").textContent =
        "Mahsulot topilmadi!";
    }
  });

  // 6. SAVATCHA

  const basket = [];

  function renderBasket() {
    $("#bagCount").textContent = basket.length;

    $("#bagItems").replaceChildren();

    basket.forEach((name, index) => {
      const li = document.createElement("li");

      li.textContent = name + " ";

      const remove = document.createElement("button");

      remove.textContent = "×";
      remove.type = "button";

      remove.addEventListener("click", () => {
        basket.splice(index, 1);
        renderBasket();
      });

      li.appendChild(remove);
      $("#bagItems").appendChild(li);
    });

    $("#bagMessage").textContent = basket.length
      ? `Savatingizda ${basket.length} ta mahsulot bor.`
      : "Savatingiz hozircha bo‘sh.";
  }

  $$(".add-button").forEach(button => {
    button.addEventListener("click", () => {
      const product = button.dataset.product || "Mahsulot";

      basket.push(product);

      renderBasket();

      showToast(product + " savatga qo‘shildi!");
    });
  });

  $("#clearBag").addEventListener("click", () => {
    basket.length = 0;
    renderBasket();

    showToast("Savat tozalandi!");
  });

  // 7. SLIDER

  const slides = $$(".hero-slide");
  const dotsWrap = $("#sliderDots");

  let currentSlide = 0;
  let sliderTimer;

  function showSlide(index) {
    if (!slides.length) return;

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentSlide);
    });

    $$(".slider-dots button").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  }

  function startSlider() {
    clearInterval(sliderTimer);

    if (slides.length > 1) {
      sliderTimer = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 5000);
    }
  }

  slides.forEach((slide, i) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.setAttribute("aria-label", `${i + 1}-slayd`);

    dot.addEventListener("click", () => {
      showSlide(i);
      startSlider();
    });

    dotsWrap.appendChild(dot);
  });

  $("#prevSlide").addEventListener("click", () => {
    showSlide(currentSlide - 1);
    startSlider();
  });

  $("#nextSlide").addEventListener("click", () => {
    showSlide(currentSlide + 1);
    startSlider();
  });

  $("#pauseSlider").addEventListener("click", () => {
    if (sliderTimer) {
      clearInterval(sliderTimer);
      sliderTimer = null;
    } else {
      startSlider();
    }
  });

  showSlide(0);
  startSlider();

  // 8. XABARNOMA

  let toastTimer;

  function showToast(message) {
    const toast = $("#toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

})();