import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../../state/selectors";
import styles from "./PaymentSettings.module.scss";
import PricingModal from "../pricing-modal/PricingModal";
import SubscriptionActive from "../subscription-states/SubscriptionActive";
import SubscriptionCanceled from "../subscription-states/SubscriptionCanceled";
import SubscriptionUnpaid from "../subscription-states/SubscriptionUnpaid";
import SubscriptionPastDue from "../subscription-states/SubscriptionPastDue";
import SubscriptionInactive from "../subscription-states/SubscriptionInactive";

const SUBSCRIPTION_STATUS_INACTIVE = ""
const SUBSCRIPTION_STATUS_ACTIVE = "active"
const SUBSCRIPTION_STATUS_UNPAID = "unpaid"
const SUBSCRIPTION_STATUS_PAST_DUE = "past_due"
const SUBSCRIPTION_STATUS_CANCELED = "canceled"

export function PaymentSettings(props) {

  let user = useSelector(selectUserInfo);

  let planExpiry = "";
  let [subStatus, setSubStatus] = useState(user.subscription.status);


  useEffect(() => {
    setSubStatus(user.subscription && user.subscription.status || SUBSCRIPTION_STATUS_INACTIVE);
    planExpiry = (user.planExpiry && new Date(user.planExpiry).getMilliseconds() > 0) ? new Date(user.planExpiry) : ""
  }, [user]);

  // pricing modal to be replace by Subscription Inactive component
  return (
    <div style={{ position: "relative" }}>
        {subStatus == SUBSCRIPTION_STATUS_INACTIVE ? <SubscriptionInactive /> : ""}
        {subStatus == SUBSCRIPTION_STATUS_ACTIVE ? <SubscriptionActive expiry={planExpiry}  /> : ""}
        {subStatus == SUBSCRIPTION_STATUS_PAST_DUE ? <SubscriptionPastDue expiry={planExpiry} /> : ""}
        {subStatus == SUBSCRIPTION_STATUS_UNPAID ? <SubscriptionUnpaid expiry={planExpiry}  /> : ""}
        {subStatus == SUBSCRIPTION_STATUS_CANCELED ? <SubscriptionCanceled expiry={planExpiry}  /> : ""}
        <PricingModal />
    </div>
  );
}
