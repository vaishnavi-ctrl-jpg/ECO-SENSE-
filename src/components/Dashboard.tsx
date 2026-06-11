import React from 'react';

interface DashboardProps {
  totalEmissions: number;
  totalOffsets: number;
  nationalBaseline: number;
  globalTarget: number;
}

export default function Dashboard({ totalEmissions, totalOffsets, nationalBaseline, globalTarget }: DashboardProps) {
  const dailyBudget = 5.0; // 5 kg CO2 budget target to limit global warming
  const finalEmissions = Math.max(0, parseFloat((totalEmissions - totalOffsets).toFixed(2)));
  const percentageUsed = Math.min(100, Math.round((finalEmissions / dailyBudget) * 100));
  
  // Calculate projected annual footprint in Tonnes (daily final * 365 / 1000)
  const annualProjected = parseFloat(((finalEmissions * 365) / 1000).toFixed(2));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TOP METRIC CARDS */}
      <div className="stats-banner">
        
        {/* CARBON CLOCK CARD */}
        <div className="glass-stat-card">
          <span className="stat-title">Daily Carbon Clock</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span className="stat-value">{finalEmissions}</span>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>kg CO2e</span>
          </div>
          <div className="progress-bar-container" style={{ margin: '8px 0 4px 0' }}>
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${percentageUsed}%`,
                background: finalEmissions > dailyBudget ? 'var(--danger)' : 'linear-gradient(90deg, #10b981, #059669)'
              }}
            ></div>
          </div>
          <span className="stat-subtitle" style={{ color: finalEmissions > dailyBudget ? 'var(--danger)' : 'var(--emerald-primary)' }}>
            {percentageUsed}% of daily budget ({dailyBudget} kg) utilized
          </span>
        </div>

        {/* ECO OFFSETS CARD */}
        <div className="glass-stat-card">
          <span className="stat-title">Eco Offsets Logged</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span className="stat-value" style={{ color: 'var(--gold-accent)' }}>-{totalOffsets.toFixed(2)}</span>
            <span style={{ fontSize: '14px', color: 'var(--gold-accent)' }}>kg CO2e</span>
          </div>
          <div className="progress-bar-container" style={{ margin: '8px 0 4px 0', background: 'rgba(255,255,255,0.02)' }}>
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${Math.min(100, Math.round((totalOffsets / dailyBudget) * 100))}%`,
                background: 'linear-gradient(90deg, #dfba6b, #c5a059)'
              }}
            ></div>
          </div>
          <span className="stat-subtitle" style={{ color: 'var(--gold-accent)' }}>
            Reduction applied to active daily carbon footprint
          </span>
        </div>

      </div>

      {/* COMPARATIVE CLIMATE FOOTPRINT INDEX */}
      <div className="compare-container">
        <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '13.5px', fontWeight: 700, color: '#fff' }}>
          Climate Footprint Benchmarks
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
          <div className="compare-row">
            <span style={{ color: 'var(--text-secondary)' }}>Your Projected Footprint:</span>
            <strong style={{ color: annualProjected <= globalTarget ? 'var(--emerald-primary)' : 'var(--danger)' }}>
              {annualProjected} Tonnes / Year
            </strong>
          </div>
          <div className="compare-row">
            <span style={{ color: 'var(--text-secondary)' }}>Indian National Average:</span>
            <strong>{nationalBaseline} Tonnes / Year</strong>
          </div>
          <div className="compare-row">
            <span style={{ color: 'var(--text-secondary)' }}>Global Sustainable Target:</span>
            <strong style={{ color: 'var(--gold-accent)' }}>{globalTarget} Tonnes / Year</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
