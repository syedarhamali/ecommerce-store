# Ecommerce Store

A fully functional ecommerce store built with Next.js frontend and Express.js backend, featuring modern design, admin panel, Google OAuth authentication, and Abhipay checkout integration.

## Features

### 🛍️ Store Features
- **Modern UI/UX** - Built with NextUI components and Tailwind CSS
- **Dark/Light Mode** - Toggle between themes with system preference detection
- **Product Catalog** - Browse products with filtering, search, and pagination
- **Product Details** - Detailed product pages with image gallery and specifications
- **Shopping Cart** - Add/remove products with quantity management
- **Checkout** - Secure checkout with Abhipay payment integration
- **Order Management** - Track orders and view order history

### 🔐 Authentication
- **Google OAuth** - Sign in with Google using NextAuth.js
- **Protected Routes** - Admin panel and user-specific features
- **Session Management** - Persistent login sessions

### 👨‍💼 Admin Panel
- **Product Management** - Add, edit, delete products with image upload
- **Order Management** - View and manage customer orders
- **User Management** - Manage user accounts and roles
- **Analytics Dashboard** - View store statistics and metrics
- **Image Upload** - Cloudinary integration for product images

### 💳 Payment Integration
- **Abhipay Checkout** - Secure payment processing
- **Order Tracking** - Real-time order status updates
- **Webhook Support** - Handle payment notifications

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **NextUI** - Modern React component library
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth.js** - Authentication for Next.js
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Cloudinary** - Image storage and optimization
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Google OAuth credentials
- Cloudinary account
- Abhipay merchant account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-store
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   **Frontend** (`.env.local`):
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
   NEXT_PUBLIC_ABHIPAY_MERCHANT_ID=your-abhipay-merchant-id
   NEXT_PUBLIC_ABHIPAY_API_KEY=your-abhipay-api-key
   ```

   **Backend** (`.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ecommerce-store
   JWT_SECRET=your-jwt-secret-key-here
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ABHIPAY_MERCHANT_ID=your-abhipay-merchant-id
   ABHIPAY_API_KEY=your-abhipay-api-key
   ABHIPAY_WEBHOOK_SECRET=your-abhipay-webhook-secret
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

### Database Setup

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **The application will automatically create the necessary collections and indexes**

## Project Structure

```
ecommerce-store/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App Router pages
│   │   ├── admin/           # Admin panel
│   │   ├── auth/            # Authentication pages
│   │   ├── products/        # Product pages
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   ├── admin/           # Admin-specific components
│   │   └── ...              # Shared components
│   └── ...
├── backend/                 # Express.js backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   └── server.js            # Main server file
└── ...
```

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/categories/list` - Get categories

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `POST /api/orders/abhipay-webhook` - Abhipay webhook

### Upload
- `POST /api/upload/single` - Upload single image (Admin)
- `POST /api/upload/multiple` - Upload multiple images (Admin)
- `DELETE /api/upload/:publicId` - Delete image (Admin)

## Features in Detail

### Admin Panel
- **Dashboard** - Overview of store statistics
- **Product Management** - Full CRUD operations for products
- **Image Upload** - Drag-and-drop image upload with Cloudinary
- **Order Management** - View and update order status
- **User Management** - Manage user accounts and roles

### Product Management
- **Rich Product Data** - Name, description, price, images, specifications
- **Category System** - Organize products by categories
- **Stock Management** - Track inventory levels
- **Featured Products** - Highlight special products
- **Image Gallery** - Multiple product images with zoom
- **Search & Filter** - Find products quickly

### Payment Integration
- **Abhipay Integration** - Secure payment processing
- **Order Tracking** - Real-time order status updates
- **Webhook Support** - Handle payment notifications
- **Multiple Payment Methods** - Support for various payment options

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update MONGODB_URI in environment variables
3. Configure network access and database user

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@ecommercestore.com or create an issue in the repository.