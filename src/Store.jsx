import { useState } from "react";
import { PRODUCTS, WHATSAPP_NUMBER } from "./products.js";
import OrderModal from "./OrderModal.jsx";

const FSSAI_NOS = ["21526077002920", "11525056000056"];

const PHONES = [
  { display: "+91 70666 88288", tel: "+917066688288" },
  { display: "+91 70666 99299", tel: "+917066699299" },
];

// Two main sections, each split into Sweet / Savoury
const SECTIONS = [
  {
    key: "faral", id: "menu",
    mr: "दिवाळी फराळ", en: "Diwali Faral",
    note: "Prices are per kg. Add as many items as you like.",
  },
  {
    key: "bakery", id: "bakery",
    mr: "बेकरी", en: "Bakery",
    note: "Prices are per pack, as shown next to each item.",
  },
];

const GROUPS = [
  { key: "sweet", mr: "गोड", en: "Sweets" },
  { key: "Namkeen", mr: "नमकीन", en: "Savouries" },
];

const PROMISES = [
  { icon: "leaf", title: "Fresh ingredients", text: "Chosen and prepared with care" },
  { icon: "shield", title: "No preservatives", text: "Just honest, traditional recipes" },
  { icon: "home", title: "Homemade quality", text: "The taste of Aai's kitchen" },
  { icon: "box", title: "Home delivery", text: "Delivered to your doorstep" },
];

const STEPS = [
  { title: "Choose your items", text: "Add as many items as you like and set the quantity (kg or packs)." },
  { title: "Enter your details", text: "Add your name, mobile number and address." },
  { title: "Confirm on WhatsApp", text: "Your order opens in WhatsApp so we can confirm it with you." },
];

const ICONS = {
  leaf: "M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19c2-4 5-7 9-9",
  shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4",
  home: "M4 11l8-7 8 7M6 10v10h12V10M10 20v-5h4v5",
  box: "M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8",
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

/* ---------- quantity / unit helpers ----------
   Only "1 kg" items are sold by weight (0.5 kg steps).
   Everything else (250 g, 200 g, 100 g, 2 pcs...) is sold as PACKS (1, 2, 3...). */
const isKg = (p) => p.unit === "1 kg";
const stepOf = (p) => (isKg(p) ? 0.5 : 1);
const priceUnit = (p) => (isKg(p) ? "kg" : p.unit);
const priceLabel = (p) => `₹${p.price}/${priceUnit(p)}`;
const qtyLabel = (p, q) => (isKg(p) ? `${q} kg` : `${q} pack${q > 1 ? "s" : ""}`);
const orderLabel = (p, q) => (isKg(p) ? `${q} kg` : `${q} × ${p.unit}`);

export default function Store() {
  // cart = { [productId]: qty }  (kg for kg items, number of packs for the rest)
  const [cart, setCart] = useState({});
  const [checkout, setCheckout] = useState(false);
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}`;

  // Set quantity for a product. 0 (or less) removes it from the cart.
  const setQty = (id, qty) =>
    setCart((c) => {
      const next = { ...c };
      const q = Math.min(50, +qty.toFixed(1));
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });

  const items = PRODUCTS.filter((p) => cart[p.id]).map((p) => ({
    ...p,
    qty: cart[p.id],
    step: stepOf(p),
    priceLabel: priceLabel(p),
    qtyLabel: qtyLabel(p, cart[p.id]),
    orderLabel: orderLabel(p, cart[p.id]),
  }));
  const total = Math.round(items.reduce((s, i) => s + i.qty * i.price, 0));

  const renderRow = (p) => {
    const q = cart[p.id] || 0;
    const step = stepOf(p);
    return (
      <li key={p.id} className="menu-row">
        <div className="nm">
          <b>{p.mr}</b>
          <span>{p.en}</span>
        </div>
        <span className="dots" aria-hidden="true" />
        <div className="pr">
          ₹{p.price}<small>/{priceUnit(p)}</small>
        </div>
        {q === 0 ? (
          <button className="btn btn-green small" onClick={() => setQty(p.id, 1)}
                  aria-label={`Add ${p.en}`}>
            Add
          </button>
        ) : (
          <div className="qty-ctl" role="group" aria-label={`${p.en} quantity`}>
            <button type="button" onClick={() => setQty(p.id, q - step)} aria-label="Less">−</button>
            <span>{qtyLabel(p, q)}</span>
            <button type="button" onClick={() => setQty(p.id, q + step)} aria-label="More">+</button>
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <header className="top">
        <a href="#/" className="brand" aria-label="AAi Foods home">
          <img src="/logo.jpeg" alt="" className="brand-logo" />
          <span className="brand-text">
            <b>AAi Foods</b>
            <small>घरच्या चवीची, विश्वासाची परंपरा</small>
          </span>
        </a>
        <nav aria-label="Main">
          <a href="#menu" className="nav-link">Faral</a>
          <a href="#bakery" className="nav-link">Bakery</a>
          <a href="#how" className="nav-link">How to order</a>
          <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-wa small">WhatsApp</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-art">
            <img src="/banner.jpeg" alt="AAi Foods – homemade chivda, chakali, ladu, shev and more" />
          </div>
        </section>

        {SECTIONS.map((s) => (
          <section key={s.key} id={s.id} className="menu">
            <div className="section-head">
              <h2>{s.mr} <small>{s.en}</small></h2>
              <p>{s.note}</p>
            </div>

            <div className="menu-cols">
              {GROUPS.map((g) => {
                const list = PRODUCTS.filter((p) => p.cat === s.key && p.type === g.key);
                if (list.length === 0) return null;
                return (
                  <div key={g.key} className="menu-group">
                    <h3>{g.mr} <small>{g.en}</small></h3>
                    <ul>{list.map(renderRow)}</ul>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <section className="promises" aria-label="Our promise">
          <ul>
            {PROMISES.map((p) => (
              <li key={p.title}>
                <Icon name={p.icon} />
                <div>
                  <b>{p.title}</b>
                  <span>{p.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="how" className="how">
          <h2>Ordering is simple</h2>
          <ol>
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="step-no">{i + 1}</span>
                <div>
                  <b>{s.title}</b>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="contact">
          <div>
            <h2>आजच ऑर्डर करा!</h2>
            <p>Home delivery available. Call or message us to place a bulk or festival order.</p>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="foot-inner">
          <div className="foot-brand">
            <img src="/logo.jpeg" alt="" />
            <div>
              <b>AAi Foods</b>
              <p>Homemade food products. Traditional taste, always.</p>
            </div>
          </div>

          <div className="foot-col">
            <h4>Quick links</h4>
            <a href="#menu">Faral</a>
            <a href="#bakery">Bakery</a>
            <a href="#how">How to order</a>
            <a href={waLink} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>

          <div className="foot-col">
            <h4>Contact</h4>
            {PHONES.map((ph) => (
              <a key={ph.tel} href={`tel:${ph.tel}`} className="phone">{ph.display}</a>
            ))}
            <span>Home delivery available</span>
          </div>

          <div className="foot-col">
            <h4>Licence</h4>
            {FSSAI_NOS.map((n) => (
              <span key={n} className="foot-fssai">FSSAI Lic. No.: <b>{n}</b></span>
            ))}
          </div>
        </div>
        <div className="foot-bottom">© 2026 AAi Foods. All rights reserved.</div>
      </footer>

      {/* Sticky cart bar */}
      {items.length > 0 && !checkout && (
        <div className="cart-bar" role="region" aria-label="Your cart">
          <div className="cart-sum">
            <b>{items.length} {items.length === 1 ? "item" : "items"}</b>
            <span className="price-font">Total ₹{total}</span>
          </div>
          <button className="btn btn-green" onClick={() => setCheckout(true)}>
            View cart &amp; order
          </button>
        </div>
      )}

      {checkout && (
        <OrderModal
          items={items}
          onQtyChange={setQty}
          onClose={() => setCheckout(false)}
          onPlaced={() => setCart({})}
        />
      )}
    </>
  );
}