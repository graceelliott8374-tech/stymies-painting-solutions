export default function Lightbox({ isOpen, src, alt, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="lightbox" onClick={onClose} role="presentation">
            <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
                <button className="lightbox__close" onClick={onClose} type="button">
                    ✕
                </button>
                <img src={src} alt={alt} />
            </div>
        </div>
    );
}
