export default function Home() {
    return (
        <>
            {/* Hero intro text under the banner/nav */}
            <section className="section section--light">
                <div className="container" style={{ maxWidth: 720 }}>
                    <h1>Professional Painting Services</h1>
                    <p>
                        Interior and exterior painting done right. Clean lines, solid prep,
                        and a finish that lasts.
                    </p>

                    <div style={{ marginTop: 16 }}>
                        <a href="/quote" className="button button-primary">
                            Get a Free Quote
                        </a>
                        <a
                            href="/services"
                            className="button button-outline"
                            style={{ marginLeft: 12 }}
                        >
                            View Services
                        </a>
                    </div>
                </div>
            </section>

            {/* Services preview */}
            <section className="section section--gray">
                <div className="container">
                    <h2>Services</h2>

                    <div className="cards-grid"
                    >
                        <div className="card">
                            <h3>Interior Painting</h3>
                            <p>Walls, ceilings, trim, doors, and detail work with clean edges.</p>
                        </div>

                        <div className="card">
                            <h3>Exterior Painting</h3>
                            <p>Durable finishes, proper prep, and weather-ready results.</p>
                        </div>

                        <div className="card">
                            <h3>Prep & Repairs</h3>
                            <p>Patching, sanding, caulking, and surface prep that makes paint last.</p>
                        </div>

                        <div className="card">
                            <h3>Staining</h3>
                            <p>Decks, fences, and wood features with even coverage and protection.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why choose us */}
            <section className="section section--light">
                <div className="container">
                    <h2>Why Choose Stymie’s</h2>

                    <div className="cards-grid">
                        <div className="card">
                            <h3>Clean Prep</h3>
                            <p>Proper prep makes the finish look better and last longer. No shortcuts.</p>
                        </div>

                        <div className="card">
                            <h3>On-Time & Reliable</h3>
                            <p>Clear scheduling and communication so you know what’s happening and when.</p>
                        </div>

                        <div className="card">
                            <h3>Quality Finish</h3>
                            <p>Sharp lines, smooth coverage, and detail work that looks professional.</p>
                        </div>

                        <div className="card">
                            <h3>Respect Your Home</h3>
                            <p>We protect floors and furniture, clean up daily, and leave the space better.</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 24 }}>
                        <a href="/quote" className="button button-primary">
                            Request a Quote
                        </a>
                    </div>
                </div>
            </section>

        </>
    );
}


