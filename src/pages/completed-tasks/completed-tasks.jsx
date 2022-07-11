import { ClickAwayListener, Popper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useTable,
} from "react-table";
import CustomDateRangePicker from "../../common/components/date-range-picker/date-range-picker";
import { selectAllCompletedTasks } from "../../common/state/selectors";
import { getAllCompletedTasks } from "../../common/state/thunks/TasksThunk";
import { getReadableDate } from "../../common/utils/date-utils";
import { getCSVDownloadLink } from "../../common/utils/download-CSV.ts";

import { ReactComponent as ChevronDown } from "../../common/svgs/ChevronDown.svg";

import { PrioritySelector } from "../../common/components/priority-selector/PrioritySelector";
import ProjectSelector from "../../common/components/project-selector/ProjectSelector";
import styles from "./CompletedTasks.module.scss";

import "./rsuite.min.css";
import { usePaymentStatus } from "../../common/hooks/PaymentHook";
import { setPricingModalState } from "../../common/state/slice/GlobalSlice";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        className={styles["search-bar"]}
      />
    </span>
  );
}

let payload = {};

let getDownloadFileName = function () {
  return (
    "CT_" +
    getReadableDate(payload.startDate).replace(/\s/g, "") +
    "_" +
    getReadableDate(payload.endDate).replace(/\s/g, "")
  );
};

export default function CompletedTasks(props) {
  let dataCompletedTasks = useSelector(selectAllCompletedTasks);

  let [completedTasksArr, setCompletedTasksArr] = useState([]);

  let { isSubscriptionActive } = usePaymentStatus();

  let getCompleteTaskCSV = function (rows) {
    if (isSubscriptionActive) {
      let fileName =
        "CT_" +
        getReadableDate(payload.startDate).replace(/\s/g, "") +
        "_" +
        getReadableDate(payload.endDate).replace(/\s/g, "");
      let headerRow = [
        "project",
        "title",
        "createdOn",
        "completedOn",
        "totalDays",
        "epomo",
        "cpomo",
      ];
      let contentRow = [];
      if (rows && rows.length >= 1) {
        rows.forEach(function (row) {
          let arr = [
            row.values.readProject,
            row.values.title,
            '"' + row.values.readCreatedOn + '"',
            '"' + row.values.readCompletedOn + '"',
            row.values.totalDays,
            row.values.epomo,
            row.values.cpomo,
          ];
          contentRow.push(arr);
        });
      }

      return window.open(getCSVDownloadLink(fileName, headerRow, contentRow));
    } else {
      dispatch(setPricingModalState(true));
    }
  };

  useEffect(() => {
    setCompletedTasksArr(dataCompletedTasks);
  }, [dataCompletedTasks]);

  let dispatch = useDispatch();
  useEffect(() => {
    // todo : change this with completed tasks api
    payload.startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    payload.endDate = new Date(new Date().setDate(new Date().getDate()));

    dispatch(getAllCompletedTasks(payload));
  }, []);
  let [project, setProject] = useState({
    projectID: "",
    secID: "",
  });

  const setProjectId = (projectId, sectionId) => {
    setProject({
      projectID: projectId,
      secID: sectionId,
    });

    setCompletedTasksArr(
      dataCompletedTasks.filter((item) => item.project.projectID === projectId)
    );
  };

  let [tagAnchorEl, setTagAnchorEl] = useState(null);
  let [priorityAncholEl, setPriorityAnchorEl] = useState(null);
  let [projectAnchorEl, setProjectAnchorEl] = useState(null);

  let [priority, setPriority] = useState(-1);

  let [selectedTags, setSelectedTags] = useState([]);
  const onTagAnchorClose = () => {
    setTagAnchorEl(null);
  };

  const onProjectAnchorClose = () => {
    setProjectAnchorEl(null);
  };

  const onProjectAnchorClick = (e) => {
    if (!props.viewOnlyProject) {
      setProjectAnchorEl(e.currentTarget);
      e.stopPropagation();
    }
  };

  const onTagAnchorClick = (e) => {
    setTagAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const onPriorityAnchorClick = (e) => {
    setPriorityAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const onLabelUpdate = (tags) => {
    setSelectedTags(tags);
  };

  const closeAllPopover = () => {
    onProjectAnchorClose();
    onPriorityAnchorClose();
    onTagAnchorClose();
  };

  const onPriorityAnchorClose = (e) => {
    setPriorityAnchorEl(null);
  };

  let getDates = function (value) {
    payload.startDate = value[0];
    payload.endDate = value[1];
    dispatch(getAllCompletedTasks(payload));
  };

  const dataDefault = React.useMemo(
    () => [
      {
        title: "",
        readCreatedOn: "",
        readCompletedOn: "",
        totalDays: "",
        epomo: "",
        cpomo: "",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Project",
        accessor: "readProject",
      },
      {
        Header: "Title",
        accessor: "title", // accessor is the "key" in the data
        colSpan: 2,
      },
      {
        Header: "Created On",
        accessor: "readCreatedOn",
      },
      {
        Header: "Completed On",
        accessor: "readCompletedOn",
      },
      {
        Header: "Total Days taken",
        accessor: "totalDays",
      },
      {
        Header: "Estimated Pomos",
        accessor: "epomo",
      },
      {
        Header: "Completed Pomos",
        accessor: "cpomo",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    { columns, data: completedTasksArr || dataDefault },
    useFilters,
    useGlobalFilter,
    useAsyncDebounce,
    useSortBy
  );

  return (
    <div className={styles["container"]}>
      <div className={styles["heading"]}>
        <span className={styles["title"]}>Completed Tasks</span>
        <div className={styles["custom-date-range"]}>
          <CustomDateRangePicker getDates={getDates}></CustomDateRangePicker>
        </div>
      </div>
      <div className={styles["search-container"]}>
        <div className={styles["left"]}>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <ClickAwayListener
            onClickAway={(e) => {
              closeAllPopover();
            }}
          >
            <div className={styles["filter-items"]}>
              <div
                className={styles["filter-item"]}
                onClick={(e) => {
                  onProjectAnchorClick(e);
                }}
              >
                <ChevronDown />
                Project
                <Popper
                  open={Boolean(projectAnchorEl)}
                  id="project-popover"
                  anchorEl={projectAnchorEl}
                  onClose={(e) => {
                    onProjectAnchorClose(e);
                  }}
                  position="bottom-left"
                >
                  <ProjectSelector onChange={setProjectId} project={project} />
                </Popper>
              </div>

              {/* <div
                className={styles["filter-item"]}
                onClick={(e) => {
                  closeAllPopover();
                  onPriorityAnchorClick(e);
                }}
              >
                <ChevronDown />
                Priority
                <Popper
                  open={Boolean(priorityAncholEl)}
                  id="priority-popover"
                  anchorEl={priorityAncholEl}
                  position="bottom-left"
                >
                  <PrioritySelector
                    priority={priority}
                    onChange={(item) => {
                      setPriority(item);
                      setCompletedTasksArr(
                        dataCompletedTasks.filter(
                          (item) => item.priority === item
                        )
                      );
                      onPriorityAnchorClose();
                    }}
                  />
                </Popper>
              </div> */}
            </div>
          </ClickAwayListener>
        </div>
        <a
          style={{ boxSizing: "border-box" }}
          className="btn add-task-btn"
          onClick={(e) => getCompleteTaskCSV(rows)}
          download={getDownloadFileName()}
        >
          Export as CSV
        </a>
      </div>
      <table>
        <thead>
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: "left",
              }}
            ></th>
          </tr>
        </thead>
      </table>
      <table {...getTableProps()} className={styles["table"]}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              className={styles["table-header"]}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={styles["table-header-item"]}
                  colSpan={column.colSpan || 1}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr className={styles["task-row"]} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      className={styles["task-item"]}
                      {...cell.getCellProps()}
                      colSpan={cell.column.colSpan || 1}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
