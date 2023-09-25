import React, { useState } from 'react';
import './verification.css'
import Success from '../Success/Success';
export default function Verification(props) {
  const { insurance_calculations } = props.data;
  console.log("HI",insurance_calculations)
  // To store updated values
  const [updatedData, setUpdatedData] = useState(insurance_calculations);
  const [updation,setUpdation] = useState(false)
  const handleInputChange = (index, key, value) => {
    const newData = [...updatedData];
    newData[index][key] = value;
    setUpdatedData(newData);
  };

  const handleSubmit = () => {
    // Send updatedData to the backend
    fetch('http://localhost:8092/api/insurance/update/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.message === "Updated successfully!"){
        setUpdation(true)
      }
      console.log(data.message);
      // Handle other responses here
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  

  return (
    <div className='verification-main'>
      {updation ? ( // Render SuccessComponent when updation is true
        <Success />
      ) : (
      <div className='verification-main'>
      <div className="verification-left">
        <h2>Verification</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='verification-sub'>
          {updatedData.map((plan, index) => (
            <div key={plan.id}>
              <h3>{plan.plan_name}</h3>
  
              {Object.keys(plan).map((key) => {
                if (key !== 'id' ) { // Exclude the id and null values
                  return (
                    <label key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:
                      <input
                        type="text"
                        value={plan[key]}
                        onChange={(e) => handleInputChange(index, key, e.target.value)}
                      />
                    </label>
                  );
                }
                return null;
              })}
            </div>
          ))}
          <button type="submit">Make Changes</button>
        </form>
      </div>
      <div className="verification-right">
        <h2>PDF Preview</h2>
        {props.s3url && (
          <iframe
            src={`https://s3.ap-south-1.amazonaws.com/txgain-user-files/${props.s3url}`}
            width="1100px"
            height="750px" // Adjust the height as needed
            title="PDF Preview"
          />
        )}
      </div>
    </div>
    )}
    </div>
  );
        }  