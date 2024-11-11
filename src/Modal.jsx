import React, { useRef } from 'react'
import './App.css'


const Modal = ({ displayPopUp, setDisplayPopUp, onClose}) => {
  return (
    <div className="modal-container" >
        
      <div className='modal' ref={useRef()} >
        <button className='close-modal' onClick={onClose}> &times; </button>
        <h2>Welcome..!</h2>
        <h3>Please select an user to see posts made by that user only.</h3>
        <p>Note :- Kindly close this window.</p>
      </div>
    </div>
  )
}

export default Modal
