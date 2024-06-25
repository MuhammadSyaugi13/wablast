
const express = require('express')
const app = express()
const port = 3000

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

app.get('/api', async (req, res) => {
    let tujuan = req.query.tujuan
    let pesan = req.query.pesan

    //   client.sendMessage(tujuan, pesan)
    for (let i = 0; i < 5; i++) {
        // let pesannya = await delayedMessage()
        let pesannya = `test-${i}`
        let statusPengiriman = await client.sendMessage('6281315096746@c.us', pesannya)
        console.log('status pengiriman');
        console.log(statusPengiriman);
        // client.sendMessage('6281211988686@c.us', pesannya)
        
    }

    // let pesannya = await delayedMessage()
    // let statusPengiriman = await client.sendMessage('6261205988686@c.us', pesannya)
    // console.log('status pengiriman');
    // console.log(statusPengiriman);

    // console.log('=====================================================\n');
    // console.log('=====================================================\n');
    // console.log('=====================================================\n');
    // console.log('=====================================================\n');

    // statusPengiriman = await client.sendMessage('6281211988686@c.us', 'hellooo')
    // console.log('status pengiriman2');
    // console.log(statusPengiriman);

    res.status(200).json({
        "status": "success",
        "message" : "berhasil kirim wa"
    })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})