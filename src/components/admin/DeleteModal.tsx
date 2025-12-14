import { useState } from "react";
import CustomModal from "./CustomModal"
import ButtonLoader from "./ButtonLoader";

interface ModalInterface {
    isOpen: boolean;
    title?: string;
    size?: 'modal-sm' | 'modal-lg' | 'modal-xl';
    onClose: () => void;
    onConfirm: () => void;
    item: string;
}

const DeleteModal = ({
    isOpen, 
    title, 
    onClose, 
    onConfirm,
    size= 'modal-lg',
    item
}: ModalInterface) => {
    const [loading, setLoading] = useState(false);

    const handleConfirmation = async () => {
        try {
            await onConfirm();

        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <CustomModal
            isOpen={isOpen}
            title={title}
            onClose={onClose}
            size={size}
        >
            <p className="text-muted mb-3">
                Are you sure you want to permanently delete the item
                <strong className="text-dark"> “{item}”</strong>?
                <br />
                This action cannot be undone.
            </p>

            <div className="alert alert-danger py-2 small mb-4">
                All related data will be permanently removed.
            </div>

            <div className="d-flex justify-content-center gap-2">
                <button
                    className="btn btn-outline-secondary px-4"
                    onClick={onClose}
                >
                    Cancel
                </button>

                <button
                    className="btn btn-danger px-4"
                    onClick={handleConfirmation}
                    disabled={loading}
                >
                    {loading ? <ButtonLoader /> : 'Proceed'}
                </button>
            </div>
        </CustomModal>
    )
}
export default DeleteModal