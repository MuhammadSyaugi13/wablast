
const express = require('express')
const multers = require('multer');
const XLSX = require('xlsx');

const app = express()
const port = 3001

// Multer configuration for handling file uploads
const upload = multers({ dest: 'uploads/' });

const qrcode = require('qrcode-terminal')
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
        // authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: [ '--no-sandbox', '--disable-gpu', ],
        },
        webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html', }
    });

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    // console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small:true})
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize()

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

// app.get('/api', async (req, res) => {
//     let tujuan = req.query.tujuan
//     let pesan = req.query.pesan

//     //   client.sendMessage(tujuan, pesan)
//     for (let i = 0; i < 5; i++) {
//         // let pesannya = await delayedMessage()
//         let pesannya = `test-${i}`
//         let statusPengiriman = await client.sendMessage('6281315096746@c.us', pesannya)
//         console.log('status pengiriman');
//         console.log(statusPengiriman);
//         // client.sendMessage('6281211988686@c.us', pesannya)
        
//     }

//     // let pesannya = await delayedMessage()
//     // let statusPengiriman = await client.sendMessage('6261205988686@c.us', pesannya)
//     // console.log('status pengiriman');
//     // console.log(statusPengiriman);

//     // console.log('=====================================================\n');
//     // console.log('=====================================================\n');
//     // console.log('=====================================================\n');
//     // console.log('=====================================================\n');

//     // statusPengiriman = await client.sendMessage('6281211988686@c.us', 'hellooo')
//     // console.log('status pengiriman2');
//     // console.log(statusPengiriman);

//     res.status(200).json({
//         "status": "success",
//         "message" : "berhasil kirim wa"
//     })

// })

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
            excelData.forEach(async (el) => {
                console.log(`${el.No} - ${el.Nama} - ${el.No_HP}`);
                // phone number
                $phone = `62${el.No_HP}@c.us`
                const pesan = `Halo ${el.Nama} - Selamat Malam`
                let statusPengiriman = await client.sendMessage($phone, pesan)
                console.log(pesan);
            })
        }
        
        console.log('berhasil')
        res.json(excelData); // Send back data as JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing Excel file.');
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})