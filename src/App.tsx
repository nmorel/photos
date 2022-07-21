import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { ImageForm } from "./components/ImageForm";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <header>My photo collection</header>
      <main>
        <ImageForm />
      </main>
    </QueryClientProvider>
  );
}

export default App;
