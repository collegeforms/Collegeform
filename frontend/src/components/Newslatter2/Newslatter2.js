import React from 'react'

const SubmitHandler = (e) => {
    e.preventDefault()
}


const Newslatter2 = (props) => {
    return (
        <section className="wpo-subscribe-section-s2 section-padding">
            <div className="container-fluid">
                <div className="wpo-subscribe-wrap">
                    <div className="subscribe-text">
                        <h3>Subscribe to our newsletter to receive
                            latest news on our services.</h3>
                    </div>
                    <div className="subscribe-form">
                        <form onSubmit={SubmitHandler}>
                            <div className="input-field">
                                <input type="email" placeholder="Enter your email" required />
                                <button type="submit">Subscribe</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Newslatter2;