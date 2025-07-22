import './Toast.css';
export default function Toast({ isVisible, children }) {

    return (
        <div style={{ visibility: isVisible ? 'visible' : 'hidden', position: 'absolute', left: '50%' }} className="modal">
            {children}
        </div>

    )
}
