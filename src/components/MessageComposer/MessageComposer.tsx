import { useRef, useState } from "react"
import sendArrow from "../../assets/send-arrow.svg"
import "./MessageComposer.scss"

interface MessageComposerProps {
  onSubmit: (message: string) => void
}

const MessageComposer = ({ onSubmit }: MessageComposerProps) => {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const sendMessage = () => {
    if (!message.trim()) {
      return
    }

    onSubmit(message.trim())
    setMessage("")

    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"
    }
  }

  const resizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "40px"

    if (textarea.scrollHeight > 40) {
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    resizeTextarea(e.target)
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <form className="message-composer" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className="message-composer__input"
        placeholder="Сообщение"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {message.trim() && (
        <button
          className="message-composer__button"
          type="submit"
          aria-label="Отправить сообщение"
        >
          <img src={sendArrow} alt="" />
        </button>
      )}
    </form>
  )
}

export default MessageComposer
