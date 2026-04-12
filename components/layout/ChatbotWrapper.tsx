'use client';

import { useEffect, useRef, useState, memo } from 'react';

// Separate memoized component for the iframe content
// This prevents React from re-parsing/re-injecting the innerHTML
// when the parent wrapper's width/height/state changes.
const ChatbotContent = memo(({ code }: { code: string }) => {
    return (
        <div 
            className="w-full h-full"
            dangerouslySetInnerHTML={{ 
                __html: code.replace('<iframe', '<iframe allowtransparency="true"') 
            }} 
        />
    );
});

ChatbotContent.displayName = 'ChatbotContent';

export default function ChatbotWrapper({ chatbotCode }: { chatbotCode: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isGreetingVisible, setIsGreetingVisible] = useState(false);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = event.data;
            
            if (data?.type === 'chatbot-state') {
                setIsExpanded(!!data.isOpen);
                return;
            }

            if (data?.type === 'chatbot-greeting') {
                setIsGreetingVisible(!!data.isVisible);
                return;
            }

            const openSignals = ['open', 'expand', 'expanded', 'show'];
            const closeSignals = ['close', 'collapse', 'collapsed', 'hide'];
            
            const isOpenMessage = 
                openSignals.includes(data) || 
                openSignals.includes(data?.type) || 
                openSignals.includes(data?.state) ||
                data?.event === 'expanded';

            const isCloseMessage = 
                closeSignals.includes(data) || 
                closeSignals.includes(data?.type) || 
                closeSignals.includes(data?.state) ||
                data?.event === 'collapsed';

            if (isOpenMessage) setIsExpanded(true);
            if (isCloseMessage) setIsExpanded(false);
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (!chatbotCode) return null;

    // Determine dimensions based on state
    let width = '110px';
    let height = '110px';

    if (isExpanded) {
        width = 'min(400px, calc(100vw - 32px))';
        height = 'min(700px, calc(100dvh - 32px))';
    } else if (isGreetingVisible) {
        width = 'min(300px, calc(100vw - 32px))';
        height = '220px';
    }

    return (
        <div 
            ref={containerRef}
            id="global-chatbot-root"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999999]"
            style={{ 
                width, 
                height,
                pointerEvents: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                colorScheme: 'light'
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                #global-chatbot-root iframe {
                    width: 100% !important;
                    height: 100% !important;
                    pointer-events: auto !important;
                    position: static !important;
                    border: none !important;
                    background: transparent !important;
                }
            `}} />
            <ChatbotContent code={chatbotCode} />
        </div>
    );
}
