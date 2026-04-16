import { useEffect, useMemo, useState } from 'react'
import {
  useGetAdminChatUsersQuery,
  useGetAdminChatMessagesQuery,
  useSendAdminChatMessageMutation,
} from '../../api/chatApi.js'
import Loader from '../../components/Loader.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'

function AdminChat() {
  const { pushToast } = useToast()
  const { data: usersData, isLoading: loadingUsers } = useGetAdminChatUsersQuery(undefined, {
    pollingInterval: 5000,
  })
  const users = useMemo(() => (Array.isArray(usersData) ? usersData : usersData?.data || []), [usersData])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [text, setText] = useState('')

  const { data: messagesData, isLoading: loadingMessages, refetch } =
    useGetAdminChatMessagesQuery(selectedUserId, {
      skip: !selectedUserId,
      pollingInterval: selectedUserId ? 5000 : 0,
    })

  const [sendAdminMessage, { isLoading: sending }] = useSendAdminChatMessageMutation()

  const messages = Array.isArray(messagesData) ? messagesData : messagesData?.data || []
  const selectedUser = users.find((entry) => String(entry?.userId || '') === String(selectedUserId || ''))
  const selectedUserName = selectedUser?.user?.name || 'Traveler'

  useEffect(() => {
    if (selectedUserId || users.length === 0) return
    const first = users[0]
    const firstUserId = first?.userId
    if (firstUserId) {
      setSelectedUserId(String(firstUserId))
    }
  }, [users, selectedUserId])

  const handleSend = async (event) => {
    event.preventDefault()
    if (!selectedUserId || !text.trim()) return
    try {
      await sendAdminMessage({ userId: selectedUserId, text: text.trim() }).unwrap()
      setText('')
      refetch()
    } catch (error) {
      pushToast({
        type: 'error',
        message: error?.data?.message || 'Unable to send reply.',
      })
    }
  }

  if (loadingUsers) return <Loader label="Loading chats..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Chat Support</h1>
        <p className="text-sm text-slate-600">Respond to traveler messages in real time.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="admin-card p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Users</p>
          <div className="space-y-2">
            {users.length === 0 && <p className="text-sm text-slate-600">No chat threads yet.</p>}
            {users.map((entry) => {
              const user = entry?.user || {}
              const userId = String(entry?.userId || '')
              const isSelected = String(selectedUserId || '') === userId
              return (
                <button
                  key={userId}
                  type="button"
                  onClick={() => setSelectedUserId(userId)}
                  className={`w-full rounded-xl border px-3 py-2 text-left ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}
                >
                  <p className="text-sm font-semibold text-ink">{user?.name || 'Traveler'}</p>
                  <p className="text-xs text-slate-500">{user?.email || '-'}</p>
                  <p className="mt-1 text-xs text-slate-600">{entry.lastMessage || 'No message'}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="admin-card p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Conversation</p>
          {!selectedUserId ? (
            <p className="text-sm text-slate-600">Select a user to view messages.</p>
          ) : loadingMessages ? (
            <Loader label="Loading messages..." />
          ) : (
            <>
              <div className="mb-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                Replying to: <strong>{selectedUserName}</strong>
              </div>
              <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-3">
                {messages.map((message) => {
                  const mine = message.senderRole === 'ADMIN'
                  return (
                    <div
                      key={message._id}
                      className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${mine ? 'ml-auto bg-blue-700 text-white' : 'bg-white text-slate-700'}`}
                    >
                      <p>{message.text}</p>
                      <p className={`mt-1 text-[10px] ${mine ? 'text-blue-100' : 'text-slate-400'}`}>
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )
                })}
              </div>
              <form onSubmit={handleSend} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Type reply..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
                >
                  {sending ? 'Sending...' : 'Reply'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminChat
