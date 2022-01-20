import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProjectsObj } from '../../state/selectors';
import styles from './ProjectSelector.module.scss';
export default function ProjectSelector(props) {

    let projects = useSelector(selectProjectsObj);
    let projectIds = Object.keys(projects);

    let [selectedProjectId, setSelectedProjectId] = useState(props.project && props.project.projectID || '');
    let [selectedSectionId, setSelectedSectionId] = useState(props.project && props.project.secID || '');

    const onProjectSelect = useCallback((projectId) => {
        setSelectedProjectId(projectId);
        props.onChange && props.onChange(projectId, selectedSectionId);
    });

    const onSectionSelect = useCallback((projectId, secId, e) => {
        setSelectedProjectId(projectId);
        setSelectedSectionId(secId);

        props.onChange && props.onChange(projectId, secId);

        e.stopPropagation();
    })

    if(projectIds.length === 0) {
        return (
        <div>
            Please create a project from all tasks
        </div>
        );
    }

    return (
        <div className={styles['project-container']}>
            {projectIds.map((item, index) => (
                <div key={projects[item].fid + 'project'} className={`${styles['projects']} ${item === selectedProjectId ? styles['selected'] : ''} cursor-pointer`} onClick={(e) => onProjectSelect(item)}> 
                    {projects[item].title}
                    <div className={styles['sections']}>
                        {projects[item].so.map(sectionId => (
                            <div 
                                key={sectionId + 'project-container'} 
                                className={`${styles['section']} ${sectionId === selectedSectionId ? styles['selected'] : ''}  currsor-pointer`}
                                onClick={(e) => onSectionSelect(item, sectionId, e)}>
                                {projects[item].sections[sectionId].title}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

}