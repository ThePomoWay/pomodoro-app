import { ClickAwayListener, Popover, Popper } from "@material-ui/core";
import { Close, ExpandMore, Flag, FormatListBulleted, FormatListBulletedOutlined, FormatListBulletedRounded, FormatListBulletedTwoTone, Label, TagFaces } from "@material-ui/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectProjectsObj, selectTagsAsArr, selectTagsAsObj } from "../../state/selectors";
import { setTags } from "../../state/slices/TagsSlice";
import { generateUniqueId, getObjFromArr } from "../../utils/common";
import { priorityColorMap } from "../../utils/constants";
import AddTagContainer from "../add-tag-container/AddTagContainer";
import EstimatedPomos from "../estimate-pomos/EstimatedPomos";
import { PrioritySelector } from "../priority-selector/PrioritySelector";
import ProjectSelector from "../project-selector/ProjectSelector";
import TaskDescription from "../task-description/TaskDescription";

import styles from "./EditTaskContainer.module.scss";

let setEndOfContentEditable = (elem) => {
    let range, selection;
    if(document.createRange) {
        range = document.createRange();
        range.selectNodeContents(elem);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    else if(document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(elem);
        range.collapse(false);
        range.select();
    }
}

export default function EditTaskContainer(props) {
    let taskToBeEdited = props.task || {};

    let tags = useSelector(selectTagsAsObj);
    let projectsObj = useSelector(selectProjectsObj);

    let ref = useRef(null);

    let [title, setTitle]                   = useState(taskToBeEdited.title || '');
    let [priority, setPriority]             = useState(taskToBeEdited.priority || 2);
    let [description, setDescription]       = useState(taskToBeEdited.description || '');
    let [schedule, setSchedule]             = useState(taskToBeEdited.schedule || new Date());
    let [estimatedPomos, setEstimatedPomos] = useState(taskToBeEdited.estimatedPomos || 0);
    let [isBulleted, setIsBulleted]         = useState(taskToBeEdited.isBulleted || false);
    let [project, setProject]               = useState(taskToBeEdited.project || {});

    let [tagAnchorEl, setTagAnchorEl] = useState(null);
    let [priorityAncholEl, setPriorityAnchorEl] = useState(null)
    let [projectAnchorEl, setProjectAnchorEl] = useState(null);

    let [selectedTags, setSelectedTags] = useState(taskToBeEdited.labels || []);

    const onTagAnchorClick = useCallback((e) => {
        setTagAnchorEl(e.currentTarget);
        e.stopPropagation();
    });

    const onTagAnchorClose = useCallback((e) => {
        setTagAnchorEl(null);
    });

    const onProjectAnchorClick = useCallback((e) => {
        setProjectAnchorEl(e.currentTarget);
        e.stopPropagation();
    });

    const onProjectAnchorClose = useCallback((e) => {
        setProjectAnchorEl(null);
    });

    const onPriorityAnchorClick = useCallback((e) => {
        setPriorityAnchorEl(e.currentTarget);
        e.stopPropagation();
    });

    const onPriorityAnchorClose = useCallback((e) => {
        setPriorityAnchorEl(null);
    });

    let resetContainer = useCallback((taskToBeEdited) => {
        
        setTitle(taskToBeEdited.title || '');
        setPriority(taskToBeEdited.priority || 1);
        setDescription(taskToBeEdited.description || '');
        setTags(taskToBeEdited.labels || []);
        setIsBulleted(taskToBeEdited.isBulleted || false);
        // setSchedule(taskToBeEdited.schedule);

        if(ref) {
            ref.current.textContent = taskToBeEdited.title || ''
            setEndOfContentEditable(ref.current);
        }
    })
    

    let doSaveTask = useCallback(() => {
        if(title){
        let task = {
            fid: taskToBeEdited.fid || generateUniqueId(),
            title,
            priority,
            description,
            schedule: schedule.toString(),
            estimatedPomos,
            isBulleted,
            summary: {
                csec: 0,
                cpomo: 0
            },
            project: {
                projectID: project.projectID || '',
                secID: project.secID || ''
            },
            labels: selectedTags
        }
        
        if(taskToBeEdited.fid) {
            task = {
                ...taskToBeEdited,
                title,
                priority,
                description,
                schedule: schedule.toString(),
                estimatedPomos,
                labels: selectedTags,
                project: {
                    projectID: project.projectID,
                    secID: project.secID
                }
            }
        }
        
        resetContainer({});

        props.saveTask(task);
        }

        // setTitle('');
        // setPriority(2);
        // setDescription('');
        // setShowTitleInput(true);

    });

    let doCancelTask = useCallback(() => {
        props.saveTask({});
    }, []);

    const onTitleInput = useCallback((e) => {
        if (e.key === 'Enter' && title) {
            doSaveTask();
        }
        
        if(e.key === 'Backspace') {
            setTitle(title.slice(0,title.length-1));
        }

        if((e.keyCode > 64 && e.keyCode < 91) || e.keyCode==32 || (e.keyCode >=48 && e.keycode <=57) ){
            setTitle(title + e.key);
        }
    })

    const onLabelUpdate = useCallback((tags) => {
        setSelectedTags(tags);
    });
    
    const removeTag = useCallback((item) => {
        setSelectedTags(selectedTags.filter(i => i !== item));
    });

    const setProjectId = useCallback((projectId, sectionId) => {
        setProject({
            projectID: projectId,
            secID: sectionId
        })
    });

    const getTaskTags = useCallback(() => {
        return (
        <div className={styles['task-tags-list']}>
            {selectedTags.map((item, ind) => (
                <span key={ind} className={styles['task-tag-item']} style={{borderColor: tags[item].color, color: tags[item].color}}>
                    {tags[item].title}
                    <Close className={styles['close']} style={{width: '12px'}} onClick={(e) => removeTag(item)} />
                    </span>
            ))}
        </div>)
    })

    return (
        <div>
        <div className={styles['edit-task']}>
            <div ref={ref} className={styles['content-editable-div']} onKeyDown={onTitleInput} contentEditable="true">
                
            </div>
            <div className={styles['description']}>
                <TaskDescription onChange={(e) => setDescription(e)} isBulleted={isBulleted} value={taskToBeEdited.description} />
            </div>
            {getTaskTags()}
            <div className={styles['cta-row']}>
                <div className={styles['estimated-pomos']}>
                    <span className={styles['estimated-pomos-text']}>Estd. Pomo: </span>
                    <div className={styles['estimated-pomos-container']}>
                        <EstimatedPomos default="5" value={estimatedPomos} onClick={(value) => {setEstimatedPomos(value)}}/>
                    </div>
                </div>
                <ClickAwayListener onClickAway={(e) => {onPriorityAnchorClose();onTagAnchorClose()}}>
                <div className={styles['right-cta']}>
                    <FormatListBulletedOutlined className={`cursor-pointer ${isBulleted ? styles['border-round'] : ''}`} onClick={(e) => setIsBulleted(!isBulleted)} />
                    
                    <Flag style={{fill: priorityColorMap[priority]}} onClick={onPriorityAnchorClick} />
                    
                    <Popper
                    open={Boolean(priorityAncholEl)}
                    id="priority-popover"
                    anchorEl={priorityAncholEl}
                    position="bottom-left">
                      <PrioritySelector priority={priority} onChange={(item) => setPriority(item)} />
                    </Popper>

                    <Label className="cursor-pointer" onClick={onTagAnchorClick}/>
                    <Popper
                        open={Boolean(tagAnchorEl)}
                        id="priority-popover"
                        anchorEl={tagAnchorEl}
                        onClose={onTagAnchorClose}
                        position="bottom-left"
                    >
                      <AddTagContainer 
                        selectedTags={selectedTags}
                        onTagsUpdate={onLabelUpdate}></AddTagContainer>
                    </Popper>

                    <div className={`cursor-pointer ${styles['project']}`} onClick={onProjectAnchorClick} >
                        {project.projectID && (
                            projectsObj[project.projectID] && projectsObj[project.projectID].title
                        ) || (
                            'Select a Project'
                        )}
                        <ExpandMore />
                    </div>
                    <Popper
                        open={Boolean(projectAnchorEl)}
                        id="project-popover"
                        anchorEl={projectAnchorEl}
                        onClose={onProjectAnchorClose}
                        position="bottom-left"
                    >
                      <ProjectSelector onChange={setProjectId} projectId={project.projectID} sectionId={project.secID} />
                    </Popper>

                    
                    
                </div>
                </ClickAwayListener>
            </div>
        </div>
        <div className={styles['save-cta']}>
            <button className="btn btn-simple" onClick={() => {doSaveTask()}}>Save</button>
            <button className="btn btn-simple btn-simple-light" onClick={() => {doCancelTask()}}>Cancel</button>
        </div>
    </div>)
}