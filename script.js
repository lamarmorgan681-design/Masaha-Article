document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =====================================
    // 1. تحديد عناصر الصفحة
    // =====================================

    const body = document.body;

    const readingProgress = document.getElementById("readingProgress");

    const fontDecrease = document.getElementById("fontDecrease");
    const fontIncrease = document.getElementById("fontIncrease");

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    const menuToggle = document.getElementById("menuToggle");
    const articleSidebar = document.getElementById("articleSidebar");

    const backToTop = document.getElementById("backToTop");

    const shareButton = document.getElementById("shareButton");
    const copyButton = document.getElementById("copyButton");

    const toastMessage = document.getElementById("toastMessage");

    const articleContent = document.querySelector(".article-content");

    const indexLinks = document.querySelectorAll(".index-link");

    // =====================================
    // 2. إشعارات الصفحة Toast
    // =====================================

    let toastTimer;

    function showToast(message) {
        if (!toastMessage) return;

        toastMessage.textContent = message;
        toastMessage.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toastMessage.classList.remove("show");
        }, 2500);
    }

    // =====================================
    // 3. مؤشر تقدم القراءة
    // =====================================

    function updateReadingProgress() {
        if (!readingProgress) return;

        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        readingProgress.style.width =
            `${Math.min(progress, 100)}%`;
    }

    window.addEventListener("scroll", updateReadingProgress, {
        passive: true
    });

    window.addEventListener("resize", updateReadingProgress);

    updateReadingProgress();

    // =====================================
    // 4. الوضع الليلي والنهاري
    // =====================================

    const savedTheme = localStorage.getItem("falsafat-theme");

    const prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    function applyTheme(isDark) {
        body.classList.toggle("dark-mode", isDark);

        if (themeIcon) {
            themeIcon.textContent = isDark ? "☀" : "☾";
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"
            );

            themeToggle.setAttribute(
                "aria-pressed",
                String(isDark)
            );
        }
    }

    const initialDark =
        savedTheme === null
            ? prefersDark
            : savedTheme === "dark";

    applyTheme(initialDark);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isDark = !body.classList.contains("dark-mode");

            applyTheme(isDark);

            localStorage.setItem(
                "falsafat-theme",
                isDark ? "dark" : "light"
            );
        });
    }

    // =====================================
    // 5. التحكم في حجم خط المقال
    // =====================================

    let currentFontSize = Number(
        localStorage.getItem("falsafat-font-size")
    );

    if (!Number.isFinite(currentFontSize)) {
        currentFontSize = 19;
    }

    currentFontSize = Math.min(
        25,
        Math.max(16, currentFontSize)
    );

    function updateFontSize() {
        if (!articleContent) return;

        articleContent.style.setProperty(
            "--reader-font-size",
            `${currentFontSize}px`
        );

        localStorage.setItem(
            "falsafat-font-size",
            currentFontSize
        );
    }

    updateFontSize();

    if (fontIncrease) {
        fontIncrease.addEventListener("click", () => {
            if (currentFontSize < 25) {
                currentFontSize++;
                updateFontSize();
            } else {
                showToast("وصلت إلى أكبر حجم للخط.");
            }
        });
    }

    if (fontDecrease) {
        fontDecrease.addEventListener("click", () => {
            if (currentFontSize > 16) {
                currentFontSize--;
                updateFontSize();
            } else {
                showToast("وصلت إلى أصغر حجم للخط.");
            }
        });
    }

    // =====================================
    // 6. فتح وإغلاق فهرس المقال على الهاتف
    // =====================================

    function isMobile() {
        return window.matchMedia("(max-width: 650px)").matches;
    }

    function closeMobileMenu() {
        if (!articleSidebar || !menuToggle) return;

        articleSidebar.classList.remove("is-open");

        const sidebarInner =
            articleSidebar.querySelector(".sidebar-inner");

        if (isMobile() && sidebarInner) {
            sidebarInner.style.display = "none";
        }

        menuToggle.setAttribute("aria-expanded", "false");
    }

    function initializeMobileMenu() {
        if (!articleSidebar || !menuToggle) return;

        const sidebarInner =
            articleSidebar.querySelector(".sidebar-inner");

        if (!sidebarInner) return;

        if (isMobile()) {
            sidebarInner.style.display = "none";
            articleSidebar.classList.remove("is-open");

            menuToggle.setAttribute("aria-expanded", "false");
        } else {
            sidebarInner.style.display = "";
            articleSidebar.classList.remove("is-open");

            menuToggle.setAttribute("aria-expanded", "false");
        }
    }

    initializeMobileMenu();

    if (menuToggle && articleSidebar) {
        menuToggle.addEventListener("click", () => {
            const sidebarInner =
                articleSidebar.querySelector(".sidebar-inner");

            if (!sidebarInner || !isMobile()) return;

            const isOpen =
                articleSidebar.classList.toggle("is-open");

            sidebarInner.style.display =
                isOpen ? "block" : "none";

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }

    window.addEventListener("resize", initializeMobileMenu);

    // =====================================
    // 7. إغلاق الفهرس بعد اختيار قسم
    // =====================================

    indexLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (isMobile()) {
                closeMobileMenu();
            }
        });
    });

    // =====================================
    // 8. تحديد القسم الحالي في الفهرس
    // =====================================

    const articleSections = document.querySelectorAll(
        "#introduction, " +
        "#section-1, " +
        "#section-2, " +
        "#section-3, " +
        "#section-4, " +
        "#section-5, " +
        "#section-6, " +
        "#section-7, " +
        "#section-8, " +
        "#references"
    );

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const currentId = entry.target.id;

                    indexLinks.forEach(link => {
                        const targetId =
                            link.getAttribute("href");

                        const isActive =
                            targetId === `#${currentId}`;

                        link.classList.toggle(
                            "active",
                            isActive
                        );

                        if (isActive) {
                            link.setAttribute(
                                "aria-current",
                                "location"
                            );
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                root: null,
                rootMargin: "-20% 0px -65% 0px",
                threshold: 0
            }
        );

        articleSections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // =====================================
    // 9. زر العودة إلى الأعلى
    // =====================================

    function updateBackToTop() {
        if (!backToTop) return;

        if (window.scrollY > 500) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // =====================================
    // 10. مشاركة المقال
    // =====================================

    if (shareButton) {
        shareButton.addEventListener("click", async () => {
            const shareData = {
                title: "فلسفة العزلة | لامار مورجان",
                text:
                    "حين يصبح الابتعاد عن العالم وسيلة لاكتشاف الذات.\n" +
                    "اقرأ مقال فلسفة العزلة بقلم لامار مورجان.",
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (error) {
                    if (error.name !== "AbortError") {
                        showToast("تعذرت مشاركة المقال.");
                    }
                }
            } else {
                copyText(window.location.href)
                    .then(() => {
                        showToast("تم نسخ رابط المقال للمشاركة.");
                    })
                    .catch(() => {
                        showToast("تعذرت مشاركة المقال.");
                    });
            }
        });
    }

    // =====================================
    // 11. نسخ رابط المقال
    // =====================================

    async function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const temporaryInput =
            document.createElement("textarea");

        temporaryInput.value = text;
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";

        document.body.appendChild(temporaryInput);

        temporaryInput.select();

        const copied = document.execCommand("copy");

        temporaryInput.remove();

        if (!copied) {
            throw new Error("Copy failed");
        }
    }

    if (copyButton) {
        copyButton.addEventListener("click", async () => {
            try {
                await copyText(window.location.href);
                showToast("تم نسخ رابط المقال بنجاح.");
            } catch (error) {
                showToast("لم نتمكن من نسخ الرابط.");
            }
        });
    }

    // =====================================
    // 12. روابط الانتقال داخل الصفحة
    // =====================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.replaceState(
                null,
                "",
                targetId
            );
        });
    });

    // =====================================
    // 13. إنهاء التهيئة
    // =====================================

    console.log(
        "فلسفة العزلة | Lamar Morgan — تم تحميل الموقع بنجاح."
    );

});