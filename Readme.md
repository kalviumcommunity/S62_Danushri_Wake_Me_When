# Wake Me When 

**Wake Me When** is a smart meeting filtering and alert system designed to reduce unnecessary interruptions for busy professionals. It intelligently surfaces only the meetings that truly need your attention — so you can stay focused and avoid alert fatigue.

---

## Problem Statement

Professionals are overwhelmed with an ever-growing stream of meeting invites. Most of these meetings are informational or optional, leading to:

- Wasted time in unnecessary meetings
- Reduced productivity and deep-focus work
- Difficulty maintaining work-life balance, especially outside working hours

**Wake Me When** solves this by filtering meetings based on:
- Whether the meeting is marked as **High Importance**
- Presence of critical keywords (e.g., *"Urgent"*, *"Attention"*) in the subject or description
- Whether the user is explicitly listed as a **required attendee** (in the "To" field)
- Whether the meeting falls **outside defined working hours**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), deployed on Netlify |
| Backend | Node.js + Express, deployed on Render |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + Google OAuth (Passport.js) |
| API Docs | Bruno |

---

## 🗄️ Database Schema

Three core collections power the application:

**Users**
- Profile info, hashed password, Google OAuth ID
- Defined working hours and alert preferences
- Critical keyword list

**Meetings**
- Meeting title, description, organizer, attendees
- Importance flag, matched keywords
- Start/end time, alert schedule

**Notification Logs**
- Linked meeting and user
- Alert timestamps (1hr / 30min / 15min before)
- Delivery status

Entity relationships:
- `User` → many `Meetings` (one-to-many)
- `Meeting` → many `NotificationLogs` (one-to-many)
- `User` → many `NotificationLogs` (via ref)

---

## 🔌 API Reference

All routes are prefixed with `/api`. Protected routes require a valid JWT in the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT |
| `GET` | `/auth/google` | Initiate Google OAuth |
| `GET` | `/auth/google/callback` | Google OAuth callback |

### Meetings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/meetings` | Fetch all meetings for the logged-in user |
| `GET` | `/meetings/:id` | Get a single meeting by ID |
| `POST` | `/meetings` | Create a new meeting entry |
| `PUT` | `/meetings/:id` | Update an existing meeting |
| `DELETE` | `/meetings/:id` | Delete a meeting |

### User Settings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users/me` | Get current user profile |
| `PUT` | `/users/me` | Update working hours, keywords, alert preferences |
| `POST` | `/users/upload` | Upload profile picture or attachment |

> Full Bruno API collection is available in `/bruno/Wake-Me-When/` in the repo.

---

## Bruno API Collection

All API routes are documented using **[Bruno](https://www.usebruno.com/)** — an open-source API client. The collection lives in the repo so any developer can clone and test the API immediately without any additional setup.

### Collection Structure

```
bruno/
└── Wake-Me-When/
    ├── bruno.json
    ├── environments/
    │   ├── local.bru          # http://localhost:5000
    │   └── production.bru     # https://s62-danushri-wake-me-when-2-hvmd.onrender.com
    ├── auth/
    │   ├── register.bru
    │   ├── login.bru
    │   ├── logout.bru
    │   ├── get-user.bru
    │   └── verify-jwt.bru
    ├── events/
    │   ├── all-events.bru
    │   ├── important-events.bru
    │   ├── after-hours-events.bru
    │   ├── overlap-events.bru
    │   ├── mark-done.bru
    │   └── resync.bru
    ├── profile/
    │   ├── get-stats.bru
    │   ├── update-name.bru
    │   ├── upload-photo.bru
    │   └── delete-account.bru
    ├── settings/
    │   ├── get-settings.bru
    │   └── save-settings.bru
    └── push/
        ├── get-vapid-key.bru
        ├── subscribe.bru
        └── test-push.bru
```

### How to Run Locally

1. Download and install [Bruno](https://www.usebruno.com/downloads)
2. Open Bruno → click **Open Collection** → select `bruno/Wake-Me-When/`
3. Switch environment to **local** (top-right dropdown)
4. Start your backend (`npm run dev` in `/Backend`)
5. Run any request using the **▶ Send** button

### How to Run Against Production

1. Switch environment to **production** in Bruno
2. Run `auth/login` first — copy the `token` from the response
3. For protected routes, set the `Authorization` header to `Bearer <token>`
4. All routes work against the live Render deployment with no local setup needed

---

## Authentication

The app supports two authentication methods:

### Username / Password
- Passwords are hashed using **bcrypt** before storage
- On login, a signed **JWT** is returned and stored client-side
- All protected API calls include the token in the `Authorization` header
- Token expiry and refresh handled on the frontend

### Google OAuth (3rd Party)

Google Sign-In is implemented using **Passport.js** with the `passport-google-oauth20` strategy.

**Flow:**
1. User clicks "Sign in with Google" on the frontend
2. Browser redirects to `GET /auth/google` — Passport initiates the OAuth handshake with Google
3. Google prompts the user to select an account and grant permission
4. Google redirects back to `GET /auth/google/callback` with an authorization code
5. Passport exchanges the code for an access token and retrieves the user's Google profile
6. Server checks if a user with that Google ID already exists in MongoDB:
   - **New user** → record is created with name, email, and Google ID; JWT is issued
   - **Returning user** → existing record is matched on Google ID; JWT is issued
7. JWT is returned to the frontend and stored for subsequent API calls

**Setup (environment variables required):**
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
```

> To obtain credentials, create a project in [Google Cloud Console](https://console.cloud.google.com/), enable the **Google+ API / People API**, and add your callback URL to the list of authorised redirect URIs.

**Key implementation files:**
```
server/
├── config/
│   └── passport.js        # Google strategy configuration
├── routes/
│   └── auth.js            # /auth/google and /auth/google/callback routes
└── models/
    └── User.js            # googleId field on the User schema
```

---

## File Upload

Users can upload files (e.g., profile images, meeting attachments) via the `/users/upload` endpoint:

- Handled server-side using **Multer**
- Files are validated for type and size before storage
- Upload state is reflected immediately in the React UI

---

## Frontend

The React application is structured around the following key components:

| Component | Description |
|---|---|
| `Dashboard` | Overview of upcoming filtered meetings and alerts |
| `MeetingCard` | Individual meeting display with importance indicators |
| `AlertTimeline` | Visual timeline of scheduled alerts |
| `SettingsPanel` | Configure working hours, keywords, and alert modes |
| `AuthForms` | Login, register, and Google OAuth entry points |
| `UploadWidget` | File/image upload with preview |

The UI matches the approved HiFi Figma designs — including layout, color system, typography, and component states.

---

## Design to End State

The final deployed application matches the approved HiFi Figma prototype across all core screens. Below is a breakdown of how each key view translated from design to implementation:

| Screen | Design Intent | End State |
|---|---|---|
| **Login / Register** | Clean auth forms with Google OAuth button | ✅ Matches — JWT + Google OAuth both functional |
| **Dashboard** | Meeting list with importance badges and alert countdown | ✅ Matches — filtered meetings rendered with status indicators |
| **Settings Panel** | Working hours picker, keyword input, alert toggles | ✅ Matches — all preferences persist to MongoDB |
| **Alert Timeline** | Visual strip of upcoming alerts (1hr / 30min / 15min) | ✅ Matches — timeline renders based on real meeting data |
| **Meeting Detail** | Expanded view with attendees, description, importance flag | ✅ Matches — all meeting fields displayed |
| **File Upload** | Upload widget with preview state | ✅ Matches — Multer integration with immediate UI feedback |

### Design Decisions Carried Through

- **Color system** — accent colors from Figma applied consistently via CSS variables
- **Typography** — font weights and sizes match the design spec across headings, body, and labels
- **Component spacing** — padding and margin values mirror the Figma layout grid
- **Empty states** — "No critical meetings" placeholder matches the designed empty state illustration
- **Responsive behavior** — layout collapses correctly on smaller viewports as per the mobile frames in Figma

**HiFi Reference:** [View Figma Design](https://www.figma.com/design/6R1dstmbMXIjf1bri60CGc/html.to.design-%E2%80%94-by-%E2%80%B9div%E2%80%BARIOTS-%E2%80%94-Import-websites-to-Figma-designs--web-html-css---Community-?node-id=0-1&t=wfpBTddXWdgrxnvF-1)  
**Prototype:** [View Clickable Prototype](https://www.figma.com/proto/6R1dstmbMXIjf1bri60CGc/html.to.design-%E2%80%94-by-%E2%80%B9div%E2%80%BARIOTS-%E2%80%94-Import-websites-to-Figma-designs--web-html-css---Community-?node-id=0-1&t=wfpBTddXWdgrxnvF-1)  
**Live App:** [wakemewhenn.netlify.app](https://wakemewhenn.netlify.app/)

---

## Deployment

| Service | Platform | Status |
|---|---|---|
| Frontend | Netlify | Live |
| Backend | Render | Live |

**Frontend** is auto-deployed from the `main` branch on push.  
**Backend** is deployed as a web service on Render with environment variables configured via the Render dashboard.

---

## Project Management

Development was tracked using **GitHub Projects** with a Kanban board. The board organized work into:

- **Backlog** — planned features and concepts
- **In Progress** — active development items
- **Done** — completed and verified milestones

All capstone concept milestones were mapped to GitHub issues and linked to pull requests.

---

## Future Scope

- **AI/ML feedback loop** — learn from attended/skipped patterns to improve filtering
- **Outlook Calendar integration** — broaden beyond Exchange Server
- **Mobile push notifications** — extend alerts to iOS/Android
- **NLP meeting summaries** — auto-summarize missed meetings
- **Slack status sync** — pause Slack DND during critical meetings
- **SMS/WhatsApp alerts** — via Twilio

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/<your-username>/wake-me-when.git

# Backend
cd server
npm install
cp .env.example .env   # fill in your MongoDB URI, JWT secret, Google OAuth keys
npm run dev

# Frontend
cd client
npm install
npm run dev
```

---
**Frontend:** [wakemewhenn.netlify.app](https://wakemewhenn.netlify.app/)  
**Backend:** [s62-danushri-wake-me-when-2-hvmd.onrender.com](https://s62-danushri-wake-me-when-2-hvmd.onrender.com)  
**Figma HiFi:** [View Design](https://www.figma.com/design/6R1dstmbMXIjf1bri60CGc/html.to.design-%E2%80%94-by-%E2%80%B9div%E2%80%BARIOTS-%E2%80%94-Import-websites-to-Figma-designs--web-html-css---Community-?node-id=0-1&t=wfpBTddXWdgrxnvF-1)  
**Prototype:** [View Prototype](https://www.figma.com/proto/6R1dstmbMXIjf1bri60CGc/html.to.design-%E2%80%94-by-%E2%80%B9div%E2%80%BARIOTS-%E2%80%94-Import-websites-to-Figma-designs--web-html-css---Community-?node-id=0-1&t=wfpBTddXWdgrxnvF-1)

---
