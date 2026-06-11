import React from 'react';

interface CalculatorProps {
  inputs: {
    transportKm: number;
    vehicleType: string;
    electricityKwh: number;
    dietType: string;
  };
  onChange: (key: string, value: string | number) => void;
}

export default function Calculator({ inputs, onChange }: CalculatorProps) {
  return (
    <div className="calculator-grid">
      {/* TRANSPORTATION CARD */}
      <div className="calc-card">
        <div className="calc-title">
          <span>🚗</span> Transportation Travel
        </div>

        <div className="input-group">
          <div className="input-label">
            <span>Weekly Mileage</span>
            <strong>{inputs.transportKm} km</strong>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            className="slider-styled"
            value={inputs.transportKm}
            onChange={(e) => onChange('transportKm', parseInt(e.target.value))}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Vehicle Fuel Core</label>
          <select
            className="select-styled"
            value={inputs.vehicleType}
            onChange={(e) => onChange('vehicleType', e.target.value)}
          >
            <option value="petrol">Petrol Car (0.17 kg CO2/km)</option>
            <option value="diesel">Diesel Car (0.19 kg CO2/km)</option>
            <option value="hybrid">Hybrid Engine (0.11 kg CO2/km)</option>
            <option value="electric">Electric Vehicle (0.05 kg CO2/km)</option>
            <option value="public">Metro & Bus Transit (0.03 kg CO2/km)</option>
          </select>
        </div>
      </div>

      {/* UTILITIES & ENERGY CARD */}
      <div className="calc-card">
        <div className="calc-title">
          <span>⚡</span> Home Utility Grid
        </div>

        <div className="input-group">
          <div className="input-label">
            <span>Monthly Grid Usage</span>
            <strong>{inputs.electricityKwh} kWh</strong>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="20"
            className="slider-styled"
            value={inputs.electricityKwh}
            onChange={(e) => onChange('electricityKwh', parseInt(e.target.value))}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Household Diet Basis</label>
          <select
            className="select-styled"
            value={inputs.dietType}
            onChange={(e) => onChange('dietType', e.target.value)}
          >
            <option value="meat">Meat Heavy Basis (3.3 kg CO2/day)</option>
            <option value="lowmeat">Low Meat / Balanced (2.2 kg CO2/day)</option>
            <option value="vegetarian">Vegetarian Regime (1.5 kg CO2/day)</option>
            <option value="vegan">Vegan Diet Plan (0.9 kg CO2/day)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
