# 🎤 Screenly - AI Interview Voice Agent

<div align="center">

### 🚀 **[Live Demo: screenly-three.vercel.app](https://screenly-three.vercel.app/)**

[![Live Demo](https://img.shields.io/badge/🔴_LIVE_DEMO-Visit_Now-FF6B6B?style=for-the-badge)](https://screenly-three.vercel.app/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://screenly-three.vercel.app/)

</div>

---

> **Screenly** is an intelligent, real-time voice-powered interview platform designed for **recruiters** to streamline their hiring process. Recruiters create AI-powered interviews, share them with candidates via a unique link, and receive comprehensive AI-generated feedback after each interview - all without manual effort.

---

## 🎯 How It Works

| Step | For Recruiters | For Candidates |
|------|----------------|----------------|
| **1** | 🔐 Sign in with Google | 📧 Receive interview link from recruiter |
| **2** | 📝 Create interview (job title, description, question types) | 🎤 Complete voice interview with AI agent |
| **3** | 🔗 Share unique interview link with candidates | ✅ Get instant performance feedback |
| **4** | 📊 View detailed AI feedback & hiring recommendations | 📈 See strengths and improvement areas |

---

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![OpenRouter](https://img.shields.io/badge/OpenRouter-Gemini_AI-412991?style=for-the-badge&logo=google)
![VAPI](https://img.shields.io/badge/VAPI-Voice_AI-FF6B6B?style=for-the-badge)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Application Flow](#-application-flow)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Usage Guide](#-usage-guide)
- [Component Overview](#-component-overview)
- [Advanced Features](#-advanced-features)
- [Known Issues & Solutions](#-known-issues--solutions)
- [Future Enhancements](#-future-enhancements)

---

## 🚀 Overview

**Screenly** is a cutting-edge AI-powered recruitment platform that revolutionizes the hiring process by automating interviews with real-time voice interactions. 

### 👔 For Recruiters
- **Create interviews in minutes** - Define job role, description, and question types
- **AI generates relevant questions** - No manual question creation needed
- **Share unique links** - Send interview links to candidates via email
- **Receive detailed feedback** - AI analyzes each interview and provides hiring recommendations
- **Track all candidates** - View responses, ratings, and make informed decisions

### 🎓 For Candidates
- **No app downloads** - Interview directly in the browser
- **Natural conversation** - Talk with an AI interviewer just like a real interview
- **Instant feedback** - See your performance immediately after completing
- **Fair evaluation** - AI provides unbiased, consistent assessments

### What Makes This Special?

- ✨ **Real-Time Voice Interviews**: Natural conversation flow using VAPI AI SDK
- 🤖 **AI-Generated Questions**: Dynamic question generation based on job role and description
- 📊 **Automated Feedback**: Comprehensive candidate evaluation with ratings and recommendations
- 🎯 **Multi-Type Interviews**: Supports Technical, Behavioral, Experience, Problem Solving, and Leadership assessments
- 🔐 **Secure Authentication**: Google OAuth with Supabase Auth integration
- 📱 **Responsive UI**: Modern, gradient-rich interface with shadcn/ui components

---

## ✨ Key Features

### 1. **Interview Creation & Management**
- Create custom interviews with job position, description, duration, and types
- AI-powered question generation tailored to specific roles
- View and manage all scheduled interviews in a centralized dashboard

### 2. **Real-Time Voice Conversations**
- Seamless integration with VAPI AI for natural voice interactions
- Real-time transcription of interview conversations
- Background noise suppression and echo cancellation

### 3. **Intelligent Feedback System**
- AI-driven analysis of interview transcripts
- Multi-dimensional ratings (Technical Skills, Communication, Problem Solving, Experience)
- Detailed summaries and hiring recommendations
- Persistent storage of feedback in Supabase

### 4. **Candidate Tracking**
- View all candidates who completed interviews
- Color-coded feedback indicators (Green: Recommended, Red: Not Recommended)
- Beautiful dialog modals for detailed feedback reports
- Export candidate data and reports

### 5. **Dashboard Analytics**
- Overview of all interviews and candidates
- Quick access to create new interviews
- Track interview completion rates
- View latest interview results

---

## 🛠 Technology Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router and Server Components
- **React 19.1.0** - UI library with Hooks and Context API
- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives (Dialog, Select, Progress, etc.)
- **shadcn/ui** - Beautiful pre-built components
- **Lucide React** - Modern icon library
- **Sonner** - Toast notifications
- **Motion** - Animation library

### Backend & Services
- **Supabase** - PostgreSQL database with Row Level Security and Authentication
- **VAPI AI SDK (@vapi-ai/web)** - Real-time voice conversation API
- **OpenAI GPT-4** - AI model for question generation and feedback analysis
- **OpenRouter** - LLM API gateway for model access

### Additional Libraries
- **Axios** - HTTP client for API requests
- **Moment.js** - Date and time formatting
- **UUID** - Unique identifier generation
- **clsx & tailwind-merge** - Class name utilities

---

## 🏗 Project Architecture

```
ai-interview-voice-agent/
│
├── app/                              # Next.js App Router
│   ├── (main)/                       # Main application layout
│   │   ├── layout.js                 # Main layout with Sidebar
│   │   ├── dashboard/                # Dashboard page
│   │   │   ├── page.jsx              # Dashboard home
│   │   │   ├── create-interview/     # Interview creation flow
│   │   │   │   ├── page.jsx          # Create interview page
│   │   │   │   └── _components/
│   │   │   │       ├── FormContainer.jsx        # Interview form
│   │   │   │       ├── QuestionList.jsx         # Display generated questions
│   │   │   │       ├── QuestionListContainer.jsx # Questions wrapper
│   │   │   │       └── InterviewLink.jsx        # Interview sharing link
│   │   │   └── _components/
│   │   │       ├── WelcomeContainer.jsx         # Dashboard header
│   │   │       ├── CreateOptions.jsx            # Quick create buttons
│   │   │       ├── InterviewCard.jsx            # Interview card component
│   │   │       └── LatestInterviewsList.jsx     # Recent interviews list
│   │   │
│   │   ├── schedule-interview/       # Schedule & view interviews
│   │   │   ├── page.jsx              # All scheduled interviews
│   │   │   └── [interview-id]/
│   │   │       └── details/
│   │   │           ├── page.jsx      # Interview details page
│   │   │           └── _components/
│   │   │               ├── InterviewDetail.jsx          # Interview info
│   │   │               ├── QuestionsList.jsx            # Interview questions
│   │   │               ├── CandidateList.jsx            # Candidates table
│   │   │               └── CandidateFeedbackDialog.jsx  # Feedback modal
│   │   │
│   │   ├── all-interview/            # View all interviews
│   │   │   └── page.jsx
│   │   │
│   │   └── _component/
│   │       └── AppSidebar.jsx        # Application sidebar navigation
│   │
│   ├── interview/                    # Interview execution flow
│   │   ├── layout.jsx                # Interview layout
│   │   ├── [interview_id]/
│   │   │   ├── page.jsx              # Interview landing page
│   │   │   ├── start/
│   │   │   │   ├── page.jsx          # Live interview page (VAPI integration)
│   │   │   │   └── _components/
│   │   │   │       └── AlertConformation.jsx # Start interview dialog
│   │   │   └── completed/
│   │   │       └── page.jsx          # Interview completion page
│   │   └── _components/
│   │       └── InterviewHeader.jsx   # Interview page header
│   │
│   ├── api/                          # API Routes (Server-side)
│   │   ├── ai-model/
│   │   │   └── route.jsx             # POST - Generate interview questions
│   │   └── ai-feedback/
│   │       └── route.jsx             # POST - Generate candidate feedback
│   │
│   ├── auth/
│   │   └── page.jsx                  # Authentication page
│   │
│   ├── layout.js                     # Root layout
│   ├── page.js                       # Landing/home page
│   ├── globals.css                   # Global styles
│   └── provider.jsx                  # App-level providers
│
├── components/
│   └── ui/                           # shadcn/ui components
│       ├── dialog.jsx                # Dialog modal component
│       ├── button.jsx                # Button component
│       ├── input.jsx                 # Input field
│       ├── textarea.jsx              # Textarea field
│       ├── select.jsx                # Select dropdown
│       ├── progress.jsx              # Progress bar
│       ├── alert.jsx                 # Alert component
│       ├── alert-dialog.jsx          # Alert dialog
│       ├── sidebar.jsx               # Sidebar component
│       ├── skeleton.jsx              # Loading skeleton
│       ├── sonner.jsx                # Toast notifications
│       ├── separator.jsx             # Divider line
│       ├── sheet.jsx                 # Sheet modal
│       └── tooltip.jsx               # Tooltip component
│
├── context/
│   ├── InterviewDataContext.jsx      # Global interview state management
│   └── UserDetailContext.jsx         # User authentication context
│
├── services/
│   ├── supabaseClient.js             # Supabase client initialization
│   └── Constants.jsx                 # App constants, prompts, and configs
│
├── hooks/
│   ├── use-mobile.js                 # Mobile device detection hook
│   └── useFormValidation.js          # Form validation hook
│
├── lib/
│   └── utils.js                      # Utility functions (cn, etc.)
│
├── public/                           # Static assets
│
├── package.json                      # Dependencies and scripts
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.js                # TailwindCSS configuration
├── postcss.config.mjs                # PostCSS configuration
├── eslint.config.mjs                 # ESLint configuration
├── jsconfig.json                     # JavaScript configuration
└── components.json                   # shadcn/ui configuration
```

---

## 💾 Database Schema

The application uses **Supabase (PostgreSQL)** with the following schema:

### **1. `interview` Table**

Stores interview configurations and questions.

| Column | Type | Description |
|--------|------|-------------|
| `interview_id` | `UUID` (PK) | Unique interview identifier |
| `created_at` | `TIMESTAMP` | Interview creation timestamp |
| `user_email` | `TEXT` | Email of interview creator |
| `job_position` | `TEXT` | Job title/position |
| `job_description` | `TEXT` | Detailed job description |
| `interview_duration` | `TEXT` | Duration (15/30/45/60 minutes) |
| `interview_types` | `TEXT[]` | Array of interview types |
| `interview_questions` | `JSONB` | Generated questions array |

**Example `interview_questions` structure:**
```json
[
  {
    "question": "Explain the difference between React hooks and class components",
    "InterviewType": "Technical"
  },
  {
    "question": "Describe a challenging project you worked on",
    "InterviewType": "Behavioral"
  }
]
```

### **2. `interview-feedback` Table** (Note: Table name uses hyphen)

Stores candidate feedback and evaluation results.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `SERIAL` (PK) | Auto-increment ID |
| `interview_id` | `UUID` (FK) | Foreign key to `interview` table |
| `userName` | `TEXT` | Candidate's name |
| `email` | `TEXT` | Candidate's email |
| `feedback` | `JSONB` | AI-generated feedback object |
| `created_at` | `TIMESTAMP` | Feedback creation timestamp |

**Foreign Key Relationship:**
```sql
interview-feedback.interview_id → interview.interview_id
```

**Example `feedback` structure:**
```json
{
  "feedback": {
    "rating": {
      "techicalSkills": 8,
      "communication": 7,
      "problemSolving": 9,
      "experince": 6
    },
    "summery": "Candidate demonstrated strong technical knowledge with excellent problem-solving skills. Communication was clear and concise. Shows good potential for the role.",
    "Recommendation": "Yes",
    "RecommendationMsg": "Highly recommended for the next round"
  }
}
```

### **Database Relationships**

```
interview (1) ──────► (N) interview-feedback
    │
    └─ interview_id ──► interview_id (FK)
```

### **Row Level Security (RLS)**

- User authentication required for all database operations
- Users can only access their own interviews and feedback
- Service role key bypass for server-side operations

---

## 🔌 API Endpoints

### **1. Generate Interview Questions**

**Endpoint:** `POST /api/ai-model`

**Description:** Generates AI-powered interview questions based on job details.

**Request Body:**
```json
{
  "jobPosition": "Full Stack Developer",
  "jobDescription": "Responsible for developing scalable web applications using React and Node.js. Must have experience with databases and RESTful APIs.",
  "interviewDuration": "30",
  "interviewTypes": ["Technical", "Problem Solving"]
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "questions": "[{\"question\":\"Explain the virtual DOM in React\",\"InterviewType\":\"Technical\"},{\"question\":\"How would you optimize a slow database query?\",\"InterviewType\":\"Problem Solving\"}]"
}
```

**Response (Error - 400):**
```json
{
  "error": "Missing required fields",
  "details": "All fields (jobPosition, jobDescription, interviewDuration, interviewTypes) are required"
}
```

**Implementation Details:**
- Uses **OpenRouter API** with `meituan/longcat-flash-chat:free` model
- Implements a structured prompt template from `Constants.jsx`
- Adjusts question complexity based on interview duration
- Returns JSON-formatted array of questions
- Error handling for missing API keys and invalid inputs

**Prompt Template:**
```javascript
const QUESTIONS_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate interview questions:
Job Title: {{jobPosition}}
Job Description: {{jobDescription}}
Interview Duration: {{interviewDuration}}
Interview Type: {{interviewTypes}}

Generate questions dependent on interview duration.
Format: interviewQuestions=[{question:"", InterviewType:""}]`
```

---

### **2. Generate Candidate Feedback**

**Endpoint:** `POST /api/ai-feedback`

**Description:** Analyzes interview conversation transcript and generates comprehensive candidate evaluation.

**Request Body:**
```json
{
  "conversation": [
    {
      "role": "assistant",
      "message": "Hi! Let's start with a question. Can you explain REST API?"
    },
    {
      "role": "user",
      "message": "REST API is an architectural style for building web services..."
    }
  ]
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "content": "{\"feedback\":{\"rating\":{\"techicalSkills\":8,\"communication\":7,\"problemSolving\":9,\"experince\":6},\"summery\":\"Strong technical understanding with excellent problem-solving abilities.\",\"Recommendation\":\"Yes\",\"RecommendationMsg\":\"Recommended for hire\"}}",
  "feedback": "{...}"
}
```

**Response (Error - 400):**
```json
{
  "error": "Conversation data is required",
  "success": false
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to generate feedback",
  "success": false,
  "details": "API configuration error"
}
```

**Implementation Details:**
- Uses **OpenAI GPT-4o-mini** model via OpenRouter
- Evaluates 4 key dimensions: Technical Skills, Communication, Problem Solving, Experience
- Provides ratings (1-10 scale), summary (3 lines), and hiring recommendation
- Cleans up response by removing markdown code blocks and special characters
- Comprehensive error logging for debugging

**Prompt Template:**
```javascript
const FEEDBACK_PROMPT = `{{conversation}}
Based on this interview conversation, provide feedback:
- Rating out of 10 for: Technical Skills, Communication, Problem Solving, Experience
- 3-line summary
- Hiring recommendation with message

Format: {feedback:{rating:{...}, summery:"", Recommendation:"", RecommendationMsg:""}}`
```

**Rating Scale:**
- **8-10**: Excellent - Strong performance
- **6-7**: Good - Meets expectations
- **4-5**: Average - Needs improvement
- **1-3**: Poor - Does not meet requirements

---

## 🔄 Application Flow

### **1. Interview Creation Flow**

```
User Login (Supabase Auth)
        ↓
Dashboard → Click "Create Interview"
        ↓
Fill Form (FormContainer.jsx)
├── Job Position (e.g., "Senior React Developer")
├── Job Description (detailed role requirements)
├── Interview Duration (15/30/45/60 minutes)
└── Interview Types (Technical, Behavioral, etc.)
        ↓
Submit Form → POST /api/ai-model
        ↓
AI Generates Questions (GPT-4)
        ↓
Display Questions (QuestionList.jsx)
        ↓
Save to Supabase (`interview` table)
        ↓
Generate Interview Link (InterviewLink.jsx)
        ↓
Share Link with Candidate
```

**Key Components:**
- **FormContainer.jsx**: Multi-step form with validation
- **QuestionListContainer.jsx**: Manages AI generation state
- **InterviewLink.jsx**: Provides shareable interview URL

---

### **2. Candidate Interview Flow**

```
Candidate Receives Interview Link
        ↓
Visit: /interview/[interview_id]
        ↓
View Interview Details (page.jsx)
├── Job Position
├── Interview Duration
├── Interview Types
└── Instructions
        ↓
Click "Start Interview" → Navigate to /interview/[interview_id]/start
        ↓
Alert Confirmation Dialog (AlertConformation.jsx)
├── Request Microphone Permission
├── Display Interview Rules
└── "Begin Interview" Button
        ↓
Initialize VAPI Client (start/page.jsx)
├── Create VAPI Instance (Singleton Pattern)
├── Configure Assistant with Questions
├── Set up Event Listeners (speech-start, call-end, etc.)
└── Debounced Start (800ms delay to prevent duplicates)
        ↓
LIVE VOICE CONVERSATION
├── VAPI Handles Speech-to-Text
├── AI Assistant Asks Questions
├── Candidate Responds via Microphone
├── Real-time Transcription
└── Conversation Stored in State
        ↓
Interview Ends (call-end event or manual stop)
        ↓
Extract Conversation Transcript
        ↓
POST /api/ai-feedback (with transcript)
        ↓
AI Generates Feedback (GPT-4)
        ↓
Save to Supabase (`interview-feedback` table)
├── Dual-Flag Protection (prevent duplicates)
├── Link to interview_id (Foreign Key)
└── Store userName, email, feedback JSON
        ↓
Navigate to /interview/[interview_id]/completed
        ↓
Display Completion Message
```

**Critical Technical Details:**

**VAPI Singleton Pattern** (Prevents Duplicate Instances):
```javascript
function getGlobal() {
  if (typeof window === 'undefined') return null;
  if (!window.__VAPI_GLOBAL__) {
    window.__VAPI_GLOBAL__ = {
      vapi: null,
      started: new Set(),
      starting: new Set()
    };
  }
  return window.__VAPI_GLOBAL__;
}
```

**Debounced Start with Global Guards**:
```javascript
const startInterview = () => {
  const global = getGlobal();
  if (global.starting.has(interviewId) || global.started.has(interviewId)) {
    console.log('Interview already starting/started');
    return;
  }
  
  global.starting.add(interviewId);
  
  setTimeout(() => {
    if (!global.started.has(interviewId)) {
      global.vapi.start(assistant);
      global.started.add(interviewId);
    }
    global.starting.delete(interviewId);
  }, 800);
};
```

**Dual-Flag Feedback Protection**:
```javascript
const feedbackGeneratedRef = useRef(false);
const feedbackInProgressRef = useRef(false);

const generateFeedback = async (conversation) => {
  if (feedbackGeneratedRef.current || feedbackInProgressRef.current) {
    console.log('Feedback already generated/in progress');
    return;
  }
  
  feedbackInProgressRef.current = true;
  
  try {
    // Generate and save feedback...
    feedbackGeneratedRef.current = true;
    router.push(`/interview/${interviewId}/completed`);
  } finally {
    feedbackInProgressRef.current = false;
  }
};
```

---

### **3. Recruiter Review Flow**

```
Recruiter Dashboard
        ↓
Navigate to "Schedule Interview"
        ↓
View All Scheduled Interviews
        ↓
Click Interview Card → /schedule-interview/[interview-id]/details
        ↓
Interview Details Page (InterviewDetail.jsx)
├── Interview Information (Job, Duration, Types)
├── Questions List (QuestionsList.jsx)
└── Candidates List (CandidateList.jsx)
        ↓
Candidate Table Display
├── Fetch from `interview-feedback` table
├── Show: Name, Email, Feedback Status, Rating
└── Color-Coded Indicators (Green/Red)
        ↓
Click "View Report" on Candidate Row
        ↓
Open Feedback Dialog (CandidateFeedbackDialog.jsx)
├── Candidate Name & Email
├── Rating Progress Bars (4 dimensions)
├── Interview Summary (3 lines)
└── Hiring Recommendation (Yes/No with message)
        ↓
Review Feedback & Make Decision
        ↓
Export/Download Candidate Report (Future Feature)
```

**Candidate List Component Features:**
- Real-time data fetching from Supabase
- Nested feedback structure parsing (`feedback.feedback.rating`)
- Average rating calculation across all dimensions
- Beautiful gradient UI with responsive design
- Dialog modal integration for detailed reports

---

## ⚙ Setup & Installation

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Supabase Account** (for database and authentication)
- **VAPI Account** (for voice AI capabilities)
- **OpenRouter API Key** (for AI model access)

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/ai-interview-voice-agent.git
cd ai-interview-voice-agent
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Set Up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Create the database tables:

```sql
-- Create interview table
CREATE TABLE interview (
  interview_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_email TEXT NOT NULL,
  job_position TEXT NOT NULL,
  job_description TEXT NOT NULL,
  interview_duration TEXT NOT NULL,
  interview_types TEXT[] NOT NULL,
  interview_questions JSONB NOT NULL
);

-- Create interview-feedback table (note the hyphen)
CREATE TABLE "interview-feedback" (
  id SERIAL PRIMARY KEY,
  interview_id UUID NOT NULL REFERENCES interview(interview_id) ON DELETE CASCADE,
  userName TEXT NOT NULL,
  email TEXT NOT NULL,
  feedback JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE interview ENABLE ROW LEVEL SECURITY;
ALTER TABLE "interview-feedback" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your auth requirements)
CREATE POLICY "Users can view their own interviews"
  ON interview FOR SELECT
  USING (auth.uid()::text = user_email);

CREATE POLICY "Users can insert their own interviews"
  ON interview FOR INSERT
  WITH CHECK (auth.uid()::text = user_email);

CREATE POLICY "Users can view feedback for their interviews"
  ON "interview-feedback" FOR SELECT
  USING (
    interview_id IN (
      SELECT interview_id FROM interview WHERE user_email = auth.uid()::text
    )
  );

CREATE POLICY "Anyone can insert feedback"
  ON "interview-feedback" FOR INSERT
  WITH CHECK (true);
```

4. **Configure Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# VAPI Configuration
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-public-key

# OpenRouter API Configuration
OPENROUTER_API_KEY=your-openrouter-api-key
```

5. **Run Development Server**
```bash
npm run dev
# or
yarn dev
```

6. **Open Browser**
Navigate to `http://localhost:3000`

---

## 🔑 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_VAPI_PUBLIC_KEY` | VAPI public API key | ✅ | `pk_live_abc123...` |
| `OPENROUTER_API_KEY` | OpenRouter API key (server-side) | ✅ | `sk-or-v1-abc123...` |

### How to Obtain Keys

**Supabase:**
1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy `URL` and `anon public` key

**VAPI:**
1. Sign up at [vapi.ai](https://vapi.ai)
2. Go to Dashboard → API Keys
3. Create new public key

**OpenRouter:**
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Go to API Keys
3. Create new key with credits

---

## 📱 Usage Guide

### For Recruiters

1. **Create an Account**
   - Navigate to `/auth`
   - Sign up with email/password or OAuth

2. **Create an Interview**
   - Go to Dashboard → "Create Interview"
   - Fill in job details, duration, and interview types
   - AI generates questions automatically
   - Copy and share the interview link with candidates

3. **Review Candidates**
   - Go to "Schedule Interview" → Select interview
   - View all candidates who completed the interview
   - Click "View Report" to see detailed feedback
   - Make hiring decisions based on AI recommendations

### For Candidates

1. **Receive Interview Link**
   - Recruiter shares link: `https://your-app.com/interview/[interview_id]`

2. **Start Interview**
   - Review interview details and instructions
   - Click "Start Interview"
   - Allow microphone access when prompted
   - Click "Begin Interview" in confirmation dialog

3. **Complete Interview**
   - Answer questions naturally via voice
   - AI assistant will guide you through each question
   - Interview automatically ends after duration or when all questions are answered

4. **View Completion**
   - See completion message
   - Wait for recruiter to review your feedback

---

## 🧩 Component Overview

### Core Pages

**`app/(main)/dashboard/page.jsx`**
- Main dashboard landing page
- Displays welcome message, quick actions, and latest interviews
- Uses `WelcomeContainer`, `CreateOptions`, `LatestInterviewsList`

**`app/(main)/dashboard/create-interview/page.jsx`**
- Multi-step interview creation wizard
- Form → AI Question Generation → Interview Link
- Uses `FormContainer`, `QuestionListContainer`, `InterviewLink`

**`app/(main)/schedule-interview/[interview-id]/details/page.jsx`**
- Detailed view of a single interview
- Shows interview info, questions, and candidates
- Uses `InterviewDetail`, `QuestionsList`, `CandidateList`

**`app/interview/[interview_id]/start/page.jsx`**
- Live interview execution page
- VAPI integration for real-time voice
- Feedback generation and storage
- Critical singleton pattern and debouncing logic

**`app/interview/[interview_id]/completed/page.jsx`**
- Interview completion confirmation page

### Key Components

**`FormContainer.jsx`**
- Interview creation form with validation
- Multi-select interview types
- Real-time form state management

**`CandidateList.jsx`**
- Displays all candidates for an interview
- Fetches feedback from Supabase
- Opens feedback dialog on row click
- Color-coded recommendation indicators

**`CandidateFeedbackDialog.jsx`**
- Beautiful modal for candidate feedback
- Progress bars for ratings
- Summary and recommendation display
- Gradient background with smooth animations

**`AppSidebar.jsx`**
- Application navigation sidebar
- Dashboard, Schedule Interview, All Interview, Billing, Settings
- Responsive mobile drawer

**`AlertConformation.jsx`**
- Confirmation dialog before starting interview
- Requests microphone permissions
- Displays interview rules and guidelines

### UI Components (shadcn/ui)

All UI components are located in `components/ui/` and follow the shadcn/ui pattern:

- `dialog.jsx` - Modal dialogs with Radix UI
- `button.jsx` - Button variants (default, destructive, outline, etc.)
- `input.jsx` - Text input fields
- `textarea.jsx` - Multi-line text areas
- `select.jsx` - Dropdown selects
- `progress.jsx` - Progress bars
- `alert.jsx` - Alert notifications
- `sidebar.jsx` - Sidebar navigation
- `skeleton.jsx` - Loading skeletons

---

## 🚀 Advanced Features

### 1. **VAPI Singleton Pattern**

**Problem:** React's StrictMode causes components to mount twice in development, creating duplicate VAPI instances.

**Solution:** Global singleton stored on `window` object.

```javascript
function getGlobal() {
  if (typeof window === 'undefined') return null;
  if (!window.__VAPI_GLOBAL__) {
    window.__VAPI_GLOBAL__ = {
      vapi: null,           // Single VAPI instance
      started: new Set(),   // Track started interviews
      starting: new Set()   // Track starting interviews
    };
  }
  return window.__VAPI_GLOBAL__;
}
```

### 2. **Debounced Interview Start**

**Problem:** Multiple rapid calls to `vapi.start()` cause "Meeting ended due to ejection" errors.

**Solution:** 800ms debounce with global state guards.

```javascript
const startInterview = () => {
  const global = getGlobal();
  if (global.starting.has(interviewId) || global.started.has(interviewId)) {
    return; // Already starting or started
  }
  
  global.starting.add(interviewId);
  
  setTimeout(() => {
    if (!global.started.has(interviewId)) {
      global.vapi.start(assistant);
      global.started.add(interviewId);
    }
    global.starting.delete(interviewId);
  }, 800);
};
```

### 3. **Dual-Flag Feedback Protection**

**Problem:** Multiple events (call-end, unmount, manual stop) trigger duplicate feedback generation.

**Solution:** Two-layer flag system with refs.

```javascript
const feedbackGeneratedRef = useRef(false);       // Tracks if feedback exists
const feedbackInProgressRef = useRef(false);       // Tracks if generation is happening

const generateFeedback = async (conversation) => {
  if (feedbackGeneratedRef.current || feedbackInProgressRef.current) {
    console.log('Feedback generation blocked');
    return;
  }
  
  feedbackInProgressRef.current = true;
  
  try {
    // API call, database save...
    feedbackGeneratedRef.current = true;
  } catch (error) {
    console.error('Feedback error:', error);
  } finally {
    feedbackInProgressRef.current = false;
  }
};
```

### 4. **Nested Feedback Structure Parsing**

**Problem:** Feedback is stored as `feedback.feedback.rating` (nested structure).

**Solution:** Safe nested access with error handling.

```javascript
const getRating = (feedback) => {
  try {
    if (!feedback) return null;
    
    const parsedFeedback = typeof feedback === 'string' 
      ? JSON.parse(feedback) 
      : feedback;
    
    // Access nested structure: feedback.feedback.rating
    const rating = parsedFeedback?.feedback?.rating;
    
    if (!rating) return null;
    
    // Calculate average
    const { techicalSkills, communication, problemSolving, experince } = rating;
    return (techicalSkills + communication + problemSolving + experince) / 4;
  } catch (error) {
    console.error('Rating parse error:', error);
    return null;
  }
};
```

### 5. **Supabase RLS Integration**

**Row Level Security** ensures users can only access their own data.

```javascript
// Client-side query with RLS
const { data, error } = await supabase
  .from('interview-feedback')
  .select('*')
  .eq('interview_id', interviewId);

// RLS policy automatically filters based on authenticated user
```

### 6. **Dynamic Question Generation**

Questions adapt to:
- **Job Position**: Role-specific technical questions
- **Interview Duration**: More questions for longer interviews
- **Interview Types**: Mix of Technical, Behavioral, etc.

```javascript
const FINAL_PROMPT = QUESTIONS_PROMPT
  .replace('{{jobPosition}}', jobPosition)
  .replace('{{jobDescription}}', jobDescription)
  .replace('{{interviewDuration}}', interviewDuration)
  .replace('{{interviewTypes}}', interviewTypes.join(', '));
```

---

## ⚠ Known Issues & Solutions

### Issue 1: Interview Not Starting Automatically

**Symptom:** Interview only starts after code change triggers Hot Module Replacement (HMR).

**Cause:** React StrictMode double-mounting creates duplicate VAPI instances.

**Solution:** Implemented window-level singleton pattern with 800ms debounce and global state guards.

---

### Issue 2: Feedback Not Saving to Database

**Symptom:** AI generates feedback successfully but Supabase insert fails silently.

**Causes:**
- Row Level Security (RLS) policies blocking client-side inserts
- Missing authentication context
- Incorrect table name (`interview-feedback` requires backticks in some queries)

**Solutions:**
- Comprehensive error logging with auth state checks
- Added RLS policy: `CREATE POLICY "Anyone can insert feedback" ON "interview-feedback" FOR INSERT WITH CHECK (true);`
- Proper error handling and user feedback via toast notifications

```javascript
// Comprehensive logging
console.log('Auth state:', (await supabase.auth.getUser()).data.user);
console.log('Insert payload:', { userName, email, interview_id, feedback });

const { data, error } = await supabase
  .from('interview-feedback')
  .insert([{ userName, email, interview_id: interviewId, feedback: jsonFeedback }])
  .select();

if (error) {
  console.error('Supabase error:', error);
  toast.error('Failed to save feedback. Check RLS policies.');
}
```

---

### Issue 3: Duplicate Feedback Entries

**Symptom:** Multiple feedback entries for same interview in database.

**Cause:** Multiple event triggers (call-end, manual stop, unmount) all call feedback generation.

**Solution:** Dual-flag protection system with `feedbackGeneratedRef` and `feedbackInProgressRef`.

---

### Issue 4: Dialog Accessibility Error

**Symptom:** Console error: "Missing `DialogTitle` required for accessibility."

**Cause:** Radix UI Dialog requires a title for screen readers, even if visually hidden.

**Solution:** Added `VisuallyHidden` wrapper around `DialogTitle`.

```javascript
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

<Dialog>
  <DialogContent>
    <VisuallyHidden>
      <DialogTitle>Candidate Feedback Report</DialogTitle>
    </VisuallyHidden>
    {/* Visible content */}
  </DialogContent>
</Dialog>
```

---

### Issue 5: VAPI "Meeting Ended Due to Ejection"

**Symptom:** Interview ends immediately with ejection error.

**Cause:** Multiple VAPI instances attempting to start simultaneously.

**Solution:** Singleton pattern ensures only one VAPI instance exists globally.

---

## 🔮 Future Enhancements

### Planned Features

- [ ] **Email Notifications**: Automated emails to candidates and recruiters
- [ ] **Video Interview Support**: Add video alongside voice for better assessment
- [ ] **Interview Recording**: Option to record and replay interviews
- [ ] **Advanced Analytics**: Charts and graphs for candidate performance trends
- [ ] **Multi-Language Support**: Conduct interviews in multiple languages
- [ ] **Custom Branding**: White-label solution for companies
- [ ] **API Webhooks**: Integrate with ATS (Applicant Tracking Systems)
- [ ] **Collaborative Review**: Multiple recruiters can review same candidate
- [ ] **Feedback Export**: Download reports as PDF
- [ ] **Interview Templates**: Pre-built templates for common roles
- [ ] **Candidate Portal**: Candidates can view their own feedback
- [ ] **Scheduling Integration**: Calendar integration for interview scheduling
- [ ] **AI Training**: Train AI on company-specific interview styles
- [ ] **Mobile App**: Native mobile applications for iOS/Android

### Technical Improvements

- [ ] **Server-Side Rendering**: Optimize SEO and performance
- [ ] **Edge Functions**: Deploy API routes to Supabase Edge Functions
- [ ] **Redis Caching**: Cache interview data for faster loads
- [ ] **WebSocket Integration**: Real-time updates for interview status
- [ ] **End-to-End Testing**: Comprehensive test coverage with Playwright
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Docker Support**: Containerized deployment
- [ ] **Rate Limiting**: Protect API endpoints from abuse
- [ ] **Monitoring & Logging**: Integrate Sentry for error tracking

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**  
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **VAPI** - For the amazing voice AI SDK
- **Supabase** - For the powerful backend infrastructure
- **OpenAI** - For GPT-4 and AI capabilities
- **Vercel** - For hosting and deployment
- **shadcn/ui** - For beautiful, accessible components

---

## 📞 Support

For questions, issues, or feature requests:

1. **GitHub Issues**: [Open an issue](https://github.com/yourusername/ai-interview-voice-agent/issues)
2. **Email**: your.email@example.com
3. **Documentation**: Check this README and code comments

---

## 🌟 Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

<div align="center">
  <sub>Built with ❤️ using Next.js, React, Supabase, and VAPI AI</sub>
</div>
