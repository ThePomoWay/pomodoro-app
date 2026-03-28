import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../state/selectors";
import {
  SUBSCRIPTION_STATUS_ACTIVE,
  SUBSCRIPTION_STATUS_INACTIVE,
} from "../utils/constants";
import { getReadableDate } from "../utils/date-utils";

export function usePaymentStatus() {
  let user = useSelector(selectUserInfo);
  let [subStatus, setSubStatus] = useState(
    user && user.subscription && user.subscription.status
  );
  let [planExpiry, setPlanExpiry] = useState(user && user.expiry);
  let [isSubscriptionActive, setIsSubscriptionActive] = useState(false);

  useEffect(() => {
    if (!user) return;
    setSubStatus(
      (user.subscription && user.subscription.status) ||
        SUBSCRIPTION_STATUS_INACTIVE
    );
    setPlanExpiry(
      user.expiry && new Date(user.expiry).getTime() > 0
        ? getReadableDate(user.expiry)
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
