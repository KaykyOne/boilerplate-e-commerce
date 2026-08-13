import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <p className="eyebrow mb-3">Área do colecionador</p>
      <h1 className="font-display text-3xl text-brand-foreground mb-3">Welcome back</h1>
      <p className="text-center text-base-regular text-brand-muted mb-8">
        Sign in to access an enhanced shopping experience.
      </p>
      {message?.state === "verification_required" && (
        <div
          className="w-full mb-6 rounded-[var(--radius-control)] border border-brand-accent/40 bg-brand-accent/10 p-4 text-center text-base-regular text-brand-foreground"
          data-testid="login-verification-message"
        >
          We sent a verification link to <strong>{message.email}</strong>.
          Please verify your email, then sign in.
        </div>
      )}
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="login-error-message"
        />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6 !bg-brand-accent !text-brand-accent-foreground hover:!bg-[#e2bf67]">
          Sign in
        </SubmitButton>
      </form>
      <span className="text-center text-brand-muted text-small-regular mt-6">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-brand-accent underline decoration-brand-accent/50 underline-offset-4 hover:text-brand-foreground"
          data-testid="register-button"
        >
          Join us
        </button>
        .
      </span>
    </div>
  )
}

export default Login
