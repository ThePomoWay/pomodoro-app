import Navbar from "../../common/components/navbar/Navbar";
import styles from "./PrivacyPolicy.module.scss";

export function PrivacyPolicy(props) {
  return (
    <div className={styles["container"]}>
      <Navbar />
      <div className={styles["main-content"]}>
        <h1 className="font-title">Privacy Policy</h1>
        <h2 className="font-heading">TimeDojo Privacy Policy</h2>
        <p className="font-info">
          When you use our services, you're trusting us with your information.
          We understand this is a big responsibility and work hard to protect
          your information and put you in control. By accessing or using the
          Services, you agree to this Privacy Policy, and our terms of service.
          If you have any questions about this Privacy Policy, you can contact
          us at feedback@timedojo.io
        </p>
        <h2 className="font-heading">Information TimeDojo Collects</h2>
        <h3 className="font-sub-heading">Your activity & apps</h3>
        <p className="font-info">
          At the time you register for TimeDojo, you voluntarily give us
          information such as your name and email address. You have the access
          and can update this information under your personal Account Settings
          at any time. We also collect aggregated, anonymous user data about the
          use of the app.
        </p>
        <h3 className="font-sub-heading">Your browsers & devices</h3>
        <p className="font-info">
          We collect information about the browsers and devices you use to
          access TimeDojo. The user data we collect is used to enhance TimeDojo
          and the quality of our service. We only collect personal data required
          to deliver our services, and we only store it to the extent that it is
          essential to perform these services.
        </p>
        <h2 className="font-heading">Why TimeDojo Collects Data</h2>
        <p className="font-info">
          We use data to build better services. Your information will not be
          shared with others and will only be used internally for the purposes
          described below:
        </p>
        <h3 className="font-sub-heading">Provide our services</h3>
        <p className="font-info">
          We use your information to deliver our services or information you
          requested, and to process and complete any transactions.
        </p>
        <h3 className="font-sub-heading">Maintain & improve our services</h3>
        <p className="font-info">
          We also use your information to ensure our services are working as
          intended, such as tracking outages or troubleshooting issues that you
          report to us. And we use your information to make improvements to our
          services - for example, to analyze usage and trends with anonymous
          user data, and to improve the quality of our service and user
          experience.
        </p>
        <h3 className="font-sub-heading">Communicate with you</h3>
        <p className="font-info">
          TimeDojo collects email addresses from those who communicate with us
          via email, as well as information provided through voluntary
          activities such as site registration or survey participation. We use
          the information we collect to interact with you directly.
        </p>
        <h3 className="font-sub-heading">
          Protect TimeDojo, our users, and the public
        </h3>
        <p className="font-info">
          We use information to help improve the safety and reliability of our
          services. This includes detecting, preventing, and responding to
          fraud, abuse, security risks, and technical issues that could harm
          TimeDojo, our users, or the public. We use different technologies to
          process your information for these purposes. We'll ask for your
          consent before using your information for a purpose that isn't covered
          in this Privacy Policy. You're also welcome to contact us at
          feedback@timedojo.io to ask for our confirmation whenever you feel
          concerned about how your personal information is being processed,
          where and for what purpose.
        </p>
        <h3 className="font-heading">Your Privacy Controls</h3>
        <p className="font-info">
          While TimeDojo owns the TimeDojo application's code, databases, and
          all rights, you retain all rights to your data. You have choices
          regarding the information we collect and how it's used. TimeDojo will
          never sell your personal data with a third party, and we will never
          share data to third parties without your permission
        </p>
        <h3 className="font-heading">Keeping Your Information Secure</h3>
        <p className="font-info">
          TimeDojo is built with strong security features that continuously
          protect your information. SSL protocol secures all data and
          information transmitted with Service. The insights we gain from
          maintaining our services help us detect and automatically block
          security threats from ever reaching you. And if we do detect something
          risky that we think you should know about, we'll notify you and help
          guide you through steps to stay better protected. We work hard to
          protect you and TimeDojo from unauthorized access, alteration,
          disclosure, or destruction of information we hold.
        </p>
        <h3 className="font-heading">Changes to This Policy</h3>
        <p className="font-info">
          If our Privacy Policy changes at some time in the future, we will not
          reduce your rights under this Privacy Policy without your explicit
          consent. We always indicate the date the latest changes were
          published. If changes are significant, we'll provide a more prominent
          notice (including, for certain services, email notification of Privacy
          Policy changes). Please check back periodically to keep informed of
          updates or changes to this Privacy Policy. By continuing to access and
          to use TimeDojo, you are agreeing to be bound by the revised policy.
        </p>
        <p className="font-info">Last Revision Date: 24th March, 2022</p>
      </div>
    </div>
  );
}
