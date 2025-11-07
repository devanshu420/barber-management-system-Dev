// components/ChatbotIcon.jsx
'use client';

import { useRouter } from 'next/navigation';

const ChatbotIcon = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/chatbot');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Open Chatbot"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: '50%',
        backgroundColor: '#111f2eff',
        color: '#1a1a1a',
        fontSize: 30,
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      💬
    </button>
  );
};

export default ChatbotIcon;
