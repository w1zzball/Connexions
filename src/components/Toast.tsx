import './Toast.css';
export default function Toast({ isVisible, message }) {
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
