import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../state/selectors";
import {
  SUBSCRIPTION_STATUS_ACTIVE,
  SUBSCRIPTION_STATUS_INACTIVE,
} from "../utils/constants";

export function usePaymentStatus() {
  let user = useSelector(selectUserInfo);
  let [subStatus, setSubStatus] = useState(user.subscription.status);
  let [planExpiry, setPlanExpiry] = useState("");
  let [isSubscriptionActive, setIsSubscriptionActive] = useState(false);

  useEffect(() => {
    setSubStatus(
      (user.subscription && user.subscription.status) ||
        SUBSCRIPTION_STATUS_INACTIVE
    );
    setPlanExpiry(
      user.planExpiry && new Date(user.planExpiry).getMilliseconds() > 0
        ? new Date(user.planExpiry)
        : ""
    );

    setIsSubscriptionActive(
      (user.subscription &&
        user.subscription.status === SUBSCRIPTION_STATUS_ACTIVE) ||
        false
    );
  }, [user]);

  return { subStatus, planExpiry, isSubscriptionActive };
}
