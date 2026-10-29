<<<<<<< HEAD
# Vincere Quantum Dashboard ⚛️

An interactive visualization dashboard for **quantum optimization applied to the 0/1 Knapsack Problem**, developed as part of Team Vincere's Qiskit Fall Fest 2026 project.

## 🚀 Overview

The dashboard presents quantum optimization experiments through interactive charts and visualizations, helping users explore how the Quantum Approximate Optimization Algorithm (QAOA) approaches a resource-constrained item-selection problem.

## ✨ Features

- **3D QAOA Energy Landscape** — Explore the relationship between QAOA parameters γ (gamma), β (beta), and expected QUBO energy.
- **Processor Benchmarking** — Compare transpiled circuit depth, CX gate counts, and estimated routing overhead for different processor configurations.
- **Solution Distribution** — Visualize sampled bitstrings, feasible solutions, and objective values.
- **Classical Baseline Comparison** — Compare QAOA sampling results against random item selection.
- **Interactive Visualizations** — Rotate 3D surfaces, zoom into charts, hover over data points, and explore results.

## 🧰 Technology Stack

- React
- Vite
- Plotly.js
- JavaScript
- GitHub Pages

## 📊 Experimental Context

The underlying project uses Qiskit to formulate and evaluate a 0/1 Knapsack optimization problem using QUBO and QAOA.

The dashboard will distinguish simulated noisy results from real quantum hardware measurements. All displayed metrics will be based on recorded experiment outputs.

## 🌐 Live Dashboard

**Coming soon!** The deployed GitHub Pages link will be added here.

## 🔗 Main Project

[Vincere Knapsack — GitHub Repository](https://github.com/ashuuuk/Vincere_Knapsack)

## 👥 Team

**Team Vincere**  
Qiskit Fall Fest 2026

---

*Built to make quantum optimization experiments easier to explore, understand, and present.*
=======
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
>>>>>>> master
