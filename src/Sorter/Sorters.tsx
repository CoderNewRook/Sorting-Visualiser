import { insert, remove, removeAt } from './ArrayUtilities'

export interface IAnimationStep {
    indices: number[];
    nextIndices?: number[];
    color: string
}

export function bubbleSort(arr: number[]): IAnimationStep[] {
    const animations: IAnimationStep[] = [];
    const sortedArr = [...arr];
    for (let n = 0; n < sortedArr.length; n++) {
        for (let i = 0; i < sortedArr.length - 1 - n; i++) {
            animations.push({ indices: [i, i + 1], color: "red" });
            if (sortedArr[i] > sortedArr[i + 1]) {
                swap(sortedArr, i, i + 1);
                animations.push({ indices: [i, i + 1], nextIndices: [i + 1, i], color: "turquoise" });
            }
        }
        if (isSorted(sortedArr, true)) break;
    }
    //if (isSorted(sortedArr, true)) console.log("bubble sorted");
    return animations;
}

export function selectionSort(arr: number[]): IAnimationStep[] {
    const animations: IAnimationStep[] = [];
    const sortedArr: number[] = [];
    const unsortedArr = [...arr];
    for (let n = 0; n < arr.length; n++) {
        for (let i = 0; i < unsortedArr.length; i++) {
            animations.push({ indices: [n + i], color: "red" });
        }
        let smallest = Math.min(...unsortedArr);
        sortedArr.push(smallest);
        const index = remove(unsortedArr, smallest);
        animations.push({ indices: [n + index], nextIndices: [n], color: "turquoise" });
    }
    //if (isSorted(sortedArr, true)) console.log("selection sorted");
    return animations;
}

export function insertionSort(arr: number[]): IAnimationStep[] {
    const animations: IAnimationStep[] = [];
    const sortedArr = [...arr];
    for (let n = 0; n < sortedArr.length; n++) {
        for (let i = n; i > 0; i--) {
            animations.push({ indices: [i, i + 1], color: "red" });
            if (sortedArr[i] < sortedArr[i - 1]) {
                swap(sortedArr, i, i - 1);
                animations.push({ indices: [i, i - 1], nextIndices: [i - 1, i], color: "turquoise" });
            }
            else {
                break;
            }
        }
    }
    //if (isSorted(sortedArr, true)) console.log("insertion sorted");
    return animations;
}

//export function quickSort(arr: number[]): IAnimationStep[] {
//    const animations: IAnimationStep[] = [];
//    const sortedArr = [...arr];
//    for (let n = 0; n < sortedArr.length; n++) {
//        let pivot = 0;
//        let left = 0;
//        for (let i = 0; i < sortedArr.length - 1 - n; i++) {
//            animations.push({ indices: [i, i + 1], color: "red" });
//            if (sortedArr[i] > sortedArr[i + 1]) {
//                swap(sortedArr, i, i + 1);
//                animations.push({ indices: [i, i + 1], nextIndices: [i + 1, i], color: "turquoise" });
//            }
//        }
//        if (isSorted(sortedArr, true)) break;
//    }
//    if (isSorted(sortedArr, true)) console.log("quick sorted");
//    return animations;
//}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function mergeSort(arr: number[]): IAnimationStep[] {
    const animations: IAnimationStep[] = [];
    const sortedArr: number[][] = arr.map(n => [n]);
    //console.log(arr);
    while (sortedArr.length > 1) {
        const iterations = Math.floor(sortedArr.length / 2);
        for (let k = 0; k < iterations; k++) {
            const mergedArr: number[] = [];
            let i = 0, j = 0;
            const firstHalf = sortedArr[k];
            const secondHalf = sortedArr[k + 1];
            const startIndex = k * firstHalf.length * 2;
            const midPoint = startIndex + firstHalf.length;
            //console.log("sorted arr: " + sortedArr);
            //console.log("index: " + startIndex);
            //console.log("------------------------------------------");
            //console.log("startIndex: " + startIndex);
            //console.log("midPoint: " + midPoint);
            while (i < firstHalf.length && j < secondHalf.length) {
                animations.push({ indices: [startIndex + i + j, midPoint + j], color: "red" });
                //console.log(`indices: ${[startIndex + i + j, midPoint + j]}`);
                if (firstHalf[i] < secondHalf[j]) {
                    mergedArr.push(firstHalf[i++]);
                }
                else {
                    animations.push({ indices: [midPoint + j], nextIndices: [startIndex + i + j], color:"turquoise" });
                    //console.log(`indices: ${[midPoint + j]}, nextIndices: ${[startIndex + i + j]}`);
                    mergedArr.push(secondHalf[j++]);
                }
            }
            while (i < firstHalf.length) {
                mergedArr.push(firstHalf[i++]);
            }
            while (j < secondHalf.length) {
                mergedArr.push(secondHalf[j++]);
            }
            //console.log(mergedArr);
            //sortedArr.shift();
            //sortedArr.shift();
            //sortedArr.unshift(mergedArr);
            removeAt(sortedArr, k);
            removeAt(sortedArr, k);
            insert(sortedArr, mergedArr, k);
        }
    }
    //console.log("------------------------------------------");
    //console.log(sortedArr[0]);
    //if (isSorted(sortedArr[0], true)) console.log("merge sorted");
    return animations;
}

function repeatCallback(callback: () => void, repeat: number) {
    for (let i = 0; i < repeat; i++) {
        callback();
    }
}

function swap<T>(arr: T[], n: number, m: number) : void {
    [arr[n], arr[m]] = [arr[m], arr[n]];
//    let t = arr[n];
//    arr[n] = arr[m];
//    arr[m] = t;
}

export function isSorted(arr: number[], ascending: boolean): boolean {
    for (let i = 0; i < arr.length - 1; i++) {
        if (ascending && arr[i] > arr[i + 1]) return false;
        if (!ascending && arr[i] < arr[i + 1]) return false;
    }
    return true;
}