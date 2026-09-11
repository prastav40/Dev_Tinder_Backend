# DevTinder Backend

A robust, production-ready RESTful API built with Node.js, Express, TypeScript, and MongoDB designed to connect developers and students for hackathons and project-based collaborations through a dynamic swiping and matching architecture.

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database & ODM:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT) stored via cookies
* **Security:** bcrypt password hashing, strict field whitelisting for updates

## Core Architecture & Features
* **Smart Feed Algorithm:** Implements dynamic user filtering using MongoDB operators (`$nin`, `$or`, `$ne`) to automatically exclude self-profiles and previously swiped or connected users.
* **Optimized Pagination:** Integrates `skip` and `limit` query parameters with safety caps to ensure high-performance data delivery and infinite-scroll compatibility.
* **Connection Lifecycle Management:** Handles swipe actions (`interested`, `ignored`), review workflows (`accepted`, `rejected`), and retrieval of mutual connections.
* **Secure Profile Management:** Enforces strict field whitelisting (`allowedEditFields`) during patch requests to prevent unauthorized schema mutations and privilege escalation.
* **Authentication Middleware:** Centralized middleware (`userAuth`) that decodes JWT tokens, validates sessions, and injects user context into protected routes.

---

## API Endpoints Reference

### Authentication (`/auth`)
* **`POST /signup`** — Register a new user account.
* **`POST /login`** — Authenticate credentials and issue an HTTP-secure JWT cookie.
* **`POST /logout`** — Terminate the user session by clearing the auth cookie.

### Profile Management (`/profile`)
* **`GET /profile/view`** — Fetch the authenticated user's profile details.
* **`PATCH /profile/update`** — Update allowed profile attributes (e.g., bio, skills, age, gender, photo URL) with strict validation checks.

### Connection Requests (`/request`)
* **`POST /request/send/:status/:touserid`** — Send a connection action (`interested` or `ignored`) to a target user.
* **`POST /user/requests/:accept_notaccept/:personuserid`** — Accept or reject a pending incoming request sitting in the user's inbox.

### User Data & Feed (`/user` & `/feed`)
* **`GET /user/requests/pendingrequests`** — Fetch all pending incoming connection requests with populated sender profiles.
* **`GET /user/connections`** — Retrieve a list of mutual matches where both users can interact.
* **`GET /feed`** — Fetch a paginated discovery feed of potential teammates, excluding past interactions (`?page=1&limit=10`).

---

## Getting Started & Installation

### Prerequisites
* Node.js installed on your machine
* A running MongoDB instance or MongoDB Atlas cluster

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Dev_Tinder_Backend

2. **Install dependencies:** (`npm install`)

3. **Configure environment variables:** (Create the `.env` file with your  DB string)

4. **Run the build/start command:** (`npm run build` and `npm start`)
