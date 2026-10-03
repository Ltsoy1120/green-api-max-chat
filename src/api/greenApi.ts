const API_URL = "https://api.green-api.com"

interface StateInstanceResponse {
  stateInstance:
    | "notAuthorized"
    | "authorized"
    | "blocked"
    | "starting"
    | "suspended"
    | "pendingPassword"
}

export const getStateInstance = async (
  idInstance: string,
  apiTokenInstance: string,
): Promise<StateInstanceResponse> => {
  const response = await fetch(
    `${API_URL}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
  )

  if (!response.ok) {
    throw new Error("Не удалось проверить данные GREEN-API")
  }

  return response.json()
}

interface CheckAccountResponse {
  exist: boolean
  chatId: string
  fromCache: boolean
}

export const checkAccount = async (
  idInstance: string,
  apiTokenInstance: string,
  phoneNumber: string,
): Promise<CheckAccountResponse> => {
  const response = await fetch(
    `${API_URL}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: Number(phoneNumber),
      }),
    },
  )

  if (!response.ok) {
    throw new Error("Не удалось проверить номер")
  }

  return response.json()
}

interface SendMessageResponse {
  idMessage: string
}

export const sendMessage = async (
  idInstance: string,
  apiTokenInstance: string,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> => {
  const response = await fetch(
    `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        message,
      }),
    },
  )

  if (!response.ok) {
    throw new Error("Не удалось отправить сообщение")
  }

  return response.json()
}
