"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import Label from "@/components/Label";
import { hasAdminAccess } from "@/lib/auth/actions";
import { authClient } from "@/lib/auth/client";
import { useT } from "@/components/LocaleProvider";
import type { Dictionary } from "@/lib/i18n";

/** Neon Auth reports bad credentials as HTTP 401 / INVALID_EMAIL_OR_PASSWORD, as a returned or a thrown error. */
function errorMessage(e: unknown, t: Dictionary): string {
  const err = (e ?? {}) as { code?: string; status?: number };
  return err.code === "INVALID_EMAIL_OR_PASSWORD" || err.status === 401 || err.status === 400
    ? t.login.invalidCredentialsError
    : t.login.genericError;
}

/** `accessDenied`: the page found a session without admin rights (e.g. the flag was revoked). */
export function LoginForm({ accessDenied = false }: { accessDenied?: boolean }) {
  const router = useRouter();
  const t = useT();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(accessDenied ? t.login.accessDeniedError : null);
  const [isLoading, setIsLoading] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const errorId = "login-form-error";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isLoading) return;

    if (!username.trim() || !password) {
      setError(t.login.emptyFieldsError);
      (username.trim() ? passwordRef : usernameRef).current?.focus();
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: username.trim(),
        password,
      });
      if (signInError) {
        setError(errorMessage(signInError, t));
        return;
      }
      if (!(await hasAdminAccess())) {
        // Signed in with valid credentials but not an admin: drop the session.
        await authClient.signOut().catch(() => undefined);
        setError(t.login.accessDeniedError);
        return;
      }
      // Full navigation so the server layout re-checks the session.
      router.replace("/");
      router.refresh();
    } catch (e) {
      setError(errorMessage(e, t));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      method="POST"
      noValidate
      className="mt-6 space-y-5"
    >
      <FormError id={errorId} message={error} />

      <div>
        <Label htmlFor="username" requiredIndicator>
          {t.login.usernameLabel}
        </Label>
        <Input
          ref={usernameRef}
          id="username"
          name="username"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="next"
          required
          disabled={isLoading}
          hasError={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) setError(null);
          }}
        />
      </div>

      <div>
        <Label htmlFor="current-password" requiredIndicator>
          {t.login.passwordLabel}
        </Label>
        <div className="relative">
          <Input
            ref={passwordRef}
            id="current-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            enterKeyHint="done"
            required
            disabled={isLoading}
            hasError={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            className="pr-14"
          />
          <button
            type="button"
            aria-pressed={showPassword}
            aria-label={t.a11y.showPassword}
            aria-describedby="password-toggle-warning"
            disabled={isLoading}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-charcoal transition-colors hover:bg-charcoal/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <path d="m1 1 22 22" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
          <span id="password-toggle-warning" className="visually-hidden">
            {t.a11y.passwordWarning}
          </span>
        </div>
      </div>

      <div className="pt-1">
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? t.login.submittingButton : t.login.submitButton}
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
