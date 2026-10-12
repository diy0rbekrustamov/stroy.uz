import { useEffect, useRef } from "react";
export default function HomeDialog({ dialog, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (dialog && !ref.current.open) ref.current.showModal();
    if (!dialog && ref.current.open) ref.current.close();
  }, [dialog]);
  return (
    <dialog
      ref={ref}
      className="home-dialog"
      aria-labelledby="home-dialog-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <div className="home-dialog-heading">
        <h2 id="home-dialog-title">{dialog?.title}</h2>
        <button type="button" aria-label="Закрыть" onClick={onClose}>
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
