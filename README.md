# Cash Management Web App

## Overview

The Cash Management Web App is a comprehensive tool designed to streamline cash handling and order tracking for laundry stores. Built with modern web technologies, this application facilitates cashier management, order creation, payment tracking, and archive management.

## Features

- **Cashier Management:** Efficiently manage cash transactions and orders.
- **Order Creation:** Create and manage laundry orders with customer details.
- **Payment Tracking:** Track payments and manage invoices.
- **Archive Management:** Archive paid and unpaid orders for reference.

## Technologies Used

- **Frontend:** Next.js
- **Backend:** Fastify
- **Database:** Prisma with PostgreSQL

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or later)
- pnpm (v6 or later)
- PostgreSQL

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Khalil-Bchir/Cash-Management-WebApp.git
   cd Cash-Management-WebApp
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up the database:**

   Ensure PostgreSQL is running and create a new database for the project. Update the `.env` file with your database connection details.

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   ```

4. **Run database migrations:**

   ```bash
   pnpm prisma migrate dev
   ```

### Running the Application

To start the application in development mode:

```bash
pnpm dev
```

### Usage

1. **Manage Orders:**

   Create, update, and delete laundry orders with customer details.

2. **Track Payments:**

   Monitor payments and manage invoices for each order.

3. **Archive Management:**

   Archive paid and unpaid orders for historical reference.

## Contributing

Contributions are welcome to enhance the Cash Management Web App! Feel free to submit ideas, suggestions, or bug reports through issues or pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please contact [Khalil Bchir](https://github.com/Khalil-Bchir).
