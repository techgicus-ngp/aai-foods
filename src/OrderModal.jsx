import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.js";
import { WHATSAPP_NUMBER } from "./products.js";

export default function OrderModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(null); // { waUrl, saved }

  const total = qty * product.price;
  const step = (d) => setQty((q) => Math.min(50, Math.max(0.5, +(q + d).toFixed(1))));

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone.trim())) return setError("Enter a valid 10-digit mobile number.");
    if (address.trim().length < 8) return setError("Please enter your full delivery address.");

    setSaving(true);
    const order = {
      product: `${product.mr} (${product.en})`,
      pricePerKg: product.price,
      qty,
      total,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      status: "New",
    };

    // 1) Save to Firebase (shows in admin panel)
    let saved = true;
    try {
      await addDoc(collection(db, "orders"), { ...order, createdAt: serverTimestamp() });
    } catch (err) {
      console.error(err);
      saved = false;
    }

    // 2) Send to WhatsApp
    const msg =
      `*New Order – AAi Foods*\n\n` +
      `Product: ${order.product}\n` +
      `Quantity: ${qty} kg\n` +
      `Total: ₹${total}\n\n` +
      `Name: ${order.name}\n` +
      `Mobile: ${order.phone}\n` +
      `Address: ${order.address}`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    setSaving(false);
    setDone({ waUrl, saved });
    window.open(waUrl, "_blank");
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="Close">×</button>

        {done ? (
          <div className="thanks">
            <h3>धन्यवाद, {name.split(" ")[0]}!</h3>
            <p>
              {done.saved
                ? "Your order is received."
                : "We could not save online, but you can still send it on WhatsApp."}{" "}
              If WhatsApp did not open, tap below to send it.
            </p>
            <a className="btn btn-wa" href={done.waUrl} target="_blank" rel="noreferrer">
              Send order on WhatsApp
            </a>
            <button className="btn btn-line" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h3>{product.mr}</h3>
            <p className="en">{product.en} · ₹{product.price} / kg</p>

            <label>Quantity (kg)</label>
            <div className="stepper">
              <button type="button" onClick={() => step(-0.5)} aria-label="Less">−</button>
              <input
                type="number" min="0.5" max="50" step="0.5" value={qty}
                onChange={(e) => setQty(Math.max(0.5, +e.target.value || 0.5))}
              />
              <button type="button" onClick={() => step(0.5)} aria-label="More">+</button>
            </div>

            <label htmlFor="n">Your name</label>
            <input id="n" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />

            <label htmlFor="p">Mobile number</label>
            <input
              id="p" type="tel" inputMode="numeric" maxLength={10} value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} autoComplete="tel"
            />

            <label htmlFor="a">Delivery address</label>
            <textarea id="a" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" />

            {error && <p className="err">{error}</p>}

            <div className="total">Total <b>₹{total}</b></div>
            <button className="btn btn-green full" disabled={saving}>
              {saving ? "Placing order…" : "Place order"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
