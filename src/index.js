import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>);
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />);
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [ Array(9).fill(null) ],
            moveIndex: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.moveIndex + 1);
        const current = [...history[history.length - 1]];

        if (calculateWinner(current) || current[i])
            return;
        current[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            // React는 push() 함수보다 concat() 함수를 권장한다.
            // concat() 함수가 기존 배열을 변경하지 않기 때문이라고 한다.
            history: history.concat([current]),
            moveIndex: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    moveTo(moveIndex) {
        this.setState({
            moveIndex,
            xIsNext: !(moveIndex % 2)
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.moveIndex];
        const winner = calculateWinner(current);
        const status = winner ?
            `Winner: ${winner}` :
            `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

        const moves = history.map((h, i) => {
            return (
                // 배열의 index를 key로 사용해도 안전하다. 배열의 순서가 바뀔 일이 없기 때문이다.
                <li key={i}>
                    <button onClick={() => this.moveTo(i)}>
                        Go to {`${i ? `Move #${i}` : 'start'}`}
                    </button>
                </li>);
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current}
                        xIsNext={this.state.xIsNext}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
