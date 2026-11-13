// Message shown when a chat cannot open.

import { useEffect } from 'react';



export function ChatMissing({ t, navTo }) {
  useEffect(() => { navTo('opportunities', { tab: 'applied' }); }, []);
  return null;
}
