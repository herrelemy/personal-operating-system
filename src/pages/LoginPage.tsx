import { FormEvent, useState } from "react";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { login } from "../lib/auth";

type Props = { onAuthenticated: () => void };

export default function LoginPage({ onAuthenticated }: Props) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) {
      setError("اكتبي كلمة المرور أولًا");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await login(password);
      onAuthenticated();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "تعذر تسجيل الدخول");
    } finally {
      setBusy(false);
    }
  };

  return <main className="auth-page" dir="rtl">
    <div className="auth-glow auth-glow-one" />
    <div className="auth-glow auth-glow-two" />
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-brand"><span className="brand-mark"><Sparkles size={19} /></span><span><strong>أبا غالية وآمنه</strong><small>مساحة الحياة الخاصة</small></span></div>
      <div className="auth-icon"><LockKeyhole size={23} /></div>
      <span className="eyebrow auth-eyebrow"><ShieldCheck size={14} /> مساحة خاصة</span>
      <h1 id="auth-title">مرحبًا بعودتكِ.</h1>
      <p>أدخلي كلمة المرور للوصول إلى مساحتكِ الشخصية بكل هدوء وأمان.</p>
      <form className="auth-form" onSubmit={submit}>
        <label htmlFor="private-password">كلمة المرور<input id="private-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="أدخلي كلمة المرور" autoComplete="current-password" autoFocus /></label>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="primary-button full" type="submit" disabled={busy}>{busy ? "جارٍ التحقق…" : "دخول إلى مساحتي"}</button>
      </form>
      <small className="auth-note">بياناتكِ محمية بجلسة خاصة، ولا يتم حفظ كلمة المرور داخل المتصفح.</small>
    </section>
  </main>;
}
