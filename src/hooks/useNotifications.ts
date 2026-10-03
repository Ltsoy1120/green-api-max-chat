import { useEffect } from "react"
import { deleteNotification, receiveNotification } from "../api/greenApi"

interface IncomingMessage {
  id: string
  chatId: string
  text: string
}

export const useNotifications = (
  idInstance: string,
  apiTokenInstance: string,
  onMessage: (message: IncomingMessage) => void,
) => {
  useEffect(() => {
    let isActive = true

    const listen = async () => {
      while (isActive) {
        try {
          const notification = await receiveNotification(
            idInstance,
            apiTokenInstance,
          )

          if (!notification) {
            continue
          }

          const { body } = notification

          if (
            body.typeWebhook === "incomingMessageReceived" &&
            body.messageData?.typeMessage === "textMessage" &&
            body.senderData?.chatId &&
            body.messageData.textMessageData?.textMessage
          ) {
            onMessage({
              id: body.idMessage,
              chatId: body.senderData.chatId,
              text: body.messageData.textMessageData.textMessage,
            })
          }

          await deleteNotification(
            idInstance,
            apiTokenInstance,
            notification.receiptId,
          )
        } catch (error) {
          console.error("Не удалось получить уведомление", error)
        }
      }
    }

    listen()

    return () => {
      isActive = false
    }
  }, [idInstance, apiTokenInstance, onMessage])
}
