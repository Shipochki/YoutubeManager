# YouTube Project Tracker - Brainstorm

## Overview
A web application for solo YouTube creators to track the complete economics of video projects. Understand the true cost, time investment, and profitability of each video.

## Core Concept
- **Primary Entity:** Project (one main video)
- **Related Content:** Shorts derived from main video (1:many)
- **Tracking:** Expenses, revenue, time spent
- **Goal:** ROI insight per video + understand channel profitability

---

## Data Model

### Account Level (Recurring Costs)
Users can add subscription/tool expenses that apply to all videos:
- Adobe Suite ($80/month)
- Hosting ($10/month)
- YouTube Premium ($13/month)
- Any other recurring subscription or service
- Each can be marked active/inactive
- Applies across all projects

### Project Level
**Basic Info:**
- Title, description
- Status (planning, filming, editing, published, etc.)
- Target publish date
- Linked shorts

**Finances:**
- Direct expenses (one-off): gear, props, commissioned music, paid services
- Revenue: AdSense payout, sponsorship, affiliate, etc.

**Time Tracking:**
- Hours spent on: scripting, filming, editing, thumbnails, other
- Total hours auto-calculated

### Shorts
- Name/title
- Link to parent project
- Publish date
- Status
- Optional: separate revenue/expenses (or inherit from parent)

---

## Profitability Calculation

**Gross Profit** = Project Revenue - Project Direct Expenses

**Net Profit** = Gross Profit - Allocated Recurring Costs

**Recurring Cost Allocation:**
- Option 1: User manually chooses how much recurring cost to deduct from each project
- Option 2: App suggests dividing total monthly recurring by number of projects published that month
- Display both options for transparency

**Key Metrics Per Project:**
- Total profit/loss
- ROI (profit / total cost)
- Revenue per hour worked
- Time invested (breakdown by category)

---

## MVP Features

### 1. Account Setup
- Add/edit/remove recurring expenses
- Name, amount, frequency (monthly, yearly, etc.)
- Toggle active/inactive

### 2. Create Project
- Title, description
- Status dropdown
- Target publish date
- Add shorts (name + publish date)

### 3. Log Project Expenses
- Add line items: description, amount, category (optional)
- Edit/delete expenses
- Show total project expenses

### 4. Log Revenue
- Add payouts: source, amount, date
- Edit/delete
- Show total project revenue

### 5. Time Tracking
- Log hours by category: scripting, filming, editing, thumbnails, other
- Manual entry or time picker
- Total hours calculated

### 6. Project View
- Display: gross profit, net profit (with recurring allocation), total time, ROI
- Breakdown of time by category
- Breakdown of expenses by category
- Linked shorts list

### 7. Project List View
- Card/table showing: title, status, profit/loss (color coded), time invested, publish date
- Quick glance at profitability

### 8. Dashboard
- Monthly recurring costs total
- Number of projects published this month
- Total channel revenue/expenses this month
- Simple charts/metrics (optional for MVP)

---

## User Flow (MVP)

1. Create account
2. Add recurring expenses (subscriptions, tools)
3. Create a project (video idea)
4. Add project-specific expenses as they happen
5. Log time spent (daily or per phase)
6. Add revenue when it comes in
7. View project profitability dashboard
8. Compare across projects

---

## Future Enhancements
- YouTube API integration (pull view counts, AdSense data)
- Expense categories & budgeting
- Shorts analytics (separate tracking)
- Tax reporting export
- Multi-channel support
- Team collaboration
- Forecasting/projections
- Trend analysis over time
- Export reports

---

## Tech Considerations (for implementation agent)
- **Database:** Need to store accounts, recurring expenses, projects, project expenses, revenue entries, time logs, shorts
- **Authentication:** User accounts
- **Calculations:** Profitability, ROI, time aggregation (can be client-side)
- **UI Framework:** React/Vue recommended for responsive dashboard
- **Charts:** Optional for MVP but nice for metrics visualization

