import React from 'react';
import { useState,useEffect } from 'react';
import { useParams } from 'react-router'; 

const Download = () => {
    const [fileName,setFileName] = useState();
    const [file,setFile] = useState(null);

    useEffect(() =>{
        searchFile();
    },[]);

    const {file_id,file_key} = useParams();

    

    function blobToFile(blob, fileName, blobType) {
        const file = new File([blob], fileName, { type: blobType });
        return file;
    }

    const searchFile = async () => {
        try{
            const data = await fetch(`http://localhost:8000/${file_id}/${file_key}`);
            const json = await data.json();
            console.log(json);
            if(json.status){
              const bufferData = json.blob;
              const uint8Array = new Uint8Array(bufferData.data);
              const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
      
              const decrpyt_key = {
                "alg":"A256GCM",
                "ext":true,
                "k":file_key,
                "key_ops":["encrypt","decrypt"],
                "kty":"oct"
                }
      
                const dcrpy_blob = await decryptblob(blob, json.iv, decrpyt_key);
                const newFile = blobToFile(dcrpy_blob, json.name, blob.type);
                setFile(newFile);
                setFileName(json.name);
            }
          }catch(err){
            console.log(err);
          }
    
    }

    function downloadFile(file) {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function decryptblob(encblob, ivdata, exportedKey) {
    
        let key = await crypto.subtle.importKey(
          "jwk",
          exportedKey,
          { name: "AES-GCM" },
          true,
          ["encrypt", "decrypt"]
        );
    
        let iv = new Uint8Array(ivdata.split(","));
    
        let algorithm = {
          name: "AES-GCM",
          iv: iv,
        };
    
        let data = await encblob.arrayBuffer();
    
        let decryptedData = await crypto.subtle.decrypt(algorithm, key, data);
    
        return new Blob([decryptedData]);
    }

    const handleDownload = () =>{
        downloadFile(file);
    }

  return (<div className='center'>
    <div className='container'>
    <h1 className='span'>Secure file sharing with end-to-end encryption and auto-expiring links</h1>

      <h1>Download your file here</h1>
      <h3>File Name : {fileName}</h3>
      <br/>
      <button onClick={handleDownload} className='button'>Download</button>
    </div>
  </div>)
}

export default Download
