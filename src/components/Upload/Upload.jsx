import React, { useState } from 'react';
import './upload.css';
import Verification from '../Verification/Verification';

function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const [companyYear, setCompanyYear] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [apiResponseData, setApiResponseData] = useState(null);
    const [s3url, setS3URL] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {
            console.log(`Selected file: ${file.name}`);
        }
    };

    const handleCompanyNameChange = (e) => {
        setCompanyName(e.target.value);
    };

    const handleCompanyYearChange = (e) => {
        setCompanyYear(e.target.value);
    };

    const handleCustomerNameChange = (e) => {
        setCustomerName(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('companyName', companyName);
        formData.append('companyYear', companyYear);
        formData.append('customerName', customerName);

        fetch('http://localhost:8092/api/insurance/uploadform/', {
    method: 'POST',
    body: formData,
})
    .then((response) => response.json()) // Convert the response to JSON format
    .then((data) => {
        if (data.message === "File processed successfully!") {
            setIsVerified(true);
            setApiResponseData(data); // Save the API response data to state
            setS3URL(data.s3_url);
        }
        // Handle other API responses here if necessary
    })
    .catch((error) => {
        // Handle errors here
    });
    };

    return (
        <div className="file-uploader">
            {isVerified ? (
                <Verification data={apiResponseData} s3url={s3url} />
            ) : (
                <form className='form-components' onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={handleCompanyNameChange}
                    />

                    <input
                        type="text"
                        placeholder="Company Year"
                        value={companyYear}
                        onChange={handleCompanyYearChange}
                    />

                    <input
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={handleCustomerNameChange}
                    />

                    <input type="file" onChange={handleFileChange} />

                    {selectedFile && (
                        <div>
                            <p>Selected File: {selectedFile.name}</p>
                        </div>
                    )}



                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
}

export default Upload;
