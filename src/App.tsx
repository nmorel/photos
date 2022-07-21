import { useQuery } from "@tanstack/react-query";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Folder } from "./components/Folder/Folder";
import { getFolders } from "./storage";
import { Nav } from "./components/Nav";

function App() {
  const foldersQuery = useQuery(["folders"], getFolders);

  if (!foldersQuery.isSuccess) {
    return null;
  }

  return (
    <Router>
      <Nav folders={foldersQuery.data} />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={`/${foldersQuery.data[0].id}`} replace />}
          />
          <Route path="/:folderId" element={<Folder />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
