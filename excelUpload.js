
const express = require('express')
const multers = require('multer');
const XLSX = require('xlsx');

const app = express()
const port = 3000


// Multer configuration for handling file uploads
const upload = multers({ dest: 'uploads/' });

// Route to handle file upload
app.post('/upload', upload.single('excelFile'), (req, res) => {
    // Check if file is present
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }

    const filePath = req.file.path;
    // Read Excel file
    try {
        const workbook = XLSX.readFile(filePath);
        // Process the Excel file (example: send back data)
        const sheetName = workbook.SheetNames[0];
        const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if(excelData){
            excelData.forEach((el) => {
                console.log(`${el.No} - ${el.Nama} - ${el.No_HP}`);
            })
        }
        
        console.log('berhasil')
        res.json(excelData); // Send back data as JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing Excel file.');
    }
});

app.get('/', async (req, res) => {
    for (let i = 0; i < 10; i++) {
        let pesan = await delayedMessage()
        console.log(pesan); 
    }
})



async function delayedMessage() {
    // console.log("Hello");
    await new Promise(resolve => setTimeout(resolve, 5000));
    // console.log("Delayed message");
    return 'pesan'
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})