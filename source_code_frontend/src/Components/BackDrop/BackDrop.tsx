import React from "react";
import "./BackDrop.css";
type backdrop = {
  show: boolean;
  modalClose: () => void;
};
const Backdrop: React.FC<backdrop> = ({ show, modalClose }) =>
  show ? <div onClick={modalClose} className="Backdrop"></div> : null;

export default Backdrop;
