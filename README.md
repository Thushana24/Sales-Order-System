# Sales Order Management System

Full-stack web application for managing sales orders.

## 🛠️ Tech Stack

### Backend
- .NET Core 8 Web API
- Entity Framework Core
- SQL Server
- Clean Architecture (N-Tier)

### Frontend
- Next.js 16
- React 19
- TypeScript 5
- Redux Toolkit
- Tailwind CSS 4

## 🚀 Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- SQL Server 2022

### Backend Setup

1. Navigate to backend directory:
```bash
cd SalesOrderAPI
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Update connection string in `appsettings.json`

4. Run database script (see `Database.sql`)

5. Start the API:
```bash
dotnet run
```

Backend runs on: `https://localhost:7259`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd sales-order-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://localhost:7058/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 📊 Features

- ✅ Customer management
- ✅ Item catalog
- ✅ Sales order creation
- ✅ Order editing
- ✅ Real-time calculations
- ✅ Responsive design
- ✅ Type-safe TypeScript
- ✅ Modern UI with Tailwind CSS

## 🗄️ Database Setup

1. Open SQL Server Management Studio (SSMS)
2. Connect to `localhost\SQLEXPRESS`
3. Create database `SalesOrderDB`
4. Run the SQL script from `Database.sql`

## 📸 Screenshots

(Add screenshots here)

## 👨‍💻 Developer

[Your Name]  
Internship Project - SPIL Labs (Pvt) Ltd.

## 📝 License

This project is for educational purposes.