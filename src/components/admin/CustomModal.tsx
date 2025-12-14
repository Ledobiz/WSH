'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

interface ModalInterface {
    isOpen: boolean;
    title?: string;
    size?: 'modal-sm' | 'modal-lg' | 'modal-xl';
    onClose: () => void;
    children: React.ReactNode
}

declare global {
    interface Window {
        bootstrap: any
    }
}

const CustomModal = ({
    isOpen, 
    title, 
    onClose, 
    size= 'modal-lg', 
    children
}: ModalInterface) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const instanceRef = useRef<any>(null);

    useEffect(() => {
        if (!modalRef.current || !window.bootstrap) return;

        instanceRef.current = instanceRef.current || new window.bootstrap.Modal(modalRef.current, {
            backdrop: 'static',
            keyboard: true
        })

        if (isOpen) {
            instanceRef.current.show();
        }
        else {
            instanceRef.current.hide();
        }
    }, [isOpen]);

    return (
        <div
            className="modal fade"
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-labelledby="sign-up"
            aria-hidden="true"
        >
            <div
                className={`modal-dialog modal-dialog-centered ${size} login-pop-form`}
                role="document"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content" id="signup">
                    <div className="position-absolute end-0 top-0 mt-3 me-3 z-1 cursor-pointer"
                        onClick={onClose}
                        style={{cursor: 'pointer'}}
                    >
                        <span
                            className="square--30 circle bg-light z-2 cursor-pointer"
                            data-bs-dismiss="modal"
                            aria-hidden="true"
                            style={{cursor: 'pointer'}}
                        >
                            <i className="bi bi-x" />
                        </span>
                    </div>
                    <div className="modal-body p-4">
                        <div className="login-caps mb-4">
                            <div className="text-center">
                                <h2 className="fw-semibold m-0">{ title }</h2>
                            </div>
                        </div>
                        
                        <div className="login-form">
                            { children }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CustomModal