import { useCallback } from 'react';
import AddTagContainer from '../add-tag-container/AddTagContainer';
import styles from './NewLabelContainer.module.scss'

export default function NewLabelContainer(props) {

    
    return (
        <div className={styles['container']}>
            <h2>New Label</h2>
            <AddTagContainer
                hideSelect={true} />
        </div>
    );
}