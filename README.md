# Election Simulator Assistant

---

## 📌 Chosen Vertical

**Election Process Education**

This project focuses on educating users about the election process by simulating real-world scenarios in an interactive and engaging way. It aims to improve awareness of roles, responsibilities, and decision-making involved in elections.

---

## 🧠 Approach and Logic

The application is designed as a **decision-based simulation system** rather than a static quiz.

* Users select a role:

  * Voter
  * Candidate
  * Election Officer

* Each role is presented with **realistic scenarios** based on actual election processes.

* The system uses a **branching decision engine**, where:

  * Every choice leads to a different outcome
  * Multiple levels of decisions are connected
  * Earlier decisions can influence later scenarios (state-based logic)

* The logic is structured into:

  * `data.js` → scenario definitions and branching paths
  * `engine.js` → decision routing and state tracking
  * `app.js` → UI rendering and interaction handling

---

## ⚙️ How the Solution Works

1. **Role Selection**

   * User selects one of the three roles.

2. **Scenario Flow**

   * The system presents a situation (e.g., polling booth, nomination filing).
   * User chooses an action from multiple options.

3. **Decision Engine**

   * The engine evaluates the selected choice.
   * Routes the user to the next scenario based on predefined logic.

4. **Branching & Consequences**

   * Each decision leads to:

     * A new scenario
     * Immediate feedback
     * Potential long-term impact

5. **Dynamic Elements**

   * Random events may occur (e.g., system downtime, crowd issues).
   * These introduce variability and realism.

6. **Progress Tracking**

   * The application tracks:

     * User decisions
     * Mistakes
     * Scenario path

7. **Final Summary**

   * At the end, the system provides:

     * A summary of decisions
     * Mistakes made
     * Overall outcome (e.g., fair or compromised election)

---

## ⚠️ Assumptions Made

* Users have basic familiarity with general election concepts.
* The simulation simplifies certain real-world complexities for clarity.
* No real personal or sensitive data is collected or processed.
* All decisions are predefined and based on commonly accepted election practices.
* Random events are used to simulate unpredictability but do not represent actual system failures.

---

## 🛠️ Technology Stack

* Frontend: HTML, CSS, Vanilla JavaScript
* Backend: Node.js with Express (for static serving)
* Deployment: Google Cloud Run

---

## 🚀 Running Locally

```bash
npm install
npm start
```

Open in browser:

```
http://localhost:8080
```

---

## ☁️ Deployment

```bash
gcloud run deploy election-simulator \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```

---

## 📊 Summary

This project provides a **lightweight, interactive simulation** that helps users understand election processes through **practical decision-making**, making learning more engaging and effective.
