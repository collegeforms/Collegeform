import React from 'react'
import { Link } from 'react-router-dom'
import sImg1 from '../../images/shape/1.svg'
import sImg2 from '../../images/shape/2.svg'
import sImg3 from '../../images/shape/3.svg'
import sImg4 from '../../images/shape/4.svg'

const PageTitle = (props) => {
    return (
        <section className="wpo-page-title">
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <div className="wpo-breadcumb-wrap">
                            <h2>{props.pageTitle}</h2>
                            <ol className="wpo-breadcumb-wrap">
                                <li><Link to="/home">Home</Link></li>
                                <li><span>{props.pagesub}</span></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="shape-1"><img src={sImg1} alt=""/></div>
            <div className="shape-2"><img src={sImg2} alt=""/></div>
            <div className="shape-3"><img src={sImg3} alt=""/></div>
            <div className="shape-4"><img src={sImg4} alt=""/></div>
        </section>
    )
}

export default PageTitle;