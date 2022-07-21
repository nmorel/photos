import { useDroppable } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ReactModal from "react-modal";
import { NavLink, useNavigate } from "react-router-dom";
import { addFolder } from "../../storage";
import { Folder } from "../../types";
import "./Nav.css";

function FolderLink({ folder }: { folder: Folder }) {
  const { isOver, setNodeRef } = useDroppable({
    id: folder.id,
  });
  const style = {
    display: "block",
    opacity: isOver ? 0.5 : 1,
  };

  return (
    <NavLink
      ref={setNodeRef}
      to={`/${folder.id}`}
      style={({ isActive }) =>
        isActive
          ? { fontWeight: "bold", color: "white", ...style }
          : { color: "white", ...style }
      }
    >
      {folder.name}
    </NavLink>
  );
}

function CreateFolderForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const createFolderMutation = useMutation((name: string) => {
    return addFolder(name);
  });
  return (
    <form
      className="form"
      onSubmit={(evt) => {
        evt.preventDefault();

        const formElement = evt.target as HTMLFormElement;
        const formData = new FormData(formElement);
        createFolderMutation.mutate(formData.get("name") as string, {
          onSuccess(folder) {
            onClose();
            queryClient.invalidateQueries(["folders"]);
            navigate(`/${folder.id}`);
          },
        });
      }}
    >
      {createFolderMutation.isError && (
        <p style={{ color: "red" }}>
          An error occured :{" "}
          {(createFolderMutation.error as Error)?.toString?.()}
        </p>
      )}
      <label>
        <input type="text" name="name" required placeholder="Name" />
      </label>
      <footer>
        <button type="button" onClick={() => onClose()}>
          Cancel
        </button>
        <button type="submit" disabled={createFolderMutation.isLoading}>
          Add
        </button>
      </footer>
    </form>
  );
}

export function Nav({ folders }: { folders: Folder[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <div className="add-button-container">
        <button
          type="button"
          className="add-button"
          onClick={() => setIsOpen((open) => !open)}
        >
          Add a new folder
        </button>
      </div>
      <ul>
        {folders.map((folder) => (
          <li key={folder.id}>
            <FolderLink folder={folder} />
          </li>
        ))}
      </ul>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        shouldCloseOnOverlayClick
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <CreateFolderForm onClose={() => setIsOpen(false)} />
      </ReactModal>
    </nav>
  );
}
