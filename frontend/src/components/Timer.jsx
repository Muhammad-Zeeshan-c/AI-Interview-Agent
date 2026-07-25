import react ,{useState} from "react";
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function Timer({ timeleft,totalTime }) {
    const percentage = (timeleft / totalTime) * 100;
    return(
        <div className='w-20 h-20 '>
            <CircularProgressbar
            value={percentage}
            text={`${timeleft}s`}
            styles={buildStyles({
                textSize:'28px',
                pathColor: '#10B981',
                textColor: '#EF4444',
                trailColor: '#D1D5DB'
                
            })}/>

        </div>
    )
}

export default Timer;