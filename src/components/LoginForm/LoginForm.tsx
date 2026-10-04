import { useState } from "react"
import maxLogo from "../../assets/max-logo.png"
import maxTitle from "../../assets/green-api-max.svg"
import "./LoginForm.scss"

interface LoginFormProps {
  error: string
  isLoading: boolean
  onClearError: () => void
  onSubmit: (idInstance: string, apiTokenInstance: string) => void
}

const LoginForm = ({
  error,
  isLoading,
  onClearError,
  onSubmit,
}: LoginFormProps) => {
  const [idInstance, setIdInstance] = useState("")
  const [apiTokenInstance, setApiTokenInstance] = useState("")

  const isSubmitDisabled =
    !idInstance.trim() ||
    !apiTokenInstance.trim() ||
    Boolean(error) ||
    isLoading

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    onSubmit(idInstance.trim(), apiTokenInstance.trim())
  }

  return (
    <div className="login-form">
      <img className="login-form__logo" src={maxLogo} alt="MAX" />
      <div className="login-form__card">
        <h1 className="login-form__title">
          <img src={maxTitle} alt="GREEN-API: MAX" />
        </h1>

        <form className="login-form__form" onSubmit={handleSubmit}>
          <label className="login-form__field">
            <span>idInstance</span>
            <input
              type="text"
              value={idInstance}
              onChange={(e) => {
                setIdInstance(e.target.value)
                onClearError()
              }}
            />
          </label>

          <label className="login-form__field">
            <span>apiTokenInstance</span>
            <input
              type="password"
              value={apiTokenInstance}
              onChange={(e) => {
                setApiTokenInstance(e.target.value)
                onClearError()
              }}
            />
          </label>

          <p className="login-form__error">{error}</p>

          <button
            className="login-form__button"
            type="submit"
            disabled={isSubmitDisabled}
          >
            {isLoading ? "Проверяем..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
