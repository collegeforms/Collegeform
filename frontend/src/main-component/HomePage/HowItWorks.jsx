import React from "react";
import { motion } from "framer-motion";

const HowItWorks = () => {
    const steps = [
        { 
            img: "https://static.vecteezy.com/system/resources/previews/011/420/616/original/search-icon-3d-png.png", 
            title: "Search Colleges",
            description: "Find your perfect college from 500+ institutions across India"
        },
        { 
            img: "https://cdn3d.iconscout.com/3d/premium/thumb/e-form-10979376-8786443.png", 
            title: "Fill CAF Form", 
            description: "Complete one common application form for multiple colleges"
        },
        { 
            img: "https://img.freepik.com/premium-psd/3d-payment-icon-illustration-render_148391-7595.jpg", 
            title: "Make A Payment", 
            description: "Secure online payment with multiple options available"
        },
        { 
            img: "https://static.vecteezy.com/system/resources/previews/019/898/722/original/phone-call-3d-icon-free-png.png", 
            title: "Get Free Counseling", 
            description: "Expert guidance throughout your admission process"
        }
    ];

    // Animation variants (same as original)
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    };

    const titleAnimation = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const arrowAnimation = {
        hover: {
            x: [0, 8, 0],
            transition: {
                repeat: Infinity,
                duration: 1.8,
                ease: "easeInOut"
            }
        }
    };

    const cardHover = {
        hover: {
            y: -10,
            boxShadow: "0 20px 40px rgba(27, 122, 255, 0.15)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 10
            }
        }
    };

    const iconHover = {
        hover: {
            rotate: [0, 10, -5, 0],
            transition: {
                duration: 0.6
            }
        }
    };

    return (
        <section className="hiw-section">
            <div className="container">
                {/* Keeping the original heading exactly as is */}
                <motion.div 
                    className="text-center mb-5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={container}
                >
                    <motion.h2 
                        className="fw-bold mb-4"
                        variants={titleAnimation}
                        style={{ fontSize: '3rem' }}
                    >
                        <span className="">How It</span> Works
                        <motion.span 
                            className="svg ms-2"
                            whileHover="hover"
                            variants={arrowAnimation}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="50"
                                height="30"
                                viewBox="0 0 38 15" 
                                fill="none"
                            >
                                <path fill="#1B7AFF" d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z"></path>
                            </svg>
                        </motion.span>
                    </motion.h2>

                    <motion.p 
                        className="text-muted mx-auto mb-5"
                        style={{ maxWidth: '700px', fontSize: '0.9rem' }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        At Collegeforms.in, we believe that making the right educational choices should be a seamless experience. We offer a comprehensive, user-friendly service that covers everything a student needs when it comes to college applications:
                    </motion.p>
                </motion.div>

                {/* Completely redesigned cards section */}
                <motion.div 
                    className="hiw-cards-container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={container}
                >
                    {steps.map((step, index) => (
                        <motion.div 
                            key={index}
                            className="hiw-card-wrapper"
                            variants={item}
                        >
                            <motion.div
                                className="hiw-card"
                                whileHover="hover"
                                variants={cardHover}
                            >
                                <div className="hiw-card-inner">
                                    <motion.div 
                                        className="hiw-icon-container"
                                        whileHover="hover"
                                        variants={iconHover}
                                    >
                                        <img 
                                            src={step.img} 
                                            alt={step.title} 
                                            className="hiw-icon"
                                        />
                                    </motion.div>
                                    
                                    <div className="hiw-content">
                                        <div className="hiw-step-number">Step {index + 1}</div>
                                        <h3 className="hiw-title">{step.title}</h3>
                                        <p className="hiw-description">{step.description}</p>
                                    </div>
                                    
                                    <div className="hiw-card-bg"></div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <style jsx>{`
                .hiw-section {
                    padding: 5rem 0;
                    background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);
                    position: relative;
                    overflow: hidden;
                }
                
                .hiw-cards-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .hiw-card-wrapper {
                    perspective: 1000px;
                }
                
                .hiw-card {
                    height: 100%;
                    position: relative;
                    transform-style: preserve-3d;
                }
                
                .hiw-card-inner {
                    position: relative;
                    height: 100%;
                    padding: 2.5rem;
                    border-radius: 20px;
                    background: white;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(27, 122, 255, 0.1);
                    transform: translateZ(20px);
                }
                
                .hiw-card:hover .hiw-card-inner {
                    transform: translateZ(30px);
                }
                
                .hiw-icon-container {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(135deg, rgba(27, 122, 255, 0.1) 0%, rgba(27, 122, 255, 0.05) 100%);
                    position: relative;
                    z-index: 2;
                }
                
                .hiw-icon {
                    width: 45px;
                    height: 45px;
                    object-fit: contain;
                }
                
                .hiw-content {
                    position: relative;
                    z-index: 2;
                }
                
                .hiw-step-number {
                    display: inline-block;
                    background: rgba(27, 122, 255, 0.1);
                    color: #1b7aff;
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                
                .hiw-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    color: #1a1a1a;
                }
                
                .hiw-description {
                    color: #6c757d;
                    line-height: 1.6;
                    margin-bottom: 0;
                }
                
                .hiw-card-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(27, 122, 255, 0.03) 0%, rgba(27, 122, 255, 0.01) 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .hiw-card:hover .hiw-card-bg {
                    opacity: 1;
                }
                
                /* Decorative elements */
                .hiw-card::before {
                    content: '';
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: rgba(27, 122, 255, 0.05);
                    z-index: 1;
                    transition: all 0.3s ease;
                }
                
                .hiw-card:hover::before {
                    transform: scale(1.2);
                    background: rgba(27, 122, 255, 0.1);
                }
                
                .hiw-card::after {
                    content: '';
                    position: absolute;
                    bottom: -20px;
                    left: -20px;
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: rgba(0, 198, 255, 0.05);
                    z-index: 1;
                    transition: all 0.3s ease;
                }
                
                .hiw-card:hover::after {
                    transform: scale(1.1);
                    background: rgba(0, 198, 255, 0.1);
                }
                
                @media (max-width: 768px) {
                    .hiw-cards-container {
                        grid-template-columns: 1fr;
                        max-width: 400px;
                    }
                    
                    .hiw-card-inner {
                        padding: 2rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default HowItWorks;