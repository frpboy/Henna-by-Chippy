'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useCartStore, MAX_MESSAGES_PER_SESSION } from '@/store/cart'
import type { ChatMessage } from '@/types'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '917561856754'

export default function StainConsultant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hi! I'm Chippy's AI Stain Consultant. Ask me about henna application, stain depth, storage, or delivery to your area. I understand English, Malayalam, and Manglish!",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageCount = useCartStore((s) => s.messageCount)
  const incrementMessageCount = useCartStore((s) => s.incrementMessageCount)

  const isLimitReached = messageCount >= MAX_MESSAGES_PER_SESSION

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [open, messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading || isLimitReached) return

    const userMsg: ChatMessage = { role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    incrementMessageCount()

    try {
      const history = messages.map((m) => ({ role: m.role, text: m.text }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })

      if (!res.ok) throw new Error('Chat error')

      const data = (await res.json()) as { text: string; images?: string[] }
      setMessages((prev) => [...prev, { role: 'model', text: data.text, images: data.images }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: "Sorry, I had trouble connecting. Please message Chippy directly on WhatsApp for help!",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-widget">
      {/* Toggle button */}
      <button
        className="chat-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close AI Stain Consultant' : 'Open AI Stain Consultant'}
        aria-expanded={open}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chat-panel" role="dialog" aria-label="AI Stain Consultant">
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: 'var(--color-leaf-green)' }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
              AI
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Stain Consultant</p>
              <p className="text-white/70 text-xs">Ask about henna, stains, delivery</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-leaf-green text-white rounded-br-sm'
                      : 'bg-warm-white text-dark-earth border border-henna-maroon/10 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.images && msg.images.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {msg.images.map((url, j) => (
                        <Image
                          key={j}
                          src={url}
                          alt="Stain example"
                          width={100}
                          height={100}
                          className="rounded-lg object-cover"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-warm-white border border-henna-maroon/10 rounded-2xl rounded-bl-sm px-4 py-2">
                  <span className="text-warm-gray text-sm animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input or limit banner */}
          <div className="px-3 pb-3">
            {isLimitReached ? (
              <div className="text-center py-3">
                <p className="text-xs text-warm-gray mb-2">
                  Session limit reached. Chat with Chippy directly:
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-sm py-2 px-4 inline-flex"
                >
                  WhatsApp Chippy
                </a>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about henna..."
                  disabled={loading}
                  className="flex-1 border border-henna-maroon/20 rounded-full px-4 py-2 text-sm bg-warm-white focus:outline-none focus:ring-2 focus:ring-leaf-green disabled:opacity-60"
                  aria-label="Message the AI consultant"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="w-9 h-9 rounded-full bg-leaf-green text-white flex items-center justify-center disabled:opacity-50 transition-opacity"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
