import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import './palette.css'

const C = { mint: '#FF634A', blue: '#D2D2D4', amber: '#E7E7E7' }
const processors = [
  { name: 'Processor B', depth: 316, cx: 114, swaps: 14, feasible: 91.796875, hit: 1.5869140625, mean: 14.2375, color: C.blue },
  { name: 'Processor D', depth: 227, cx: 98, swaps: 8.67, feasible: 91.8212890625, hit: 1.3916015625, mean: 14.3209252858, color: C.mint },
]
const baseline = { name: 'Random baseline', feasible: 87.939453125, hit: 3.076171875, mean: 15.0810660744, color: C.amber }
const layoutBase = {
  paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#242426', family: 'Arial, Helvetica, sans-serif', size: 12 },
  margin: { l: 48, r: 18, t: 24, b: 48 },
  xaxis: { gridcolor: 'rgba(36,36,38,.12)', zerolinecolor: 'rgba(36,36,38,.18)', tickfont: { color: '#242426' } },
  yaxis: { gridcolor: 'rgba(36,36,38,.12)', zerolinecolor: 'rgba(36,36,38,.18)', tickfont: { color: '#242426' } }, showlegend: false,
}
function Card({ children, className = '' }) { return <section className={`card ${className}`}>{children}</section> }
function SectionTitle({ eyebrow, title, desc }) { return <div className="section-title"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div><p>{desc}</p></div> }

// Plotly has no native 3D bar trace, so each bar is drawn as an interactive cuboid mesh.
function make3DBars(rows, { xKey = 'name', yKey = 'value', colorKey = 'color' } = {}) {
  return rows.map((row, idx) => {
    const x = idx; const y = 0; const h = Number(row[yKey]) || 0; const dx = 0.56; const dy = 0.56;
    const xx = [x-dx/2,x+dx/2,x+dx/2,x-dx/2,x-dx/2,x+dx/2,x+dx/2,x-dx/2];
    const yy = [y-dy/2,y-dy/2,y+dy/2,y+dy/2,y-dy/2,y-dy/2,y+dy/2,y+dy/2];
    const zz = [0,0,0,0,h,h,h,h];
    const faces = [[0,1,2],[0,2,3],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[1,2,6],[1,6,5],[2,3,7],[2,7,6],[3,0,4],[3,4,7]];
    return { type:'mesh3d', x:xx, y:yy, z:zz, i:faces.map(f=>f[0]), j:faces.map(f=>f[1]), k:faces.map(f=>f[2]), color:row[colorKey], opacity:1, flatshading:true, name:row[xKey], customdata:Array(8).fill(h), hovertemplate:`${row[xKey]}<br>${yKey}: %{customdata}<extra></extra>`, showscale:false, lighting:{ambient:0.78,diffuse:0.65,specular:0.18,roughness:0.85} };
  });
}
const sceneBase = { bgcolor:'rgba(0,0,0,0)', xaxis:{title:'',tickfont:{color:'#242426',size:10},gridcolor:'rgba(36,36,38,.12)',zerolinecolor:'rgba(36,36,38,.18)',showbackground:false}, yaxis:{title:'',tickfont:{color:'#242426',size:10},gridcolor:'rgba(36,36,38,.12)',zerolinecolor:'rgba(36,36,38,.18)',showbackground:false,showticklabels:false}, zaxis:{title:'',tickfont:{color:'#242426',size:10},gridcolor:'rgba(36,36,38,.12)',zerolinecolor:'rgba(36,36,38,.18)',rangemode:'tozero',showbackground:false}, camera:{eye:{x:1.55,y:1.65,z:1.05}}, dragmode:'orbit', uirevision:'vincere-3d-view', aspectmode:'manual', aspectratio:{x:1.25,y:0.72,z:0.8} }


function KnapsackDP() {
  const values = [10, 4, 7, 5, 8]
  const weights = [5, 3, 4, 2, 6]
  const capacity = 15
  const cols = capacity + 1
  const totalCells = (values.length + 1) * cols
  const [step, setStep] = useState(0)

  const dp = Array.from({ length: values.length + 1 }, () => Array(cols).fill(0))
  for (let i = 1; i <= values.length; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = weights[i - 1] > w
        ? dp[i - 1][w]
        : Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]])
    }
  }

  const isVisible = (row, col) => row * cols + col < step
  const activeIndex = step - 1
  const activeRow = Math.floor(activeIndex / cols)
  const activeCol = activeIndex % cols

  let explanation = 'Press “Next cell” to begin. With zero items available, every capacity has a best value of 0.'
  if (step > 0 && step < totalCells) {
    const i = activeRow
    const w = activeCol
    if (i === 0) {
      explanation = `Base case: no items are available, so the best value at capacity ${w} is 0.`
    } else if (weights[i - 1] > w) {
      explanation = `Item ${i} weighs ${weights[i - 1]}, which exceeds capacity ${w}. Copy the value from above: ${dp[i - 1][w]}.`
    } else {
      const excluded = dp[i - 1][w]
      const remainingCapacity = w - weights[i - 1]
      const included = values[i - 1] + dp[i - 1][remainingCapacity]
      explanation = `Item ${i}, capacity ${w}: exclude it = ${excluded}; include it = ${values[i - 1]} + dp[${i - 1}][${remainingCapacity}] (${dp[i - 1][remainingCapacity]}) = ${included}. Choose the larger value: ${dp[i][w]}.`
    }
  } else if (step === totalCells) {
    explanation = 'Table complete. The optimal selection is 11110: take items 1–4, for total value 26 and total weight 14.'
  }

  const fillRow = () => setStep(s => Math.min(totalCells, (Math.floor(s / cols) + 1) * cols))
  const fillAll = () => setStep(totalCells)

  return (
    <Card className="dp-card">
      <div className="card-heading">
        <div>
          <div className="eyebrow">DYNAMIC PROGRAMMING</div>
          <h3>Build the 0/1 Knapsack Table</h3>
          <p>Values [10, 4, 7, 5, 8] · Weights [5, 3, 4, 2, 6] · Capacity 15</p>
        </div>
        <span className="pill neutral">{step} / {totalCells} CELLS</span>
      </div>

      <p className="body-copy">
        Each cell stores the maximum value achievable using the first i items and the capacity shown above.
        Reveal the table cell-by-cell, fill a whole row, or show the complete table.
      </p>

      <div className="dp-formula">
        <strong>Recurrence</strong>
        <code>dp[i][w] = max(dp[i−1][w], value[i] + dp[i−1][w−weight[i]])</code>
        <small>If the item is too heavy, copy the value from the row above. Otherwise, compare excluding and including it.</small>
      </div>

      <div className="sim-progress" aria-label="Table progress">
        <span style={{ width: `${(step / totalCells) * 100}%` }} />
      </div>

      <div className="dp-table-wrap">
        <table className="dp-table">
          <thead>
            <tr>
              <th className="dp-row-label">Items used</th>
              {Array.from({ length: cols }, (_, w) => <th key={w}>{w}</th>)}
            </tr>
          </thead>
          <tbody>
            {dp.map((row, i) => (
              <tr key={i}>
                <th className="dp-row-label">
                  {i === 0 ? '0 items' : `${i} (wt ${weights[i - 1]}, val ${values[i - 1]})`}
                </th>
                {row.map((value, w) => {
                  const index = i * cols + w
                  const filled = isVisible(i, w)
                  const current = index === activeIndex && step < totalCells
                  const optimum = step === totalCells && i === values.length && w === capacity
                  return (
                    <td key={w} className={[
                      filled ? 'dp-filled' : 'dp-empty',
                      current ? 'dp-current' : '',
                      optimum ? 'dp-optimum' : '',
                    ].filter(Boolean).join(' ')}>
                      {filled ? value : '·'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dp-explanation" aria-live="polite">
        <span className="sim-step-kicker">
          {step === 0 ? 'READY TO BEGIN' : step === totalCells ? 'TABLE COMPLETE' : `CELL ${step} OF ${totalCells}`}
        </span>
        <p>{explanation}</p>
      </div>

      <div className="sim-controls">
        <button type="button" className="sim-button secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
          ← Previous cell
        </button>
        <span className="sim-step-caption">{step} of {totalCells} cells filled</span>
        <button type="button" className="sim-button primary" onClick={() => setStep(s => Math.min(totalCells, s + 1))} disabled={step === totalCells}>
          Next cell →
        </button>
        <button type="button" className="sim-button secondary" onClick={fillRow} disabled={step === totalCells}>
          Fill row →
        </button>
        <button type="button" className="sim-button secondary" onClick={fillAll} disabled={step === totalCells}>
          Fill all
        </button>
        <button type="button" className="sim-button reset" onClick={() => setStep(0)}>
          Reset
        </button>
      </div>

      {step === totalCells && (
        <div className="dp-result">
          <div><span>Optimal value</span><b>26</b></div>
          <div><span>Selected items</span><b>1, 2, 3, 4</b></div>
          <div><span>Total weight</span><b>14 / 15</b></div>
          <div><span>Decision bits</span><b>11110</b></div>
        </div>
      )}
    </Card>
  )
}

export default function App() {
  const [active, setActive] = useState('Overview')
  const [metric, setMetric] = useState('depth')
  const [showBaseline, setShowBaseline] = useState(true)
  const [surface, setSurface] = useState({
  gamma: [],
  beta: [],
  z: [],
})

const [surfaceStatus, setSurfaceStatus] = useState(
  'Loading calculated QAOA data...'
)

useEffect(() => {
  let cancelled = false

  async function loadLandscape() {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/qaoa_energy_landscape.csv`)

      if (!response.ok) {
        throw new Error(`CSV request failed: ${response.status}`)
      }

      const csv = await response.text()
      const lines = csv.trim().split(/\r?\n/)

      const rows = lines.slice(1).map((line) => {
        const [gamma, beta, energy] = line.split(',').map(Number)

        if (![gamma, beta, energy].every(Number.isFinite)) {
          throw new Error('Invalid numeric value in CSV')
        }

        return { gamma, beta, energy }
      })

      const gamma = [...new Set(rows.map(row => row.gamma))]
        .sort((a, b) => a - b)

      const beta = [...new Set(rows.map(row => row.beta))]
        .sort((a, b) => a - b)

      if (rows.length !== 169 || gamma.length !== 13 || beta.length !== 13) {
        throw new Error(
          `Expected 169 grid points; received ${rows.length}`
        )
      }

      const lookup = new Map(
        rows.map(row => [`${row.gamma}|${row.beta}`, row.energy])
      )

      const z = beta.map(b =>
        gamma.map(g => {
          const energy = lookup.get(`${g}|${b}`)

          if (energy === undefined) {
            throw new Error('The CSV grid is incomplete')
          }

          return energy
        })
      )

      if (!cancelled) {
        setSurface({ gamma, beta, z })
        setSurfaceStatus('Loaded 169 calculated circuit evaluations')
      }
    } catch (error) {
      if (!cancelled) {
        setSurfaceStatus(`Could not load QAOA data: ${error.message}`)
      }
    }
  }

  loadLandscape()

  return () => {
    cancelled = true
  }
}, [])
  const metricChart = make3DBars(processors.map(p => ({ name: p.name, value: p[metric], color: p.color })))
  const hitNames = ['Processor B', 'Processor D', ...(showBaseline ? [baseline.name] : [])]
  const hitValues = [processors[0].hit, processors[1].hit, ...(showBaseline ? [baseline.hit] : [])]
  const hitColors = [C.blue, C.mint, ...(showBaseline ? [C.amber] : [])]
  const hitChart = make3DBars(hitNames.map((name, i) => ({ name, value: hitValues[i], color: hitColors[i] })))
  const nav = [{ label: 'Overview', id: 'overview' }, { label: 'Processor benchmarks', id: 'processor-benchmarks' }, { label: 'Solution quality', id: 'solution-quality' }, { label: 'DP table walkthrough', id: 'dp-walkthrough' }, { label: 'QAOA landscape', id: 'qaoa-landscape' }, { label: 'Repository figures', id: 'repository-figures' }]
  function goTo(item) {
    setActive(item.label)
    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const feasibleRows = [
    { name: 'Processor B', value: processors[0].feasible, color: C.blue },
    { name: 'Processor D', value: processors[1].feasible, color: C.mint },
    ...(showBaseline ? [{ name: baseline.name, value: baseline.feasible, color: C.amber }] : []),
  ]

  return <div className="app-shell">
    <aside className="sidebar" aria-label="Dashboard navigation">
      <a className="brand" href="#overview" onClick={() => setActive('Overview')} aria-label="Vincere Quantum Lab home">
        <span className="brand-mark">V</span><span className="brand-copy"><strong>VINCERE</strong><small>QUANTUM LAB</small></span>
      </a>
      <div className="side-label">PROJECT NAVIGATION</div>
      <nav className="nav-list">{nav.map((item, i) => <button key={item.id} className={`nav-item ${active === item.label ? 'selected' : ''}`} aria-current={active === item.label ? 'location' : undefined} onClick={() => goTo(item)}><span className="nav-index">0{i + 1}</span>{item.label}</button>)}</nav>
      <div className="sidebar-bottom"><span className="status-dot" /> <span>Experiment dataset</span><small>4,096 shots · Seed 42</small><small>Simulated noise model</small></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><div className="breadcrumb">RESEARCH / <strong>VINCERE KNAPSACK</strong></div><div className="dataset-label"><span className="status-dot" /> SIMULATION RUN · 42</div></header>
      <div className="page-wrap">
        <section id="overview" className="hero">
          <div className="hero-copy">
            <div className="eyebrow">QISKIT FALL FEST 2026 <span className="eyebrow-divider">/</span> TEAM VINCERE</div>
            <h1>Quantum<br /><em>optimization</em></h1>
            <p className="hero-intro">A reproducible look at QAOA for a resource-constrained 0/1 knapsack problem. Compare compiled circuit costs with noisy simulation outcomes and a classical random baseline.</p>
            <div className="hero-tags"><span>0/1 KNAPSACK</span><span>QUBO + QAOA</span><span>SYNTHETIC AER NOISE</span></div>
          </div>
          <aside className="hero-note"><div className="note-label">EXPERIMENT SCOPE</div><p>Five items</p><p>Capacity of 15</p><p>4,096 shots per configuration</p><a href="https://github.com/ashuuuk/Vincere_Knapsack" target="_blank" rel="noreferrer">Source code <span aria-hidden="true">↗</span></a></aside>
        </section>

        <section className="metrics-grid" aria-label="Experiment highlights">
          <Card className="metric-card"><div className="metric-head">BEST FEASIBLE VALUE</div><div className="metric-value">26<span className="metric-unit"> / 26</span></div><div className="metric-foot"><span className="pill good">OPTIMUM FOUND</span><span>Both processors</span></div></Card>
          <Card className="metric-card"><div className="metric-head">PROCESSOR D · DEPTH</div><div className="metric-value">227</div><div className="metric-foot"><span className="delta">−28.2%</span><span>vs Processor B</span></div></Card>
          <Card className="metric-card"><div className="metric-head">PROCESSOR D · CX GATES</div><div className="metric-value">98</div><div className="metric-foot"><span className="delta">−14.0%</span><span>vs Processor B</span></div></Card>
          <Card className="metric-card"><div className="metric-head">SHOTS PER CONFIGURATION</div><div className="metric-value">4,096</div><div className="metric-foot"><span className="pill neutral">SEED 42</span><span>Fixed sampling run</span></div></Card>
        </section>

        <div id="processor-benchmarks" className="section-anchor"><SectionTitle eyebrow="01 / CIRCUIT COST" title="Processor benchmarks" desc="Compiled resource estimates for the same problem. Smaller depth and CX count indicate a lighter compiled circuit." /></div>
        <div className="two-col benchmark-layout">
          <Card><div className="card-heading"><div><h3>Transpiled circuit metrics</h3><p>Change the measure to compare processors</p></div><label className="select-label">METRIC<select aria-label="Circuit metric" value={metric} onChange={e => setMetric(e.target.value)}><option value="depth">Circuit depth</option><option value="cx">CX gate count</option><option value="swaps">Estimated routing swaps</option></select></label></div><Plot data={metricChart} layout={{ ...layoutBase, margin:{l:0,r:0,t:8,b:0}, scene:{ ...sceneBase, xaxis:{ ...sceneBase.xaxis, tickvals:processors.map((_,i)=>i), ticktext:processors.map(p=>p.name) }, zaxis:{ ...sceneBase.zaxis, title:metric==='depth'?'Depth':metric==='cx'?'CX gates':'Estimated swaps' } } }} config={{ responsive: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'] }} style={{ width: '100%', height: '310px' }} useResizeHandler /></Card>
          <Card className="insight-card"><div className="card-heading"><div><h3>Reading the results</h3><p>What compilation metrics do and do not tell us</p></div><span className="section-number">01</span></div><div className="insight-list"><div className="insight"><span className="insight-number">A</span><div><b>Lower transpiled depth</b><p>Processor D depth is 227 versus 316 for Processor B, about 28.2% lower.</p></div></div><div className="insight"><span className="insight-number">B</span><div><b>Fewer CX operations</b><p>Processor D uses 98 CX gates versus 114, about 14.0% fewer.</p></div></div><div className="insight"><span className="insight-number">C</span><div><b>Cost is not solution quality</b><p>A smaller circuit does not guarantee a higher optimal-solution hit rate.</p></div></div></div></Card>
        </div>

        <div id="solution-quality" className="section-anchor"><SectionTitle eyebrow="02 / SOLUTION QUALITY" title="Sampling performance" desc="How often each method found an optimal-value sample, and how often samples satisfied the capacity constraint." /></div>
        <div className="two-col quality-layout">
          <Card><div className="card-heading"><div><h3>Optimal-value hit rate</h3><p>Share of all sampled shots with value 26</p></div><label className="toggle"><input type="checkbox" checked={showBaseline} onChange={e => setShowBaseline(e.target.checked)} /> Include random baseline</label></div><Plot data={hitChart} layout={{ ...layoutBase, margin:{l:0,r:0,t:8,b:0}, scene:{ ...sceneBase, xaxis:{ ...sceneBase.xaxis, tickvals:hitNames.map((_,i)=>i), ticktext:hitNames }, zaxis:{ ...sceneBase.zaxis, title:'Hit rate (%)' } } }} config={{ responsive: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'] }} style={{ width: '100%', height: '310px' }} useResizeHandler /><div className="chart-note"><span className="note-dot amber" /><span>The random baseline hit the optimum more often in this run. These results do not demonstrate quantum advantage.</span></div></Card>
          <Card><div className="card-heading"><div><h3>Feasible-shot rate</h3><p>Samples that satisfy the knapsack constraint</p></div><span className="section-number">02</span></div><Plot data={make3DBars(feasibleRows.map(x=>({name:x.name,value:x.value,color:x.color})))} layout={{ ...layoutBase, margin:{l:0,r:0,t:8,b:0}, scene:{ ...sceneBase, xaxis:{ ...sceneBase.xaxis, tickvals:feasibleRows.map((_,i)=>i), ticktext:feasibleRows.map(x=>x.name) }, zaxis:{ ...sceneBase.zaxis, title:'Feasible shots (%)' } } }} config={{responsive:true,displaylogo:false}} style={{width:'100%',height:'280px'}} useResizeHandler /><div className="sub-stat-grid"><div><span>Best feasible value</span><b>26</b></div><div><span>Capacity limit</span><b>15</b></div><div><span>Items in problem</span><b>5</b></div><div><span>QAOA depth p</span><b>1</b></div></div></Card>
        </div>


        <div id="dp-walkthrough" className="section-anchor"><SectionTitle eyebrow="03 / DYNAMIC PROGRAMMING" title="Build the DP table" desc="A cell-by-cell walkthrough of the classical 0/1 knapsack recurrence, including the include-versus-exclude decision at each cell." /></div>
        <KnapsackDP />

        <div id="qaoa-landscape" className="section-anchor"><SectionTitle eyebrow="04 / PARAMETER EXPLORATION" title="QAOA energy landscape" desc="Parameter-grid values from the repository's ideal p=1 statevector calculation." /></div>
        <Card className="landscape-card">
          <div className="card-heading">
            <div>
              <h3>Expected energy over γ and β</h3>
              <p>Ideal p=1 statevector · 13 × 13 parameter grid · QUBO objective</p>
            </div>
            <span className="pill neutral">CSV CALCULATED GRID</span>
          </div>
          <p className="body-copy" role="status">{surfaceStatus}</p>
          {surface.z.length > 0 && (
            <Plot
              data={[{
                type: 'surface',
                x: surface.gamma,
                y: surface.beta,
                z: surface.z,
                colorscale: [[0, '#E7E7E7'], [.5, '#D2D2D4'], [1, '#FF634A']],
                colorbar: {
                  title: { text: 'Expected energy', font: { color: '#242426' } },
                  tickfont: { color: '#242426' },
                  outlinewidth: 0
                }
              }]}
              layout={{
                ...layoutBase,
                margin: { l: 0, r: 0, t: 10, b: 0 },
                scene: {
                  bgcolor: 'rgba(0,0,0,0)',
                  xaxis: {
                    title: 'Gamma (γ)',
                    gridcolor: 'rgba(36,36,38,.14)',
                    color: '#242426'
                  },
                  yaxis: {
                    title: 'Beta (β)',
                    gridcolor: 'rgba(36,36,38,.14)',
                    color: '#242426'
                  },
                  zaxis: {
                    title: 'Expected QUBO energy',
                    gridcolor: 'rgba(36,36,38,.14)',
                    color: '#242426'
                  },
                  camera: { eye: { x: 1.55, y: 1.55, z: 1.05 } },
                  dragmode: 'orbit',
                  uirevision: 'qaoa-landscape-view',
                  aspectmode: 'manual',
                  aspectratio: { x: 1.2, y: 1, z: 0.7 }
                }
              }}
              config={{ responsive: true, displaylogo: false }}
              style={{ width: '100%', height: '420px' }}
              useResizeHandler
            />
          )}
          <div className="chart-note">
            <span className="note-dot" />
            <span>
              Values are loaded from the local CSV generated by the project's circuit/statevector calculation, not noisy-shot measurements or hardware results. The saved optimizer minimum and this grid still need reconciliation before the minimum is presented as validated.
            </span>
          </div>
        </Card>

        <div id="repository-figures" className="section-anchor"><SectionTitle eyebrow="05 / REPOSITORY OUTPUTS" title="Figures generated by the experiment" desc="Original figure assets from the repository, alongside the interactive 3D benchmark charts above." /></div>
        <div className="repo-figures-grid">
          <Card className="repo-figure-card"><div className="card-heading"><div><h3>Processor comparison</h3><p>Original figure from Phase2/results/figures</p></div><a className="small-source-link" href="https://github.com/ashuuuk/Vincere_Knapsack/blob/main/Phase2/results/figures/processor_comparison.png" target="_blank" rel="noreferrer">Open source ↗</a></div><a className="figure-image-link" href="https://github.com/ashuuuk/Vincere_Knapsack/blob/main/Phase2/results/figures/processor_comparison.png" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/ashuuuk/Vincere_Knapsack/main/Phase2/results/figures/processor_comparison.png" alt="Original processor comparison figure generated by the experiment" loading="lazy" onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling.style.display='block' }} /><span className="figure-fallback">Could not load this image from GitHub. Use “Open source” to inspect the repository file.</span></a></Card>
          <Card className="repo-figure-card"><div className="card-heading"><div><h3>Processor D coupling map</h3><p>Original topology figure from the experiment</p></div><a className="small-source-link" href="https://github.com/ashuuuk/Vincere_Knapsack/blob/main/Phase2/results/figures/processor_D_coupling.png" target="_blank" rel="noreferrer">Open source ↗</a></div><a className="figure-image-link" href="https://github.com/ashuuuk/Vincere_Knapsack/blob/main/Phase2/results/figures/processor_D_coupling.png" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/ashuuuk/Vincere_Knapsack/main/Phase2/results/figures/processor_D_coupling.png" alt="Original Processor D coupling map generated by the experiment" loading="lazy" onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling.style.display='block' }} /><span className="figure-fallback">Could not load this image from GitHub. Use “Open source” to inspect the repository file.</span></a></Card>
        </div>
        <div className="data-source-note">The interactive charts use the recorded benchmark values. Original figure images load from the repository’s main branch; if the branch or paths differ, update the image URLs.</div>

        <div className="closing-grid"><Card className="problem-card"><div className="eyebrow">PROBLEM DEFINITION</div><h3 className="close-heading">0/1 Knapsack</h3><p className="body-copy">Select items to maximize total value while keeping total weight within the capacity limit.</p><div className="problem-stats"><div><span>Values</span><b>[10, 4, 7, 5, 8]</b></div><div><span>Weights</span><b>[5, 3, 4, 2, 6]</b></div><div><span>Capacity</span><b>15</b></div><div><span>Exact optimum</span><b>26 value · weight 14</b></div></div></Card><Card className="conclusion-card"><div className="eyebrow">CONCLUSION</div><h3 className="close-heading">Compilation improved.<br /><em>Quantum advantage not shown.</em></h3><p className="body-copy">Processor D has lower transpiled depth and CX count in this experiment. The random baseline achieved a higher optimal-value hit rate, so both findings matter when interpreting these results.</p><a className="repo-link" href="https://github.com/ashuuuk/Vincere_Knapsack" target="_blank" rel="noreferrer">Explore the experiment repository <span aria-hidden="true">↗</span></a></Card></div>
        <footer><div className="footer-brand"><span className="brand-mark small">V</span><span>VINCERE QUANTUM LAB</span></div><span>Qiskit Fall Fest 2026 · Team Vincere</span><span>Simulated data · Not hardware results</span></footer>
      </div>
    </main>
  </div>
}
