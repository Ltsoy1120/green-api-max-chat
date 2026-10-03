import { useState } from "react"
import { checkAccount, sendMessage } from "../../api/greenApi"
import MessageComposer from "../MessageComposer"
import ChatMessage from "../ChatMessage"
import PhoneForm from "../PhoneForm"
import "./Chat.scss"

interface ActiveChat {
  phoneNumber: string
  chatId: string
}

interface Message {
  id: string
  text: string
}

interface ChatProps {
  idInstance: string
  apiTokenInstance: string
}

const Chat = ({ idInstance, apiTokenInstance }: ChatProps) => {
  const [chats, setChats] = useState<ActiveChat[]>([])
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null)
  const [isPhoneFormOpen, setIsPhoneFormOpen] = useState(false)
  const [error, setError] = useState("")
  const [messagesByChatId, setMessagesByChatId] = useState<
    Record<string, Message[]>
  >({})

  const handleCreateChat = async (phoneNumber: string) => {
    setError("")
    try {
      const data = await checkAccount(idInstance, apiTokenInstance, phoneNumber)

      if (data.exist) {
        const newChat = {
          phoneNumber,
          chatId: data.chatId,
        }

        setChats((prevChats) => {
          const chatExists = prevChats.some(
            (chat) => chat.chatId === data.chatId,
          )

          return chatExists ? prevChats : [...prevChats, newChat]
        })

        setActiveChat(newChat)
        setIsPhoneFormOpen(false)
      } else {
        setError("Аккаунт MAX с таким номером не найден")
      }
    } catch {
      setError("Не удалось проверить номер")
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!activeChat) {
      return
    }

    try {
      const data = await sendMessage(
        idInstance,
        apiTokenInstance,
        activeChat.chatId,
        message,
      )

      setMessagesByChatId((prevMessages) => ({
        ...prevMessages,
        [activeChat.chatId]: [
          ...(prevMessages[activeChat.chatId] || []),
          {
            id: data.idMessage,
            text: message,
          },
        ],
      }))
    } catch {
      console.error("Не удалось отправить сообщение")
    }
  }

  return (
    <div className="chat">
      <aside className="chat__sidebar">
        <div className="chat__sidebar-top">
          <div className="chat__sidebar-header">
            <h2 className="chat__sidebar-title">Чаты</h2>

            <button
              className="chat__add-button"
              type="button"
              onClick={() => setIsPhoneFormOpen(true)}
              aria-label="Создать новый чат"
            >
              +
            </button>
          </div>

          {isPhoneFormOpen && (
            <PhoneForm
              error={error}
              onPhoneChange={() => setError("")}
              onSubmit={handleCreateChat}
            />
          )}
        </div>
        <div className="chat__list">
          {chats.map((chat) => (
            <button
              className={`chat__item ${
                activeChat?.chatId === chat.chatId ? "chat__item--active" : ""
              }`}
              type="button"
              key={chat.chatId}
              onClick={() => setActiveChat(chat)}
            >
              {chat.phoneNumber}
            </button>
          ))}
        </div>
      </aside>

      <section className="chat__content">
        {activeChat && (
          <>
            <div className="chat__header">
              <h2 className="chat__title">{activeChat.phoneNumber}</h2>
            </div>

            <div className="chat__messages">
              {(messagesByChatId[activeChat.chatId] || []).map((message) => (
                <ChatMessage key={message.id} text={message.text} />
              ))}
            </div>

            <MessageComposer onSubmit={handleSendMessage} />
          </>
        )}
      </section>
    </div>
  )
}

export default Chat
