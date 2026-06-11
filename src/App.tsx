import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import HabitTracker from './components/HabitTracker';
import ChartView from './components/ChartView';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Habit {
  id: string;
  name: string;
  offset: number;
  completed: boolean;
}

export default function App() {
  // --------------------------------------------------
  // ⚙️ APP STATE
  // --------------------------------------------------
  const [inputs, setInputs] = useState({
    transportKm: 80,
    vehicleType: 'petrol',
    electricityKwh: 240,
    dietType: 'lowmeat'
  });

  // What-If Simulation Sliders
  const [simulation, setSimulation] = useState({
    solarShare: 0,      // 0% to 100% (reduces electricity emissions)
    evShare: 0,         // 0% to 100% (shifts petrol/diesel travel to EV equivalent)
    meatlessDays: 0     // 0 to 7 days/week (reduces diet emissions)
  });

  // Daily Habits checklist
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Walked or cycled under 3km instead of driving', offset: 1.2, completed: false },
    { id: '2', name: 'Unplugged standby electronics overnight', offset: 0.5, completed: false },
    { id: '3', name: 'Had a strictly plant-based/vegan day', offset: 2.0, completed: false },
    { id: '4', name: 'Used reusable grocery canvas bags', offset: 0.3, completed: false },
    { id: '5', name: 'Switched off non-essential lights and AC', offset: 0.8, completed: false }
  ]);

  // Conversational AI (Gemini) states
  const [geminiKey, setGeminiKey] = useState<string>(() => {
    return localStorage.getItem('GEMINI_API_KEY') || '';
  });
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'assistant', content: 'Hello Vaishnavi! I am your AI Eco-CoPilot. Ask me anything about calculating, simulating, or reducing your carbon footprint today.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Benchmarks
  const nationalBaseline = 1.9; // Indian Avg (tonnes/year)
  const globalTarget = 2.0;    // Target Limit (tonnes/year)

  // --------------------------------------------------
  // 🧮 CARBON CALCULATIONS & FACTORS
  // --------------------------------------------------
  // Travel factor: kg CO2 per km
  const getTravelFactor = (type: string) => {
    switch (type) {
      case 'petrol': return 0.17;
      case 'diesel': return 0.19;
      case 'hybrid': return 0.11;
      case 'electric': return 0.05;
      case 'public': return 0.03;
      default: return 0.17;
    }
  };

  // Diet factor: daily kg CO2
  const getDietFactor = (type: string) => {
    switch (type) {
      case 'meat': return 3.3;
      case 'lowmeat': return 2.2;
      case 'vegetarian': return 1.5;
      case 'vegan': return 0.9;
      default: return 2.2;
    }
  };

  // 1. Calculate Base Transport CO2/day
  const baseTravelFactor = getTravelFactor(inputs.vehicleType);
  const simulatedTravelFactor = inputs.vehicleType === 'electric' 
    ? 0.05 
    : (baseTravelFactor * (1 - simulation.evShare / 100)) + (0.05 * (simulation.evShare / 100));
  
  // Daily travel = weekly km / 7 days
  const dailyTravelEmissions = parseFloat(((inputs.transportKm / 7) * simulatedTravelFactor).toFixed(2));

  // 2. Calculate Base Electricity CO2/day (electricity factor: 0.8 kg per kWh)
  // Daily electricity = monthly kWh / 30 days
  const baseElectricityEmissions = (inputs.electricityKwh / 30) * 0.8;
  const dailyElectricityEmissions = parseFloat((baseElectricityEmissions * (1 - simulation.solarShare / 100)).toFixed(2));

  // 3. Calculate Base Diet CO2/day
  const baseDietEmissions = getDietFactor(inputs.dietType);
  // Shift diet based on meatless days (reduces factor to vegetarian if meat-heavy or vegan if vegetarian)
  const dietSavingPerDay = (simulation.meatlessDays / 7) * (baseDietEmissions - 0.9);
  const dailyDietEmissions = parseFloat(Math.max(0.9, baseDietEmissions - dietSavingPerDay).toFixed(2));

  const totalEmissions = dailyTravelEmissions + dailyElectricityEmissions + dailyDietEmissions;

  // 4. Calculate total offsets logged
  const totalOffsets = habits
    .filter(h => h.completed)
    .reduce((sum, h) => sum + h.offset, 0);

  const finalEmissions = Math.max(0, totalEmissions - totalOffsets);
  const annualProjected = parseFloat(((finalEmissions * 365) / 1000).toFixed(2));

  // --------------------------------------------------
  // 🎖️ ACHIEVEMENTS & BADGES SYSTEM
  // --------------------------------------------------
  const badges = [
    { id: 'commuter', icon: '🚲', label: 'Green Commuter', unlocked: inputs.transportKm < 50 || inputs.vehicleType === 'public' || inputs.vehicleType === 'electric' },
    { id: 'solar', icon: '☀️', label: 'Solar Pioneer', unlocked: simulation.solarShare >= 50 },
    { id: 'diet', icon: '🥗', label: 'Plant Champion', unlocked: inputs.dietType === 'vegan' || simulation.meatlessDays >= 3 },
    { id: 'offset', icon: '🌳', label: 'Offset Hero', unlocked: totalOffsets >= 3.0 }
  ];

  // --------------------------------------------------
  // 🤝 GEMINI INTERACTIVE COPILOT PIPELINE
  // --------------------------------------------------
  const handleSaveKey = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('GEMINI_API_KEY', geminiKey);
    alert('Gemini API key updated successfully!');
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userText }]);
    setIsTyping(true);

    if (!geminiKey.trim()) {
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: '⚠️ API Key is missing. Please paste your Google AI Studio API key in the bottom sidebar settings panel to connect me to Gemini.'
        }]);
        setIsTyping(false);
      }, 800);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      // Using gemini-1.5-flash for rapid processing
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: `You are "Eco-CoPilot", a friendly, scientific sustainability advisor on the EcoSense platform.
        You assist Vaishnavi (the user) in tracking carbon emissions and understanding green alternatives.
        Current User Stats:
        - Daily Carbon Score: ${finalEmissions.toFixed(2)} kg CO2 (Target limit: 5kg/day)
        - Annual Projected Footprint: ${annualProjected.toFixed(2)} Tonnes/year
        - Top Badges Unlocked: ${badges.filter(b => b.unlocked).map(b => b.label).join(', ') || 'None yet'}
        
        Keep answers encouraging, actionable, and backed by carbon lifecycle assessments. Refer to Vaishnavi by name occasionally.`
      });

      const response = await model.generateContent(userText);
      const botReply = response.response.text();
      setChatHistory(prev => [...prev, { role: 'assistant', content: botReply }]);
    } catch (err: any) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: `❌ Error communicating with Gemini API: ${err?.message || 'Check your internet connection and API key validity.'}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Handle input changes
  const handleInputChange = (key: string, value: string | number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  // Generate LinkedIn template
  const getLinkedInText = () => {
    return encodeURIComponent(`🌱 I am building my carbon savings in public using EcoSense! 
My daily carbon footprint is down to ${finalEmissions.toFixed(2)} kg CO2 today (saving ${totalOffsets.toFixed(1)} kg from eco-offsets).
Unlocking new badges like: ${badges.filter(b => b.unlocked).map(b => b.label).join(', ')}.
Let's build a greener future! #PromptWars #BuildInPublic #Sustainability`);
  };

  return (
    <div className="app-container">
      
      {/* LEFT COLUMN: SIDEBAR */}
      <aside className="app-sidebar">
        
        <div className="sidebar-header">
          <div className="brand-logo-circle">E</div>
          <span className="brand-title">EcoSense</span>
        </div>

        {/* Profile Card */}
        <div className="sidebar-profile-card">
          <div className="user-avatar">
            👤
            <div className="status-dot"></div>
          </div>
          <div className="profile-info">
            <span className="profile-name">Vaishnavi</span>
            <span className="profile-tier">Climate Guardian</span>
          </div>
          <span className="profile-chevron">&gt;</span>
        </div>

        {/* Achievements Rack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span className="section-label">Unlocked Badges</span>
          <div className="badge-rack">
            {badges.map(b => (
              <div key={b.id} className={`eco-badge ${b.unlocked ? 'unlocked' : ''}`}>
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Build-in-Public LinkedIn Share */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span className="section-label">Build in Public</span>
          <div className="compare-container" style={{ background: 'rgba(223, 186, 107, 0.02)', borderColor: 'rgba(223, 186, 107, 0.15)' }}>
            <span style={{ fontSize: '11px', color: 'var(--gold-accent)', fontWeight: 'bold' }}>📢 LinkedIn Progress Update</span>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '6px 0 10px 0', lineHeight: 1.4 }}>
              Share your eco accomplishments directly on LinkedIn to earn community credits!
            </p>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://promptwars.in&text=${getLinkedInText()}`}
              target="_blank" 
              rel="noreferrer"
              style={{
                background: 'linear-gradient(135deg, #dfba6b 0%, #c5a059 100%)',
                color: '#09090b',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
                display: 'block'
              }}
            >
              Share to LinkedIn
            </a>
          </div>
        </div>

        {/* Settings API Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
          <span className="section-label">API Configuration</span>
          <form onSubmit={handleSaveKey} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <input
              type="password"
              placeholder="Paste Gemini API Key..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              style={{
                background: '#111',
                border: '1px solid var(--border-emerald)',
                color: '#fff',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--border-emerald-active)',
                color: 'var(--emerald-primary)',
                padding: '8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Save API Key
            </button>
          </form>
        </div>

      </aside>

      {/* CENTER COLUMN: DYNAMIC CALCULATORS AND SIMULATOR */}
      <main className="center-content-panel">
        
        {/* TOP DASHBOARD METRICS */}
        <Dashboard 
          totalEmissions={totalEmissions}
          totalOffsets={totalOffsets}
          nationalBaseline={nationalBaseline}
          globalTarget={globalTarget}
        />

        {/* LIVE CHART & CALCULATORS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <ChartView 
            transport={dailyTravelEmissions}
            energy={dailyElectricityEmissions}
            diet={dailyDietEmissions}
          />
          
          <Calculator 
            inputs={inputs}
            onChange={handleInputChange}
          />

        </div>

        {/* WHAT-IF SIMULATOR */}
        <div className="simulator-card">
          <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📊</span> Interactive "What-If" Simulator
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Drag variables below to model how solar transition, electric vehicles, or dietary changes will impact your future emissions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <div className="input-group">
              <div className="input-label">
                <span>Solar panels energy offset share</span>
                <strong>{simulation.solarShare}% reduction</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                className="slider-styled"
                value={simulation.solarShare}
                onChange={(e) => setSimulation(prev => ({ ...prev, solarShare: parseInt(e.target.value) }))}
              />
            </div>

            <div className="input-group">
              <div className="input-label">
                <span>EV transition target</span>
                <strong>{simulation.evShare}% electric shift</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                className="slider-styled"
                value={simulation.evShare}
                onChange={(e) => setSimulation(prev => ({ ...prev, evShare: parseInt(e.target.value) }))}
              />
            </div>

            <div className="input-group">
              <div className="input-label">
                <span>Meat-free days per week</span>
                <strong>{simulation.meatlessDays} days</strong>
              </div>
              <input
                type="range"
                min="0"
                max="7"
                step="1"
                className="slider-styled"
                value={simulation.meatlessDays}
                onChange={(e) => setSimulation(prev => ({ ...prev, meatlessDays: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        {/* DALLY OFFSETS HABITS TRACKER */}
        <HabitTracker 
          habits={habits}
          onToggle={handleToggleHabit}
        />

      </main>

      {/* RIGHT COLUMN: AI ECO-COPILOT CHAT PANEL */}
      <section className="chat-panel-container">
        
        <div className="chat-header">
          <span className="chat-title">AI Eco-CoPilot</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Gemini active</span>
        </div>

        <div className="chat-feed">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`chat-msg-row ${msg.role === 'user' ? 'user' : 'bot'}`}>
              <div className="chat-avatar">{msg.role === 'user' ? 'U' : 'E'}</div>
              <div className="chat-bubble">{msg.content}</div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-msg-row bot" style={{ opacity: 0.6 }}>
              <div className="chat-avatar">E</div>
              <div className="chat-bubble">Eco-CoPilot is evaluating climate records...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-area">
          <form onSubmit={handleSendChat} className="chat-input-box">
            <input
              type="text"
              className="chat-text-input"
              placeholder="Ask about carbon reduction tips..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="chat-send-btn" disabled={isTyping}>
              🪶
            </button>
          </form>
        </div>

      </section>

    </div>
  );
}
