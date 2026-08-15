import { Toaster } from "sonner";
import { Route, Switch } from "wouter";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Assistant, Analytics, Calendar, Deutsch, Finance, Habits, Home, Memories, MobileAuth, More, NotFound, Notes, Projects, Social, Spiritual, Tasks, Vault, VoiceTask } from "./pages/Pages";

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><Toaster richColors position="top-center" dir="rtl" /><Switch>
    <Route path="/" component={Home} />
    <Route path="/mobile-auth" component={MobileAuth} />
    <Route path="/tasks" component={Tasks} />
    <Route path="/analytics" component={Analytics} />
    <Route path="/projects" component={Projects} />
    <Route path="/voice-task" component={VoiceTask} />
    <Route path="/vault" component={Vault} />
    <Route path="/habits" component={Habits} />
    <Route path="/finance" component={Finance} />
    <Route path="/calendar" component={Calendar} />
    <Route path="/memories" component={Memories} />
    <Route path="/deutsch" component={Deutsch} />
    <Route path="/notes" component={Notes} />
    <Route path="/spiritual" component={Spiritual} />
    <Route path="/social" component={Social} />
    <Route path="/assistant" component={Assistant} />
    <Route path="/more" component={More} />
    <Route component={NotFound} />
  </Switch></ThemeProvider></ErrorBoundary>;
}
