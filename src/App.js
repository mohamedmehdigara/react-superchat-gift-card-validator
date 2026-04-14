import React, { useState } from 'react';
import { create } from 'zustand';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// --- 1. FICTIONAL DATA ---
const GIFT_CARDS = [
  { id: 'gc1', code: "GIFT-10-DISCREET", value: 10, color: '#4ca1af' },
  { id: 'gc2', code: "GIFT-50-PRIVATE", value: 50, color: '#ff4444' },
  { id: 'gc3', code: "GIFT-100-ELITE", value: 100, color: '#ffd700' }
];

const CHANNELS = [
  { id: 'ch1', serial: "CH-SEC-01", name: "The Quiet Educator", icon: "🛡️" },
  { id: 'ch2', serial: "CH-SEC-02", name: "Hidden Tech Labs", icon: "📡" },
  { id: 'ch3', serial: "CH-SEC-03", name: "Anonymous Gamer", icon: "🎮" }
];

// --- 2. ZUSTAND STORE ---
const useFlowStore = create((set) => ({
  step: 1,
  selectedCard: null,
  selectedChannel: null,
  receipt: null,

  setStep: (s) => set({ step: s }),
  selectCard: (card) => set({ selectedCard: card, step: 2 }),
  selectChannel: (channel) => set({ selectedChannel: channel, step: 3 }),
  
  confirmTransfer: (message) => set((state) => ({
    step: 4,
    receipt: {
      id: `TXN-${Math.floor(Math.random() * 88888 + 11111)}`,
      amount: state.selectedCard.value,
      to: state.selectedChannel.name,
      msg: message || "Private support sent.",
      date: new Date().toLocaleString()
    }
  })),

  reset: () => set({ step: 1, selectedCard: null, selectedChannel: null, receipt: null })
}));

// --- 3. STYLED COMPONENTS ---
const GlobalStyle = createGlobalStyle`
  body { margin: 0; background: #080808; color: #fff; font-family: 'Inter', sans-serif; }
`;

const AppWrapper = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;
`;

const MainCard = styled.div`
  width: 100%; max-width: 400px; background: #111; border: 1px solid #222; border-radius: 24px; padding: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
`;

const ListButton = styled.button`
  width: 100%; padding: 16px; margin: 8px 0; background: #1a1a1a; border: 1px solid #333; border-radius: 12px;
  color: white; text-align: left; cursor: pointer; transition: all 0.2s;
  display: flex; justify-content: space-between; align-items: center;
  &:hover { background: #222; border-color: #555; transform: translateX(5px); }
`;

const Badge = styled.span`
  background: ${props => props.color || '#444'}; color: #000; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.8rem;
`;

const ProgressDots = styled.div`
  display: flex; justify-content: center; gap: 8px; margin-bottom: 20px;
  div { width: 8px; height: 8px; border-radius: 50%; background: #333; }
  .active { background: #ff0000; box-shadow: 0 0 10px #ff0000; }
`;

const ReceiptView = styled.div`
  background: #fff; color: #000; padding: 24px; border-radius: 16px; margin-top: 10px;
  font-family: 'Courier New', Courier, monospace; border-top: 8px solid #4caf50;
`;

// --- 4. MAIN COMPONENT ---
export default function App() {
  const { step, selectedCard, selectedChannel, receipt, selectCard, selectChannel, confirmTransfer, reset } = useFlowStore();
  const [msg, setMsg] = useState('');

  return (
    <AppWrapper>
      <GlobalStyle />
      <MainCard>
        {step < 4 && (
          <ProgressDots>
            <div className={step >= 1 ? 'active' : ''} />
            <div className={step >= 2 ? 'active' : ''} />
            <div className={step >= 3 ? 'active' : ''} />
          </ProgressDots>
        )}

        {step === 1 && (
          <>
            <h2 style={{textAlign: 'center'}}>Select a Gift Card</h2>
            <p style={{fontSize: '0.8rem', color: '#666', textAlign: 'center'}}>Available in grocery stores</p>
            {GIFT_CARDS.map(card => (
              <ListButton key={card.id} onClick={() => selectCard(card)}>
                <span>{card.code}</span>
                <Badge color={card.color}>${card.value}</Badge>
              </ListButton>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{textAlign: 'center'}}>Choose Creator</h2>
            <p style={{fontSize: '0.8rem', color: '#666', textAlign: 'center'}}>Direct & Private Support</p>
            {CHANNELS.map(ch => (
              <ListButton key={ch.id} onClick={() => selectChannel(ch)}>
                <span>{ch.icon} {ch.name}</span>
                <span style={{fontSize: '0.7rem', color: '#888'}}>{ch.serial}</span>
              </ListButton>
            ))}
            <button onClick={() => useFlowStore.getState().setStep(1)} style={{background: 'none', border: 'none', color: '#888', marginTop: '10px', cursor: 'pointer'}}>← Go Back</button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{textAlign: 'center'}}>Confirm Transfer</h2>
            <div style={{background: '#1a1a1a', padding: '15px', borderRadius: '10px', marginBottom: '15px'}}>
              <p style={{margin: '5px 0'}}><strong>From:</strong> {selectedCard.code}</p>
              <p style={{margin: '5px 0'}}><strong>To:</strong> {selectedChannel.name}</p>
              <p style={{margin: '5px 0'}}><strong>Amount:</strong> <span style={{color: selectedCard.color}}>${selectedCard.value}.00</span></p>
            </div>
            <textarea 
              placeholder="Add a private note (Optional)"
              style={{width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', boxSizing: 'border-box'}}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button 
              onClick={() => confirmTransfer(msg)}
              style={{width: '100%', padding: '15px', background: '#ff0000', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '15px', fontWeight: 'bold', cursor: 'pointer'}}
            >
              Confirm Private Donation
            </button>
          </>
        )}

        {step === 4 && receipt && (
          <>
            <h2 style={{textAlign: 'center', color: '#4caf50'}}>Transfer Approved</h2>
            <ReceiptView>
              <div style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '10px'}}>OFFICIAL RECEIPT</div>
              <p>ID: {receipt.id}</p>
              <p>CHANNEL: {receipt.to}</p>
              <p>AMOUNT: ${receipt.amount}.00</p>
              <p>NOTE: "{receipt.msg}"</p>
              <div style={{fontSize: '0.7rem', marginTop: '20px', textAlign: 'center'}}>{receipt.date}</div>
            </ReceiptView>
            <button 
              onClick={reset}
              style={{width: '100%', padding: '15px', background: '#222', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '15px', cursor: 'pointer'}}
            >
              Return Home
            </button>
          </>
        )}
      </MainCard>
    </AppWrapper>
  );
}