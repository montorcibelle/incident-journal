import { Route, Routes } from "react-router";
import Nav from "./components/Nav";
import IncidentsPage from "./pages/IncidentsPage";
import NewIncidentPage from "./pages/NewIncidentPage";

export default function App() {
  return (
    <div className="min-h-screen bg-stone-100">
      <Nav />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <Routes>
          <Route path="/" element={<IncidentsPage />} />
          <Route path="/new" element={<NewIncidentPage />} />
        </Routes>
      </main>
    </div>
  );
}
