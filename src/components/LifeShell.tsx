import { Bell, Bot, CalendarDays, CheckSquare2, ChevronLeft, CircleUserRound, GraduationCap, HeartHandshake, Home, Images, Lightbulb, Moon, NotebookPen, Plus, ReceiptText, Sparkles, Sun, WalletCards, X } from "lucide-react";
import { useState, type ElementType, type ReactNode } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useTheme } from "../contexts/ThemeContext";
import { logout } from "../lib/auth";

type NavItem = { href: string; label: string; icon: ElementType; tone?: string };

const primaryNav: NavItem[] = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/tasks", label: "المهام", icon: CheckSquare2 },
  { href: "/calendar", label: "المواعيد", icon: CalendarDays },
  { href: "/finance", label: "الماليات", icon: WalletCards },
  { href: "/more", label: "المزيد", icon: Sparkles },
];

const exploreNav: NavItem[] = [
  { href: "/habits", label: "العادات", icon: Sparkles, tone: "tone-sky" },
  { href: "/notes", label: "الملاحظات", icon: NotebookPen, tone: "tone-amber" },
  { href: "/spiritual", label: "عبادتي", icon: HeartHandshake, tone: "tone-rose" },
  { href: "/memories", label: "ذكريات لا تُنسى", icon: Images, tone: "tone-pink" },
  { href: "/assistant", label: "مساعدي", icon: Bot, tone: "tone-cyan" },
  { href: "/deutsch", label: "Deutsch lernen", icon: GraduationCap, tone: "tone-blue" },
];

const quickActions = [
  { label: "مهمة", href: "/tasks?add=1", icon: CheckSquare2, tone: "tone-sky" },
  { label: "موعد", href: "/calendar?add=1", icon: CalendarDays, tone: "tone-cyan" },
  { label: "دخل", href: "/finance?type=income", icon: WalletCards, tone: "tone-emerald" },
  { label: "مصروف", href: "/finance?type=expense", icon: ReceiptText, tone: "tone-rose" },
  { label: "فكرة", href: "/notes?add=1", icon: Lightbulb, tone: "tone-amber" },
  { label: "هدف", href: "/more", icon: Sparkles, tone: "tone-violet" },
];

export function getSpaceKey(location: string) {
  const path = location.split("?")[0];
  if (path === "/") return "home";
  if (["/tasks", "/projects"].includes(path)) return "focus";
  if (["/habits", "/analytics"].includes(path)) return "growth";
  if (path === "/finance") return "finance";
  if (path === "/calendar") return "calendar";
  if (path === "/notes") return "notes";
  if (path === "/spiritual") return "spiritual";
  if (["/assistant", "/voice-task"].includes(path)) return "assistant";
  if (path === "/memories") return "memories";
  if (path === "/deutsch") return "learning";
  if (path === "/social") return "social";
  if (path === "/vault") return "vault";
  return "spaces";
}

export default function LifeShell({ children, title, eyebrow }: { children: ReactNode; title?: string; eyebrow?: string }) {
  const [location, navigate] = useLocation();
  const [quickOpen, setQuickOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const activeHref = primaryNav.find((item) => item.href === location)?.href;
  const go = (href: string) => { navigate(href); setQuickOpen(false); };
  const signOut = async () => { await logout(); window.location.reload(); };

  return <div className={`app-frame subtle-grid space-${getSpaceKey(location)}`} dir="rtl">
    <aside className="sidebar">
      <button className="brand" onClick={() => go("/")}>
        <span className="brand-mark"><Sparkles size={19} /></span>
        <span><strong>أبا غالية وآمنه</strong><small>مساحة الحياة</small></span>
      </button>
      <nav className="side-nav"><small className="nav-label">مساحتك الخاصة</small>{primaryNav.map((item) => <NavButton key={item.href} item={item} active={activeHref === item.href} onClick={() => go(item.href)} />)}</nav>
      <div className="nav-separator" />
      <nav className="side-nav"><small className="nav-label">اكتشف</small>{exploreNav.map((item) => <NavButton key={item.href} item={item} active={location === item.href} onClick={() => go(item.href)} />)}</nav>
      <div className="profile-chip" onClick={() => go("/more")}><span className="avatar">هـ</span><span><strong>هير محمود</strong><small>مساحة خاصة</small></span><ChevronLeft size={16} /></div>
      <button className="logout-link" onClick={signOut}>تسجيل الخروج</button>
    </aside>
    <main className="main-content">
      <div className="section-art" aria-hidden="true" />
      <header className="topbar">
        <div className="mobile-title"><small>أبا غالية وآمنه</small><strong>{title || "مساحتك الخاصة"}</strong></div>
        <div className="desktop-title"><small>{eyebrow || "نظام تشغيل حياتك"}</small><strong>{title || "مساحتك الخاصة"}</strong></div>
        <div className="top-actions">
          <button className="icon-button" onClick={toggleTheme} aria-label="تبديل المظهر">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button className="icon-button notification" onClick={() => toast("لا توجد تنبيهات جديدة", { description: "سنذكّرك بما يهمك في الوقت المناسب." })} aria-label="التنبيهات"><Bell size={18} /><i /></button>
          <button className="profile-button" onClick={() => go("/more")} aria-label="الملف الشخصي"><CircleUserRound size={19} /></button>
        </div>
      </header>
      <section className="content-wrap">{children}</section>
    </main>
    <nav className="mobile-nav">{primaryNav.slice(0, 2).map((item) => <MobileNav key={item.href} item={item} active={activeHref === item.href} onClick={() => go(item.href)} />)}<button className="quick-button" onClick={() => setQuickOpen(true)} aria-label="إجراء سريع"><Plus size={25} /></button>{primaryNav.slice(2).map((item) => <MobileNav key={item.href} item={item} active={activeHref === item.href} onClick={() => go(item.href)} />)}</nav>
    {quickOpen && <div className="modal-backdrop" onMouseDown={() => setQuickOpen(false)}><div className="quick-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><strong>إضافة سريعة</strong><small>ابدأ بخطوة صغيرة الآن</small></div><button className="icon-button" onClick={() => setQuickOpen(false)}><X size={17} /></button></div><div className="quick-grid">{quickActions.map((item) => <button key={item.label} className="quick-action" onClick={() => go(item.href)}><span className={`action-icon ${item.tone}`}><item.icon size={17} /></span>{item.label}</button>)}</div></div></div>}
  </div>;
}

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return <button className={`nav-button ${active ? "active" : ""}`} onClick={onClick}><span className={`nav-icon ${active ? "active" : ""} ${item.tone || ""}`}><Icon size={16} /></span><span>{item.label}</span></button>;
}

function MobileNav({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return <button className={`mobile-link ${active ? "active" : ""}`} onClick={onClick}><Icon size={18} /><span>{item.label}</span></button>;
}
