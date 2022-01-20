import { taskObjectStoreName } from '../API/indexed-db-ops/init';
import {getObjFromArr} from './common';

export function processBEProject(project, taskObj) {

    let sectionIdMap = getObjFromArr(project.sections, 'secID', true);
    let so = [];
    let to = [];

    if(project.so) {
        so = project.so.map(item => sectionIdMap[item] && sectionIdMap[item].fid).filter(i=>i);

        for(let section of project.sections) {
            section.to = (section.to && section.to.map(item => taskObj[item] && taskObj[item].fid).filter(i=>i)) || [];
        }
    }

    if(project.to) {
        to = project.to.map(item => taskObj[item] && taskObj[item].fid).filter(i=>i);
    }

    return {
        ...project,
        sections: project.sections && getObjFromArr(project.sections, 'fid', true) || [],
        to,
        so
    }
}