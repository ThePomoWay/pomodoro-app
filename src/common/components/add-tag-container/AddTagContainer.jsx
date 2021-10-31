import { Add, Done, Label } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTagsAsArr, selectTagsAsObj } from "../../state/selectors";
import { createTagThunk } from "../../state/slices/TagsSlice";
import { generateUniqueId, getObjFromArr } from "../../utils/common";

import styles from "./AddTagContainer.module.scss";

const tagColorPalette = [
    '#DD726B',
    '#4D72EE',
    '#84DDC6',
    '#D969CE',
    '#AACC70'
    
]

const defaultTagColor = 'gray';

export default function AddTagContainer(props) {
    let tags = useSelector(selectTagsAsArr);
    let tagsObj = useSelector(selectTagsAsObj);

    let selectedTagsArr = props.selectedTags || [];
    let [selectedTagsObj, setSelectedTagsObj] = useState(getObjFromArr(selectedTagsArr));

    let dispatch = useDispatch();

    const handleCheckboxClick = useCallback((tag) => {
        if(!selectedTagsObj[tag.fid]) {
            setSelectedTagsObj({
                ...selectedTagsObj,
                [tag.fid]: 1
            })

            selectedTagsArr = [...selectedTagsArr, tag.fid];
        }
        else {
            setSelectedTagsObj({
                ...selectedTagsObj,
                [tag.fid]: 0
            });
            selectedTagsArr = selectedTagsArr.filter(i => i !== tag.fid);

        }
        props.onTagsUpdate && props.onTagsUpdate(selectedTagsArr);
    })

    let getTags = useCallback(() => {
        if(tags.length > 0) {
            return (<div className={styles['tags-list']}>
                        { tags.map((tag, ind) => (<div key={ind} className={styles['tags-item']}>
                            <Label style={{fill: tag.color}} />
                            <span>{tag.title} </span>
                            <input onChange={(e) => handleCheckboxClick(tag)} checked={!!selectedTagsObj[tag.fid]} type="checkbox" className={styles['tag-checkbox']} />     
                            </div>)) }
                    </div>)
        }
        return (<span></span>);
    });

    let createTag = useCallback(() => {
        let fid = generateUniqueId();
        dispatch(createTagThunk({
            fid,
            title: tagTitle,
            color: selectedIndex !== -1 && tagColorPalette[selectedIndex] || defaultTagColor
        }));

        setTagTitle('');
        setSelectedIndex(-1);

        handleCheckboxClick({fid})
    });

    let [showCreateTag, setShowCreateTag] = useState(false);
    let [tagTitle, setTagTitle] = useState('');
    let [selectedIndex, setSelectedIndex] = useState(-1);


    return (
        <div className={styles['tags-container']}>
            {getTags()}
            <div className={styles['create-tags-container']}>
                {
                    showCreateTag && 
                    
                    (<span className="text-small text-gray" onClick={(e) => setShowCreateTag(!showCreateTag)}>
                        <Add></Add>
                        Create new label
                    </span>)
                    
                    ||
                    
                    (
                        <div className={styles['create-view']}>
                            <input className={styles['tag-input']} onChange={(e) => setTagTitle(e.target.value)} value={tagTitle} />
                            <div className={styles['color-palette']}>
                                {tagColorPalette.map((item, index) => (<span onClick={(e) => setSelectedIndex(index)} style={{"backgroundColor": item}} className="circle flex flex-center" key={index}>{selectedIndex === index && (<Done color="action" style={{width: '0.6em'}}></Done>)}</span>))}
                            </div>
                            <div className={styles['cta']}>
                                {
                                    tagTitle.length > 0 && 
                                    (
                                        <span>
                                            <button className="btn btn-simple" onClick={createTag}>Save</button> 
                                        </span>
                                    )
                                }
                            </div>
                        </div>
                    )
                    
                }
            </div>
        </div>
    )
}