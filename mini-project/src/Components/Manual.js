import React, { useState } from "react";

const Manual = () => {
    const [isOpen, setManual] = useState(false);
    const toggleManual = () => {
        setManual(prev => !prev);
    }

    return (
        <div className="Manual">
            <h3 onClick={toggleManual}>{isOpen ? "ᨦ 사용방법 ᨩ ▲" : "ᨦ 사용방법 ᨩ ▼"}</h3>

            <div className={isOpen ? "show-manual" : "hide-manual"}>
                <p>
                    ᨦ <b>Draw</b> 버튼을 클릭하면 <b>Fill</b> 페인트통으로 변해요! 도화지 전체를 칠해요.<br />
                    ᨦ <b>Clear</b> 그림을 초기화 해요. 신중히 눌러주세요! 헗<br />
                    ᨦ <b>Save</b> 버튼으로 멋진 작품을 저장해 보세요. 턳
                </p>
            </div>
        </div>
    );
};

export default Manual;