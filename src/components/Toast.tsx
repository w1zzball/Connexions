import './Toast.css';
export default function Toast({ isVisible, message }) {
    //do not show toast if not visible and no message
    if (!isVisible && !message) return null;
    return (
        <div
            className="toast"
            style={{
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'auto' : 'none',
                position: 'fixed',
                left: '50%',
            }}
        >
            <div className="toast-message">
                <h3>{message}</h3>
            </div>
        </div>
    );
}
