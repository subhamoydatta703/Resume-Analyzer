# Resume Analyzer 

An application to upload, parse, and analyze resumes.

---

##  Repository Structure

```
resume_analyzer/
├── backend/          # Express API server powered by Bun & TypeScript
│   ├── prisma/       # Prisma ORM schema and database migrations
│   ├── src/          # Application source code
│   │   ├── config/       # Configurations (DB, environment, etc.)
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Custom Express middlewares (Multer, Auth, etc.)
│   │   ├── routes/       # API route definitions
│   │   ├── services/     # Business logic & resume parsing services
│   │   ├── types/        # TypeScript type definitions
│   │   ├── app.ts        # Express application setup
│   │   └── server.ts     # Server entry point
│   ├── index.ts      # Main entry point
│   ├── package.json  # Bun dependencies and scripts
│   └── tsconfig.json # TypeScript configuration
└── frontend/         # Frontend web application (placeholder)
```

---

##  Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Backend Framework**: [Express](https://expressjs.com/) with TypeScript
- **Database ORM**: [Prisma](https://www.prisma.io/) (configured for PostgreSQL)
- **File Upload**: [Multer](https://github.com/expressjs/multer)

---

##  Getting Started

### Prerequisites

- **Bun** (v1.x or higher) installed on your local machine.
- **PostgreSQL** database instance.

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the `backend` directory and add your database connection string and server port:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   PORT=5000
   ```

4. **Run database migrations**:
   Apply the Prisma schema to your PostgreSQL database:
   ```bash
   bun prisma db push
   ```

5. **Start the application**:
   - Dev mode (running `index.ts`):
     ```bash
     bun run index.ts
     ```
   - Running the server:
     ```bash
     bun run src/server.ts
     ```

### Frontend Setup

The `frontend` directory is currently set up as a placeholder. In the next phase, a modern web UI (e.g., React/Vite or Next.js) will be built inside this directory to allow users to interact with the backend API.
