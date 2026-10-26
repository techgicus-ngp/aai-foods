import { useState } from "react";
import { PRODUCTS, WHATSAPP_NUMBER } from "./products.js";
import OrderModal from "./OrderModal.jsx";

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
  { title: "Choose your faral", text: "Pick any item from the menu and tap Order Now." },
  { title: "Enter your details", text: "Add quantity in kg, your name, mobile number and address." },
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

export default function Store() {
  const [selected, setSelected] = useState(null);
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}`;

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
          <div className="hero-copy">
            <h1>आमचा दिवाळी फराळ</h1>
            <p className="tagline">Athavan Aai chya chavichi…</p>
            <p className="lead">
              Homemade chivda, chakali, ladu, shev and shankarpale, made fresh the traditional
              way and delivered to your home this Diwali.
            </p>
            <div className="hero-actions">
              <a href="#menu" className="btn btn-green">Order your faral</a>
              <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-line">Ask us on WhatsApp</a>
            </div>
          </div>
          <div className="hero-art">
            <img src="/banner.jpeg" alt="AAi Foods – homemade chivda, chakali, ladu, shev and more" />
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

        <section id="menu" className="menu">
          <div className="section-head">
            <h2>दिवाळी फराळ मेनू</h2>
            <p>Diwali faral menu. All prices are per kg.</p>
          </div>

          <div className="menu-cols">
            {GROUPS.map((g) => (
              <div key={g.key} className="menu-group">
                <h3>
                  {g.mr} <small>{g.en}</small>
                </h3>
                <ul>
                  {PRODUCTS.filter((p) => p.type === g.key).map((p) => (
                    <li key={p.id} className="menu-row">
                      <div className="nm">
                        <b>{p.mr}</b>
                        <span>{p.en}</span>
                      </div>
                      <span className="dots" aria-hidden="true" />
                      <div className="pr">
                        ₹{p.price}<small>/kg</small>
                      </div>
                      <button className="btn btn-green small" onClick={() => setSelected(p)}
                              aria-label={`Order ${p.en}`}>
                        Order Now
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
          <a href={waLink} target="_blank" rel="noreferrer" className="contact-num">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
            </svg>
            +91 80558 08899
          </a>
        </section>
      </main>

      <footer className="foot">
        <img src="/logo.jpeg" alt="" />
        <p>
          <b>AAi Foods</b><br />
          Homemade food products. Traditional taste, always.
        </p>
        <small>© 2026 AAi Foods. All rights reserved.</small>
      </footer>

      {selected && <OrderModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}