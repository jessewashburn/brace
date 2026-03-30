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

  // Also set them immediately on documentElement in case they're already set
  const apply = () => {
    for (const [prop, val] of Object.entries(BRACE_GRAYS)) {
      document.documentElement.style.setProperty(prop, val);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
