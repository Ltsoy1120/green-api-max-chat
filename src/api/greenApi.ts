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
