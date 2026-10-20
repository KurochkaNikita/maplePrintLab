export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResult =
  | { ok: true }
  | { ok: false; error: "invalid_credentials" };

/**
 * Заглушка авторизации.
 * В отдельной задаче здесь будет подключён вызов Auth.js (`signIn("credentials", ...)`).
 *
 * Сейчас для демонстрации обоих состояний:
 * - логин `admin` и пароль `admin` → успешный вход (`{ ok: true }`)
 * - любая другая пара → ошибка (`{ ok: false, error: "invalid_credentials" }`)
 */
export async function loginWithCredentials({
  username,
  password,
}: LoginCredentials): Promise<LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (username.trim() === "admin" && password === "admin") {
    return { ok: true };
  }

  return { ok: false, error: "invalid_credentials" };
}

/**
 * Заглушка выхода из системы.
 * В отдельной задаче здесь будет подключён `signOut()` из Auth.js.
 */
export async function logoutAdmin(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 150));
}
