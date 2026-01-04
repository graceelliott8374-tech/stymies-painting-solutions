import { useState } from "react";

export default function Quote() {
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <section className="section section--light">
                <div className="container" style={{ maxWidth: 720 }}>
                    <div className="card">
                        <h1>Request received</h1>
                        <p>
                            Thanks! We’ve got your info and will reach out as soon as possible.
                        </p>

                        <a href="/" className="button button-primary">
                            Back to Home
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section section--light">
            <div className="container" style={{ maxWidth: 720 }}>
                <h1>Request a Free Quote</h1>
                <p>
                    Tell us a little about your project and we’ll get back to you with a
                    quote.
                </p>

                <div className="card" style={{ marginTop: 24 }}>
                    <form
                        className="quote-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSubmitted(true);
                        }}
                    >
                        <div className="form-group">
                            <label>
                                Name <span className="required">*</span>
                            </label>
                            <input type="text" placeholder="Your name" />
                        </div>

                        <div className="form-group">
                            <label>
                                Email <span className="required">*</span>
                            </label>
                            <input type="email" placeholder="you@email.com" />
                            <small className="form-help">
                                We’ll only use your email to contact you about your quote.
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" placeholder="Optional" />
                        </div>

                        <div className="form-group">
                            <label>
                                Type of Service <span className="required">*</span>
                            </label>
                            <select>
                                <option>Interior Painting</option>
                                <option>Exterior Painting</option>
                                <option>Prep & Repairs</option>
                                <option>Staining</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Project Details</label>
                            <textarea rows="4" placeholder="Tell us about the project" />
                            <small className="form-help">
                                Include room sizes, surfaces, or anything you think is important.
                            </small>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="button button-primary">
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}


