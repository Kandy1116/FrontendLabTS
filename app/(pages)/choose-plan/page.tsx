'use client';
import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './choose-plan.css';

const AccordionItem = ({ title, content }: { title: string; content: string }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="accordion__item">
        <button className="accordion__title" onClick={() => setIsOpen(!isOpen)}>
          <span>{title}</span>
          <span className={`accordion__icon ${isOpen ? 'accordion__icon--open' : ''}`}>&#x25B2;</span>
        </button>
        {isOpen && <div className="accordion__content">{content}</div>}
      </div>
    );
};

const ChoosePlanPage = () => {
  const [isYearly, setIsYearly] = useState(true);

  const handleCheckout = (plan: 'monthly' | 'yearly') => {
    // Stripe checkout logic will go here
    console.log(`Checking out for ${plan} plan`);
  };

    const faqs: { title: string; content: string }[] = [
    {
      title: "How does the free 7-day trial work?",
      content: "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial."
    },
    {
      title: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
      content: "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option."
    },
    {
      title: "What's included in the Premium plan?",
      content: "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books, high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle."
    },
    {
      title: "Can I cancel during my trial or subscription?",
      content: "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day."
    }
  ];

  return (
    <div className="choose-plan__wrapper">
        <div className="choose-plan__container">
            <div className="choose-plan__header">
                <h1 className="choose-plan__title">Get unlimited access to many amazing books to read</h1>
                <h2 className="choose-plan__sub-title">Turn ordinary moments into amazing learning opportunities</h2>
            </div>

            <div className="choose-plan__plans-container">
                <div className="choose-plan__toggle-wrapper">
                    <div className="choose-plan__toggle-option">Monthly</div>
                    <div className="choose-plan__toggle-switch" onClick={() => setIsYearly(!isYearly)}>
                        <div className={`choose-plan__toggle-slider ${isYearly ? 'yearly' : 'monthly'}`}></div>
                    </div>
                    <div className="choose-plan__toggle-option">Yearly</div>
                </div>

                <div className="choose-plan__plans">
                    <div className={`plan-card ${!isYearly ? 'plan-card--active' : ''}`}>
                        <div className="plan-card__header">Premium</div>
                        <div className="plan-card__price">$9.99/month</div>
                        <div className="plan-card__features">
                            <div className="plan-card__feature">
                                <FaCheckCircle /><span>Unlimited books</span>
                            </div>
                            <div className="plan-card__feature">
                                <FaCheckCircle /><span>Unlimited audio</span>
                            </div>
                            <div className="plan-card__feature">
                                <FaCheckCircle /><span>Cancel anytime</span>
                            </div>
                        </div>
                        <button className="plan-card__btn" onClick={() => handleCheckout('monthly')}>
                            Start with Premium
                        </button>
                    </div>

                    <div className={`plan-card ${isYearly ? 'plan-card--active' : ''}`}>
                        <div className="plan-card__header">Premium Plus</div>
                        <div className="plan-card__price">$99.99/year</div>
                        <p className="plan-card__trial">7-day free trial included</p>
                        <div className="plan-card__features">
                            <div className="plan-card__feature">
                                <FaCheckCircle /><span>Unlimited books</span>
                            </div>
                            <div className="plan-card__feature">
                                <FaCheckCircle /><span>Unlimited audio</span>
                            </div>
                            <div className="plan-card__feature">
                                <FaCheckCircle /><span>Cancel anytime</span>
                            </div>
                            <div className="plan-card__feature">
                                <FaCheckCircle /><span>Send to Kindle</span>
                            </div>
                        </div>
                        <button className="plan-card__btn" onClick={() => handleCheckout('yearly')}>
                            Start your free 7-day trial
                        </button>
                    </div>
                </div>
            </div>

            <div className="choose-plan__accordion">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} title={faq.title} content={faq.content} />
                ))}
            </div>
        </div>
    </div>
  );
};

export default ChoosePlanPage;
