(() => {
  const root = document.documentElement;
  const locales = (() => {
    try {
      return JSON.parse(root.dataset.locales || "[]");
    } catch {
      return [];
    }
  })();

  const normalize = (locale) => locale.replace(/_/g, "-").toLowerCase();
  const normalizedLocales = new Map(locales.map((locale) => [normalize(locale), locale]));

  const browserLocale = () => {
    const preferred = navigator.languages || [navigator.language || ""];

    for (const locale of preferred) {
      const normalized = normalize(locale);
      if (normalizedLocales.has(normalized)) return normalizedLocales.get(normalized);

      const language = normalized.split("-")[0];
      const languageOnly = normalizedLocales.get(language);
      if (languageOnly) return languageOnly;

      const matchingLocale = locales.find((configured) => normalize(configured).split("-")[0] === language);
      if (matchingLocale) return matchingLocale;
    }

    return root.dataset.defaultLocale;
  };

  if (root.dataset.localeRoot === "true") {
    const basePath = window.location.pathname.replace(/\/(?:index\.html)?$/, "") || "/";
    const targetLocale = browserLocale();
    const target = `${basePath.replace(/\/?$/, "/")}${encodeURIComponent(targetLocale)}${window.location.search}${window.location.hash}`;
    window.location.replace(target);
  }
})();
