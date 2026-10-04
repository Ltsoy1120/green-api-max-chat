import { useState } from "react"
import { getStateInstance } from "./api/greenApi"
import Chat from "./components/Chat"
import LoginForm from "./components/LoginForm"

interface GreenApiCredentials {
  idInstance: string
  apiTokenInstance: string
}

function App() {
  const [credentials, setCredentials] = useState<GreenApiCredentials | null>(
    null,
  )
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (idInstance: string, apiTokenInstance: string) => {
    setError("")
    setIsLoading(true)

    try {
      const data = await getStateInstance(idInstance, apiTokenInstance)

      if (data.stateInstance === "authorized") {
        setCredentials({
          idInstance,
          apiTokenInstance,
        })
      } else {
        setError(`Инстанс не авторизован: ${data.stateInstance}`)
      }
    } catch {
      setError("Не удалось войти. Проверьте idInstance и apiTokenInstance")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      {!credentials ? (
        <LoginForm
          error={error}
          isLoading={isLoading}
          onSubmit={handleLogin}
          onClearError={() => setError("")}
        />
      ) : (
        <Chat
          idInstance={credentials.idInstance}
          apiTokenInstance={credentials.apiTokenInstance}
        />
      )}
    </main>
  )
}

export default App
