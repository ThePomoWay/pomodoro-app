import { useState } from "react";
import styles from "./TabsComponent.module.scss";
import { ReactComponent as LockSvg } from "../../svgs/lock.svg";
import { usePaymentStatus } from "../../hooks/PaymentHook";
import { useDispatch } from "react-redux";
import { setPricingModalState } from "../../state/slice/GlobalSlice";

export function TabsComponent(props) {
  let tabs = props.tabs;
  let [selectedTab, setSelectedTab] = useState(props.selected || 0);
  let { isSubscriptionActive } = usePaymentStatus();

  let dispatch = useDispatch();

  let onSelect = (index) => {
    if (!isSubscriptionActive && index > 0) {
      dispatch(setPricingModalState(true));
    } else {
      setSelectedTab(index);
      props.onClick && props.onClick(index);
    }
  };

  return (
    <div className={styles["tabs"]}>
      {tabs.map((item, index) => (
        <div
          className={`${styles["tab"]} ${
            selectedTab === index && styles["selected"]
          }`}
          key={"tab#" + index + item.title}
          onClick={(e) => onSelect(index)}
        >
          {item.title}
          {index > 0 && !isSubscriptionActive && <LockSvg />}
        </div>
      ))}
    </div>
  );
}
