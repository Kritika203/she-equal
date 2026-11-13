// Handle skill proof and image files.



export const MAX_PROOF = 6;

export const EVIDENCE_KEY = 'wp_skill_evidence';

const SEED_PHOTO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRkJGQUY4Ii8+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI4MDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjQzczRTMzIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iOTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI1MiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhJTUFMIENPRkZFRTwvdGV4dD4KPGNpcmNsZSBjeD0iNDAwIiBjeT0iMzMwIiByPSIxMDUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0M3M0UzMyIgc3Ryb2tlLXdpZHRoPSIxMCIvPgo8cGF0aCBkPSJNIDUwNSAzMDAgQSA2MCA2MCAwIDEgMSA1MDUgMzYwIiBmaWxsPSJub25lIiBzdHJva2U9IiNDNzNFMzMiIHN0cm9rZS13aWR0aD0iMTAiLz4KPHJlY3QgeD0iMzMwIiB5PSI0NTUiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHJ4PSI1IiBmaWxsPSIjQzczRTMzIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iNTIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IiMxQzFCMUEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ28gYW5kIE1lbnUgRGVzaWduPC90ZXh0Pgo8dGV4dCB4PSI0MDAiIHk9IjU2MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmaWxsPSIjOEE4NTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TYW1wbGUgd29yayBieSBNYXlhPC90ZXh0Pgo8L3N2Zz4K";

export const makeEvidenceSeed = () => {
  const d = new Date().toISOString();
  return {
    Photoshop: [
      { id: 'seed-ps-photo', type: 'photo', src: SEED_PHOTO, note: "Logo and menu for Himal Coffee", date: d },
      { id: 'seed-ps-link', type: 'link', src: "https://mayashrestha.myportfolio.com", note: "My logo designs", date: d },
    ],
    Canva: [
      { id: 'seed-canva-link', type: 'link', src: "https://mayashrestha.myportfolio.com/instagram-posts", note: "Instagram posts for a clothing store", date: d },
    ],
  };
};

export const proofDomain = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } };

export const safeHref = (u) => (/^https?:\/\//i.test(u || '') ? u : undefined);

export const evidenceGroups = (skills, ev) => {
  const keys = [...skills.filter(s => ev[s] && ev[s].length), ...Object.keys(ev).filter(k => !skills.includes(k) && ev[k] && ev[k].length)];
  return keys.map(k => [k, ev[k]]);
};

export function resizeImageToJpeg(file, maxSide = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode'));
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale)), h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h); // JPEG has no transparency
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (e) { reject(e); }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
