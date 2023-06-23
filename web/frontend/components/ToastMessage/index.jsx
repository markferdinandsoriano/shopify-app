import { Toast, Frame, Page, Button } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

export default function Toastcomponent({ message, isOpen }) {
  const [active, setActive] = useState(isOpen);

  console.log("active", active);

  useEffect(() => {
    setActive(isOpen);

    return () => {
      setActive(false);
    };
  }, [isOpen]);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast content={message} onDismiss={toggleActive} duration="2000" />
  ) : null;

  return toastMarkup;
}
