import React from 'react';

interface ChartViewProps {
  transport: number;
  energy: number;
  diet: number;
}

export default function ChartView({ transport, energy, diet }: ChartViewProps) {
  const total = transport + energy + diet || 1;
  const pctTransport = Math.round((transport / total) * 100);
  const pctEnergy = Math.round((energy / total) * 100);
  const pctDiet = Math.round((diet / total) * 100);

  // SVG parameters for donut chart segments
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffsetTransport = circumference - (pctTransport / 100) * circumference;
  const strokeDashoffsetEnergy = circumference - (pctEnergy / 100) * circumference;
  const strokeDashoffsetDiet = circumference - (pctDiet / 100) * circumference;

  return (
    <div className="chart-card" style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', fontWeight: 700, color: '#fff' }}>Emissions Mix</h4>
        <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Live breakdown of carbon source pools</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Transport: <strong>{pctTransport}%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Energy: <strong>{pctEnergy}%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Diet & Food: <strong>{pctDiet}%</strong></span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <svg className="donut-chart-svg" viewBox="0 0 100 100" style={{ width: '120px', height: '120px' }}>
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#222" strokeWidth="10" />
          
          {/* Transport Segment */}
          <circle
            className="donut-segment"
            cx="50"
            cy="50"
            r={radius}
            stroke="#3b82f6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffsetTransport}
          />
          
          {/* Energy Segment */}
          <circle
            className="donut-segment"
            cx="50"
            cy="50"
            r={radius}
            stroke="#10b981"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffsetEnergy}
            style={{ transform: `rotate(${pctTransport * 3.6}deg)`, transformOrigin: '50px 50px' }}
          />

          {/* Diet Segment */}
          <circle
            className="donut-segment"
            cx="50"
            cy="50"
            r={radius}
            stroke="#f59e0b"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffsetDiet}
            style={{ transform: `rotate(${(pctTransport + pctEnergy) * 3.6}deg)`, transformOrigin: '50px 50px' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '13.5px', fontWeight: 'bold', color: '#fff' }}>
          🌱
        </div>
      </div>
    </div>
  );
}
