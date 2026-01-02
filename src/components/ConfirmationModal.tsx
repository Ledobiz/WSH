import { useState } from "react";
import CustomModal from "@/src/components/admin/CustomModal"
import ButtonLoader from "@/src/components/admin/ButtonLoader";

interface ModalInterface {
    text: string;
    isOpen: boolean;
    isForDelete?: boolean;
    size?: 'modal-sm' | 'modal-lg' | 'modal-xl';
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmationModal = ({
    text,
    isOpen, 
    isForDelete=false, 
    onClose, 
    onConfirm,
    size= 'modal-lg'
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
            title=""
            onClose={onClose}
            size={size}
        >
            <p className="text-muted mb-3 text-center">
                {text}
                <br />
                This action cannot be undone.
            </p>

            {isForDelete && <div className="alert alert-danger py-2 small mb-4">
                All related data will be permanently removed.
            </div>}

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
export default ConfirmationModal