import { Label } from '@material-ui/icons';
import styles from './LabelContainer.module.scss';
import {useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectTagsAsObj, selectTasksFromTag } from '../../state/selectors';
import UndraggableList from '../undraggable-list/UndraggableList';

export default function LabelContainer(props) {

    let {labelId} = useParams();
    let labelsObj = useSelector(selectTagsAsObj);

    let tasks = useSelector(selectTasksFromTag(labelId));

    if(!labelsObj[labelId]){
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className={styles['container']}>
            <div className={styles['header']}>
                <h2>
                    <Label />
                    <UndraggableList tasks={tasks} />
                </h2>
            </div>
        </div>
    )
}