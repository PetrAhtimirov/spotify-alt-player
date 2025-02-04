import React, { useEffect, useState } from "react";
import closeIcon from "../../../assets/icons/close.svg";

interface ErrorMessageProps {
  code: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ code }) => {
  const [message, setMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    switch (code) {
      case "401":
        setMessage("Not Authorized");
        break;
      case "403":
        setMessage("Not available in your region");
        break;
      default:
        setMessage("An error occurred");
        break;
    }
  }, [code]);

  return (
    isOpen ? (
    <div className="error_message">
      <span className="error_message__text">{message}</span>
      <button className="error_message__close" onClick={() => setIsOpen(false)}>
        <img src={closeIcon} alt="Close" className="error_message__close_icon" />
      </button>
    </div>
    ) : null
  );
};

export default ErrorMessage;
