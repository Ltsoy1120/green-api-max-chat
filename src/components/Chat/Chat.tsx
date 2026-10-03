import { useState } from "react"
import { checkAccount, sendMessage } from "../../api/greenApi"
import MessageComposer from "../MessageComposer"
import PhoneForm from "../PhoneForm"
import "./Chat.scss"

interface ActiveChat {
  phoneNumber: string
  chatId: string
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

      console.log("Сообщение отправлено:", data.idMessage)
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

            <MessageComposer onSubmit={handleSendMessage} />
          </>
        )}
      </section>
    </div>
  )
}

export default Chat
