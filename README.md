# Vincere Quantum Lab dashboard

A React + Vite dashboard for the Vincere Knapsack Qiskit Fall Fest project.

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To verify a production build:

```bash
npm run build
npm run preview
```

## What's included

- Interactive 3D cuboid bar charts for processor metrics, optimal-value hit rate, and feasible-shot rate.
- Orbit-style camera interaction for 3D plots; the underlying plotted data remains fixed.
- A step-through exhaustive-search simulator that evaluates all 32 possible subsets of the five-item 0/1 knapsack, with previous/next/reset controls.
- The repository's processor-comparison and Processor D coupling figures, loaded from GitHub.
- The saved 13 × 13 ideal p=1 QAOA parameter grid.

## Scientific note

The QAOA landscape is shown from the saved parameter-grid data and is not hardware data. The saved optimizer minimum and the parameter-grid energy values were previously found to need reconciliation, so do not present the displayed minimum as independently validated until that discrepancy is resolved. The processor sampling figures are simulated results, not quantum-hardware measurements.

The repository figure images are loaded from the repository's `main` branch, so an internet connection is needed for those images.
