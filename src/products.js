// Edit names / prices here. Price is per the "unit" shown (₹).
export const WHATSAPP_NUMBER = "917066688288"; // country code + number, no "+"

const RAW_PRODUCTS = [
  // ---------- Festive snacks (price per kg) ----------
  { id: 1,  type: "savoury", mr: "चिवडा",          en: "Chivda",            price: 450, unit: "1 kg" },
  { id: 2,  type: "sweet",   mr: "बुंदी लाडू",      en: "Bundi Ladu",        price: 600, unit: "1 kg" },
  { id: 3,  type: "sweet",   mr: "रवा बेसन लाडू",   en: "Rava Besan Ladu",   price: 600, unit: "1 kg" },
  { id: 4,  type: "sweet",   mr: "बालुशाही",       en: "Balushahi",         price: 600, unit: "1 kg" },
  { id: 5,  type: "sweet",   mr: "चिरोटे",         en: "Chirote",           price: 600, unit: "1 kg" },
  { id: 6,  type: "savoury", mr: "मसाला शेव",      en: "Masala Shev",       price: 450, unit: "1 kg" },
  { id: 7,  type: "savoury", mr: "साधी शेव",       en: "Plain Shev",        price: 400, unit: "1 kg" },
  { id: 8,  type: "sweet",   mr: "गोड शंकरपाळे",    en: "Sweet Shankarpale", price: 450, unit: "1 kg" },
  { id: 9,  type: "savoury", mr: "खारे शंकरपाळे",   en: "Salty Shankarpale", price: 400, unit: "1 kg" },
  { id: 10, type: "savoury", mr: "भाजणी चकली",     en: "Bhajani Chakli",    price: 500, unit: "1 kg" },

  // ---------- Millet cookies ----------
  { id: 11, type: "sweet",   mr: "ज्वारी कुकीज",    en: "Jowar Cookies",     price: 185, unit: "250 g" },
  { id: 12, type: "sweet",   mr: "बाजरी कुकीज",    en: "Bajra Cookies",     price: 185, unit: "250 g" },
  { id: 13, type: "sweet",   mr: "राजगिरा कुकीज",   en: "Rajgira Cookies",   price: 220, unit: "250 g" },
  { id: 14, type: "sweet",   mr: "नाचणी कुकीज",    en: "Nachni Cookies",    price: 200, unit: "250 g" },

  // ---------- Millet toast ----------
  { id: 15, type: "savoury", mr: "ज्वारी टोस्ट",    en: "Jowar Toast",       price: 125, unit: "200 g" },
  { id: 16, type: "savoury", mr: "बाजरी टोस्ट",    en: "Bajra Toast",       price: 125, unit: "200 g" },
  { id: 17, type: "savoury", mr: "राजगिरा टोस्ट",   en: "Rajgira Toast",     price: 155, unit: "200 g" },
  { id: 18, type: "savoury", mr: "नाचणी टोस्ट",    en: "Nachni Toast",      price: 135, unit: "200 g" },

  // ---------- Cakes & brownies ----------
  { id: 19, type: "sweet",   mr: "वॉलनट ब्राउनी",   en: "Walnut Brownie",    price: 75,  unit: "100 g" },
  { id: 20, type: "sweet",   mr: "कुल्फी केक",     en: "Kulfi Cake",        price: 85,  unit: "100 g" },
  { id: 21, type: "sweet",   mr: "मावा केक",       en: "Mawa Cake",         price: 85,  unit: "100 g" },

  // ---------- Breads & basics ----------
  { id: 22, type: "savoury", mr: "ब्रेड",           en: "Bread",             price: 45,  unit: "300 g" },
  { id: 23, type: "savoury", mr: "ब्राउन ब्रेड",     en: "Brown Bread",       price: 50,  unit: "300 g" },
  { id: 24, type: "savoury", mr: "पाव",            en: "Pav (Regular)",     price: 45,  unit: "regular" },
  { id: 25, type: "savoury", mr: "कुलचा",          en: "Kulcha",            price: 35,  unit: "2 pcs" },
  { id: 26, type: "savoury", mr: "खारी",           en: "Khari",             price: 85,  unit: "200 g" },
  { id: 27, type: "savoury", mr: "टोस्ट",           en: "Toast",             price: 55,  unit: "200 g" },

  // ---------- More cookies ----------
  { id: 28, type: "sweet",   mr: "आटा गूळ कुकीज",   en: "Atta Jaggery Cookies", price: 150, unit: "250 g" },
  { id: 29, type: "savoury", mr: "जिरा कुकीज",     en: "Jeera Cookies",     price: 115, unit: "250 g" },
  { id: 30, type: "sweet",   mr: "कॉफी कुकीज",     en: "Coffee Cookies",    price: 140, unit: "250 g" },

  // ---------- Dry cakes ----------
  { id: 31, type: "sweet",   mr: "व्हॅनिला ड्राय केक", en: "Vanilla Dry Cake",   price: 60, unit: "100 g" },
  { id: 32, type: "sweet",   mr: "चॉकलेट ड्राय केक",  en: "Chocolate Dry Cake", price: 65, unit: "100 g" },

  // ---------- Muffins & donuts ----------
  { id: 33, type: "sweet",   mr: "व्हॅनिला मफिन्स",   en: "Vanilla Muffins",    price: 29, unit: "2 pcs" },
  { id: 34, type: "sweet",   mr: "चॉकलेट मफिन्स",    en: "Chocolate Muffins",  price: 35, unit: "2 pcs" },
  { id: 35, type: "sweet",   mr: "लाँग डोनट्स (बेक्ड)", en: "Long Donuts (Baked)", price: 20, unit: "2 pcs" },
  { id: 36, type: "sweet",   mr: "लाँग डोनट्स (फ्राईड)", en: "Long Donuts (Fried)", price: 25, unit: "2 pcs" },
];

// ids 1-10 = Diwali Faral, everything else = Bakery
export const PRODUCTS = RAW_PRODUCTS.map((p) => ({
  ...p,
  cat: p.id <= 10 ? "faral" : "bakery",
}));