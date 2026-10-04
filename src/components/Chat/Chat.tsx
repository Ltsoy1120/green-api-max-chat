import { useCallback, useEffect, useRef, useState } from "react"
import { checkAccount, sendMessage } from "../../api/greenApi"
import { useNotifications } from "../../hooks/useNotifications"
import backArrow from "../../assets/back-arrow.svg"
import ChatMessage from "../ChatMessage"
import MessageComposer from "../MessageComposer"
import PhoneForm from "../PhoneForm"
import "./Chat.scss"

interface ChatItem {
  phoneNumber: string
  chatId: string
}

interface Message {
  id: string
  text: string
  direction: "incoming" | "outgoing"
}

interface ChatProps {
  idInstance: string
  apiTokenInstance: string
}

const Chat = ({ idInstance, apiTokenInstance }: ChatProps) => {
  const [chats, setChats] = useState<ChatItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeChat, setActiveChat] = useState<ChatItem | null>(null)
  const [isPhoneFormOpen, setIsPhoneFormOpen] = useState(false)
  const [error, setError] = useState("")
  const [messagesByChatId, setMessagesByChatId] = useState<
    Record<string, Message[]>
  >({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messagesByChatId, activeChat])

  const handleCreateChat = async (phoneNumber: string) => {
    setError("")
    setIsLoading(true)

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
    } finally {
      setIsLoading(false)
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
            direction: "outgoing",
          },
        ],
      }))
    } catch {
      console.error("Не удалось отправить сообщение")
    }
  }

  const handleIncomingMessage = useCallback(
    (message: { id: string; chatId: string; text: string }) => {
      setMessagesByChatId((prevMessages) => ({
        ...prevMessages,
        [message.chatId]: [
          ...(prevMessages[message.chatId] || []),
          {
            id: message.id,
            text: message.text,
            direction: "incoming",
          },
        ],
      }))
    },
    [],
  )

  useNotifications(idInstance, apiTokenInstance, handleIncomingMessage)

  return (
    <div className={`chat ${activeChat ? "chat--active" : ""}`}>
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
              isLoading={isLoading}
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
              <button
                className="chat__back-button"
                type="button"
                onClick={() => setActiveChat(null)}
                aria-label="Вернуться к списку чатов"
              >
                <img src={backArrow} alt="" />
              </button>

              <h2 className="chat__title">{activeChat.phoneNumber}</h2>
            </div>

            <div className="chat__scroll">
              <div className="chat__messages">
                {(messagesByChatId[activeChat.chatId] || []).map((message) => (
                  <ChatMessage
                    key={message.id}
                    text={message.text}
                    direction={message.direction}
                  />
                ))}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <MessageComposer onSubmit={handleSendMessage} />
          </>
        )}
      </section>
    </div>
  )
}

export default Chat
