import { useCallback, useContext, useEffect, useRef } from "react";
import { Button, Input, Modal } from "react-daisyui";
import Select from "react-tailwindcss-select";

import { PreferenceContext } from "@/services/context";
import { Theme } from "@/services/preference/preference";

export interface PreferenceEditorProps {
  open?: boolean;
  onClose: () => unknown;
}

export function PreferenceEditor({ open, onClose }: PreferenceEditorProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const preferenceContext = useContext(PreferenceContext);
  const themeOptions = useRef([
    {
      label: "Light",
      value: Theme.light,
    },
    {
      label: "Black",
      value: Theme.black,
    },
  ]);

  const save = useCallback(async () => {
    preferenceContext.refresh();
    onClose();
  }, [preferenceContext, onClose]);

  const attachCloseHandler = useCallback(() => {
    if (!dialogRef.current) return;

    const handler = (ev: MouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (ev.target?.nodeName === "DIALOG") {
        onClose();
      }
    };

    dialogRef.current.addEventListener("click", handler);

    return () => dialogRef.current?.removeEventListener("click", handler);
  }, [dialogRef, onClose]);

  useEffect(() => {
    return attachCloseHandler();
  }, [attachCloseHandler]);

  return (
    <Modal open={open} ref={dialogRef}>
      <Modal.Header>Edit preferences</Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-preference-item-layout gap-y-3 items-center">
          <div>Theme (no worky)</div>
          <Select
            options={themeOptions.current}
            value={
              themeOptions.current.find((option) => option.value === preferenceContext.preference.theme) ??
              themeOptions.current[0]
            }
            onChange={(option) => {
              if (!option || Array.isArray(option)) return;
              preferenceContext.setItem("theme", option.value as Theme);
            }}
            primaryColor="teal"
          />
          <div>Font Size</div>

          <Input
            value={preferenceContext.preference.fontSize}
            onChange={(ev) => {
              preferenceContext.setItem("fontSize", ev.target.value);
            }}
          />
          <div>Line Height</div>
          <Input
            value={preferenceContext.preference.lineHeight}
            onChange={(ev) => {
              preferenceContext.setItem("lineHeight", ev.target.value);
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Actions>
        <Button onClick={save}>Save</Button>
      </Modal.Actions>
    </Modal>
  );
}
