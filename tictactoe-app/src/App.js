import { useState } from 'react';
import myImg from './14.jpg';
import myBack from './15.jpg';
import musicF from './music1.mp3';
import girl from './girl.gif';
import cli from './cli.mp3';
import './App.css'
// 재사용 가능한 컴포넌트
function Square({ value, onSquareClick }) {
  /*
  function handleClick() {
    setValue('X');
  }
  */

  function playSound() {
    const audio = new Audio(cli);
    audio.play();
  }

  return (// 렌더 되어야 함. JSX에서 JS로 갈려면 중괄호 필요
    <>
      <button className='sqare' onClick={() => { onSquareClick(); playSound(); }}><span>{value}</span></button>
    </>
  );
}

// 모든 State 관리를 사각형이 아닌 Board 컴포넌트에서 처리
function Board({ xIsNext, Squares, onPlay }) {//부모에서 Props 전달+업데이트 요청
  //const [xIsNext, setXIsNext] = useState(true);
  //const [Squares, setSquares] = useState(Array(9).fill(null)); // 기억
  const [isVisible, setVisible] = useState(true);

  function HideImg() {
    setVisible(false);
  }
  // 리렌더링 트리거
  function handleClick(i) { // habdle... 배열을 null에서 x로 업데이트
    if (Squares[i] || calculateWinner(Squares))//사용자가 이미 클릭했는지 확인
      return;
    const nextSquares = Squares.slice();//배열 수정대신 slice()로 사본생성
    // X, O 값 반전
    if (xIsNext)
      nextSquares[i] = "X";
    else
      nextSquares[i] = "O";
    onPlay(nextSquares);
    //setSquares(nextSquares);
    //setXIsNext(!xIsNext);
  }

  // 게임 끝~ 승자 알려주기
  const winner = calculateWinner(Squares);
  let status;
  if (winner)
    status = "Winner: " + winner;
  else
    status = "Next player: " + (xIsNext ? "X" : "O");

  return (
    <div className='wrap'><audio src={musicF} autoplay loop controls id="myAudio"></audio>
      <h1>ᨦ Tic ෆ Tac ෆ Toe ᨩ </h1>
      {isVisible && <img src={myImg} className='starting' alt='' />}
      {isVisible && <button className='start' onClick={HideImg}>Start</button>}
      <div className='status'>{status}</div>
      <article>
        <div className="board-row">
          <Square value={Squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={Squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={Squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={Squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={Squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={Squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={Squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={Squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={Squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </article>
      <img src={girl} className='girl' alt='' />
      <img src={myBack} className='back' alt='' />
    </div>
  );
}

export default function Game() {
  // const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  //user가 현재 어떤 단계를 보고 있는지 추적
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  //별도 State변수로 저장하지 않고 currentMove기반으로 수정
  const currentSquares = history[currentMove];
  //마지막 선택 렌더링 대신 선택 동작 렌더링하도록 재설정

  //const currentSquares = history[history.length - 1];
  //이동에 관한 마지막 선택 렌더링은 사각형 마지막 배열을 읽어야 함.

  function handlePlay(nextSquares) {// X, O 값 반전
    //...history 전개 구문을 “history 의 모든 항목 열거”
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    //setCurrentMove(nextHistory.length - 1);
    //setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    //setXIsNext(nextMove % 2 === 0);
    // xIsNext State 선언이나 setXIsNext 호출X
    //currentMove를 변경하는 숫자가 짝수면 xIsNext를 true
  }

  const moves = history.map((Squares, move) => {
    let description;
    if (move > 0)
      description = 'Go to move #' + move;
    else
      description = 'Go to game start';

    //동적인 리스트를 만들 때마다 적절한 key를 할당하는 것
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} Squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// X,O 또는 null 반환하는 도우미 함수
function calculateWinner(Squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (Squares[a] && Squares[a] === Squares[b] && Squares[a] === Squares[c])
      return Squares[a];
  }
  return null;
}