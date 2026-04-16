import { useState } from 'react'
import {
  useGetMyChatQuery,
  useSendMyChatMessageMutation,
} from '../../api/chatApi.js'
import Loader from '../../components/Loader.jsx'

function UserChat() {
  const { data, isLoading, refetch } = useGetMyChatQuery(undefined, {
    pollingInterval: 5000,
  })
  const [sendMyMessage, { isLoading: sending }] = useSendMyChatMessageMutation()
  const [text, setText] = useState('')
  const messages = Array.isArray(data) ? data : data?.data || []

  const handleSend = async (event) => {
    event.preventDefault()
    if (!text.trim()) return
    try {
      await sendMyMessage({ text: text.trim() }).unwrap()
      setText('')
      refetch()
    } catch {
      // handled by server response
    }
  }

  if (isLoading) return <Loader label="Loading chat..." />

  return (
    <div className="container-shell py-12">
      <h1 className="font-display text-3xl text-ink">Chat with Admin</h1>
      <p className="mt-2 text-sm text-slate-600">
        Ask questions about your bookings, payments, and trek planning.
      </p>

      <div className="card-surface mt-6 p-4">
        <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3">
          {messages.length === 0 && (
            <p className="text-sm text-slate-500">No messages yet. Start the conversation.</p>
          )}
          {messages.map((message) => {
            const mine = message.senderRole === 'USER'
            return (
              <div
                key={message._id}
                className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${mine ? 'ml-auto bg-blue-600 text-white' : 'bg-white text-slate-700'}`}
              >
                <p>{message.text}</p>
                <p className={`mt-1 text-[10px] ${mine ? 'text-blue-100' : 'text-slate-400'}`}>
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            )
          })}
        </div>

        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type your message..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserChat
