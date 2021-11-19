
import { AddCircleOutlineOutlined, Label, LabelOutlined } from '@material-ui/icons';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTagsAsArr } from '../../state/selectors';
import { Link } from 'react-router-dom';
import styles from './TagsSidebar.module.scss';

export function TagsSidebar(props) {

    let [tagExpanded, setTagExpanded] = useState(true);

    let tags = useSelector(selectTagsAsArr);

    let pathname = window.location.pathname;
    let selectedTagId = pathname.split('/all/labels/')[1];

    const getTags = useCallback(() => {
        if(tags.length > 0 ) {
           return ( 
           <div>
                {tags.map(item =>(
                    <Link  key={`sidebar-${item.fid}`} to={`/all/labels/${item.fid}`} >
                        <div className={`${styles['tag']} ${selectedTagId === item.fid && styles['selected']}`}>
                            <Label style={{fill: item.color}} />
                            {item.title}
                        </div>
                    </Link>
                ))}
            </div>
           )
        }
        return <div></div>
    })

    return (
        <div>
            <div className={styles['tags-sidebar']}>
                <LabelOutlined />
                Labels
                <span onClick={(e) => setTagExpanded(!tagExpanded)} className={`${styles['accordion']} ${tagExpanded ? 'up-arrow' : 'down-arrow'}`}>
                </span>
            </div>
            <div className={styles['tags-sidebar-second']}>
            {tagExpanded && 
                getTags()
            }
            <Link to="/all/labels">
                <div className={`${styles['sidebar-row']} text-gray`}>
                    <AddCircleOutlineOutlined />
                    Create a Label
                </div>
            </Link>
            </div>
        </div>

    )
}