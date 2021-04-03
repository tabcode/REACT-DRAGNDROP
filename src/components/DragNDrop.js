import React, { useState, useRef } from 'react';

function DragNDrop({ data }) {
    const [list, setList] = useState(data);
    const [drawing, setDrawing] = useState(false);
    const dragItem = useRef();
    const dragNode = useRef();

    const handleDragStart = (e, params) => {
        dragItem.current = params;
        dragNode.current = e.target;
        dragNode.current.addEventListener('dragend', handleDragEnd);
        setTimeout(() => {
            setDrawing(true)
        }, 0)
    }

    const getStyles = (params) => {
        const currentItem = dragItem.current;
        if (currentItem.groupI === params.groupI && currentItem.itemI === params.itemI) {
            return 'current dnd-item';
        } else {
            return 'dnd-item';
        }
    }

    const handleDragEnter = (e, params) => {
        const currentItem = dragItem.current;
        if (e.target !== dragNode.current) {
            setList(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList));
                newList[params.groupI].items.splice(params.itemI, 0, newList[currentItem.groupI].items.splice(currentItem.itemI, 1)[0]);
                dragItem.current = params;
                return newList;
            })
        }
    }

    const handleDragEnd = () => {
        setDrawing(false);
        dragNode.current.removeEventListener('dragend', handleDragEnd);
        dragItem.current = null;
        dragNode.current = null;
    }
    return (
        <div className="drag-n-drop">
            {
                list.map((group, groupI) => (
                    <div
                        key={group.title}
                        className="dnd-group"
                        onDragEnter={drawing && !group.items.length ? (e) => { handleDragEnter(e, { groupI, itemI: 0 }) } : null}
                    >
                        <div className="group-title">
                            {group.title}
                        </div>
                        {
                            group.items.map((item, itemI) => {
                                return (
                                    <div
                                        draggable
                                        key={item}
                                        onDragStart={(e) => { handleDragStart(e, { groupI, itemI }) }}
                                        onDragEnter={drawing ? (e) => { handleDragEnter(e, { groupI, itemI }) } : null}
                                        className={drawing ? getStyles({ groupI, itemI }) : "dnd-item"}>
                                        <div>
                                            <p>
                                                {item}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default DragNDrop
