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
