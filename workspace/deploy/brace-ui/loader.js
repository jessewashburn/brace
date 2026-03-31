// Brace theme interceptor
// Open WebUI's applyTheme() sets --color-gray-* as inline styles via style.setProperty
// which overrides any stylesheet. We wrap setProperty to remap those values to
// PromptRoot's navy palette before they're applied.

(function() {
  const HIGH_RES_ICON = '/static/web-app-manifest-512x512.png';
  const VECTOR_ICON = '/static/favicon.svg';
  const HIGH_RES_BRAND_IMAGE = '/static/logo.png';
  const HIGH_RES_SPLASH_IMAGE = '/static/splash.png';

  const BRACE_GRAYS = {
    '--color-gray-50':  '#f0f3f8',
    '--color-gray-100': '#e0e5f0',
    '--color-gray-200': '#c8cfe0',
    '--color-gray-300': '#a0a8bc',
    '--color-gray-400': '#8b94a8',
    '--color-gray-500': '#2a2d4a',
    '--color-gray-600': '#222438',
    '--color-gray-700': '#1a1f35',
    '--color-gray-750': '#171c2f',
    '--color-gray-800': '#141829',
    '--color-gray-850': '#0f1428',
    '--color-gray-900': '#0d1121',
    '--color-gray-950': '#0a0e1a',
  };

  const origSetProperty = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function(prop, value, priority) {
    if (BRACE_GRAYS.hasOwnProperty(prop)) {
      return origSetProperty.call(this, prop, BRACE_GRAYS[prop], priority);
    }
    return origSetProperty.call(this, prop, value, priority);
  };

  // Set CSS variables immediately on documentElement
  const applyColors = () => {
    for (const [prop, val] of Object.entries(BRACE_GRAYS)) {
      document.documentElement.style.setProperty(prop, val);
    }
  };

  // Ensure all favicon/link entries prefer vector or 512px assets.
  const enforceHighResIcons = () => {
    const iconLinks = document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    for (const link of iconLinks) {
      const rel = (link.getAttribute('rel') || '').toLowerCase();
      if (rel.includes('apple-touch-icon')) {
        link.setAttribute('href', HIGH_RES_ICON);
        continue;
      }
      if (rel.includes('icon') || rel.includes('shortcut')) {
        // Prefer SVG for crisp rendering at all scales.
        link.setAttribute('href', VECTOR_ICON);
      }
    }

    // Replace low-resolution branding images rendered in UI sections.
    const imageNodes = document.querySelectorAll('img[src]');
    for (const img of imageNodes) {
      const src = img.getAttribute('src') || '';
      if (/splash/i.test(src)) {
        img.setAttribute('src', HIGH_RES_SPLASH_IMAGE);
        continue;
      }
      if (/favicon|logo/i.test(src)) {
        img.setAttribute('src', HIGH_RES_BRAND_IMAGE);
      }
    }
  };

  // Remove "(Open WebUI)" from any text nodes in the page
  const cleanBranding = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.nodeValue && node.nodeValue.includes('(Open WebUI)')) {
        node.nodeValue = node.nodeValue.replace(/\s*\(Open WebUI\)/g, '');
      }
      if (node.nodeValue && node.nodeValue.includes('Open WebUI')) {
        node.nodeValue = node.nodeValue.replace(/Open WebUI/g, 'Brace');
      }
    }
    // Fix document title — "Brace (Brace)" → "Brace", "X (Brace)" → "X | Brace"
    if (document.title) {
      // Remove "Open WebUI" occurrences
      document.title = document.title.replace(/Open WebUI/g, 'Brace');
      // Remove duplicate "(Brace)" if it appears after "Brace"
      document.title = document.title.replace(/\bBrace\s*\(Brace\)/g, 'Brace');
      // Clean up "X (Brace)" → "X | Brace"
      document.title = document.title.replace(/^(.+?)\s*\(Brace\)$/, '$1 | Brace');
    }
  };

  // Tag controls side panels so CSS can target collapsible rows and param toggles
  // without affecting unrelated pages.
  const markControlsPanels = () => {
    const headings = document.querySelectorAll('div.text-md.self-center.font-primary');
    for (const heading of headings) {
      const label = (heading.textContent || '').trim().toLowerCase();
      if (label !== 'controls') continue;

      const panelRoot = heading.closest('div.dark\\:text-white');
      if (panelRoot) {
        panelRoot.setAttribute('data-brace-controls-root', 'true');
      }
    }
  };

  // Mark top navigation tab rails (admin/playground) so CSS can provide
  // stronger hover affordances than the stock text-color-only behavior.
  const markHeaderNavBars = () => {
    const path = window.location.pathname || '';

    // Shared top nav in admin/playground layouts.
    const topNavRails = document.querySelectorAll(
      'nav div[class*="scrollbar-none"][class*="overflow-x-auto"][class*="w-fit"][class*="rounded-full"]'
    );
    for (const rail of topNavRails) {
      rail.setAttribute('data-brace-header-nav', 'true');
    }

    // Users page sub-tabs (overview/groups) rail.
    if (path.startsWith('/admin/users')) {
      const usersTabs = document.getElementById('users-tabs-container');
      if (usersTabs) {
        usersTabs.setAttribute('data-brace-users-nav', 'true');
      }
    }
  };

  const applyAll = () => {
    applyColors();
    cleanBranding();
    enforceHighResIcons();
    markControlsPanels();
    markHeaderNavBars();
    setTimeout(cleanBranding, 500);
    setTimeout(enforceHighResIcons, 500);
    setTimeout(markControlsPanels, 500);
    setTimeout(markHeaderNavBars, 500);
    setTimeout(cleanBranding, 1500);
    setTimeout(enforceHighResIcons, 1500);
    setTimeout(markControlsPanels, 1500);
    setTimeout(markHeaderNavBars, 1500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll);
  } else {
    applyAll();
  }

  // Watch for DOM changes (Svelte re-renders) and re-clean branding
  const observer = new MutationObserver(() => {
    cleanBranding();
    enforceHighResIcons();
    markControlsPanels();
    markHeaderNavBars();
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
