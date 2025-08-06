"use client";
interface GenericModalProps {
    closeModal: () => void;
}
const GenericModal = ({ closeModal }: GenericModalProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-2xl bg-opacity-50 z-50">
            <div className="bg-white p-6">
                <div><button onClick={closeModal}>X</button></div>
                <h1>This is a modal</h1>
            </div>
        </div>
    )
}

export default GenericModal;