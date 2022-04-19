const FormData = require('form-data');
const fetch = require('node-fetch');
const path = require("path")
const basePath = process.cwd();
const fs = require("fs");

fs.readdirSync('${basePath}/build/images').
forEach(file => {
    const formData = new FormData();
    const fileStream = fs.createReadStream('${basePath}/build/images/${file}');    
    formData.append('file','');

    let url = 'https://api.nftport.xyz/v0/files';

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: '6b0655f2-848b-4f7d-8d30-847fda8f9999',
        'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
      },
      body: formData
    };
    
    
    
    fetch(url, options)
      .then(res => res.json())
      .then(json => {
          const fileName = path.parse(json.file_name).name;
          let rawdata = fs.readFileSync('${basePath}/build/json/${fileName}.json');
          let metaData = JSON.parse(rawdata);
    
          metaData.file_url = json.ipfs_url;
    
          fs.writeFileSync('${basePath}/build/json/${fileName}.json',
          JSON.stringify(metaData, null, 2));
    
    
          console.log('${json.file_name} uploaded & ${fileName}.json updated!');
      })
      .catch(err => console.error("error:" + err));
    
});
