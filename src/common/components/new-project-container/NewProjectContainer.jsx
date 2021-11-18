import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import { createProjectAsync } from "../../state/slices/ProjectSlice"
import { generateUniqueId } from "../../utils/common"

import {useRouteMatch} from 'react-router-dom';

import styles from "./NewProjectContainer.module.scss"

export default () => {
    let [projectTitle, setProjectTitle] = useState('')
    let {path} = useRouteMatch();
    
    let dispatch = useDispatch();

    const saveProject = useCallback(() => {
        if(projectTitle.length > 0) {
            let fid = generateUniqueId();

            dispatch(createProjectAsync({
                fid,
                title: projectTitle,
                completedTaskOrder: [],
                sections: {},
                sectionOrder: [],
                taskOrder: [],
                isArchived: false
            }));

            setTimeout(() => {
                window.location.href = `${path}/${fid}`
            }, 100);
        }
        
    })

    return (
        <div className={styles['new-project-container']}>
            <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
            <button className="btn btn-simple" onClick={(e) => saveProject()}>Save</button>
        </div>
    )
}