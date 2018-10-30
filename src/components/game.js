import React, { Component } from 'react';
import _ from 'lodash';
import { possibleCombinationSum } from '../utils.js';


const Stars = (props) => {

    return (
        <div className="col-5">
            { _.range(props.numberOfStars).map(i =>
                <i key={i} className="fa fa-star"></i>
            )}
        </div>
    );
}

const Button = (props) => {
    let button;
    switch (props.answerIsCorrect) {
        case true:
            button = <button className="btn btn-success"
                                onClick={props.acceptAnswer}>
                <i className="fa fa-check"></i>
            </button>
            break;
        case false:
            button = <button className="btn btn-danger">
                <i className="fa fa-times"></i>
            </button>
            break;
        default:
            button =
                <button className="btn"
                onClick={props.checkAnswer}
                disabled={props.selectedNumbers.length === 0}>
                    =
                </button>
            break;
    }
    return (
        <div className="col-2 text-center">
            {button}
            <br/>
            <button style={{ 'margin-top': "0.5em"}}
                className="btn btn-warning btn-sm"
                onClick={props.redraw}
                disabled={props.redraws === 0}>
                <i className="fa fa-sync-alt"> {props.redraws}</i>
            </button>
        </div>
    );
}

const Answer = (props) => {
    return (
        <div className="col-5">
            {props.selectedNumbers.map((number, i) =>
                <span key={i} onClick={() => props.unselectNumber(number)}>
                    {number}
                </span>
            )}
        </div>
    );
}

const Numbers = (props) => {
    const numberClassName = (number) => {
        if (props.usedNumbers.indexOf(number) >= 0) {
            return 'used selected';
        }
        if (props.selectedNumbers.indexOf(number) >= 0) {
            return 'selected';
        }
    };
    return (
        <div className="card text-center">
            <div>
                {Numbers.list.map((number, i) =>
                    <span key={i} className={numberClassName(number)}
                            onClick={() => props.selectedNumber(number)}>
                        {number}
                    </span>
                )}
            </div>
        </div>
    );
}

Numbers.list = _.range(1, 10);

const DoneFame = (props) => {
    return (
        <div style={{ textAlign: "center", fontSize:"24px", fontStyle:"bold" }} >
            <h2>{props.doneStatus}</h2>
            <button className="btn btn-secondary"
                    onClick={props.resetGame}>
                Play Again
            </button>
        </div>
    );
}

class Game extends Component {
    static randomNumber = () => 1 + Math.floor(Math.random() * 9);
    static initialState = () =>({
        selectedNumbers: [],
        randomNumberOfStars: Game.randomNumber(),
        usedNumbers: [],
        answerIsCorrect: null,
        redraws: 5,
        doneStatus: null,
    });
    state = Game.initialState();
    resetGame = () => this.setState(Game.initialState());
    selectedNumber = (clickedNumber) => {
        if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) {
            return;
        }
        if (this.state.usedNumbers.indexOf(clickedNumber) >= 0) {
            return;
        }
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
        }));
    };
    unselectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers
                                        .filter(number => number !== clickedNumber)
        }));
    };
    checkAnswer = () => {
        this.setState(prevState => ({
            answerIsCorrect: prevState.randomNumberOfStars === prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
        }));
    };
    acceptAnswer = () => {
        this.setState(prevState => ({
            usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
            selectedNumbers: [],
            answerIsCorrect: null,
            randomNumberOfStars: Game.randomNumber(),
        }), this.updateDoneStatus);
    };
    redraw = () => {
        this.setState(prevState => ({
            randomNumberOfStars: Game.randomNumber(),
            selectedNumbers: [],
            answerIsCorrect: null,
            redraws: prevState.redraws - 1,
        }), this.updateDoneStatus);
    }
    possibleSolutions = ({ randomNumberOfStars, usedNumbers }) => {
        const possibleNumbers = _.range(1, 10).filter(number =>
            usedNumbers.indexOf(number) === -1);
        return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
    }
    updateDoneStatus = () => {
        this.setState(prevState => {
            if (prevState.usedNumbers.length === 9) {
                return { doneStatus: 'Done Nice!' };
            }
            if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
                return { doneStatus: "Game Over!" };
            }
        });
    }
    render() {
        const {
            selectedNumbers,
            randomNumberOfStars,
            answerIsCorrect,
            usedNumbers,
            redraws,
            doneStatus
        } = this.state;
        return (
            <div className="container">
                <h3>Play Nine</h3>
                <hr />
                <div className="row">
                    <Stars numberOfStars={randomNumberOfStars}/>
                    <Button selectedNumbers={selectedNumbers}
                        checkAnswer={this.checkAnswer}
                        acceptAnswer={this.acceptAnswer}
                        redraw={this.redraw}
                        redraws={redraws}
                        answerIsCorrect={answerIsCorrect}/>
                    <Answer selectedNumbers={selectedNumbers}
                        unselectNumber={this.unselectNumber}/>
                </div>
                <br />
                {doneStatus ? <DoneFame resetGame={this.resetGame} doneStatus={doneStatus} /> :
                    <Numbers selectedNumbers={selectedNumbers}
                        selectedNumber={this.selectedNumber}
                        usedNumbers={usedNumbers} />
                }
            </div>
        );
    }
}

export default Game