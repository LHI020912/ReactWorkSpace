import { useEffect, useRef, useState } from 'react';
import cli from '../css/cli.mp3';
import Undo from '../css/undo.png';

const Draw = () => {
    // canvas 엘리먼트에 접근하기 위한 ref
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const historyRef = useRef([]);

    const [width, setWidth] = useState(5);
    const [color, setColor] = useState("#000000");
    // '채우기'인지 '그리기'인지 관리상태 추가
    const [isFilling, setFilling] = useState(false);
    const [isInside, setIsInside] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

    const CANVAS_WIDTH = 800;
    const CANVAS_HIGHT = 600;

    useEffect(() => {
        // 컴포넌트가 마운트 된 후 실행됨
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        canvas.width = 800;
        canvas.height = 600;

        // 현재 상태값으로 굵기 설정
        ctx.lineWidth = width;
        ctx.lineCap = "round";

        ctxRef.current = ctx;

        let isPainting = false;

        function onMove(event) {
            if (isPainting) {
                ctxRef.current.lineTo(event.offsetX, event.offsetY);
                ctxRef.current.stroke();
                return;
            }
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(event.offsetX, event.offsetY);
        }

        function startPainting() { isPainting = true; saveHistory(); isPainting = true; }
        function cancelPainting() { isPainting = false; }

        canvas.addEventListener("mousemove", onMove);
        canvas.addEventListener("mousedown", startPainting);
        canvas.addEventListener("mouseup", cancelPainting);
        canvas.addEventListener("mouseleave", cancelPainting);

        // Undo 단축키
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.Key === 'z')
                onUndoClick();
        }
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            canvas.removeEventListener("mousemove", onMove);
            canvas.removeEventListener("mousedown", startPainting);
            canvas.removeEventListener("mouseup", cancelPainting);
            canvas.removeEventListener("mouseleave", cancelPainting);
        };
    }, [isFilling, width]); // isFilling이 바뀔 때 리스너가 새 상태 인지


    // 모드 전환 버튼 클릭 함수 (상태만 반전시킴)
    const onModeClick = () => {
        setFilling((prev) => !prev);
    };

    const onCanvasClick = () => {
        if (isFilling && ctxRef.current) {
            saveHistory();
            ctxRef.current.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HIGHT);
        }
    };

    const onDestroyClick = () => {
        ctxRef.current.fillStyle = "white";
        ctxRef.current.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HIGHT);
    };

    const onEraserClick = () => {
        /*
        ctxRef.current.strokeStyle = "white";
        isFilling = false; // 직접변수를 수정하지 않고 useState으로 통제해야함.(오류)
        setFilling((prev) => !prev);
        */

        if (ctxRef.current) {
            saveHistory();
            ctxRef.current.strokeStyle = "white";
        }

        setFilling(false);
    };

    // 캔버스 Undo 기능
    const saveHistory = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const snapshot = canvas.toDataURL();
        historyRef.current.push(snapshot);

        if (historyRef.current.length > 10) {
            historyRef.current.shift();
        }
    };

    const onUndoClick = () => {
        if (historyRef.current.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // 마지막 스냅샷 꺼내기
        const lastSnapshot = historyRef.current.pop();

        const image = new Image();
        image.src = lastSnapshot;
        image.onload = () => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HIGHT);
            ctx.drawImage(image, 0, 0); // 캔버스에 복구
        };
        playSound(); // 사운드 추가
    };

    const onLineWithChage = (event) => {
        const value = event.target.value;
        setWidth(value);
        if (ctxRef.current)
            ctxRef.current.lineWidth = value;
        //console.count(event.target.value);
    };

    const colors = [
        "#F5F5DC", "#FEEEDC", "#FDE6F0", "#FEC8D8", "#f08080",
        "#B6E7B9", "#77DD77", "#AEDEF0", "#A7C7E7", "#779ECB",
        "#191970", "#E0BBE4", "#663399"
    ];

    const onColorClick = (newColor) => {
        setColor(newColor);
        if (ctxRef.current) {
            ctxRef.current.strokeStyle = newColor;
            ctxRef.current.fillStyle = newColor;
        }
    };

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        setCursorPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleMouseEnter = () => setIsInside(true);
    const handleMouseLeave = () => {
        setIsInside(false);
        setCursorPos({ x: -100, y: -100 });
    };

    function playSound() {
        const audio = new Audio(cli);
        audio.play();
    }

    const onSaveClick = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

        try {
            // 브라우저의 파일 저장 창 호출
            if (window.showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({
                    suggerstName: 'my-drawsing.png',
                    types: [{
                        decription: 'PNG Image',
                        accept: { 'image/png': ['.png'] },
                    }],
                });

                // 사용자가 선택한 위치에 파일 쓰기
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                alert("✨ 저장되었습니다! ✨")
            } else {
                // 가상의 링크(<a>)를 생성하여 다운로드 트리거
                const image = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = image;
                link.download = "my-drawing.png"; // 저장될 파일 이름
                link.click();
            }
        } catch (err) {
            // 사용자가 창을 닫거나 취소했을 때 에러 처리
            console.error("저장이 취소되었습니다.", err);
        }
    };

    return (
        <div className='DrawContainer'>
            <div style={{ position: 'relative', cursor: 'none' }}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>

                <canvas ref={canvasRef} className='Draw-canvas' onClick={onCanvasClick} />

                {/*커서 역할 div */}
                {isInside && (
                    <div
                        style={{
                            position: 'absolute',
                            left: cursorPos.x,
                            top: cursorPos.y,
                            // 채우기 모드와 그리기 모드 차이
                            width: isFilling ? '40px' : `${width}px`,
                            height: isFilling ? '40px' : `${width}px`,
                            borderRadius: isFilling ? '4px' : '50%',
                            pointerEvents: 'none',
                            transform: 'translate(-50%, -50%)',
                            border: '1px solid #c4c4c4',
                            zIndex: 10,

                            backgroundColor: isFilling ? `${color}80` : 'transparent',
                        }}>
                        {isFilling && <span style={{ fontSize: '10px', textAlign: 'center', display: 'block' }}>FILL</span>}
                    </div>
                )}
            </div>

            <div className='item'>
                <input id="line-width" type='range' min='1' max='10' step='0.5' value={width} onChange={onLineWithChage} />
                <span>{width}</span>
                <div className='color-options'>
                    {colors.map((c) => (
                        <div key={c} className='color-option' style={{ backgroundColor: c }} onClick={() => onColorClick(c)} />
                    ))}
                </div>
                <input type='color' id='color' value={color} onChange={(e) => onColorClick(e.target.value)} />
                <img id='undo' src={Undo} onClick={onUndoClick} style={{ width: '30px' }} />
            </div>
            <div className='Fill'>
                <button id='distroy-btn' onClick={() => { onDestroyClick(); playSound(); }}>Clear</button>
                <button id='mode-btn' onClick={() => { onModeClick(); playSound(); }}>{isFilling ? "Fill" : "Draw"}</button>
                <button id='eraser-btn' onClick={() => { onEraserClick(); playSound(); }}>Eraser</button>
                <button id='save-btn' onClick={() => { onSaveClick(); playSound(); }}>Save</button>
            </div>
        </div>
    );
};

export default Draw;