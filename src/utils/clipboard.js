// Copy text from a safety result.



export const copyToClipboard = async (str) => {
  try { await navigator.clipboard.writeText(str); } catch (e) {
    try { const ta = document.createElement('textarea'); ta.value = str; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e2) { /* ignore */ }
  }
};
