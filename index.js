const axios = require('axios');
const fs = require('fs');
const ocr = require('./ocr_pb.js');

const url = "https://ocr-middleware-vupmcdtsia-as.a.run.app/";
const accessKey = process.env.LV_ACCESS_KEY;

const filePath = process.argv[2];
const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

const outputPath = process.argv[3];

async function call_levenshtein() {
    const check = await axios.get(url);

    if (check.status !== 200) {
        console.log('Error');
    } else {
        console.log('Health check passed!');
    }

    const options = {
        method: 'POST',
        responseType: 'arraybuffer',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Accept': 'application/octet-stream',
            'Authorization': `Bearer ${accessKey}`
        },
    };

    const request = new ocr.Request();
    const document = new ocr.Document();

    document.setUuid("abcde");
    document.setName("abhi-sample.pdf");
    document.setMime("application/pdf");
    document.setFile(fileContent);

    request.setUuid("12345");
    request.setDocumentsList([document]);

    const requestData = request.serializeBinary();
    const responseOcr = await axios.post(`${url}ocr`, requestData, options);

    const response = ocr.Response.deserializeBinary(responseOcr.data).toObject();
    const transactions = response.statementsList[0].transactionsList;

    console.log(transactions);
}

call_levenshtein(); 