import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.js";
import { WHATSAPP_NUMBER } from "./products.js";

export default function OrderModal({ items = [], onQtyChange, onClose, onPlaced }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(null); // { waUrl, saved }

  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  const totalKg = items.reduce((s, i) => s + i.qty, 0);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (items.length === 0) return setError("Your cart is empty. Please add at least one item.");
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone.trim())) return setError("Enter a valid 10-digit mobile number.");
    if (address.trim().length < 8) return setError("Please enter your full delivery address.");

    setSaving(true);

    const lines = items.map((i) => ({
      product: `${i.mr} (${i.en})`,
      pricePerKg: i.price,
      qty: i.qty,
      subtotal: i.qty * i.price,
    }));

    const order = {
      items: lines,
      // Summary fields kept so an existing admin panel still shows something readable
      product: lines.map((l) => `${l.product} × ${l.qty} kg`).join(", "),
      qty: totalKg,
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
    const itemText = lines
      .map((l, n) => `${n + 1}. ${l.product}\n   ${l.qty} kg × ₹${l.pricePerKg} = ₹${l.subtotal}`)
      .join("\n");
    const msg =
      `*New Order – AAi Foods*\n\n` +
      `${itemText}\n\n` +
      `Total quantity: ${totalKg} kg\n` +
      `*Total: ₹${total}*\n\n` +
      `Name: ${order.name}\n` +
      `Mobile: ${order.phone}\n` +
      `Address: ${order.address}`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    setSaving(false);
    setDone({ waUrl, saved });
    onPlaced?.(); // clear the cart
    window.open(waUrl, "_blank");
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="Close">×</button>

        {done ? (
          <div className="thanks">
            <h3>धन्यवाद, {name.trim().split(" ")[0]}!</h3>
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
            <h3>Your order</h3>

            {items.length === 0 ? (
              <p className="en">Your cart is empty. Close this and add items from the menu.</p>
            ) : (
              <ul className="cart-list">
                {items.map((i) => (
                  <li key={i.id} className="cart-item">
                    <div className="ci-name">
                      <b>{i.mr}</b>
                      <span>{i.en} · ₹{i.price}/kg</span>
                    </div>
                    <div className="qty-ctl" role="group" aria-label={`${i.en} quantity`}>
                      <button type="button" onClick={() => onQtyChange(i.id, i.qty - 0.5)} aria-label="Less">−</button>
                      <span>{i.qty} kg</span>
                      <button type="button" onClick={() => onQtyChange(i.id, i.qty + 0.5)} aria-label="More">+</button>
                    </div>
                    <div className="ci-sub">₹{i.qty * i.price}</div>
                    <button type="button" className="ci-remove" onClick={() => onQtyChange(i.id, 0)}
                            aria-label={`Remove ${i.en}`}>×</button>
                  </li>
                ))}
              </ul>
            )}

            <div className="total">Total ({totalKg} kg) <b>₹{total}</b></div>

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

            <button className="btn btn-green full" disabled={saving || items.length === 0}>
              {saving ? "Placing order…" : `Place order · ₹${total}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}