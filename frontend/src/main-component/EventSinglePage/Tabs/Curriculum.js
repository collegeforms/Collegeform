import React from 'react'
import { Link } from 'react-router-dom'


const Curriculum = () => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    
    return (
        <div className="wpo-course-content">
            <div className="wpo-course-text-top">
                <h2>Starting Beginners Level Course</h2>
                <div className="course-b-text mt-1">
                    <p>On the other hand, we denounce with righteous indignation
                        and dislike men who are so beguiled and demoralized by
                        the charms of pleasure of the moment, so blinded by
                        desire, that they cannot foresee the pain and trouble
                        that are bound to ensue and equal blame belongs to those
                        who fail in their duty through weakness of will, which
                        is the same as saying through shrinking from toil and
                        pain.</p>
                </div>
                <div className="course-curriculam">
                    <ul>
                        <li><span><i className="fi flaticon-play-button"></i>Introduction of Editing<Link onClick={ClickHandler} to="/lesson">Preview</Link></span><small>20 Minutes</small></li>
                        <li><span><i className="fi flaticon-play-button"></i>Overview of Editing<Link onClick={ClickHandler} to="/lesson">Preview</Link></span><small>16 Minutes</small></li>
                        <li><span><i className="fi flaticon-e-learning"></i>Basic Editing Technology</span></li>
                        <li><span><i className="fi flaticon-knowledge"></i>Quiz</span><small>5 Questions</small></li>
                    </ul>
                </div>
            </div>
            <div className="wpo-course-text-top">
                <h2>Intermediate Level Course</h2>
                <div className="course-b-text mt-1">
                    <p>On the other hand, we denounce with righteous indignation
                        and dislike men who are so beguiled and demoralized by
                        the charms of pleasure of the moment, so blinded by
                        desire, that they cannot foresee the pain and trouble
                        that are bound to ensue and equal blame belongs to those
                        who fail in their duty through weakness of will, which
                        is the same as saying through shrinking from toil and
                        pain.</p>
                </div>
                <div className="course-curriculam">
                    <ul>
                        <li><span><i className="fi flaticon-play-button"></i>Introduction of Editing<Link onClick={ClickHandler} to="/lesson">Preview</Link></span><small>20 Minutes</small></li>
                        <li><span><i className="fi flaticon-e-learning"></i>Basic Editing Technology</span></li>
                        <li><span><i className="fi flaticon-knowledge"></i>Quiz</span><small>5 Questions</small></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Curriculum;