---

# Bel Lingeries E-Commerce Platform

Welcome to Bel Lingeries, an e-commerce platform built with Next.js and Prisma ORM.

## Features
- **Product Catalog**: Browse and purchase a variety of lingerie products.
- **User Authentication**: Secure account management and authentication.
- **Shopping Cart**: Add, remove, and manage items in the cart.
- **Checkout Process**: Seamless payment integration for a smooth buying experience.
- **Admin Panel**: Manage products, orders, and users through an intuitive interface.
- **Responsive Design**: Mobile-friendly design ensures accessibility across devices.

## Technologies Used
- **Next.js**: React framework for server-rendered applications.
- **Prisma**: Modern database toolkit for Node.js and TypeScript.
- **Tailwind CSS**: Utility-first CSS framework for styling flexibility.
- **PostgreSQL**: Reliable relational database management system.

## Getting Started
### Prerequisites
- Node.js (version >= 12.x)
- npm or yarn
- PostgreSQL database

### Installation
```bash
git clone https://github.com/Pedroklg/Bel-Lingeries.git
cd Bel-Lingeries
npm install
# or
yarn install
```

### Configuration
- Set up your environment variables in a `.env` file in the root directory.
- Required environment variables:
  ```plaintext
  DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
  SESSION_SECRET="your_session_secret"
  STRIPE_SECRET_KEY="your_stripe_secret_key"
  ```

### Database Setup
Initialize and migrate the database using Prisma:
```bash
npx prisma migrate dev
```

### Usage
Start the development server:
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

Feel free to customize and expand upon this template with additional details specific to your project.
