# Resume Analyzer

An application to upload, parse, and analyze resumes. The project is split into a robust backend API and a modern, responsive frontend web application.

---

### System Architecture

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
        Redis[(Redis Cache)]
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
    
    %% Analysis flow
    Analyze_Ctrl -->|1. Check Completed Cache| Prisma
    Analyze_Ctrl -->|2. Extract Text| PDF_Parser
    Analyze_Ctrl -->|3. Send Text| Gemini
    Gemini -->|4. Structure Analysis JSON| GoogleGemini
    Analyze_Ctrl -->|5. Save result & set COMPLETED| Prisma

    %% Get analysis result caching flow
    Get_Ctrl -->|1. Check Cache| Redis
    Redis -- Cache Hit -->|Return Cached Data| Get_Ctrl
    Redis -- Cache Miss -->|2. Fetch Resume| Prisma
    Prisma -->|3. Save to Redis Cache (300s)| Redis
```

---

## Repository Structure

```
resume_analyzer/
├── backend/          # Express API server powered by Bun & TypeScript
│   ├── prisma/       # Prisma ORM schema, migrations, and configs
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── public/       # Static public files
│   │   └── data/
│   │       └── uploads/ # Uploaded resumes (Git-ignored)
│   ├── src/          # Application source code
│   │   ├── config/       # Configurations (DB connection, Redis client setup)
│   │   │   ├── db.ts
│   │   │   └── redis.ts
│   │   ├── controllers/  # Request handlers
│   │   │   ├── analyzeResumeController.ts
│   │   │   ├── getResumeResultController.ts
│   │   │   └── uploadResumeController.ts
│   │   ├── middleware/   # Custom Express middlewares (Multer setup)
│   │   │   └── multerMiddleware.ts
│   │   ├── routes/       # API route definitions
│   │   │   ├── multerRoutes.ts
│   │   │   └── resumeAnalysysRoutes.ts
│   │   ├── services/     # Business logic & database services
│   │   │   ├── geminiService.ts
│   │   │   ├── getResumeService.ts
│   │   │   ├── resumeanalysisServis.ts
│   │   │   └── uploadResumeServive.ts
│   │   ├── utils/        # Utility helpers (PDF parser setup)
│   │   │   └── pdfParser.ts
│   │   ├── app.ts        # Express application setup, middlewares, and routing
│   │   └── server.ts     # Server entry point, database, and Redis connection setup
│   ├── package.json  # Bun dependencies, Prisma scripts, and configurations
│   └── tsconfig.json # TypeScript configuration
└── frontend/         # React + TypeScript + Vite web application
    ├── src/
    │   ├── assets/      # Graphical assets and logos
    │   ├── components/  # Reusable UI components
    │   │   ├── AnalysisDashboard.tsx  # Interactive scoring & structured analysis view
    │   │   ├── PendingScanner.tsx     # Progress indicator showing parser stages
    │   │   └── ResumeUploader.tsx     # Drag & drop upload area with progress bar
    │   ├── pages/       # Page components
    │   │   └── UploadPage.tsx         # Main entry point for theme handling & upload flow
    │   ├── services/    # API integration services
    │   │   └── api.ts                 # Axios HTTP client, API mappings, and legacy parser fallbacks
    │   ├── types/       # TypeScript definition files
    │   │   └── index.ts               # Shared types, state models, and API responses
    │   ├── App.css      # CSS baseline styles
    │   ├── App.tsx      # Main application router/view mount
    │   ├── index.css    # Tailwind CSS layout utility directives
    │   └── main.tsx     # Web entry point and React root mounting
    ├── package.json     # Node scripts & React dependencies
    └── tailwind.config.js # Tailwind CSS configuration
```

---

## Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh/)
- **Backend Framework**: [Express](https://expressjs.com/) with TypeScript
- **Database ORM**: [Prisma](https://www.prisma.io/) (configured for PostgreSQL with `@prisma/adapter-pg` pool)
- **File Upload**: [Multer](https://github.com/expressjs/multer)
- **In-Memory Cache**: [Redis](https://redis.io/) (with caching for resume results lookup)
- **AI Integration**: Google GenAI SDK (`@google/genai`)

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
- **Redis** server running locally (default port `6379`).

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
- **Method**: `GET`
- **Description**: Inspects system health parameters, specifically verifying the Express server status and database connectivity. It returns a status message indicating overall system health and database adapter connection details.

### 2. Upload Resume
- **URL**: `POST /api/resume/upload`
- **Method**: `POST`
- **Content Type**: `multipart/form-data`
- **Payload**: Includes a PDF document attached via the `resume` form parameter.
- **Workflow**:
  - The server checks if a resume with the same original filename already exists in the database.
  - If a match is found, the server fetches and returns the existing database record directly, leveraging cache storage.
  - If the resume is new, it generates a unique database ID, saves the PDF file under a randomized identifier, initializes its status as pending, and returns the newly registered resume record.

### 3. Analyze Resume
- **URL**: `POST /api/analyze/:id`
- **Method**: `POST`
- **Parameters**: Requires the unique `id` of the resume in the URL path.
- **Workflow**:
  - The server reads the PDF file corresponding to the given ID and extracts its text.
  - The text is sent to the Gemini AI service to generate structured analytics.
  - The resulting analysis is parsed, saved to the database, the record's status is updated to completed, and the structured response data is returned to the client.
  - If the resume is already analyzed, the server skips the parser and LLM call and returns the cached analysis string directly.

### 4. Get Resume Analysis Result
- **URL**: `GET /api/analyze/:id/analyze`
- **Method**: `GET`
- **Parameters**: Requires the unique `id` of the resume in the URL path.
- **Workflow**:
  - Queries the database to retrieve the current status (`PENDING`, `COMPLETED`, or `FAILED`) and `analysisResult` for the requested resume ID.
  - Used by the frontend page to support progress polling, failure handling, and loading pre-analyzed details without re-triggering expensive AI generations.
