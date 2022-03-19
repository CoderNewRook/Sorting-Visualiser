import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import * as Sorter from './Sorters'
import {insertMany, removeManyAt} from './ArrayUtilities'

function App() {
    const baseLength = 32;
    const minRange = 20;
    const maxRange = 100;
    const [baseArr, setBaseArr] = useState(randomArray(baseLength, minRange, maxRange));
    const [arr, setArr] = useState(baseArr);

    const [arrLength, setArrLength] = useState(baseLength);
    const [animInterval, setAnimInterval] = useState(0.1);

    const [animations, setAnimations] = useState(new Array<Sorter.IAnimationStep>());
    const [animIDs, setAnimIDs] = useState(new Array<number>());
    const [colors, setColors] = useState(Array(arr.length).fill("blue"));
    const [sortIndex, setSortIndex] = useState(0);

    // componentDidMount equivalent
    useEffect(() => {
        sort(baseArr, sortButtonData[sortIndex].sortAlg);
    }, []);

    function generateArray(length: number) {
        stopAnimation(false);
        const newArr = randomArray(length, minRange, maxRange);
        setBaseArr(newArr);
        setArr(newArr);
        const colors = Array(newArr.length).fill("blue");
        setColors(colors);
        sort(newArr, sortButtonData[sortIndex].sortAlg);
    }

    function randomArray(length: number, min: number, max: number) {
        const newArr: number[] = [];
        for (let i = 0; i < length; i++) {
            newArr.push(randomInt(min, max));
        }
        return newArr;
    }

    function randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function playAnimation() {
        //console.log(arr);
        //console.log(baseArr);
        //if (animations.length === 0) {
        //    sort(baseArr, sortButtonData[sortIndex].sortAlg);
        //}
        if (animIDs.length > 0) {
            // stop
            stopAnimation(true);
        }
        else {
            // start
            //const ids: number[] = [];
            //for (let i = 0; i < animations.length; i++) {
            resetArr();
            //setArr(baseArr);
            nextStep(baseArr, animations);
            //ids.push(window.setTimeout(animationStep, animationDelay(animInterval), animations[0]));
            //setAnimations(animations.slice(1));
            //}
            //setAnimIDs(ids);
        }
        //console.log(arr);
        //console.log(baseArr);
    }

    function stopAnimation(reset: boolean) {
        animIDs.forEach(id => clearTimeout(id));
        setAnimIDs([]);
        const colors = Array(arr.length).fill("blue");
        setColors(colors);
        if(reset) resetArr();
    }

    function resetArr() {
        setArr(baseArr);
    }

    function sort(arrToSort: number[], sorter: (arrayToSort: number[]) => Sorter.IAnimationStep[]) {
        stopAnimation(true);
        setAnimations(sorter(arrToSort));
        let newSortIndex = 0;
        for (let i = 0; i < sortButtonData.length; i++) {
            if (sortButtonData[i].sortAlg === sorter) {
                newSortIndex = i;
                break;
            }
        }
        updateAnimInterval(arrLength, newSortIndex);
    }

    //const animationDelay = (animationInterval: number) => animationInterval * 1000;

    function animationStep(currentArr: number[], anims: Sorter.IAnimationStep[]) {
        const step = anims[0];
        if (!step) {
            stopAnimation(false);
            return;
        }
        const colors = Array(arr.length).fill("blue");
        const nextArr = [...currentArr];
        if (step.nextIndices) {
            //console.log("Before: " + currentArr);
            const removed = removeManyAt(nextArr, step.indices);
            insertMany(nextArr, removed, step.nextIndices);
            setArr(nextArr);
            //console.log("After: " + nextArr);
            step.nextIndices.forEach(i => colors[i] = step.color);
        }
        else {
            step.indices.forEach(i => colors[i] = step.color);
        }
        setColors(colors);
        if (animations.length > 0) {
            nextStep(nextArr, anims.slice(1));
        }
    }

    function nextStep(currentArr: number[], anims: Sorter.IAnimationStep[]) {
        //const id = window.setTimeout(animationStep, animationDelay(animInterval), currentArr, anims);
        const id = window.setTimeout(animationStep, animInterval, currentArr, anims);
        setAnimIDs([...animIDs, id]);
    }


    function updateSizeSpeed(e: ChangeEvent<HTMLInputElement>) {
        const newLength = parseInt(e.target.value);
        setArrLength(newLength);
        //setAnimInterval(0.1 / Math.pow(newLength, 3));
        updateAnimInterval(newLength, sortIndex);
        //window.setTimeout(generateArray, 10);
        generateArray(newLength);
    }

    function updateAnimInterval(length: number, sorterIndex: number) {
        //const interval = 1000 * 0.1 / Math.pow(length, sortButtonData[sorterIndex].speed);
        //console.log(interval);
        setAnimInterval(0.5 * 1000 * 0.1 / length / sortButtonData[sorterIndex].speed);
    }

    const sortButtonData = [
        { sortAlg: Sorter.bubbleSort, description: "Bubble Sort", speed: 4 },
        { sortAlg: Sorter.selectionSort, description: "Selection Sort", speed: 4 },
        { sortAlg: Sorter.insertionSort, description: "Insertion Sort", speed: 4 },
        { sortAlg: Sorter.mergeSort, description: "Merge Sort", speed: 2 }
    ];

    const visualsWidth = 90;
    const visualsHeight = 65;
    const gap = visualsWidth / (arr.length * 5 - 1);
    const barWidth = gap * 4;
    //console.log(gap);
    //console.log(barWidth);
    const sortButtons = sortButtonData.map((data, i) => <div key={i + "thsorter"} className={i === sortIndex ? "Sort CurrentSort" : "Sort"} onClick={() => { sort(baseArr, data.sortAlg); setSortIndex(i); }}>{data.description}</div>);
    const startStop = animIDs.length > 0 ? "Stop" : "Start";
    const startStopClass = animIDs.length > 0 ? "Start Stop" : "Start";
    //const arrDisplay = arr.map((n, i) => <div className="Data" style={{ backgroundColor: colors[i], height: `${n * 3}px`, width: `${30}px`}} key={i + "th"}></div>);
    const arrDisplay = arr.map((n, i) => <div className="Data" style={{ backgroundColor: colors[i], height: `${visualsHeight * n / maxRange}vh`, width: `${barWidth}vw` }} key={i + "th"}></div>);
    const lastIndex = arrDisplay.length - 1;
    arrDisplay[lastIndex] = <div className="Data" style={{ backgroundColor: colors[lastIndex], height: `${visualsHeight * arr[lastIndex] / maxRange}vh`, width: `${barWidth}vw` }} key={lastIndex + "th"}></div>;
    return (
        <div id="Sorter">
            <div id="ButtonToolbar">
                <div className={startStopClass} onClick={playAnimation}>{startStop}</div>
                <div className="GenerateArray" onClick={() => generateArray(arrLength)}>Generate New Array</div>
                {sortButtons}
                <div className="SizeSpeedContainer">
                    <label htmlFor="SizeSpeed">Size and Speed</label>
                    <input onChange={updateSizeSpeed} id="SizeSpeed" type="range" min={baseLength} max={100} value={arrLength} />
                </div>
            </div>
            <div id="ArrayVisuals" style={{ gap: gap+"vw" }}>
                {arrDisplay}
            </div>
        </div>
    );
}

export default App;
