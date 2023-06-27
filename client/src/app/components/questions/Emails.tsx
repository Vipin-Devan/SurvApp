'use client'

import { useState } from "react";
import {BsTrash} from "react-icons/bs";
import {sendEmail} from "../../apiServices";
import { useSearchParams } from "next/navigation";



const Emails = (userId) => {
  const searchParams = useSearchParams();
  const surveyId = searchParams.get('id')


  const [inputEmails, setInputEmails] = useState<string[]>([]);


  const addInput = () => {
    setInputEmails([... inputEmails, ""])
  }

  const addEmail = (index:number, newEmail: string) => {
    const updatedEmails = [...inputEmails];
    updatedEmails[index] = newEmail;
    setInputEmails(updatedEmails);
  }

  const deleteEmail = (EmailToDelete:string) => {
    const updatedEmails = inputEmails.filter((email) => email !== EmailToDelete);
    setInputEmails(updatedEmails);
  }

  const sendEmails = () => {
    sendEmail(userId, inputEmails, surveyId)
    .catch(Error)
  }

  return (
    <div>
      <div className="addNewEmail">
        <input type="button" id="addEmail" value="Add Email" name="addEmail" onClick={(addInput)}/>
      </div>
      <div className="email-list">
        {inputEmails.map((email, index) => (
          <div key={index}>
            <input type="text" value={email} onChange={(event) => 
              addEmail(index, event.target.value)}
              placeholder="Email to send..."/>
              <BsTrash onClick={() => deleteEmail(email)}/>
          </div>
        ))}
        <input type='submit' value='Send' onClick={sendEmails}/>
      </div>
    </div>
  )
}

export default Emails