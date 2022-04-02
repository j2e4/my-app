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

function Board(props) {
    const n = Math.sqrt(props.squares.length);

    return <div>
        {
            Array(n).fill(null).map((_, i) => {
                const startIndex = n * i;
                const squares = props.squares.slice(startIndex, n * (i + 1));
                return (
                    <div key={i} className="board-row">
                        {squares.map((square, j) => (
                            <Square
                                key={startIndex + j}
                                value={square}
                                onClick={() => props.onClick(startIndex + j)}
                            />
                        ))}
                    </div>);
            })
        }
    </div>;
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                pos: Array(2).fill(null)
            }],
            moveIndex: 0,
            xIsNext: true,
            ascOrder: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.moveIndex + 1);
        const squares = history[history.length - 1].squares.slice();

        if (calculateWinner(squares) || squares[i])
            return;
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        const n = Math.sqrt(squares.length);
        this.setState({
            // React는 push() 함수보다 concat() 함수를 권장한다.
            // concat() 함수가 기존 배열을 변경하지 않기 때문이라고 한다.
            history: history.concat([{
                squares,
                pos: [
                    Math.ceil((i + 1) / n),
                    (i + 1) % n ? (i + 1) % n : n
                ]
            }]),
            moveIndex: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    handleSortOrder() {
        this.setState({
            ascOrder: !this.state.ascOrder
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
        const {squares} = history[this.state.moveIndex];
        const winner = calculateWinner(squares);
        const status = winner ?
            `Winner: ${winner}` :
            `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

        const moves = history.map((step, i) => {
            return (
                // 배열의 index를 key로 사용해도 안전하다. 배열의 순서가 바뀔 일이 없기 때문이다.
                <li key={i}>
                    <button
                        style={{ fontWeight: this.state.moveIndex === i ? 'bold' : null }}
                        onClick={() => this.moveTo(i)}
                    >
                        Go to {`${i ? `Move #${i} (${step.pos.join(', ')})` : 'start'}`}
                    </button>
                </li>);
        });
        if (! this.state.ascOrder)
            moves.reverse();

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={squares}
                        xIsNext={this.state.xIsNext}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.handleSortOrder()}>
                        Sort in {this.state.ascOrder ? 'Descending' : 'Ascending'} Order
                    </button>
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
