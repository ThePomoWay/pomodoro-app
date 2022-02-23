import { Add, Done, Label } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../API/network/AuthService";
import { selectTagsAsArr, selectTagsAsObj } from "../../state/selectors";
import { openOnboardingModal } from "../../state/slices/GlobalSlice";
import { createTagThunk } from "../../state/slices/TagsSlice";
import { generateUniqueId, getObjFromArr } from "../../utils/common";
import { tagColorPalette } from "../../utils/constants";

import styles from "./AddTagContainer.module.scss";

const defaultTagColor = "gray";

let filter = function (filterArr, filterVal) {
  if (!filterVal) {
    return filterArr;
  }
  return filterArr.filter((item) =>
    item.title.toLowerCase().includes(filterVal.toLowerCase())
  );
};

export default function AddTagContainer(props) {
  let tags = useSelector(selectTagsAsArr);
  let tagsObj = useSelector(selectTagsAsObj);

  let selectedTagsArr = props.selectedTags || [];
  let [selectedTagsObj, setSelectedTagsObj] = useState(
    getObjFromArr(selectedTagsArr)
  );

  let [showCreateTag, setShowCreateTag] = useState(true);

  let [createLabelView, setCreateLabelView] = useState(false);
  let [filteredTags, setFilteredTags] = useState(tags);

  let [tagTitle, setTagTitle] = useState("");
  let [selectedIndex, setSelectedIndex] = useState(-1);

  let dispatch = useDispatch();

  useEffect(() => {
    setFilteredTags(filter(tags, tagTitle));
  }, [tags, tagTitle]);

  const handleCheckboxClick = useCallback((tag) => {
    if (!selectedTagsObj[tag.fid]) {
      setSelectedTagsObj({
        ...selectedTagsObj,
        [tag.fid]: 1,
      });

      selectedTagsArr = [...selectedTagsArr, tag.fid];
    } else {
      setSelectedTagsObj({
        ...selectedTagsObj,
        [tag.fid]: 0,
      });
      selectedTagsArr = selectedTagsArr.filter((i) => i !== tag.fid);
    }
    props.onTagsUpdate && props.onTagsUpdate(selectedTagsArr);
  });

  let getTags = useCallback(() => {
    if (filteredTags.length > 0) {
      return (
        <div className={`${styles["tags-list"]} `}>
          {tags.map((tag, ind) => (
            <div
              key={ind}
              onClick={(e) => handleCheckboxClick(tag)}
              className={`popover-normal-item ${styles["tags-item"]} ${
                props.hideSelect && styles["view-only"]
              } ${selectedTagsObj[tag.fid] && "popover-normal-item-selected"}`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                style={{ fill: tag.color }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.7501 1.49951L1.5 6.74961L5.25007 10.4997L10.5002 5.24958V1.49951H6.7501Z" />
                <path d="M10.5335 1.19971H6.88008C6.81339 1.19971 6.7467 1.2264 6.69341 1.27969L1.28001 6.67976C1.17333 6.78644 1.17333 6.94641 1.28001 7.0531L4.93339 10.7198C4.98668 10.7731 5.05337 10.7998 5.12005 10.7998C5.18674 10.7998 5.25343 10.7731 5.30672 10.7198L10.7068 5.31975C10.7601 5.26645 10.7868 5.19977 10.7868 5.13308V1.46637C10.8002 1.31969 10.6801 1.19971 10.5335 1.19971ZM10.2668 5.01309L5.13341 10.1598L1.84003 6.86645L6.98677 1.73305H10.2668V5.01309ZM9.29349 2.70642C9.09352 2.50645 8.81348 2.39977 8.53343 2.39977C8.25338 2.39977 7.98673 2.50645 7.77337 2.70642C7.57341 2.90638 7.46682 3.18642 7.46682 3.46647C7.46682 3.74653 7.5735 4.01317 7.77347 4.22653C7.97343 4.4265 8.24019 4.53318 8.53353 4.53318C8.81358 4.53318 9.08022 4.4265 9.29358 4.22653C9.49355 4.02657 9.60023 3.75981 9.60023 3.46647C9.60014 3.17314 9.49346 2.9064 9.29349 2.70642ZM8.90677 3.83981C8.7068 4.03978 8.34676 4.03978 8.14671 3.83981C8.05342 3.74643 8.00013 3.61316 8.00013 3.46647C8.00013 3.3198 8.05343 3.18642 8.16011 3.09314C8.26679 2.98646 8.40006 2.93316 8.53345 2.93316C8.68012 2.93316 8.8135 2.98646 8.90678 3.09314C9.00016 3.19982 9.06676 3.33309 9.06676 3.46647C9.06685 3.59976 9.01345 3.74643 8.90677 3.83981Z" />
              </svg>

              <span style={{ color: tag.color }} className="">
                {tag.title}{" "}
              </span>
              {!!selectedTagsObj[tag.fid] && (
                <Done
                  style={{
                    width: "0.6em",
                    fill: tag.color,
                    position: "absolute",
                    right: "8px",
                  }}
                ></Done>
              )}
              {/* {
                                (!props.hideSelect && (
                                    <input onChange={(e) => handleCheckboxClick(tag)} checked={!!selectedTagsObj[tag.fid]} type="checkbox" className={styles['tag-checkbox']} />     
                            
                                ))
                            } */}
            </div>
          ))}
        </div>
      );
    }
    return (
      <span className="popover-unselectable">
        {(tagTitle.length > 0 &&
          tags &&
          tags.length !== 0 &&
          "No tags found") ||
          "Your tags will appear here"}
      </span>
    );
  });

  let createTag = useCallback(() => {
    let fid = generateUniqueId();
    dispatch(
      createTagThunk({
        fid,
        title: tagTitle,
        color:
          (selectedIndex !== -1 && tagColorPalette[selectedIndex]) ||
          defaultTagColor,
      })
    );

    setTagTitle("");
    setSelectedIndex(-1);
    setCreateLabelView(false);
    setShowCreateTag(true);
    handleCheckboxClick({ fid });
  });

  let onInput = useCallback((e) => {
    setTagTitle(e.target.value);
    setFilteredTags(filter(tags, e.target.value));
  });

  let onKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      setCreateLabelView(true);
    }
  });

  let onLogin = () => {
    dispatch(openOnboardingModal());
  };

  if (!AuthService.isLoggedIn()) {
    return (
      <div className="popover">
        <div className="popover-title">
          <p>
            <a
              href="javascript:void(0)"
              className={styles["login"]}
              onClick={(e) => onLogin()}
            >
              Login
            </a>{" "}
            to create and add tags
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles["tags-container"]} popover`}>
      <div className={styles["create-tags-container"]}>
        {!createLabelView && showCreateTag && (
          <span
            className={`text-small text-gray ${styles["create-text"]}`}
            onClick={(e) => setShowCreateTag(!showCreateTag)}
          >
            <Add></Add>
            Create new label
          </span>
        )}
        {!showCreateTag && (
          <div>
            <input
              className={styles["tag-input"]}
              autoFocus
              onChange={onInput}
              onKeyDown={onKeyDown}
              value={tagTitle}
            />
            {!createLabelView && (
              <Add
                className={styles["tag-svg"]}
                onClick={(e) => setCreateLabelView(true)}
              ></Add>
            )}
          </div>
        )}
        {createLabelView && (
          <div className={styles["create-view"]}>
            <p className={styles["tag-name-label"]}>Tag Name:</p>
            <p className={styles["tag-title"]}>{tagTitle}</p>
            <p className={styles["tag-name-label"]}>Choose Color:</p>
            <div className={styles["color-palette"]}>
              {tagColorPalette.map((item, index) => (
                <span
                  onClick={(e) => setSelectedIndex(index)}
                  style={{ backgroundColor: item }}
                  className="circle-simple flex flex-center"
                  key={index}
                >
                  {selectedIndex === index && (
                    <Done style={{ width: "0.6em", fill: "white" }}></Done>
                  )}
                </span>
              ))}
            </div>
            <div className={styles["cta"]}>
              {tagTitle.length > 0 && (
                <span>
                  <button className="btn btn-save" onClick={createTag}>
                    Save
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {!createLabelView && getTags()}
    </div>
  );
}
