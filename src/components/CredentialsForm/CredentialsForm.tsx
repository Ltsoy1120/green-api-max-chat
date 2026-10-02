import { useState } from "react"
import maxLogo from "../../assets/max-logo.png"
import maxTitle from "../../assets/green-api-max.svg"
import "./CredentialsForm.scss"

interface CredentialsFormProps {
  error: string
  onClearError: () => void
  onSubmit: (idInstance: string, apiTokenInstance: string) => void
}

const CredentialsForm = ({
  error,
  onClearError,
  onSubmit,
}: CredentialsFormProps) => {
  const [idInstance, setIdInstance] = useState("")
  const [apiTokenInstance, setApiTokenInstance] = useState("")

  const isSubmitDisabled =
    !idInstance.trim() || !apiTokenInstance.trim() || Boolean(error)

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    onSubmit(idInstance.trim(), apiTokenInstance.trim())
  }

  return (
    <div className="credentials-form">
      <img className="credentials-form__logo" src={maxLogo} alt="MAX" />
      <div className="credentials-form__card">
        <h1 className="credentials-form__title">
          <img src={maxTitle} alt="GREEN-API: MAX" />
        </h1>

        <form className="credentials-form__form" onSubmit={handleSubmit}>
          <label className="credentials-form__field">
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

          <label className="credentials-form__field">
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

          <p className="credentials-form__error">{error}</p>

          <button
            className="credentials-form__button"
            type="submit"
            disabled={isSubmitDisabled}
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}

export default CredentialsForm
