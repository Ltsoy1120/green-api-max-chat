import "./ChatMessage.scss"

interface ChatMessageProps {
  text: string
  direction: "incoming" | "outgoing"
}

const ChatMessage = ({ text, direction }: ChatMessageProps) => {
  return <div className={`chat-message chat-message--${direction}`}>{text}</div>
}

export default ChatMessage
