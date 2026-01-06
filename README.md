# 🛒 Next.js E‑Commerce Application

A modern, scalable **full‑stack e‑commerce platform** built with **Next.js (App Router)**, **MongoDB**, and **Redux Toolkit**. The UI is crafted using **Tailwind CSS** and **shadcn/ui**, providing a clean, accessible, and highly customizable design system.

The project is production‑ready, well‑structured, and designed for easy extension.

---

## 🌐 Live Demo

* **Storefront:** [https://nextjs-ecommerce-three-self.vercel.app/](https://nextjs-ecommerce-three-self.vercel.app/)
* **Admin Panel:** [https://nextjs-ecommerce-three-self.vercel.app/admin](https://nextjs-ecommerce-three-self.vercel.app/admin)
* **Auth Pages:** [https://nextjs-ecommerce-three-self.vercel.app/auth](https://nextjs-ecommerce-three-self.vercel.app/auth)

---

## ✨ Features

### 🛍️ User Features

* Product listing with categories & variants
* Product details with reviews
* Cart & checkout flow
* Secure payments with **Razorpay**
* JWT‑based authentication
* OTP login & email verification
* User dashboard (orders, profile)

### 🛠️ Admin Features

* Admin dashboard & analytics
* Product & category management
* Media manager (Cloudinary)
* Coupon & discount management
* Order management
* Customer management

### 🔐 Security

* JWT authentication
* OTP & email verification
* Server‑only secrets
* Protected admin routes

---

## 🧱 Tech Stack

### Frontend

* **Next.js 16 (App Router)**
* **React**
* **Redux Toolkit**
* **Tailwind CSS**
* **shadcn/ui**

### Backend

* **Next.js API Routes**
* **MongoDB (Mongoose)**
* **JWT Authentication**

### Integrations

* **Cloudinary** – image upload & media handling
* **Razorpay** – payments
* **Nodemailer (Gmail SMTP)** – emails & OTP

---

## 📁 Project Structure

```
src/
 ├── app/
 │   ├── layout.js           # Root layout
 │   ├── (website)/          # Public website
 │   ├── (admin)/            # Admin panel
 │   ├── api/                # API routes
 │   └── auth/               # Authentication pages
 ├── components/
 ├── lib/
 ├── models/
 ├── redux/
 └── utils/
```

---

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/Nextjs-Ecommerce.git
cd Nextjs-Ecommerce
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the root directory and add required values:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

MONGODB_URI=your_mongodb_uri
SECRET_KEY=your_secret_key

NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=587
NODEMAILER_EMAIL=your_email
NODEMAILER_PASSWORD=your_app_password

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
CLOUDINARY_SECRET_KEY=your_secret

NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### 4️⃣ Run the development server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## ☁️ Deployment

The app is deployed on **Vercel**.

* Add environment variables in **Vercel → Project Settings → Environment Variables**
* Redeploy without cache after changes

📖 Official guide: [https://nextjs.org/docs/app/building-your-application/deploying](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 🧠 Best Practices Used

* App Router layouts & route groups
* Server/client component separation
* Case‑sensitive file naming (Linux safe)
* Secure env handling
* Scalable folder structure

---

## 📌 Future Enhancements

* Wishlist
* Product search & filters
* Order invoices
* Admin role permissions
* Performance & SEO optimizations

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Rohit Kumar**

If you like this project, don’t forget to ⭐ the repository!