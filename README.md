# HostelSync — Smart Hostel Management System

**HostelSync** is an all-in-one residential campus operations platform connecting students, hostel administrators (wardens/accounts), and maintenance technicians in a unified system. It prevents duplicate bed bookings, regulates canteen dining queues through digital tokens, streamlines maintenance tickets through a 4-stage SLA workflow, provides Gemini AI-powered health guidance, and reconciles fee receipts.

---

## 🌟 Key Modules & Capabilities

### 1. Role-Based Portals
- **Resident Student**: Bed allocation requests, daily canteen token booking, photo-enabled maintenance filing with AI auto-categorization, gym batch reservations, Gemini health guidance, fee receipt uploads.
- **Hostel Administrator**: High-level campus analytics, bed allocation approval desk, complaint dispatcher & technician assignment, canteen menu & slot capacity configuration, fee receipt audit desk, campus-wide circular broadcasts, immutable audit logs.
- **Maintenance Technician**: Filtered work order queue (Assigned, In Progress, Resolved), room details & damage photo inspection, live progress note logging, parts replacement and sign-off recording.

### 2. Core Operational Workflows
1. **Conflict-Guarded Bed Allocation**: Prevents concurrent bed reservations. When a student requests an available bed, the bed enters a reserved state awaiting Warden approval, deducting available room inventory upon approval.
2. **Canteen Dining Slots & Tokens**: Students choose a meal window (Breakfast, Lunch, Snacks, Dinner) with dynamic capacity meters. The system enforces single-token constraints per meal and issues a verifiable digital token code (e.g., `HSTL-3904`).
3. **4-Stage Maintenance Lifecycle**:
   - `Submitted`: Student logs issue with description and photo.
   - `Assigned`: Warden dispatches certified technician.
   - `In Progress`: Technician logs inspection notes on site.
   - `Resolved`: Technician submits parts replaced and resolution summary; student rates repair quality (1–5 stars).
4. **AI-Powered Facilities & Health Guidance**:
   - **Gemini Facility AI**: Automatically predicts complaint category (Plumbing, Electrical, Wi-Fi, Furniture, Cleaning) and priority, plus provides immediate safety mitigation advice.
   - **Gemini Health Assistant**: Provides non-diagnostic initial symptom guidance, red-flag warning detection, and 24/7 campus dispensary/ambulance hotline details.
5. **Fee Payment Reconciliation**: Students upload bank transfer/UPI receipts. Accounts officers verify the UTR transaction number and reconcile ledgers before marking fees as settled.

---

## 🚀 Rapid Demonstration & Role Switching

A top **Demonstration Mode Bar** enables 1-click role switching during project demonstrations:
- **Rahul Sharma (Student)**: Room A-204, existing active plumbing ticket & verified fee record.
- **Vikram Singh (New Student)**: Unallocated bed — test requesting vacant beds!
- **Dr. Arthur Henderson (Chief Warden)**: Approve bed requests, assign technicians, reconcile fee receipts.
- **Ramesh Kumar (Technician)**: Inspect assigned work orders, record work in progress, and sign off.

---

## 🛠️ Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion.
- **Backend**: Express on Node.js / `server.ts` with Vite development middleware.
- **AI Integration**: Google Gemini API (`@google/genai`) with secure server-side API key proxying and automated rule-based fallbacks.
- **Data Persistence**: In-memory store with `localStorage` client synchronization and full export/reset support.

---

## 💻 Running Locally

```bash
# Install dependencies
npm install

# Start development full-stack server (Port 3000)
npm run dev

# Build production bundle
npm run build
```
