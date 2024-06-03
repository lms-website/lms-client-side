import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";

import { useOutsideClick } from "../hooks/useOutsideClick";

const ModalContext = createContext();
function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = (name) => setOpenName(name);
  return (
    <ModalContext.Provider value={{ open, close, openName }}>
      {children}
    </ModalContext.Provider>
  );
}
function Open({ children, opens: openWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(openWindowName) });
}
function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);
  if (name !== openName) return null;
  return createPortal(
    <div className="fixed inset-0 w-full h-screen z-[1000] transition-all ease-in-out duration-300">
      <div
        className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white py-4 px-2 transition-all duration-300 ease-in-out"
        ref={ref}
      >
        <span role="button" onClick={close}>
          <HiX />
        </span>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}
Modal.Open = Open;
Modal.Window = Window;
export default Modal;
