import { ExpandMoreOutlined } from "@material-ui/icons";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Settings from "../../../pages/settings/Settings";

import { useLocation } from "react-router-dom";

import {
  selectBlockedWebsites,
  selectFocusModeObj,
  selectStats,
  selectTimeTrackingObj,
} from "../../state/selectors";
import {
  setPricingModalState,
  showErrorToast,
} from "../../state/slice/GlobalSlice";
import {
  addBlockedSite,
  getBlockedSites,
  getHistory,
  getTimeTrackingDetails,
  removeFromBlockedSites,
} from "../../state/thunks/BlockerThunk";
import { getObjFromArr } from "../../utils/common";
import { getFormattedTime } from "../../utils/date-utils";
import { CustomSlider } from "../custom-slider/CustomSlider";
import Navbar from "../navbar/Navbar";
import PieChart from "../pie-chart/PieChart";
import styles from "./WebsiteBlocker.module.scss";
import { usePaymentStatus } from "../../hooks/PaymentHook";

export default function WebsiteBlocker() {
  let dispatch = useDispatch();

  let stats = useSelector(selectStats);
  let blockedWebsites = useSelector(selectBlockedWebsites);
  let timeTrackingAllObj = useSelector(selectTimeTrackingObj);

  let focusModeObj = useSelector(selectFocusModeObj);
  let blockedHostsObj = getObjFromArr(blockedWebsites, "host");

  let [showAllSites, setShowAllSites] = useState(true);
  let [siteInput, setSiteInput] = useState("");

  let [focusModeOnly, setFocusModeOnly] = useState(false);

  let { isSubscriptionActive } = usePaymentStatus();

  let timeTrackingObj = focusModeOnly ? focusModeObj : timeTrackingAllObj;

  let toggleFocusModeOnly = () => {
    setFocusModeOnly(!focusModeOnly);
  };

  let location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      dispatch(getHistory());
      dispatch(getBlockedSites());
      dispatch(getTimeTrackingDetails());
    }, 1000);
  }, [location]);

  const addSiteToBlockedSites = (siteInput) => {
    if (!siteInput.startsWith("http")) {
      siteInput = "https://" + siteInput;
    }
    try {
      siteInput = siteInput.replace("www.", "");
      let url = new URL(siteInput);
      if (url.hostname in blockedHostsObj) {
        dispatch(showErrorToast("Host already blocked"));
      } else if (url.hostname.includes("timedojo.io")) {
        dispatch(showErrorToast("Timedojo cannot be blocked"));
      } else {
        if (!isSubscriptionActive && blockedWebsites.length > 4) {
          dispatch(setPricingModalState(true));
        } else {
          dispatch(
            addBlockedSite({
              url: url.href,
              host: url.hostname,
              origin: url.origin,
            })
          );
          setSiteInput("");
        }
      }
    } catch (err) {
      dispatch(showErrorToast("Please enter a valid URL"));
    }
  };

  const removeSite = (obj) => {
    dispatch(removeFromBlockedSites(obj));
  };

  const onKeyUp = useCallback((e) => {
    if (e.key === "Enter") {
      addSiteToBlockedSites(siteInput);
    }
  });

  if (!showAllSites) {
    stats = stats.slice(0, 4);
  }

  return (
    <div className={styles["container"]}>
      <Navbar selected="3" />
      <Settings />
      <div className={styles["main-content"]}>
        <div className={styles["block-websites"]}>
          <h1 className="font-title">Block Websites</h1>
          <p className="font-normal">
            Analyze where and which website you spend most time on
          </p>

          <div className={styles["blocker"]}>
            {/* <div className={styles["http"]}>https://</div> */}
            <input
              className={"input " + styles["block-input"]}
              value={siteInput}
              onChange={(e) => {
                setSiteInput(e.target.value);
              }}
              placeholder="Type URL here..."
              onKeyUp={(e) => onKeyUp(e)}
            />
            <button
              className="btn add-task-btn"
              onClick={(e) => addSiteToBlockedSites(siteInput)}
            >
              + ADD SITE
            </button>
          </div>
          <div className={styles["blocked-sites"]}>
            {blockedWebsites.map((item, index) => (
              <div
                className={styles["blocked-site"] + " " + styles["blocked-bg"]}
                key={"blocked-" + index}
              >
                <div className={styles["left"]}>
                  <img
                    src={
                      item.favicon ||
                      "http://www.google.com/s2/favicons?domain=" + item.host
                    }
                  />
                  {item.host}
                </div>
                <button
                  className={styles["button"]}
                  onClick={(e) => removeSite(item)}
                >
                  UNBLOCK
                </button>
              </div>
            ))}

            {blockedWebsites.length === 0 && (
              <div className={styles["blocked-site"]}>
                Blocked sites will appear here
              </div>
            )}
          </div>
        </div>

        <div className={styles["stats"]}>
          <h1 className="font-title">Your History</h1>
          <p className="font-normal">
            Analyze where and which website do you spend most of your time and
            block some of the website for less distractions
          </p>
        </div>
        <div className={styles["time-track"]}>
          <p className={styles["text"]}>
            {focusModeOnly ? "Focus mode tracking" : "Overall tracking"}
          </p>
          <CustomSlider onChange={toggleFocusModeOnly} />
        </div>
        <div className={styles["block-stats"]}>
          <div className={styles["chart"]}>
            <PieChart chartData={timeTrackingObj} />
          </div>
          <div className={styles["sites"]}>
            <p className={styles["title"]}>
              Showing {timeTrackingObj.length} websites
            </p>
            <div className={styles["legend"]}>
              {timeTrackingObj.map((item, index) => (
                <div
                  key={"stats-block" + index}
                  className={`${styles["legend-item"]} ${
                    item.host in blockedHostsObj && styles["blocked-bg"]
                  }`}
                >
                  <div className={styles["left"]}>
                    <img
                      src={
                        item.favicon ||
                        "http://www.google.com/s2/favicons?domain=" + item.host
                      }
                      width="16"
                      height="16"
                    />
                    <span className={styles["url"]}>{item.host}</span>
                  </div>
                  <div className={styles["right"]}>
                    {item.percent > 0 && (
                      <span className={styles["percent"]}>{item.percent}%</span>
                    )}
                    <span className={styles["time"]}>
                      {/* Last visited: {getAnteMeridiemText(item.lastVisitTime)}
                       */}
                      {/* Visited {item.visitedCount} times */}
                      {getFormattedTime(item.timeSpent / 1000)}
                    </span>
                    {!(item.host in blockedHostsObj) && (
                      <span
                        className={styles["button"]}
                        onClick={(e) => {
                          addSiteToBlockedSites(item.host);
                        }}
                      >
                        BLOCK
                      </span>
                    )}

                    {item.host in blockedHostsObj && (
                      <span
                        className={styles["button"]}
                        onClick={(e) => {
                          removeSite(item);
                        }}
                      >
                        UNBLOCK
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {!showAllSites && (
              <div
                className={styles["see-more"]}
                onClick={(e) => setShowAllSites(true)}
              >
                See More <ExpandMoreOutlined style={{ fill: "#7586E3" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
