import styles from "./ProjectMoreOptions.module.scss";
export function ProjectMoreOptions(props) {
  return (
    <div className="popper-container">
      <div
        className="popper-item"
        onClick={(e) => props.onEditProject && props.onEditProject()}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.77487 10.2064V7.68472L7.09909 2.46112C7.47035 2.09687 8.06698 2.10381 8.42967 2.4766L9.57929 3.6582C9.93758 4.02646 9.93335 4.61431 9.5698 4.97737L4.47918 10.0611L1.77487 10.2064Z"
            stroke="#6A6F9A"
            strokeWidth="0.469484"
          />
          <line
            y1="-0.234742"
            x2="3.47132"
            y2="-0.234742"
            transform="matrix(0.688562 0.725177 -0.688562 0.725177 1.77487 7.73438)"
            stroke="#6A6F9A"
            strokeWidth="0.469484"
          />
        </svg>
        Edit project name
      </div>
      {/* <div className={styles["item"]}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.77487 10.2064V7.68472L7.09909 2.46112C7.47035 2.09687 8.06698 2.10381 8.42967 2.4766L9.57929 3.6582C9.93758 4.02646 9.93335 4.61431 9.5698 4.97737L4.47918 10.0611L1.77487 10.2064Z"
            stroke="#6A6F9A"
            strokeWidth="0.469484"
          />
          <line
            y1="-0.234742"
            x2="3.47132"
            y2="-0.234742"
            transform="matrix(0.688562 0.725177 -0.688562 0.725177 1.77487 7.73438)"
            stroke="#6A6F9A"
            strokeWidth="0.469484"
          />
        </svg>
        Sort tasks by
      </div> */}
      <div
        className="popper-item"
        onClick={(e) => props.onDeleteProject && props.onDeleteProject()}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5993 2.22377V1H4.64261V2.22385L2 2.22378V2.66784H2.77979L3.34299 10H8.9098L9.47299 2.66784H10.3719V2.22378L7.5993 2.22377ZM7.16612 1.43318V2.21296H5.08669V1.43318H7.16612ZM9.02895 2.64616L8.49824 9.53427H3.74371L3.22387 2.64616H9.02895Z"
            fill="#6A6F9A"
          />
        </svg>
        Delete project
      </div>
      <div
        className="popper-item"
        onClick={(e) =>
          props.toggleCompletedTasks && props.toggleCompletedTasks()
        }
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="6" cy="6" r="4" stroke="#6A6F9A" strokeWidth="0.7" />
          <path d="M4.5 6L6 7.5L11 2.5" stroke="#6A6F9A" strokeWidth="0.7" />
        </svg>
        {props.showCompletedSection ? "Hide" : "Show"} Completed Tasks
      </div>
    </div>
  );
}
