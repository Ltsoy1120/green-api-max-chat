import { useState } from "react"
import "./PhoneForm.scss"

interface PhoneFormProps {
  error: string
  onPhoneChange: () => void
  onSubmit: (phoneNumber: string) => void
}

const PhoneForm = ({ error, onPhoneChange, onSubmit }: PhoneFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    onSubmit(phoneNumber.trim())
  }

  return (
    <form className="phone-form" onSubmit={handleSubmit}>
      <input
        className="phone-form__input"
        type="text"
        placeholder="Номер телефона"
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value)
          onPhoneChange()
        }}
      />

      <p className="phone-form__error">{error}</p>

      <button
        className="phone-form__button"
        type="submit"
        disabled={!phoneNumber.trim()}
      >
        Создать чат
      </button>
    </form>
  )
}
export default PhoneForm
