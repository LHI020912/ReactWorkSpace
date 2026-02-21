import { useState, useEffect } from 'react';
import Color from '../js/Color';

function useTime() {
    const [time, setTime] = useState(() => new Date());
    useEffect(() => {
        const id = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(id);
    }, []);
    return time;
}

const Clock = () => {
    const time = useTime();
    const [color, setColor] = useState('chosoice color');
    return (
        <div className='clock'>
            <p>
                pick a color:{' '}
                <select value={color} onChange={e => setColor(e.target.value)}>
                    <option value="lightcoral">lightcoral</option>
                    <option value="midnightblue">midnightblue</option>
                    <option value="rebeccapurple">rebeccapurple</option>
                </select>
            </p>
            <Color color={color} time={time.toLocaleTimeString()} />
        </div>
    );
};

export default Clock;