// import { useState } from "react";
// import { PRODUCTS, WHATSAPP_NUMBER } from "./products.js";
// import OrderModal from "./OrderModal.jsx";

// const FSSAI_NOS = ["21526077002920", "11525056000056"];

// const PHONES = [
//   // { display: "+91 80558 08899", tel: "+918055808899" },
//   { display: "+91 70666 88288", tel: "+917066688288" },
//   { display: "+91 70666 99299", tel: "+917066699299" },
// ];

// const GROUPS = [
//   { key: "sweet", mr: "गोड फराळ", en: "Sweets" },
//   { key: "savoury", mr: "तिखट फराळ", en: "Savouries" },
// ];

// const PROMISES = [
//   { icon: "leaf", title: "Fresh ingredients", text: "Chosen and prepared with care" },
//   { icon: "shield", title: "No preservatives", text: "Just honest, traditional recipes" },
//   { icon: "home", title: "Homemade quality", text: "The taste of Aai's kitchen" },
//   { icon: "box", title: "Home delivery", text: "Delivered to your doorstep" },
// ];

// const STEPS = [
//   { title: "Choose your faral", text: "Add as many items as you like and set the quantity in kg." },
//   { title: "Enter your details", text: "Add your name, mobile number and address." },
//   { title: "Confirm on WhatsApp", text: "Your order opens in WhatsApp so we can confirm it with you." },
// ];

// const ICONS = {
//   leaf: "M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19c2-4 5-7 9-9",
//   shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4",
//   home: "M4 11l8-7 8 7M6 10v10h12V10M10 20v-5h4v5",
//   box: "M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8",
// };

// function Icon({ name }) {
//   return (
//     <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor"
//          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//       <path d={ICONS[name]} />
//     </svg>
//   );
// }

// export default function Store() {
//   // cart = { [productId]: qtyInKg }
//   const [cart, setCart] = useState({});
//   const [checkout, setCheckout] = useState(false);
//   const waLink = `https://wa.me/${WHATSAPP_NUMBER}`;

//   // Set quantity for a product. 0 (or less) removes it from the cart.
//   const setQty = (id, qty) =>
//     setCart((c) => {
//       const next = { ...c };
//       const q = Math.min(50, +qty.toFixed(1));
//       if (q <= 0) delete next[id];
//       else next[id] = q;
//       return next;
//     });

//   const items = PRODUCTS.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] }));
//   const totalKg = items.reduce((s, i) => s + i.qty, 0);
//   const total = items.reduce((s, i) => s + i.qty * i.price, 0);

//   return (
//     <>
//       <header className="top">
//         <a href="#/" className="brand" aria-label="AAi Foods home">
//           <img src="/logo.jpeg" alt="" className="brand-logo" />
//           <span className="brand-text">
//             <b>AAi Foods</b>
//             <small>घरच्या चवीची, विश्वासाची परंपरा</small>
//           </span>
//         </a>
//         <nav aria-label="Main">
//           <a href="#menu" className="nav-link">Menu</a>
//           <a href="#how" className="nav-link">How to order</a>
//           <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-wa small">WhatsApp</a>
//         </nav>
//       </header>

//       <main>
//         <section className="hero">
//           <div className="hero-art">
//             <img src="/banner.jpeg" alt="AAi Foods – homemade chivda, chakali, ladu, shev and more" />
//           </div>
//         </section>

//         <section id="menu" className="menu">
//           <div className="section-head">
//             <h2>दिवाळी फराळ मेनू</h2>
//             <p>Diwali faral menu. All prices are per kg. Add as many items as you like.</p>
//           </div>

//           <div className="menu-cols">
//             {GROUPS.map((g) => (
//               <div key={g.key} className="menu-group">
//                 <h3>
//                   {g.mr} <small>{g.en}</small>
//                 </h3>
//                 <ul>
//                   {PRODUCTS.filter((p) => p.type === g.key).map((p) => {
//                     const q = cart[p.id] || 0;
//                     return (
//                       <li key={p.id} className="menu-row">
//                         <div className="nm">
//                           <b>{p.mr}</b>
//                           <span>{p.en}</span>
//                         </div>
//                         <span className="dots" aria-hidden="true" />
//                         <div className="pr">
//                           ₹{p.price}<small>/kg</small>
//                         </div>
//                         {q === 0 ? (
//                           <button className="btn btn-green small" onClick={() => setQty(p.id, 1)}
//                                   aria-label={`Add ${p.en}`}>
//                             Add
//                           </button>
//                         ) : (
//                           <div className="qty-ctl" role="group" aria-label={`${p.en} quantity`}>
//                             <button type="button" onClick={() => setQty(p.id, q - 0.5)} aria-label="Less">−</button>
//                             <span>{q} kg</span>
//                             <button type="button" onClick={() => setQty(p.id, q + 0.5)} aria-label="More">+</button>
//                           </div>
//                         )}
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className="promises" aria-label="Our promise">
//           <ul>
//             {PROMISES.map((p) => (
//               <li key={p.title}>
//                 <Icon name={p.icon} />
//                 <div>
//                   <b>{p.title}</b>
//                   <span>{p.text}</span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </section>

//         <section id="how" className="how">
//           <h2>Ordering is simple</h2>
//           <ol>
//             {STEPS.map((s, i) => (
//               <li key={s.title}>
//                 <span className="step-no">{i + 1}</span>
//                 <div>
//                   <b>{s.title}</b>
//                   <p>{s.text}</p>
//                 </div>
//               </li>
//             ))}
//           </ol>
//         </section>

//         <section className="contact">
//           <div>
//             <h2>आजच ऑर्डर करा!</h2>
//             <p>Home delivery available. Call or message us to place a bulk or festival order.</p>
//           </div>
          
//         </section>
//       </main>

//       <footer className="foot">
//         <div className="foot-inner">
//           <div className="foot-brand">
//             <img src="/logo.jpeg" alt="" />
//             <div>
//               <b>AAi Foods</b>
//               <p>Homemade food products. Traditional taste, always.</p>
//             </div>
//           </div>

//           <div className="foot-col">
//             <h4>Quick links</h4>
//             <a href="#menu">Menu</a>
//             <a href="#how">How to order</a>
//             <a href={waLink} target="_blank" rel="noreferrer">WhatsApp</a>
//           </div>

//           <div className="foot-col">
//             <h4>Contact</h4>
//             {PHONES.map((ph) => (
//               <a key={ph.tel} href={`tel:${ph.tel}`} className="phone">{ph.display}</a>
//             ))}
//             <span>Home delivery available</span>
//           </div>

//           <div className="foot-col">
//             <h4>Licence</h4>
//             {FSSAI_NOS.map((n) => (
//               <span key={n} className="foot-fssai">FSSAI Lic. No.: <b>{n}</b></span>
//             ))}
//           </div>
//         </div>
//         <div className="foot-bottom">© 2026 AAi Foods. All rights reserved.</div>
//       </footer>

//       {/* Sticky cart bar: appears once at least one item is added */}
//       {items.length > 0 && !checkout && (
//         <div className="cart-bar" role="region" aria-label="Your cart">
//           <div className="cart-sum">
//             <b>{items.length} {items.length === 1 ? "item" : "items"} · {totalKg} kg</b>
//             <span>Total ₹{total}</span>
//           </div>
//           <button className="btn btn-green" onClick={() => setCheckout(true)}>
//             View cart &amp; order
//           </button>
//         </div>
//       )}

//       {checkout && (
//         <OrderModal
//           items={items}
//           onQtyChange={setQty}
//           onClose={() => setCheckout(false)}
//           onPlaced={() => setCart({})}
//         />
//       )}
//     </>
//   );
// }










import { useState } from "react";
import { PRODUCTS, WHATSAPP_NUMBER } from "./products.js";
import OrderModal from "./OrderModal.jsx";

const FSSAI_NOS = ["21526077002920", "11525056000056"];

const PHONES = [
  // { display: "+91 80558 08899", tel: "+918055808899" },
  { display: "+91 70666 88288", tel: "+917066688288" },
  { display: "+91 70666 99299", tel: "+917066699299" },
];

const GROUPS = [
  { key: "sweet", mr: "गोड फराळ", en: "Sweets" },
  { key: "savoury", mr: "तिखट फराळ", en: "Savouries" },
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

// Kg-priced items (festive snacks) go in 0.5 kg steps; pack-priced items go in whole packs.
const isKg = (p) => p.unit === "1 kg";
const stepOf = (p) => (isKg(p) ? 0.5 : 1);
const priceUnit = (p) => (isKg(p) ? "kg" : p.unit);
// Short label for a quantity, e.g. "1.5 kg" or "× 2"
const qtyLabel = (p, q) => (isKg(p) ? `${q} kg` : `× ${q}`);
// Longer label for order summaries, e.g. "1.5 kg" or "2 × 250 g"
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
    qtyLabel: qtyLabel(p, cart[p.id]),
    orderLabel: orderLabel(p, cart[p.id]),
  }));
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

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
          <a href="#menu" className="nav-link">Menu</a>
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

        <section id="menu" className="menu">
          <div className="section-head">
            <h2>दिवाळी फराळ मेनू</h2>
            <p>Diwali faral and bakery menu. Price is shown next to each item (per kg or per pack). Add as many items as you like.</p>
          </div>

          <div className="menu-cols">
            {GROUPS.map((g) => (
              <div key={g.key} className="menu-group">
                <h3>
                  {g.mr} <small>{g.en}</small>
                </h3>
                <ul>
                  {PRODUCTS.filter((p) => p.type === g.key).map((p) => {
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
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

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
            <a href="#menu">Menu</a>
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

      {/* Sticky cart bar: appears once at least one item is added */}
      {items.length > 0 && !checkout && (
        <div className="cart-bar" role="region" aria-label="Your cart">
          <div className="cart-sum">
            <b>{items.length} {items.length === 1 ? "item" : "items"}</b>
            <span>Total ₹{total}</span>
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