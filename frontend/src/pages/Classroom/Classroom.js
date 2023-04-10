import {useContext, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';

import styles from './style.module.css';
import { AuthContext } from '../../context/AuthContext';

const Classroom = () => {
    const [classroomData, setClassroomData] = useState();
    const {apx} = useContext(AuthContext);
    const {id: cid} = useParams()
    useEffect(()=> {
        console.log(cid)
        apx.get(`classrooms/${cid}/`).then(res=> {
            console.log(res.data)
            setClassroomData(res.data)
        })
    }, [])
  return (
    <div className={styles['wrapper']}>
        <h2>{classroomData?.name}</h2>
        <h3>{classroomData?.teacher_firstname}'s classroom</h3>
        <h2>Students</h2>
        <div className={styles["main"]}>

        <div className={styles['student-list']}>
            <ul>
                <li>studnet 1</li>
                <li>studnet 2</li>
                <li>studnet 3</li>
            </ul>
        </div>
        <div className={styles["buttons"]}>

        <button>Add Student/s</button>
        <button>Assign Exam</button>
        </div>
        </div>
    </div>
  )
}

export default Classroom