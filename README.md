# AAi Foods – one-page order website (React + Firebase + WhatsApp)

## 1. Install & run
    npm install
    cp .env.example .env     # then paste your Firebase keys
    npm run dev

## 2. Firebase setup (console.firebase.google.com)
1. Create project → Add **Web app** → copy the config values into `.env`.
2. **Build → Firestore Database** → Create database.
3. **Build → Authentication** → Sign-in method → enable **Email/Password**,
   then **Users → Add user** (this is your admin login).
4. Firestore → **Rules** → paste `firestore.rules`, replace `YOUR_ADMIN_EMAIL@gmail.com`
   with your admin email, then Publish.

## 3. How it works
- Customer clicks **Order Now** → form → order saved in Firestore **and** WhatsApp opens
  with the order message pre-filled for +91 8055808899.
- Admin panel: open `yourwebsite.com/#/admin`, log in, see live orders,
  change status, message the customer on WhatsApp, delete.

## 4. Change products / prices / WhatsApp number
Edit `src/products.js`.

## 5. Deploy
    npm run build
Upload the `dist` folder to Firebase Hosting / Netlify / Vercel.
(Firebase Hosting: `firebase init hosting` → public dir `dist` → single-page app: yes.)
