import "./ChatMessage.scss"

interface ChatMessageProps {
  text: string
}

const ChatMessage = ({ text }: ChatMessageProps) => {
  return <div className="chat-message">{text}</div>
}

export default ChatMessage
