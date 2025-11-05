import React from 'react'
import sImg1 from '../../../images/shop/shop-single/review/img-1.jpg'
import sImg2 from '../../../images/shop/shop-single/review/img-1.jpg'

const SubmitHandler = (e) => {
    e.preventDefault()
}

const Review = () => {
    return (
        <div className="row">
            <div className="col col-lg-10 col-12">
                <div className="client-rv">
                    <div className="client-pic">
                        <img src={sImg1} alt=""/>
                    </div>
                    <div className="details">
                        <div className="name-rating-time">
                            <div className="name-rating">
                                <div>
                                    <h4>Jenefar Willium</h4>
                                </div>
                                <div className="product-rt">
                                    <span>25 Sep 2023</span>
                                    <div className="rating">
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star-o"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="review-body">
                            <p>There are many variations of passages of Lorem Ipsum
                                available, but the majority have suffered alteration in some
                                form, by injected humour, or randomised words which don't
                                look.</p>
                        </div>
                    </div>
                </div>
                <div className="client-rv">
                    <div className="client-pic">
                        <img src={sImg2} alt=""/>
                    </div>
                    <div className="details">
                        <div className="name-rating-time">
                            <div className="name-rating">
                                <div>
                                    <h4>Maria Bannet</h4>
                                </div>
                                <div className="product-rt">
                                    <span>28 Sep 2023</span>
                                    <div className="rating">
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star"></i>
                                        <i className="fa fa-star-o"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="review-body">
                            <p>There are many variations of passages of Lorem Ipsum
                                available, but the majority have suffered alteration in some
                                form, by injected humour, or randomised words which don't
                                look.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col col-lg-12 col-12 review-form-wrapper">
                <div className="review-form">
                    <h4>Add a review</h4>
                    <p>Your email address will not be published. Required fields are marked
                        *</p>
                    <form onSubmit={SubmitHandler}>
                        <div className="give-rat-sec">
                            <p>Your rating *</p>
                            <div className="give-rating">
                                <label>
                                    <input type="radio" name="stars" value="1"/>
                                        <span className="icon">★</span>
                                </label>
                                <label>
                                    <input type="radio" name="stars" value="2"/>
                                        <span className="icon">★</span>
                                        <span className="icon">★</span>
                                </label>
                                <label>
                                    <input type="radio" name="stars" value="3"/>
                                        <span className="icon">★</span>
                                        <span className="icon">★</span>
                                        <span className="icon">★</span>
                                </label>
                                <label>
                                    <input type="radio" name="stars" value="4"/>
                                        <span className="icon">★</span>
                                        <span className="icon">★</span>
                                        <span className="icon">★</span>
                                        <span className="icon">★</span>
                                </label>
                                <label>
                                    <input type="radio" name="stars" value="5"/>
                                        <span className="icon">★</span>
                                        <span className="icon">★</span>
                                        <span className="icon">★</span>
                                        <span className="icon">★</span>
                                        <span className="icon">★</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <input type="text" className="form-control" placeholder="Name *"
                                required/>
                        </div>
                        <div>
                            <input type="email" className="form-control" placeholder="Email *"
                                required/>
                        </div>
                        <div>
                            <textarea className="form-control"
                                placeholder="Review *"></textarea>
                        </div>
                        <div className="rating-wrapper">
                            <div className="submit">
                                <button type="submit" className="theme-btn-s2">Post
                                    review</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Review;