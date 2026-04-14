import React, { useState, useEffect } from 'react';
import { create } from 'zustand';
import styled, { createGlobalStyle } from 'styled-components';

// --- 1. MOCK DATA (JSON Format) ---
const DATABASE = {
  giftCards: [
    { code: "GIFT-10", value: 10, currency: "USD" },
    { code: "GIFT-50", value: 50, currency: "USD" },
    { code: "GIFT-100", value: 100, currency: "USD" }
  ],
  channels: [
    { serial: "CH-001", name: "Anonymous Creator A", avatar: "🛡️" },
    { serial: "CH-002", name: "Silent Tech Reviews", avatar: "💻" },
    { serial: "CH-003", name: "The Private Chef", avatar: "🍳" }
  ]
};

// --- 2. ZUSTAND STORE ---
const usePrivateStore = create((set) => ({
  history: JSON.parse(localStorage.getItem('txn_history')) || [],
  receipt: null,
  isProcessing: false,

  processPrivateDonation: async (cardCode, serial, message) => {
    set({ isProcessing: true });
    await new Promise(r => setTimeout(r, 1500));

    const card = DATABASE.giftCards.find(c => c.code === cardCode);
    const channel = DATABASE.channels.find(ch => ch.serial === serial);

    if (card && channel) {
      const newEntry = {
        id: `SECURE-${Math.floor(Math.random() * 9999)}`,
        amount: card.value,
        to: channel.name,
        msg: message || "No private message attached.",
        date: new Date().toLocaleString(),
        color: card.value >= 100 ? '#ffd700' : card.value >= 50 ? '#ff4444' : '#4ca1af'
      };

      set((state) => {
        const updatedHistory = [newEntry, ...state.history];
        localStorage.setItem('txn_history', JSON.stringify(updatedHistory));
        return { receipt: newEntry, history: updatedHistory, isProcessing: false };
      });
    } else {
      set({ isProcessing: false });
      alert("Invalid Card or Serial Number.");
    }
  },
  reset: () => set({ receipt: null })
}));

// --- 3. STYLED COMPONENTS ---
const GlobalStyle = createGlobalStyle`
  body { margin: 0; background: #050505; color: #e0e0e0; font-family: sans-serif; }
`;

const Layout = styled.div`
  display: flex; flex-direction: column; align-items: center; padding: 20px; min-height: 100vh;
`;

const Container = styled.div`
  width: 100%; max-width: 400px; background: #121212; border-radius: 20px; padding: 2rem;
  border: 1px solid #222; box-shadow: 0 10px 50px rgba(0,0,0,0.9);
`;

const Input = styled.input`
  width: 100%; padding: 12px; margin: 10px 0; background: #1a1a1a; border: 1px solid #333;
  border-radius: 8px; color: white; box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%; padding: 12px; margin: 10px 0; background: #1a1a1a; border: 1px solid #333;
  border-radius: 8px; color: white; height: 80px; box-sizing: border-box; resize: none;
`;

const PrimaryButton = styled.button`
  width: 100%; padding: 15px; background: #fff; color: #000; border: none;
  border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px;
  &:hover { background: #ccc; }
`;

const Receipt = styled.div`
  background: ${props => props.color || '#fff'}; color: #000; padding: 20px;
  border-radius: 12px; margin-top: 20px; position: relative;
  &::after { content: '🔒 END-TO-END PRIVATE'; position: absolute; top: 10px; right: 10px; font-size: 0.6rem; opacity: 0.6; }
`;

const HistoryItem = styled.div`
  width: 100%; max-width: 400px; padding: 15px; background: #1a1a1a; 
  margin-top: 10px; border-radius: 10px; font-size: 0.8rem; border-left: 4px solid #444;
`;

// --- 4. MAIN APP ---
export default function App() {
  const [form, setForm] = useState({ code: '', serial: '', msg: '' });
  const { processPrivateDonation, receipt, isProcessing, reset, history } = usePrivateStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    processPrivateDonation(form.code, form.serial, form.msg);
  };

  return (
    <Layout>
      <GlobalStyle />
      <Container>
        <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Private Superchat</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem', marginBottom: '20px' }}>
          Off-the-record creator support.
        </p>

        {!receipt ? (
          <form onSubmit={handleSubmit}>
            <Input placeholder="Card Code (GIFT-10, GIFT-50, GIFT-100)" 
              onChange={e => setForm({...form, code: e.target.value})} required />
            <Input placeholder="Channel Serial (CH-001, CH-002, CH-003)" 
              onChange={e => setForm({...form, serial: e.target.value})} required />
            <TextArea placeholder="Private message for the creator..." 
              onChange={e => setForm({...form, msg: e.target.value})} />
            
            <PrimaryButton type="submit" disabled={isProcessing}>
              {isProcessing ? 'Encrypting Transfer...' : 'Send Privately'}
            </PrimaryButton>
          </form>
        ) : (
          <>
            <Receipt color={receipt.color}>
              <h3 style={{marginTop: 0}}>Approved Transfer</h3>
              <p><strong>To:</strong> {receipt.to}</p>
              <p><strong>Amount:</strong> ${receipt.amount}.00</p>
              <p style={{fontStyle: 'italic'}}>"{receipt.msg}"</p>
              <small>{receipt.date}</small>
            </Receipt>
            <PrimaryButton onClick={reset} style={{background: '#333', color: '#fff'}}>
              Send Another
            </PrimaryButton>
          </>
        )}
      </Container>

      {history.length > 0 && (
        <div style={{ width: '100%', maxWidth: '400px', marginTop: '40px' }}>
          <h4 style={{ color: '#444' }}>YOUR PRIVATE HISTORY</h4>
          {history.map(item => (
            <HistoryItem key={item.id}>
              <strong>{item.to}</strong> - ${item.amount} <br/>
              <span style={{color: '#888'}}>{item.date}</span>
            </HistoryItem>
          ))}
        </div>
      )}
    </Layout>
  );
}