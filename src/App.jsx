import { useEffect, useState } from "react";
import Store from "./Store.jsx";
import Admin from "./Admin.jsx";

// Customer site:  /          Admin panel:  /#/admin
export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash === "#/admin" ? <Admin /> : <Store />;
}
