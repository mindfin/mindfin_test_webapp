const express = require('express');
const fs = require('fs');
const router = express.Router();
var sha1 = require('sha1');
const multer = require('multer');
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage;
const knex = require('../knex/knex.js');
var defaultImg = 'admin.png';
var request = require('request');
var PDFParser = require("pdf2json");


router.post('/checkcurrentpwd', (req, res, next) => {
    console.log(req.body);
    var memid = req.body.idvalue;
    var currentpwd = req.body.bname;
    var pwd = (sha1(currentpwd));
    console.log(pwd);
    console.log(memid);
    knex.select()
        .from('employee')
        .where({ password: pwd })
        .where({ idemployee: memid })
        .then(function(result) {
            console.log(result);
            if (result == undefined || result == '' || result == null) {
                console.log("hi")
                res.json({ status: false, });
            } else {
                console.log("bye")
                res.json({
                    result: result,
                    status: true,
                });
            }
        });
});

router.post('/changepwd', function(req, res) {
    console.log(req.body);
    const pwd = (sha1(req.body.cpwd));
    console.log(pwd);

    knex('employee')
        .where({ idemployee: req.body.idvalue })
        .update({
            password: pwd,
            orgpassword: req.body.cpwd
        })
        .then(function(result) {
            if (result == undefined || result == '' || result == null) {
                res.json({ message: "Not Update", status: false });
            } else {
                res.json({
                    result: result,
                    status: true,
                });
            }
        });
});
// const azureStorage = new MulterAzureStorage({
//     connectionString: 'DefaultEndpointsProtocol=https;AccountName=mindfinfiles;AccountKey=4NrEY0vfXnyvJVohjkXXcBLZDfYnCCUqO/HfnaTnhmiYAYxj0n9cbVRvheeNcvdEwJFnh4DhA1Uf7Uxbcq4ocw==;EndpointSuffix=core.windows.net',
//     accessKey: '4NrEY0vfXnyvJVohjkXXcBLZDfYnCCUqO/HfnaTnhmiYAYxj0n9cbVRvheeNcvdEwJFnh4DhA1Uf7Uxbcq4ocw==',
//     accountName: 'mindfinfiles',
//     containerName: 'mindfin-docment-scan',
//     containerAccessLevel: 'blob',
//     urlExpirationTime: 60,
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' || file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 'application/octet-stream' || 'application/zip') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

// const upload = multer({
//     storage: azureStorage,
//     limits: {
//         fileSize: 150 * 1024 * 1024
//     },
//     fileFilter: fileFilter,
// });

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './President/');
    },
    filename: function(req, file, cb) {

        cb(null, 'documentcam.pdf');


    }

})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' || file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 'application/octet-stream' || 'application/zip') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/image-upload', upload.any(), (req, res) => {
    console.log(req.files)
    return res.json({ 'imageUrl': req.files });
});

// router.post('/bankstatementcam', (req, res) => {
//     // console.log(req.bady.bankstatement)

//     var pdfUrl = "https://mindfinfiles.blob.core.windows.net/mindfin-docment-scan/" + req.body.bankstatement[0].blobName;
//     console.log(pdfUrl);
//     var pdfParser = new PDFParser();

//     var pdfPipe = request({ url: pdfUrl, encoding: null }).pipe(pdfParser);
//     // console.log(pdfPipe)
//     pdfPipe.on("pdfParser_dataError", err => console.error(err));
//     pdfPipe.on("pdfParser_dataReady", pdf => {
//         console.log("First console", pdfParser.getAllFieldsTypes())
//         console.log("Second console", pdfParser.getMergedTextBlocksIfNeeded())
//             // let count1;
//             // //get text on a particular page
//             // for (let page of pdf.formImage.Pages) {
//             //     // console.log("First console", pdfParser.getAllFieldsTypes())

//         //     count1 += page.Text;
//         // }

//         // console.log(count1)
//         pdfParser.destroy();
//     });
// })
router.post('/bankstatementcam', (req, res) => {
    // let pdfParser = new PDFParser();

    // pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    // pdfParser.on("pdfParser_dataReady", pdfData => {
    //     // fs.writeFile("./pdf2json/test/F1040EZ.json", JSON.stringify(pdfData));
    //     const raw = pdfParser.getRawTextContent().replace(/\r\n/g, " ");
    //     console.log(raw);
    // });
    // var pdf = ("./President/" + req.body.bankstatement[0].filename)
    // console.log(pdf)
    // pdfParser.loadPDF("./President/documentcam.pdf");


    // console.log(req.bady.bankstatement)

    // Get all the filenames from the President folder
    const files = fs.readdirSync("President");

    // All of the parse President
    let President = [];

    // Make a IIFE so we can run asynchronous code
    (async() => {

        // Await all of the President to be passed
        // For each file in the President folder
        await Promise.all(files.map(async(file) => {

            // Set up the pdf parser
            let pdfParser = new PDFParser(this, 1);
            console.log(file);
            // Load the pdf document
            // pdfParser.loadPDF(`President/${file}` + req.body.bankstatement[0].filename);
            pdfParser.loadPDF(`President/${file}`);


            // Parsed the document
            let document = await new Promise(async(resolve, reject) => {

                // On data ready
                pdfParser.on("pdfParser_dataReady", (pdfData) => {

                    // The raw PDF data in text form
                    const raw = pdfParser.getRawTextContent();

                    console.log(raw);
                    fs.unlink('./President/documentcam.pdf', function(err) {
                        if (err) return console.log(err);
                        console.log('file deleted successfully');
                    });
                    resolve({
                        data: raw
                    });
                });
            });
            // Add the document to the President array
            President.push(document);

        }));
        console.log(President)
            // Save the extracted information to a json file
        return res.json(JSON.stringify(President));
    })();

});

module.exports = router;