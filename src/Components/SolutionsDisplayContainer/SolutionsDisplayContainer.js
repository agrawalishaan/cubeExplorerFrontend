import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import Solution from '../Solution/Solution';
import { useState, useEffect } from 'react';
import './SolutionsDisplayContainer.css';

/**
 * @param {*} props The props contain:
 * <SolutionsDisplay solutionsList={solutionsList}/>
 * @usage Used in solve.js
 */
function SolutionsDisplayContainer({solutionsList}) {
    // * states
    // ["solution 1", "solution 2" ...]
    // when more solutions are found, props change, but solutionState does not, useState explicitly only registers the first time
    const [solutionState, setSolutionState] = useState(solutionsList);
    // this lets the state update dynamically
    useEffect(() => {
        setSolutionState(solutionsList);
    }, [solutionsList]);

    const JsxSolutions = solutionState.map((solution) => (<Solution solution={solution}/>));


    // * handlers
    // handles clicking the sort button
    // e.target.value is the value of whether the stm or qtm sort button was clicked
    function handleClickOnSort(e) {
        const reorderedList = sortSolutionsDictByMoves(mapSolutionsListToDict(solutionState), e.target.value);
        setSolutionState(reorderedList);
    }

    // * helpers
    // takes in an input of ["solution 1", "solution 2" ...]
    // outputs { "solution 1" : [1, 2], "solution 2" : [3, 4] }
    function mapSolutionsListToDict(solutions) {
        let solutionsDictWithMovecounts = {};
        for (let i = 0; i < solutions.length; i++) {
            const noSpacesPrimeOrDouble = solutions[i].replace(/ /g, '').replace(/'/g, '').replace(/2/g, '');
            const totalSliceMoves = (noSpacesPrimeOrDouble.match(/E/g) || []).length +
                                    (noSpacesPrimeOrDouble.match(/S/g) || []).length +
                                    (noSpacesPrimeOrDouble.match(/M/g) || []).length;
            // maps a solution to [A, B] where A is the STM and B is the QTM
            solutionsDictWithMovecounts[solutions[i]] = [noSpacesPrimeOrDouble.length, noSpacesPrimeOrDouble.length + totalSliceMoves];
        }
        return solutionsDictWithMovecounts;
    }

    // takes in an input of { "solution 1" : [1, 2], "solution 2" : [3, 4] }
    // outputs a list of the sorted solutions by STM: ["M U M2 U2 M'", "R2 U R U R' R' U F R U"]
    function sortSolutionsDictByMoves(obj, stmOrQtm) {
        const strings = Object.keys(obj);
        strings.sort((a, b) => {
            const listA = obj[a];
            const listB = obj[b];
            if (stmOrQtm === 'stm') {
                return listA[0] - listB[0];
            } else {
                return listA[1] - listB[1];
            }
        });
        return strings;
    }

    return (
        <div className="solutionsDisplayContainer">
            <div className="solutionsDisplay">
                <div className="solutionsHeader mainColor">
                <span className="mainText">Solutions</span>
                    <div className="iconAndPopup">
                        <FontAwesomeIcon icon={faCircleInfo} className="solutionsIcon icon mainText"/>
                        <div className="solutionsPopup popup"><p>Any found solutions will be displayed here.
                        Click a solution to copy it to your clipboard. All solutions that exist for a query will be found.</p></div>
                    </div>
                    <div className="solutionsHeaderSpacer"></div>
                    {/* when this onclick is triggered it sorts the state, causing a re-render, so the below JSX should change */}
                    <button onClick={handleClickOnSort} className="sortButton mainText" value="qtm">Sort by QTM</button>
                    <button onClick={handleClickOnSort} className="sortButton mainText" value="stm">Sort by STM</button>
                </div>
                <div className="scrollableSolutions secondaryColor">
                    <ol className="solutionsOl">
                        {JsxSolutions}
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default SolutionsDisplayContainer;