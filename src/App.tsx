import { useState } from "react"
import CredentialsForm from "./components/CredentialsForm"
import { getStateInstance } from "./api/greenApi"

interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null)
  const [error, setError] = useState("")

  const handleLogin = async (idInstance: string, apiTokenInstance: string) => {
    setError("")

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
    }
  }

  return (
    <main>
      {!credentials ? (
        <CredentialsForm
          error={error}
          onSubmit={handleLogin}
          onClearError={() => setError("")}
        />
      ) : (
        <div>Chat</div>
      )}
    </main>
  )
}

export default App
