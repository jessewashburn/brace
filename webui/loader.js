// Brace theme interceptor
// Open WebUI's applyTheme() sets --color-gray-* as inline styles via style.setProperty
// which overrides any stylesheet. We wrap setProperty to remap those values to
// PromptRoot's navy palette before they're applied.

(function() {
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
    // Also fix document title
    if (document.title && document.title.includes('Open WebUI')) {
      document.title = document.title.replace(/Open WebUI/g, 'Brace');
    }
  };

  const applyAll = () => {
    applyColors();
    cleanBranding();
    setTimeout(cleanBranding, 500);
    setTimeout(cleanBranding, 1500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll);
  } else {
    applyAll();
  }

  // Watch for DOM changes (Svelte re-renders) and re-clean branding
  const observer = new MutationObserver(() => cleanBranding());
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
