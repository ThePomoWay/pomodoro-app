import { usePaymentStatus } from "../../hooks/PaymentHook";
import {
  SUBSCRIPTION_STATUS_ACTIVE,
  SUBSCRIPTION_STATUS_CANCELED,
  SUBSCRIPTION_STATUS_INACTIVE,
  SUBSCRIPTION_STATUS_PAST_DUE,
  SUBSCRIPTION_STATUS_UNPAID,
} from "../../utils/constants";
import PricingModal from "../pricing-modal/PricingModal";
import SubscriptionActive from "../subscription-states/SubscriptionActive";
import SubscriptionCanceled from "../subscription-states/SubscriptionCanceled";
import SubscriptionInactive from "../subscription-states/SubscriptionInactive";
import SubscriptionPastDue from "../subscription-states/SubscriptionPastDue";
import SubscriptionUnpaid from "../subscription-states/SubscriptionUnpaid";

export function PaymentSettings(props) {
  let { subStatus, planExpiry } = usePaymentStatus();

  // pricing modal to be replace by Subscription Inactive component
  return (
    <div style={{ position: "relative" }}>
      {subStatus == SUBSCRIPTION_STATUS_INACTIVE ? (
        <SubscriptionInactive />
      ) : (
        ""
      )}
      {subStatus == SUBSCRIPTION_STATUS_ACTIVE ? (
        <SubscriptionActive expiry={planExpiry} />
      ) : (
        ""
      )}
      {subStatus == SUBSCRIPTION_STATUS_PAST_DUE ? (
        <SubscriptionPastDue expiry={planExpiry} />
      ) : (
        ""
      )}
      {subStatus == SUBSCRIPTION_STATUS_UNPAID ? (
        <SubscriptionUnpaid expiry={planExpiry} />
      ) : (
        ""
      )}
      {subStatus == SUBSCRIPTION_STATUS_CANCELED ? (
        <SubscriptionCanceled expiry={planExpiry} />
      ) : (
        ""
      )}
      <PricingModal />
    </div>
  );
}
