'use client';
import { useUser } from "@/src/UserContext";
import Link from "next/link";
import "./settings.css";

const SettingsPage = () => {
  const { user, loading } = useUser();

  const subscriptionStatus = user?.subscription || "Basic";

  if (loading) {
    return <div className="settings__loading">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="settings__wrapper">
        <div className="settings__container settings__container--logged-out">
          <h1 className="settings__title">Settings</h1>
          <div className="settings__logged-out-content">
            <p>Please log in to see your settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings__wrapper">
      <div className="settings__container">
        <h1 className="settings__title">Settings</h1>
        <div className="settings__content">
          <div className="settings__section">
            <h2 className="settings__section-title">Your Subscription plan</h2>
            <div className="settings__plan-details">
                {subscriptionStatus === 'Basic' ? (
                    <>
                        <span className="settings__plan-name">Basic</span>
                        <Link href="/choose-plan" className="settings__upgrade-btn">
                            Upgrade to Premium
                        </Link>
                    </>
                ) : (
                    <span className="settings__plan-name settings__plan-name--premium">{subscriptionStatus}</span>
                )}
            </div>
          </div>
          <div className="settings__section">
            <h2 className="settings__section-title">Email</h2>
            <p className="settings__user-email">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
