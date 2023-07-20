import React, { useState } from 'react'
import { useState } from 'react';
const Upload = () => {
    const [downloadUrl,setDownloadUrl] = useState("");
    const [selectedFile,setSelectedFile] = useState(null);
    const [ttl,setTtl] = useState(600000);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    const handleTTLChange = (event) =>{
        setTtl(Number(event.target.value))
    }

    async function encryptblob(blob) {
        let iv = crypto.getRandomValues(new Uint8Array(12));
        let algorithm = {
        name: "AES-GCM",
        iv: iv,
        };

        let key = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
        );

        let data = await blob.arrayBuffer();

        const result = await crypto.subtle.encrypt(algorithm, key, data);

        let exportedkey = await crypto.subtle.exportKey("jwk", key);

        return [new Blob([result]), iv.toString(), exportedkey];
    }


    const handleUpload = async () =>{
        if(!selectedFile){
            alert("please selct the file")
        }
        else{
            try{
                const blob = new Blob([selectedFile], {type: selectedFile.type });
                const [enc_blob,iv,k]=  await encryptblob(blob);
                const key = k.k;
                const file_id = Math.floor((Math.random() * 1000000) + 1);
                const formData = new FormData();
                formData.append("name", selectedFile.name);
                formData.append("file_data", enc_blob);
                formData.append("iv",iv);
                formData.append("id",file_id);
                formData.append("expire_time",Date.now() + ttl);
                const data =  await fetch(`http://localhost:8000/upload`,{method:"POST",body:formData});
                console.log(data);
                setDownloadUrl(`http://localhost:1234/${file_id}/${key}`);


            }catch(err){
                console.log(err);
            }
        }
    }

    const copyUrl =  ()  => {
        navigator.clipboard.writeText(downloadUrl);
        alert("link copied");
    }

    if(downloadUrl){
        return(<div className='center'>
            <div className='container'>
            <h1 className='span'>Secure file sharing with end-to-end encryption and auto-expiring links</h1>

                <p>copy the link to share</p>
                <input type="text" value={downloadUrl} readOnly className='text'/>
                <br/><br/>
                <button onClick={copyUrl} className='button'>Copy Link</button>
            </div>        
        </div>)
    }
  return (
    <div className='center'>
        <div className='container'>
        
        <h1 className='span'>Secure file sharing with end-to-end encryption and auto-expiring links</h1>
            <div className='upload'>
                
            <input type="file" onChange={handleFileChange} className='images' />
            <br/><br/>
            <button onClick={handleUpload} className='button'>upload</button><br/><br/>
            </div>
            <br/><br/>
            <label>Delete File after : </label>

            <select onChange={handleTTLChange}>
                <option value="600000">10 Minutes</option>
                <option value="1800000">30 minutes</option>
                <option value="3600000">60 minutes</option>
                <option value="9200000">90 minutes</option>
            </select>
        </div>
        </div>
  )
}

export default Upload
