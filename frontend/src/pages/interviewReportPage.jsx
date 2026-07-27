import react,{useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import interviewService from '../services/api/interviewService'

//components
import InterviewReport from '../components/InterviewReport'

function InterviewReportPage(){
    const {id}=useParams();
    const [interviewReport,setInterviewReport]=useState(null)

    useEffect(()=>{
        const fetchReport=async ()=>{
            try{
                const response=await interviewService.getInterviewReport(id)
                console.log(response)
                setInterviewReport(response.data)



            }catch(error){
                console.error('An unexpected error occured while fetching interview report \n',error)
            }
        }

        fetchReport()
    },[])
    
    if(!interviewReport){
        return(
            <div className='min-h-screen flex items-center justify-center'>
                <p className='text-gray-500 text-lg'>
                    Loading...
                </p>
            </div>
        )
    }

    return(
        <InterviewReport report={interviewReport} />
    )
}

export default InterviewReportPage

