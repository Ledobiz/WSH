'use client'

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const CelebrationModal = ({ isOpen, onClose, title = 'Congratulations!', message = "You've completed this course. Great job!" }: CelebrationModalProps) => {
  if (!isOpen) return null;

  return (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
    }}>
        <div
            className="bg-white rounded-4 shadow-lg"
            style={{ maxWidth: 520, width: '100%' }}
            onClick={e => e.stopPropagation()}
        >
            <div className="p-4 p-md-5 text-center">
                <div className="mb-3">
                    <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
                    </svg>
                </div>
                <h2 className="fw-bold mb-2">{title}</h2>
                <p className="text-muted mb-4">{message}</p>
                <button className="btn btn-main px-4" onClick={onClose}>Close</button>
            </div>
        </div>
    </div>
  );
};

export default CelebrationModal;
