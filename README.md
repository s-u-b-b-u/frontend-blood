# 🩸 BloodLink Network — Emergency Blood Coordination Platform

**BloodLink Network** is a modern, responsive web application connecting voluntary blood donors, emergency hospital ICUs, regional blood banks, and platform administrators across a unified lifesaving network.

---

## 🌟 Key Capabilities & Features

* **Public Landing Page (`/`)**:
  * **Full-Width Crimson Hero**: Single primary CTA (`Register as a Lifesaver` ➔ `/register`) with inspiring donor quote and high-resolution visuals.
  * **Dynamic Glass Navbar**: Morphing glassmorphic pill with active section observer, smooth scrolling (`#how-it-works`, `#services`, `#presence`, `#reviews`), and role-aware navigation.
  * **Services & Capabilities (`#services`)**: Fluid dark crimson header with connected 3-column capability cards.
  * **Regional Presence (`#presence`)**: 50/50 split layout showcasing 4 national metric counters and `blood-storage` visual.
  * **Impact Stories Carousel (`#reviews`)**: Equal 50/50 split review carousel with responsive aspect-ratio bounds and screen-edge SVG chevron controls.
* **Hospital Portal (`/dashboard/requests`, `inventory`, `transfers`)**:
  * Emergency blood request creation modal (`Modal.jsx`) & nearby stock matcher drawer (`Drawer.jsx`).
  * Visual 4-stage transfer progress stepper (`REQUESTED` ➔ `APPROVED` ➔ `DISPATCHED` ➔ `DELIVERED`).
* **Blood Bank Portal (`/dashboard/inventory`, `donations`, `transfers`)**:
  * Unit intake & testing lifecycle modal (`Modal.jsx`) with 35-day shelf-life expiry warning badges (`⚠️ 3d left`).
  * Voluntary community blood drive manager modal & cold-chain courier assignment drawer (`Drawer.jsx`).
* **Voluntary Donor Portal (`/dashboard/donations`, `profile`, `notifications`)**:
  * Digital Donor Health Pass card featuring blood group badge, impact score, and appointment scheduler modal (`Modal.jsx`).
  * Emergency shortage notification drawer (`Drawer.jsx`) with one-click donation pledge action.
* **Admin Management Portal (`/dashboard/users`, `organizations`, `audit-logs`)**:
  * User role & account status drawer (`ACTIVE` vs `SUSPENDED`).
  * Organization verification inspector drawer for hospital/blood bank credentials review.
  * System audit log JSON payload inspector modal (`Modal.jsx`).

---

## 🛠️ Prerequisites

Before you start, make sure you have the following installed on your machine:
* **Node.js**: `v18.0.0` or higher (`v20.x` recommended). Verify with `node -v`.
* **npm**: `v9.0.0` or higher. Verify with `npm -v`.
* **Git**: Installed and configured. Verify with `git --version`.

---

## 🚀 Quickstart Guide for Teammates (Fork & Clone Setup)

Follow these exact step-by-step instructions after **forking** and **cloning** this repository.

### Step 1: Fork & Clone the Repository

First, click the **Fork** button at the top right of this repository on GitHub. Then clone your fork locally:

```bash
git clone https://github.com/<your-github-username>/frontend-blood.git
cd frontend-blood
```

---

### Step 2: Create Environment Configuration File (`.env`)

Create your local `.env` configuration file from the provided `.env.example` template:

#### 🪟 On Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

#### 🪟 On Windows (Command Prompt / CMD):
```cmd
copy .env.example .env
```

#### 🐧 On Linux / macOS (Bash / Zsh):
```bash
cp .env.example .env
```

> **Note**: The `.env` file contains your local environment variables and is automatically ignored by Git. **NEVER** commit `.env` or sensitive API keys to GitHub.

---

### Step 3: Install Project Dependencies

Install all required npm packages:

```bash
npm install
```

---

### Step 4: Run Local Development Server

Launch the Vite local development server:

```bash
npm run dev
```

Once started, open your browser and navigate to:
👉 **`http://localhost:5173/`**

---

### Step 5: Building for Production & Testing Output

To test the optimized production build locally:

```bash
npm run build
npm run preview
```

---

## 📁 Project Architecture & Directory Structure

```text
frontend-blood/
├── public/                 # Static public assets
├── src/
│   ├── api.js              # Centralized REST API client layer
│   ├── App.jsx             # Main Router & ProtectedRoute wrappers
│   ├── main.jsx            # React root mount
│   ├── index.css           # Core Design Tokens, Variables & Keyframes
│   ├── assets/             # Images (blood-donation, blood-storage, doctor1, donor1, reciever1)
│   ├── components/         # Reusable Design System Components
│   │   ├── Navbar.jsx      # Dynamic Glassmorphic Floating Header
│   │   ├── Sidebar.jsx     # Dashboard Navigation Sidebar
│   │   ├── Modal.jsx       # Center Pop-Up Glass Modal
│   │   ├── Drawer.jsx      # Right Slide-Over Inspector Drawer
│   │   ├── DataTable.jsx   # Floating Card Data Table Container
│   │   ├── StatCard.jsx    # Metric Summary Card
│   │   ├── Skeleton.jsx    # Shimmer Loading Placeholder
│   │   └── IndiaMap.jsx    # Vector India Regional Map Component
│   ├── contexts/
│   │   └── AuthContext.jsx # Authentication state & session manager
│   ├── layouts/
│   │   └── DashboardLayout.jsx # Authenticated portal grid layout
│   └── pages/              # Portal Feature Views
│       ├── Landing.jsx     # Public Landing Page
│       ├── Login.jsx       # Login Page
│       ├── Register.jsx    # Registration Page
│       ├── Dashboard.jsx   # Portal Overview Dashboard
│       ├── Users.jsx       # Admin User Directory & Role Manager
│       ├── Organizations.jsx # Admin Organization Inspector
│       ├── AuditLogs.jsx   # Admin Audit Log JSON Inspector
│       ├── HospitalRequests.jsx # Hospital Blood Request Manager
│       ├── HospitalTransfers.jsx # Hospital Transfer Stepper Tracker
│       ├── HospitalInventory.jsx # Hospital Reserve Stock Monitor
│       ├── BloodBankInventory.jsx # Blood Bank Intake & Testing Manager
│       ├── BloodBankDonations.jsx # Blood Bank Drive Manager
│       ├── BloodBankTransfers.jsx # Blood Bank Dispatch Control
│       ├── DonorDonations.jsx # Donor Pass & Appointment Booking
│       ├── DonorNotifications.jsx # Donor Emergency Shortage Alerts
│       └── DonorProfile.jsx # Donor Profile & Availability Toggle
├── .env.example            # Environment variables template for team setup
├── .gitignore              # Git ignore rules (.env, node_modules, dist)
├── package.json            # Project dependencies & scripts
└── vite.config.js          # Vite build configuration
```

---

## 🔒 Security & Git Contribution Guidelines

To maintain code hygiene and security:

1. **Ignored Files**: `node_modules/`, `.env`, `dist/`, `.DS_Store`, and IDE files are listed in `.gitignore` and must **never** be committed.
2. **Branching Workflow**: Always create a feature branch before making changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit Messages**: Write clear, descriptive commit messages:
   ```bash
   git commit -m "feat(hospital): add emergency stock search drawer"
   ```
4. **Pushing & Pull Requests**:
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request against the `main` branch.

---

## 📄 License & Ownership

© BloodLink Network. All rights reserved. Lifesaving Emergency Coordination.
