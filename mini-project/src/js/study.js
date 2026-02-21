
/*      실습했던 내용 모음
        ctx.rect(50, 50, 100, 100);
        ctx.rect(150, 150, 100, 100);
        ctx.rect(250, 250, 100, 100);
        ctx.fill();

        ctx.beginPath(); // 연결끊기
        ctx.rect(350, 350, 100, 100);
        ctx.fillStyle = "red";
        setTimeout(() => { ctx.fill() }, 5000); // 5초뒤 색상 채우기

        ctx.moveTo(50, 50);
        ctx.lineTo(150, 50);
        ctx.lineTo(150, 150);
        ctx.lineTo(50, 150);
        ctx.lineTo(50, 50);
        ctx.fill();

        // 집 ^^
        ctx.fillRect(200, 200, 50, 200);
        ctx.fillRect(400, 200, 50, 200);
        ctx.lineWidth = 2;
        ctx.strokeRect(300, 300, 50, 100);
        ctx.fillRect(200, 200, 200, 20);
        ctx.moveTo(200, 200);       // 지붕 삼각형
        ctx.lineTo(325, 100);
        ctx.lineTo(450, 200);
        ctx.fill();
        
        // 웃고있는 사람 ^^*
        ctx.fillRect(210, 200, 15, 100);
        ctx.fillRect(350, 200, 15, 100);
        ctx.fillRect(260, 200, 60, 200);

        ctx.arc(290, 140, 40, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(305, 150, 8, Math.PI, 2 * Math.PI);
        ctx.arc(275, 150, 8, Math.PI, 2 * Math.PI);
        ctx.fill();


        // 클릭으로 선 이어 그리기

        ctx.lineWidth = 1;

        const colors = [
            "#ff3838",
            "#ffb8b8",
            "#c56cf0",
            "#ff9f1a",
            "#fff200",
            "#32ff7e",
            "#7efff5",
        ]

        function onClick(event) {
            //ctx.beginPath();
            // console.log(event);
            ctx.moveTo(0, 0);
            const color = colors[Math.floor(Math.random() * colors.length)];
            ctx.strokeStyle = color;
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
        }

        canvas.addEventListener("mousemove", onClick);
        */