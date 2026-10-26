import { useEffect, useMemo, useState } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase.js";
import { PRODUCTS } from "./products.js";


// Admin can sign in with a full email (admin@gmail.com) or a simple username.
// A username without "@" becomes  <username>@aaifoods.app
const toEmail = (value) => {
  const v = value.trim().toLowerCase();
  return v.includes("@") ? v : `${v}@aaifoods.app`;
};

const STATUSES = ["New", "Confirmed", "Delivered", "Cancelled"];
const RANGES = [
  { key: "all", label: "All time" },
  { key: "today", label: "Today" },
  { key: "week", label: "Last 7 days" },
  { key: "month", label: "Last 30 days" },
];

const orderDate = (o) => (o.createdAt?.toDate ? o.createdAt.toDate() : new Date());
const inRange = (o, range) => {
  if (range === "all") return true;
  const d = orderDate(o), now = new Date();
  if (range === "today") return d.toDateString() === now.toDateString();
  return now - d <= (range === "week" ? 7 : 30) * 86400000;
};
const kgFmt = (n) => (Number.isInteger(n) ? n : n.toFixed(1));
const money = (n) => "₹" + n.toLocaleString("en-IN");

export default function Admin() {
  const [user, setUser] = useState(undefined); // undefined = loading
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  if (user === undefined) return <p className="center">Loading…</p>;
  return user ? <Dashboard user={user} /> : <Login />;
}

/* ---------------------------------------------------------------- login */
function Login() {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  async function login(e) {
    e.preventDefault();
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, toEmail(username), pass);
    } catch (e) {
      console.error(e);
      const msgs = {
        "auth/invalid-credential": "Wrong email or password, or this admin user does not exist in Firebase Authentication.",
        "auth/user-not-found": "Admin user not found in Firebase Authentication.",
        "auth/wrong-password": "Wrong password.",
        "auth/operation-not-allowed": "Enable Email/Password in Firebase Console > Authentication > Sign-in method.",
        "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
      };
      setErr(msgs[e.code] || `Login failed (${e.code || e.message}).`);
    }
  }

  return (
    <form className="login" onSubmit={login}>
      <img src="/logo.jpeg" alt="AAi Foods" />
      <h2>Admin login</h2>
      <label>Email or username</label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" />
      <label>Password</label>
      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" />
      {err && <p className="err">{err}</p>}
      <button className="btn btn-green full">Log in</button>
      <a href="#/" className="back">Back to website</a>
    </form>
  );
}

/* ------------------------------------------------------------ dashboard */
function Dashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [range, setRange] = useState("all");
  const [status, setStatus] = useState("All");
  const [product, setProduct] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => setError("You do not have permission to view orders. Check your Firestore rules and admin email.")
    );
  }, []);

  const scoped = useMemo(() => orders.filter((o) => inRange(o, range)), [orders, range]);
  const active = useMemo(() => scoped.filter((o) => o.status !== "Cancelled"), [scoped]);

  const totals = useMemo(() => ({
    orders: scoped.length,
    fresh: scoped.filter((o) => o.status === "New").length,
    kg: active.reduce((s, o) => s + (o.qty || 0), 0),
    value: active.reduce((s, o) => s + (o.total || 0), 0),
  }), [scoped, active]);

  // product-wise totals (cancelled orders are not counted)
  const summary = useMemo(() => {
    const map = new Map(PRODUCTS.map((p) => [`${p.mr} (${p.en})`, { key: `${p.mr} (${p.en})`, mr: p.mr, en: p.en, orders: 0, kg: 0, amount: 0 }]));
    active.forEach((o) => {
      let r = map.get(o.product);
      if (!r) { r = { key: o.product, mr: o.product, en: "", orders: 0, kg: 0, amount: 0 }; map.set(o.product, r); }
      r.orders += 1; r.kg += o.qty || 0; r.amount += o.total || 0;
    });
    return [...map.values()].sort((a, b) => b.kg - a.kg || b.orders - a.orders);
  }, [active]);
  const maxKg = Math.max(1, ...summary.map((r) => r.kg));

  const counts = useMemo(() => {
    const c = { All: scoped.length };
    STATUSES.forEach((s) => (c[s] = scoped.filter((o) => o.status === s).length));
    return c;
  }, [scoped]);

  const shown = useMemo(() => {
    const t = search.trim().toLowerCase();
    return scoped.filter((o) =>
      (status === "All" || o.status === status) &&
      (!product || o.product === product) &&
      (!t || `${o.name} ${o.phone} ${o.address}`.toLowerCase().includes(t))
    );
  }, [scoped, status, product, search]);

  const updateStatus = (id, s) => updateDoc(doc(db, "orders", id), { status: s });
  const remove = (id) => window.confirm("Delete this order permanently?") && deleteDoc(doc(db, "orders", id));

  function exportCsv() {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [["Date", "Order", "Product", "Qty (kg)", "Total", "Name", "Phone", "Address", "Status"]];
    shown.forEach((o) => rows.push([orderDate(o).toLocaleString("en-IN"), o.id.slice(0, 6).toUpperCase(), o.product, o.qty, o.total, o.name, o.phone, o.address, o.status]));
    const blob = new Blob(["\ufeff" + rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `aai-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="ad">
      <header className="ad-bar">
        <div className="ad-brand">
          <img src="/logo.jpeg" alt="" />
          <div>
            <b>AAi Foods</b>
            <span>Order dashboard</span>
          </div>
        </div>
        <div className="ad-user">
          <a href="#/" className="ad-link">View website</a>
          <span className="ad-email">{user.email}</span>
          <button className="ad-out" onClick={() => signOut(auth)}>Log out</button>
        </div>
      </header>

      <main className="ad-main">
        <div className="ad-titlebar">
          <h1>Orders overview</h1>
          <div className="ad-seg" role="group" aria-label="Date range">
            {RANGES.map((r) => (
              <button key={r.key} className={range === r.key ? "on" : ""} onClick={() => setRange(r.key)}>{r.label}</button>
            ))}
          </div>
        </div>

        {error && <p className="err">{error}</p>}

        <section className="ad-kpis" aria-label="Summary">
          <div className="ad-kpi"><span>Total orders</span><b>{totals.orders}</b></div>
          <div className="ad-kpi hot"><span>New, to confirm</span><b>{totals.fresh}</b></div>
          <div className="ad-kpi"><span>Total quantity</span><b>{kgFmt(totals.kg)}<small> kg</small></b></div>
          <div className="ad-kpi"><span>Order value</span><b>{money(totals.value)}</b></div>
        </section>
        <p className="ad-note">Quantity and value do not include cancelled orders.</p>

        <section className="ad-panel">
          <div className="ad-panel-head">
            <h2>Product-wise orders</h2>
            <p>Select a product to see only its orders.</p>
          </div>
          <div className="ad-prod-head" aria-hidden="true">
            <span>Product</span><span>Quantity</span><span>Orders</span><span>Value</span>
          </div>
          <ul className="ad-prods">
            {summary.map((r) => (
              <li key={r.key}>
                <button className={`ad-prod ${product === r.key ? "sel" : ""} ${r.orders === 0 ? "zero" : ""}`}
                        onClick={() => setProduct(product === r.key ? null : r.key)}>
                  <span className="pname"><b>{r.mr}</b><small>{r.en}</small></span>
                  <span className="pbar">
                    <i style={{ width: `${(r.kg / maxKg) * 100}%` }} />
                    <em>{kgFmt(r.kg)} kg</em>
                  </span>
                  <span className="pnum">{r.orders}</span>
                  <span className="pval">{money(r.amount)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="ad-panel">
          <div className="ad-panel-head split">
            <h2>All orders</h2>
            <div className="ad-tools">
              <input className="ad-search" type="search" placeholder="Search name, phone or address"
                     value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search orders" />
              <button className="ad-btn" onClick={exportCsv} disabled={!shown.length}>Download CSV</button>
            </div>
          </div>

          <div className="ad-tabs" role="tablist">
            {["All", ...STATUSES].map((s) => (
              <button key={s} role="tab" aria-selected={status === s} className={status === s ? "on" : ""} onClick={() => setStatus(s)}>
                {s} <span>{counts[s]}</span>
              </button>
            ))}
          </div>

          {product && (
            <div className="ad-chip">
              Showing orders for <b>{product}</b>
              <button onClick={() => setProduct(null)} aria-label="Clear product filter">Clear</button>
            </div>
          )}

          <div className="ad-thead" aria-hidden="true">
            <span>Order</span><span>Quantity</span><span>Customer</span><span>Status</span><span>Actions</span>
          </div>

          {!error && shown.length === 0 && (
            <p className="ad-empty">No orders match these filters. New orders appear here as soon as customers place them.</p>
          )}

          <ul className="ad-orders">
            {shown.map((o) => (
              <li key={o.id} className="ad-row">
                <div className="c-order">
                  <b>{o.product}</b>
                  <small>#{o.id.slice(0, 6).toUpperCase()} on {orderDate(o).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</small>
                </div>
                <div className="c-qty">
                  <b>{o.qty} kg</b>
                  <small>{money(o.total || 0)}</small>
                </div>
                <div className="c-cust">
                  <b>{o.name}</b>
                  <a href={`tel:${o.phone}`}>{o.phone}</a>
                  <small>{o.address}</small>
                </div>
                <div className="c-status">
                  <select data-status={o.status} value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} aria-label="Order status">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="c-act">
                  <a className="ad-btn wa" target="_blank" rel="noreferrer"
                     href={`https://wa.me/91${o.phone}?text=${encodeURIComponent(
                       `नमस्कार ${o.name}, AAi Foods कडून: तुमची ${o.product} ${o.qty} kg (₹${o.total}) ची ऑर्डर मिळाली आहे.`
                     )}`}>WhatsApp</a>
                  <button className="ad-btn danger" onClick={() => remove(o.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}