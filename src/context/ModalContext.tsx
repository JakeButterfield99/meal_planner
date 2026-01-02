import React, { ReactNode, useContext, useRef, useState } from "react";

import Modal from 'react-modal';

export interface IModalSetup {
    title: string,
    text: string,
    confirm_cb: Function,
    cancel_cb: Function,
}

export interface IModalContext {
    show: (setup: IModalSetup) => void;
}

const ModalContext = React.createContext<IModalContext | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [text, setText] = useState<string>("");

    const confirmRef = useRef<Function>(() => { });
    const cancelRef = useRef<Function>(() => { });

    function ShowModal(setup: IModalSetup) {
        setTitle(setup.title);
        setText(setup.text);

        confirmRef.current = setup.confirm_cb;
        cancelRef.current = setup.cancel_cb;

        setIsOpen(true);
    }

    function ResetModal() {
        confirmRef.current = () => { };
        cancelRef.current = () => { };
        setTitle("");
        setText("");
    }

    function OnConfirm() {
        confirmRef.current();
        setIsOpen(false);
        ResetModal();
    }

    function OnCancel() {
        cancelRef.current();
        setIsOpen(false);
        ResetModal();
    }

    return (
        <ModalContext.Provider value={{
            show: ShowModal,
        }}>
            <Modal
                isOpen={isOpen}
                onRequestClose={OnCancel}
                className="prompt_modal"
                style={{
                    overlay: { zIndex: 1000 }
                }}
            >
                <div className="header">
                    <h2>{title}</h2>
                </div>

                <div className="content">
                    <p>{text}</p>
                </div>

                <div className="buttons">
                    <button className="alt_button" onClick={OnCancel}>
                        Cancel
                    </button>

                    <button onClick={OnConfirm}>
                        Confirm
                    </button>
                </div>
            </Modal>

            {children}
        </ModalContext.Provider>
    )
}

export const useModal = (): IModalContext => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};