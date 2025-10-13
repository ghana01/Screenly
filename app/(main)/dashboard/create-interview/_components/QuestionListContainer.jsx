import React from 'react'

const QuestionListContainer = ({questionList}) => {
  return (
    <div className='mt-5'>
                    <h2 className='font-bold text-lg mb-3'>Generated Questions:</h2>

                    {questionList.map((item, index)=>(
                         <div key={index} className='bg-gray-50 p-4 border border-gray-300 rounded-lg'>
                        <pre className='whitespace-pre-wrap text-sm'>
                            <h2 className='font-bold'>{item.question}</h2>
                            <h2 className='text-primary'> InterviewType:{item?.InterviewType}</h2>
                            {/* {typeof item === 'string' ? item : JSON.stringify(item, null, 2)} */}
                        </pre>
                    </div>
                    ))}
                   
                </div>
  )
}

export default QuestionListContainer