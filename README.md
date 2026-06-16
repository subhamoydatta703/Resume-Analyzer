# Resume Analyzer

An application to upload, parse, and analyze resumes. The project is split into a robust backend API and a modern, responsive frontend web application.

---

## System Architecture

```mermaid
graph TD
    %% Frontend Components
    subgraph Frontend [React Frontend]
        UI[Upload UI / Dashboard]
        API_Client[Axios API Client]
        UI -->|Upload Action| API_Client
    end

    %% Backend Components
    subgraph Backend [Express Backend Server]
        Multer[Multer Middleware]
        Router[Express Router]
        Upload_Ctrl[uploadResumeController]
        Analyze_Ctrl[analyzeResumeController]
        Get_Ctrl[getResumeResultController]
        PDF_Parser[PDF Parser Utils]
        Gemini[Gemini AI Service]
        
        Multer -->|Saves PDF to public/data/uploads| Upload_Ctrl
        Router -->|POST /api/resume/upload| Multer
        Router -->|POST /api/analyze/:id| Analyze_Ctrl
        Router -->|GET /api/analyze/:id/analyze| Get_Ctrl
    end

    %% Database & External Services
    subgraph Database_Layer [Data Layer]
        Prisma[Prisma Client]
        DB[(PostgreSQL Database)]
        Redis[(Redis Server)]
        Prisma -->|Queries/Updates| DB
    end

    subgraph External [External Services]
        GoogleGemini[Google Gemini API]
    end

    %% Connections
    API_Client -->|POST /api/resume/upload| Router
    API_Client -->|POST /api/analyze/:id| Router
    API_Client -->|GET /api/analyze/:id/analyze| Router

    Upload_Ctrl -->|1. Check Duplicate originalName <br> 2. Create PENDING Resume| Prisma
    Analyze_Ctrl -->|1. Get File Path <br> 2. Check Completed Cache| Prisma
    Analyze_Ctrl -->|3. Extract Text| PDF_Parser
    Analyze_Ctrl -->|4. Send Text| Gemini
    Gemini -->|5. Structure Analysis JSON| GoogleGemini
    Analyze_Ctrl -->|6. Save result & set COMPLETED| Prisma

    Get_Ctrl -->|Retrieve status & cached result| Prisma
```

---

## Repository Structure

```
resume_analyzer/
├── backend/          # Express API server powered by Bun & TypeScript
│   ├── prisma/       # Prisma ORM schema and database migrations
│   ├── public/       # Static public files
│   │   └── data/
│   │       └── uploads/ # Uploaded resumes (Git-ignored)
│   ├── src/          # Application source code
│   │   ├── config/       # Configurations (DB, database adapters, etc.)
│   │   ├── controllers/  # Request handlers (resume upload handlers)
│   │   ├── middleware/   # Custom Express middlewares (Multer setup)
│   │   ├── routes/       # API route definitions (upload routes)
│   │   ├── services/     # Business logic & database interaction services
│   │   ├── app.ts        # Express application setup and routing
│   │   └── server.ts     # Server entry point
│   ├── package.json  # Bun dependencies, Prisma scripts, and setup configurations
│   └── tsconfig.json # TypeScript configuration
└── frontend/         # React + TypeScript + Vite web application
    ├── src/
    │   ├── components/  # Reusable UI elements (ResumeUploader drag & drop)
    │   ├── pages/       # Page components (UploadPage layout & states)
    │   ├── services/    # Axios API client integrations (Axios configuration)
    │   ├── types/       # TypeScript definition files
    │   ├── App.tsx      # Main application router/view mount
    │   └── main.tsx     # Application mounting point
    ├── package.json     # Node script configuration
    └── tailwind.config.js # Tailwind CSS configuration
```

---

## Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh/)
- **Backend Framework**: [Express](https://expressjs.com/) with TypeScript
- **Database ORM**: [Prisma](https://www.prisma.io/) (configured for PostgreSQL with `@prisma/adapter-pg` pool)
- **File Upload**: [Multer](https://github.com/expressjs/multer)

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/) with TypeScript
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites

- **Bun** (v1.x or higher) installed on your local machine.
- **PostgreSQL** database instance.

### 1. Backend Setup

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
   bun run db:push
   ```

5. **Start the application**:
   - Running the development server (auto-reloading):
     ```bash
     bun run dev
     ```
   - Production execution:
     ```bash
     bun run start
     ```

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Configure environment variables (optional)**:
   Create a `.env` file in the `frontend` directory to target a custom API endpoint (defaults to `http://localhost:5000`):
   ```env
   VITE_API_URL="http://localhost:5000"
   ```

4. **Start the application**:
   - Start the local development server:
     ```bash
     bun run dev
     ```
   - Build for production:
     ```bash
     bun run build
     ```

---

## API Endpoints

### 1. Health Check
- **URL**: `GET /health`
- **Description**: Returns health parameters of the Express server and checking PostgreSQL database connection.

### 2. Upload Resume
- **URL**: `POST /api/resume/upload`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**: File field `resume` (accepts `.pdf` only)
- **Features**: Checks if the resume already exists in the database by `originalName`. If found, it returns the existing record directly (allowing immediate frontend rendering from the DB cache).
- **Response (Success - New Upload)**:
  ```json
  {
    "success": true,
    "message": "Resume uploaded successfully",
    "fileData": {
      "resume": {
        "id": "cuid-string",
        "fileName": "randomized-filename",
        "originalName": "original-filename.pdf",
        "filePath": "uploads/randomized-filename",
        "status": "PENDING",
        "analysisResult": null,
        "createdAt": "2026-06-16T07:08:31.671Z",
        "updatedAt": "2026-06-16T07:08:31.671Z"
      }
    }
  }
  ```
- **Response (Success - Existing/Cached Upload)**:
  ```json
  {
    "success": true,
    "message": "Resume uploaded successfully",
    "fileData": {
      "id": "cuid-string",
      "fileName": "randomized-filename",
      "originalName": "original-filename.pdf",
      "filePath": "uploads/randomized-filename",
      "status": "COMPLETED",
      "analysisResult": { ... },
      "createdAt": "2026-06-16T07:08:31.671Z",
      "updatedAt": "2026-06-16T07:08:45.540Z"
    }
  }
  ```

### 3. Analyze Resume
- **URL**: `POST /api/analyze/:id`
- **Description**: Triggers layout text extraction and calls Gemini AI to compile structured resume analysis results. If the resume is already analyzed, it returns the cached string.
- **Response (Success)**:
  ```json
  {
    "success": true,
    "message": "Resume uploaded successfully",
    "extractedData": "raw-gemini-json-string-block"
  }
  ```

### 4. Get Resume Analysis Result
- **URL**: `GET /api/analyze/:id/analyze`
- **Description**: Returns the status (`PENDING`, `COMPLETED`, `FAILED`) and cached `analysisResult` directly from the database. Used by the frontend for polling and reloading cached views.
- **Response (Success)**:
  ```json
  {
    "success": true,
    "message": "Resume analysis result retrieved successfully",
    "resumeRes": {
      "status": "COMPLETED",
      "analysisResult": {
        "candidateInfo": {
          "name": "Arpan Sarkar",
          "email": "contact.arpan.sarkar@gmail.com",
          "phone": "+91 86378 97186",
          "location": "Barasat, West Bengal, India"
        },
        "summary": "Full-Stack Developer focused on fast, scalable backend systems...",
        "skills": ["JavaScript", "TypeScript", "Node.js"],
        "strengths": ["Strong technical stack", "Quantifiable achievements"],
        "improvements": ["Clarify internship dates", "Expand on impact"],
        "overallScore": 88,
        "atsScore": 92,
        "formattingScore": 85,
        "suggestedRoles": ["Full Stack Developer", "Backend Engineer"]
      }
    }
  }
  ```
