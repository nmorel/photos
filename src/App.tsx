import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
} from "react-router-dom";
import { Folder } from "./components/Folder/Folder";
import { getFolders } from "./storage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function App() {
  const foldersQuery = useQuery(["folders"], getFolders);

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      {foldersQuery.isSuccess && (
        <Router>
          <nav>
            <ul>
              {foldersQuery.data.map((folder) => (
                <li key={folder.id}>
                  <NavLink
                    to={`/${folder.id}`}
                    style={({ isActive }) =>
                      isActive
                        ? { fontWeight: "bold", color: "white" }
                        : { color: "white" }
                    }
                  >
                    {folder.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <Navigate to={`/${foldersQuery.data[0].id}`} replace />
                }
              />
              <Route path="/:folderId" element={<Folder />} />
            </Routes>
          </main>
        </Router>
      )}
    </QueryClientProvider>
  );
}

export default App;
