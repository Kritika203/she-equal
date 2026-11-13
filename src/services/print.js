// Print the Passport or Evidence Vault report.



export function printDocument(target) {
  document.body.dataset.print = target;
  const clear = () => { delete document.body.dataset.print; window.removeEventListener('afterprint', clear); };
  window.addEventListener('afterprint', clear);
  window.print();
}
