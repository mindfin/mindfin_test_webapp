const express = require('express');
const router = express.Router();
var sha1 = require('sha1');
var generator = require('generate-password');
const format = require('date-format');
const multer = require('multer');
const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage;
var request = require('request');
var convertRupeesIntoWords = require('convert-rupees-into-words');
const knex = require('../knex/knex.js');
var DateDiff = require('date-diff');
var zeropad = require('zeropad');
var moment = require('moment');
var urlencode = require('urlencode');
var otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
var implode = require('implode')
var defaultImg = 'admin.png';
var JSZip = require("jszip");
var FileSaver = require('file-saver');
var macaddress = require('macaddress');

const MAO = require('multer-aliyun-oss');

var now = new Date()

// const azureStorage = new MulterAzureStorage({
//     connectionString: 'DefaultEndpointsProtocol=https;AccountName=mindfinfiles;AccountKey=4NrEY0vfXnyvJVohjkXXcBLZDfYnCCUqO/HfnaTnhmiYAYxj0n9cbVRvheeNcvdEwJFnh4DhA1Uf7Uxbcq4ocw==;EndpointSuffix=core.windows.net',
//     accessKey: '4NrEY0vfXnyvJVohjkXXcBLZDfYnCCUqO/HfnaTnhmiYAYxj0n9cbVRvheeNcvdEwJFnh4DhA1Uf7Uxbcq4ocw==',
//     accountName: 'mindfinfiles',
//     containerName: 'mindfin-backend',
//     containerAccessLevel: 'blob',
//     urlExpirationTime: 60,
// });
const aliOssStorage = MAO({
    config: {
        region: 'oss-ap-south-1',
        accessKeyId: 'LTAI4GGoAKC67ZwLrJZ2jgeD',
        accessKeySecret: 'JNF52oPMNo2dQ23Ce7PFX9QTMhebxO',
        bucket: 'mindfin-files',
    }
});
async function deleteFile(fileName) {
    try {
        let result = await aliOssStorage.delete(fileName);
        console.log(result);
    } catch (e) {
        console.log(e)
    }
}
//mindfin-images
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './src/assets/President/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "" + file.originalname);
    }
})
const filename = (req, file, cb) => {
    cb(null, Date.now() + "" + file.originalname);
}
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' || file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 'application/octet-stream' || 'application/zip') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
// const upload = multer({
//     storage: azureStorage,
//     limits: {
//         fileSize: 150 * 1024 * 1024
//     },
//     fileFilter: fileFilter,
// });
const upload = multer({
    storage: aliOssStorage,
    limits: {
        fileSize: 150 * 1024 * 1024
    },
    fileFilter: fileFilter,
    filename: filename,
});
router.get('/piechart', function(req, res) {
    knex.select('usertype.user')
        .from('usertype')
        .count('employee.name as total')
        .join('employee', 'employee.iduser', 'usertype.idusertype')
        .where('employee.status', 'active')
        .groupBy('employee.iduser')
        .then(function(result) {
            res.json(result);
        })
})

// new apis to mindfin//
router.post('/bankinsert', (req, res) => {
    const nowdate1 = format.asString('yyyy-MM-dd', new Date());
    var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var localTime = moment.utc(date).toDate();
    localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
    //console.log("moment: " + localTime);
    if (req.body.idbank != null) {
        knex('bank')
            .where({ idbank: req.body.idbank })
            .update({
                bankname: req.body.bankname,
                bankvendor: req.body.bankvendor,
                updateddate: localTime
            })
            .then(function(result) {
                res.json('Bank Updated Successfully');
            })
    } else {
        knex('bank')
            .returning('id')
            .insert({
                bankname: req.body.bankname,
                status: "active",
                bankvendor: req.body.bankvendor,
                createddate: moment().format(nowdate1)
            })
            .then(function(result) {
                res.json('Bank Added Successfully');
            })
    }
});
router.get('/getbanklist', (req, res) => {
    knex.select()
        .from('bank')
        .where('bank.status', 'active')
        .then(function(result) {
            res.json(result);
        })
});
router.post('/getnames', (req, res) => {
    var vbs = req.body.length;
    for (var j = 0; j < req.body.length; j++) {
        var b1 = req.body[j].previousbankname;
        var l1 = req.body[j].previousapplytype;
        knex.select('bank.bankname')
            .from('bank')
            .where({ idbank: b1 })
            .then(function(result) {
                knex.select('loantype.loantype')
                    .from('loantype')
                    .where({ idloantype: l1 })
                    .then(function(re) {
                        res.json({
                            result: result,
                            re: re
                        })
                    })
            })
    }
});
router.post('/loaninsert', (req, res) => {
    const nowdate1 = format.asString('yyyy-MM-dd', new Date());
    if (req.body.idloantype != null) {
        knex('loantype')
            .where({ idloantype: req.body.idloantype })
            .update({
                loantype: req.body.loantype,
                code: req.body.code,
                updateddate: moment().format(nowdate1)
            })
            .then(function(result) {
                res.json('Loan Updated Successfully');
            })
    } else {
        knex('loantype')
            .returning('id')
            .insert({
                loantype: req.body.loantype,
                code: req.body.code,
                status: "active",
                createddate: moment().format(nowdate1)
            })
            .then(function(result) {
                res.json('Loan Added Successfully');
            })
    }
});
router.get('/getloanlist', (req, res) => {
    knex.select()
        .from('loantype')
        .where('loantype.status', 'active')
        .then(function(result) {
            res.json(result);
        })
});
router.post('/userinsert', (req, res) => {
    const nowdate1 = format.asString('yyyy-MM-dd', new Date());
    if (req.body.idusertype != null) {
        knex('usertype')
            .where({ idusertype: req.body.idusertype })
            .update({
                user: req.body.user,
                updateddate: moment().format(nowdate1)
            })
            .then(function(result) {
                res.json('Loan Updated Successfully');
            })
    } else {
        knex('usertype')
            .returning('id')
            .insert({
                user: req.body.user,
                status: "active",
                createddate: moment().format(nowdate1)
            })
            .then(function(result) {
                res.json('Loan Added Successfully');
            })
    }
});
router.get('/getuserlist', (req, res) => {
    knex.select()
        .from('usertype')
        .where('usertype.status', 'active')
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
});
router.post('/employeetypeinsert', (req, res) => {
    //console.log(req.body);
    var date3 = format.asString('yyyy-MM-dd', new Date());
    if (req.body.idemployeetype != null) {
        knex('employeetype')
            .where({ idemployeetype: req.body.idemployeetype })
            .update({
                emp_type: req.body.emp_type,
                updateddate: moment().format(date3)
            })
            .then(function(result) {
                res.json('Employeetype Updated Successfully');
            })
    } else {
        knex('employeetype')
            .insert({
                emp_type: req.body.emp_type,
                status: "active",
                createddate: moment().format(date3)
            })
            .then(function(result) {
                res.json('Employeetype Added Successfully');
            })
    }
});
router.get('/getemployeetypelist', (req, res) => {
    knex.select()
        .from('employeetype')
        .where('employeetype.status', 'active')
        .then(function(result) {
            res.json(result);
        })
});
router.post('/customeradd',
    upload.fields([{ name: 'cimage' }, { name: 'pimage' }, { name: 'aimage' }]), (req, res) => {
        var dob = req.body.dob;
        var applieddate = req.body.applieddate;
        const nowdate1 = format.asString('yyyy-MM-dd', new Date(dob));
        const nowdate = format.asString('yyyy-MM-dd', new Date(applieddate));
        let config = req.body.arr;
        let config1 = req.body.arr1;
        if (req.files.cimage != null) {
            cimage = req.files.cimage[0]['filename'];
        } else {
            cimage = req.body.cimage;
        }
        if (req.files.pimage != null) {
            pimage = req.files.pimage[0]['filename'];
        } else {
            pimage = req.body.pimage;
        }

        if (req.files.aimage != null) {
            aimage = req.files.aimage[0]['filename'];
        } else {
            aimage = req.body.aimage;
        }
        knex('customer')
            .insert({
                name: req.body.name,
                mobile: req.body.mobile,
                email: req.body.email,
                cemail: req.body.cemail,
                dob: nowdate1,
                salary: req.body.salary,
                altmobile: req.body.altmobile,
                address: req.body.address,
                cname: req.body.cname,
                designation: req.body.designation,
                caddress: req.body.caddress,
                pincode: req.body.pincode,
                idexecutive: req.body.idexecutive,
                gender: req.body.gender,
                amount: req.body.amount,
                applytype: req.body.applytype,
                cimage: cimage,
                pimage: pimage,
                aimage: aimage,
                status: 'active',
                displaystatus: 'Pending',
                applieddate: nowdate,
                source: 'Application',
                documents: req.body.documents,
                idno: req.body.idno,
                subvendor: req.body.subvendor,
                topupstatus: 'topup',
                sourcetype: req.body.sourcetype,
                aadharno: req.body.aadharno,
                panno: req.body.panno,
                dlno: req.body.dlno,
                voterno: req.body.voterno,
                emptype: req.body.emptype,
                createdby: req.body.createdby


            }).returning('id')
            .then(function(id) {
                ////console.log(config);
                //console.log(config1);
                const ids = id.toString();
                if (config1 == undefined || config1 == 'undefined') {
                    res.json("Not Inserted");
                    //console.log("empty data")
                } else {
                    const vbs1 = JSON.parse(config1);
                    for (var j = 0; j < vbs1.length; j++) {
                        var coname = vbs1[j].coname
                        var copaddress = vbs1[j].copaddress
                        var coraddress = vbs1[j].coraddress

                        knex('co-customer')
                            .insert({
                                coappname: coname,
                                coappresaddress: copaddress,
                                coappperaddress: coraddress,
                                idcustomer: ids

                            }).then(function(re) {
                                res.json(re);
                            })
                    }
                }

            })
    });

router.get('/hotCustomers/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;

    knex.select('customer.*')
        .from('customer')
        // .where('customer.status', 'PENDING')
        .where('customer.source', 'Website')
        .orderBy('customer.idcustomer', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            var a = result.length
                //console.log(a);

            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].applieddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('customer')
                .where('customer.status', 'PENDING')
                .where('customer.source', 'Website')
                .orderBy('customer.idcustomer', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
})


router.get('/customerlist/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;

    knex.select('customer.*')
        .from('customer')
        .where('customer.status', 'APPROVED')
        .orderBy('customer.idcustomer', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            var a = result.length
                //console.log(a);

            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].applieddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('customer')
                .where('customer.status', 'APPROVED')
                .orderBy('customer.idcustomer', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
})

router.get('/getexecutivelist', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user ', 'EXECUTIVE')
        .where('employee.status ', 'active')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});

router.post('/approvecustomer', upload.fields([{ name: 'cimage' }, { name: 'pimage' }, { name: 'aimage' }]), (req, res) => {

    knex.select()
        .from('approvedcustomer')
        .then(function(re) {
            ////console.log(re);
            var length = re.length;
            //console.log(length);
            var len = length + 1;
            //console.log(len);
            knex.select()
                .from('loantype')
                .where('loantype.idloantype ', req.body.applytype)
                .then(function(re) {
                    var code = re[0].code;

                    ////console.log(req.body.applieddate);
                    var x = Buffer.from(req.body.applieddate);
                    var y = x.slice(2, 4);
                    ////console.log(y.toString());

                    var abc = "MF" + code + y;
                    //console.log(abc);
                    var autoid = abc + zeropad(len, 4)
                        // //console.log(zeropad(len, 4));
                        //console.log(autoid);

                    var password = generator.generate({
                        length: 8,
                        numbers: true
                    });

                    var dob = req.body.dob;
                    const nowdate = format.asString('yyyy-MM-dd', new Date(dob));
                    var nowdate1 = moment().format(nowdate)
                    const encryptedString = sha1(password);

                    knex('approvedcustomer')
                        .returning('id')
                        .insert({
                            autoid: autoid,
                            name: req.body.name,
                            mobile: req.body.mobile,
                            email: req.body.email,
                            dob: moment().format(nowdate1),
                            salary: req.body.salary,
                            altmobile: req.body.altmobile,
                            address: req.body.address,
                            cname: req.body.cname,
                            designation: req.body.designation,
                            caddress: req.body.caddress,
                            pincode: req.body.pincode,
                            idexecutive: req.body.idexecutive,
                            gender: req.body.gender,
                            amount: req.body.amount,
                            applytype: req.body.applytype,
                            cimage: req.body.cimage,
                            pimage: req.body.pimage,
                            aimage: req.body.aimage,
                            status: 'active',
                            password: encryptedString,
                            orgpassword: password,
                            source: req.body.source
                        })
                        .then(function(id) {
                            knex('customer')
                                .where({ idcustomer: req.body.idcustomer })
                                .update({
                                    idapprovecustomer: id,
                                    status: "inactive",
                                    displaystatus: "Approved"
                                }).then(function(result) {
                                    res.json('Approved customer Added Successfully');
                                })
                            knex('previousbankdetails')
                                .where({ idcustomer: req.body.idcustomer })
                                .update({
                                    idapprovedcustomer: id,
                                    status: "active"
                                }).then(function(result) {
                                    res.json('Approved customer Added Successfully');
                                })
                        })
                })
        })
})

router.post('/rejectcustomer', function(req, res) {
    var date3 = format.asString('yyyy-MM-dd', new Date());
    knex('customer')
        .where({ idcustomer: req.body.idcustomer })
        .update({
            status: "reject",
            displaystatus: "Reject",
            updateddate: moment().format(date3)
        }).then(function(result) {
            res.json('Approved custome Rejected Successfully');
        })
});

router.post('/deleteemp', function(req, res) {
    var date3 = format.asString('yyyy-MM-dd', new Date());
    knex('employee')
        .where({ idemployee: req.body.idemployee })
        .update({
            status: "inactive",
            updateddate: moment().format(date3)
        }).then(function(result) {
            res.json('Employee Deleted Successfully');
        })
})
router.get('/getemployeelist/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.status', 'active')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('employee')
                .join('usertype', 'usertype.idusertype', 'employee.iduser')
                .where('employee.status', 'active')


            .then(function(re) {
                ////console.log(re);
                ////console.log(result);

                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re.length
                });

            })
        })
})


router.get('/getexecutiveelist/:pagesize/:page', function(req, res) {
    //console.log("hii");
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))

    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user ', 'EXECUTIVE')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('employee')
                .join('usertype', 'usertype.idusertype', 'employee.iduser')
                .where('usertype.user ', 'EXECUTIVE')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length

                    });
                })
        })

})


router.get('/approvedlist/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('approvedcustomer')
        // .join('bank','bank.idbank','approvedcustomer.bankname')
        .join('loantype', 'loantype.idloantype', 'approvedcustomer.applytype')
        .where('approvedcustomer.status', 'active')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('approvedcustomer')
                // .join('bank','bank.idbank','approvedcustomer.bankname')
                .join('loantype', 'loantype.idloantype', 'approvedcustomer.applytype')
                .where('approvedcustomer.status', 'active')
                .then(function(re) {
                    ////console.log(re);
                    ////console.log(result);
                    res.status(200).json({
                        message: "Approved list fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
})
router.get('/getAllMacAddress', (req, res) => {
    let macAddresss;
    macaddress.all(function(err, mac) {
        macAddresss = mac
        console.log("inside macaddress function", macAddresss)
        res.json(macAddresss);
    })
})
router.get('/getMacAddress', (req, res) => {
    let macAddresss;
    macaddress.one(function(err, mac) {
        macAddresss = mac;
        console.log("inside macaddress function", macAddresss)
        res.json(macAddresss);
    })
})
router.post('/adminlogin', (req, res) => {
    console.log(req.body)
    const username = req.body.username;
    const password = (sha1(req.body.password));
    // const macAddress = req.body.macAddress;
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.status', "active")
        .where('employee.password', password)
        .where(function() {
            this.where({ 'employee.email': username })
                .orWhere({ 'employee.mobile': username })
                .orWhere({ 'employee.altmobile': username })
        })
        // .where(function() {
        //     this.where({ 'employee.macAddress1': macAddress })
        //         .orWhere({ 'employee.macAddress2': macAddress })
        //         .orWhere({ 'employee.macAddress3': macAddress })
        // })

    .then(function(result) {
            //console.log(result);
            if (result == '' || result == null || result == undefined) {
                knex.select()
                    .from('customer')
                    .where({ email: username, password: password })
                    .then(function(re) {
                        //console.log(re);
                        re.user = "CUSTOMER";
                        res.json(re);
                    })
            } else {
                res.json(result);
            }
        })
        // console.log("outside macaddress function", macAddresss)


})
router.get('/employeecount', (req, res) => {
    knex.select()
        .from('employee')
        .where({ status: "active" })
        .count({ a: 'employee.idemployee' })
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})

router.get('/membercount', (req, res) => {
    knex.select()
        .from('approvedcustomer')
        .where({ status: "active" })
        .count({ a: 'approvedcustomer.idapprovedcustomer' })
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})

router.get('/rejectcount', (req, res) => {
    knex.select()
        .from('customer')
        .where({ status: "reject" })
        // .count({a:'customer.idcustomer'})
        .then(function(result) {
            ////console.log(result); 
            res.json(result.length);
        })
})

router.get('/pendingcount', (req, res) => {
    knex.select()
        .from('customer')
        .where({ status: "active" })
        .count({ a: 'customer.idcustomer' })
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})

router.get('/editemp/:id', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.idemployee', req.params.id)
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})

router.post('/editemployee', (req, res) => {
    //console.log(req.body);
    const nowdate = format.asString('yyyy-MM-dd', new Date());
    var dob = req.body.value.dob;
    const nowdate1 = format.asString('yyyy-MM-dd', new Date(dob));
    const doj = req.body.value.joiningdate;
    const joiningdate = format.asString('yyyy-MM-dd', new Date(doj));
    var cimage;
    var pimage;
    var aimage;
    var appointmentLetter;
    var appointmentLetter_org;
    var cucount;
    var dcount;
    //console.log(doj);

    if (req.body.cimg == undefined) {
        cimage = req.body.value.cimage;

    } else {
        cimage = req.body.cimg[0].filename;
        //console.log("filename  " + cimage);
    }
    if (req.body.pimg == undefined) {
        pimage = req.body.value.pimage;

    } else {
        pimage = req.body.pimg[0].filename;
        //console.log(pimage);
    }
    if (req.body.aimg == undefined) {
        aimage = req.body.value.aimage;
    } else {
        aimage = req.body.aimg[0].filename;
        //console.log(aimage);
    }
    if (req.body.appletimg == undefined) {
        appointmentLetter = req.body.value.appointmentLetter;
        appointmentLetter_org = req.body.value.appointmentLetter_org;
    } else {
        appointmentLetter = req.body.appletimg[0].filename;
        appointmentLetter_org = req.body.appletimg[0].originalname
            //console.log(aimage);
    }
    if (req.body.value.downloadCount == undefined && req.body.appletimg == undefined) {
        dcount = undefined;
    } else if (req.body.value.downloadCount == undefined && req.body.appletimg != undefined) {
        dcount = '0'
    } else {
        dcount = req.body.value.downloadCount
    }
    if (req.body.value.cimgUploadCount == undefined && req.body.appletimg == undefined) {
        dcount = undefined;
    } else if (req.body.value.cimgUploadCount == undefined && req.body.appletimg != undefined) {
        cucount = '0';
    } else {
        cucount = req.body.value.cimgUploadCount
    }
    knex('employee')
        .where({ idemployee: req.body.idemployeee })
        .update({
            name: req.body.value.name,
            mobile: req.body.value.mobile,
            email: req.body.value.email,
            dob: nowdate1,
            ifsc: req.body.value.ifsc,
            altmobile: req.body.value.altmobile,
            address: req.body.value.address,
            qualification: req.body.value.qualification,
            accno: req.body.value.accno,
            branch: req.body.value.branch,
            pincode: req.body.value.pincode,
            iduser: req.body.value.idusertype,
            gender: req.body.value.gender,
            cimage: cimage,
            pimage: pimage,
            aimage: aimage,
            status: 'active',
            joiningdate: joiningdate,
            updateddate: nowdate,
            empno: req.body.value.empno,
            designation: req.body.value.designation,
            createdby: req.body.createdby,
            appointmentLetter: appointmentLetter,
            appointmentLetter_org: appointmentLetter_org,
            basicPay: req.body.value.basicPay,
            downloadCount: dcount,
            cimgUploadCount: cucount
        })
        .then(function(result) {
            ////console.log(result); 
            res.json('Employee Updated Successfully');
        })
})

router.get('/memberviewdetails/:memberid', function(req, res) {

    ////console.log(req.params);
    Approvedcustomer.findOne({ _id: req.params.memberid }).populate('idexecutive applytype ').exec(function(err, result) {
        res.json(result);
    })
})

router.get('/editcust/:id', function(req, res) {
    knex.select()
        .from('customer')

    .where('customer.idcustomer', req.params.id)
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})

router.get('/getextradetails/:id', function(req, res) {
    knex.select('previousbankdetails.amount as previousamounttaken', 'bank.bankname as previousbankname', 'loantype.loantype as previousapplytype')
        .from('previousbankdetails')
        .join('bank', 'bank.idbank', 'previousbankdetails.idbank')
        .join('loantype', 'loantype.idloantype', 'previousbankdetails.idloantype')
        .where('previousbankdetails.idcustomer', req.params.id)
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})

router.post('/customerupdate', (req, res) => {
    var companykyc;
    var comp_orgname;
    var customerkyc;
    var cust_orgname;
    var itr;
    var itr_orgname;
    var bankstatement;
    var bank_orgname;
    var loanstatement;
    var loan_orgname;
    var gstandreturns;
    var gst_orgname;
    var applicationDetails;
    var applicationDetails_orgname;
    var status;
    var displaystatus;
    var dob = req.body.value.dob;
    var applieddate = req.body.value.applieddate;
    const nowdate1 = format.asString('yyyy-MM-dd', new Date(dob));
    const nowdate = format.asString('yyyy-MM-dd', new Date(applieddate));
    const nowdate2 = format.asString('yyyy-MM-dd', new Date());
    let config = req.body.arr;
    if (req.body.companykyc == undefined) {
        companykyc = req.body.value.companykyc;

    } else {
        companykyc = req.body.companykyc[0].filename;
        comp_orgname = req.body.companykyc[0].originalname;
        //console.log("company kyc filename  " + companykyc);
        //console.log("comp orginal name  " + comp_orgname);
    }
    if (req.body.customerkyc == undefined) {
        customerkyc = req.body.value.customerkyc;

    } else {
        customerkyc = req.body.customerkyc[0].filename;
        cust_orgname = req.body.customerkyc[0].originalname;
        //console.log("cust kyc filename  " + customerkyc);
        //console.log("cudt orginal name  " + cust_orgname);
    }
    if (req.body.itr == undefined) {
        itr = req.body.value.itr;

    } else {
        itr = req.body.itr[0].filename;
        itr_orgname = req.body.itr[0].originalname;
        //console.log("itr filename  " + itr);
        //console.log("itr orginal name  " + itr_orgname);
    }
    if (req.body.bankstatement == undefined) {
        bankstatement = req.body.value.bankstatement;

    } else {
        bankstatement = req.body.bankstatement[0].filename;
        bank_orgname = req.body.bankstatement[0].originalname;
        //console.log("bankstatement filename  " + bankstatement);
        //console.log("bankstatement orginal name  " + bank_orgname);
    }
    if (req.body.loanstatement == undefined) {
        loanstatement = req.body.value.loanstatement;

    } else {
        loanstatement = req.body.loanstatement[0].filename;
        loan_orgname = req.body.loanstatement[0].originalname;
        //console.log("loanstatement filename  " + loanstatement);
        //console.log("loanstatement orginal name  " + loan_orgname);
    }
    if (req.body.gstandreturns == undefined) {
        gstandreturns = req.body.value.gstandreturns;

    } else {
        gstandreturns = req.body.gstandreturns[0].filename;
        gst_orgname = req.body.gstandreturns[0].originalname;
        //console.log("gstandreturns filename  " + gstandreturns);
        //console.log("gstandreturns orginal name  " + gst_orgname);
    }
    if (req.body.applicationDetails == undefined) {
        applicationDetails = 'admin.png';
        applicationDetails_orgname = 'admin.png';

    } else {
        applicationDetails = req.body.applicationDetails[0].filename;
        applicationDetails_orgname = req.body.applicationDetails[0].originalname;
        //console.log("applicationDetails filename  " + applicationDetails);
        //console.log("applicationDetails orginal name  " + applicationDetails_orgname);
    }
    if (req.body.applicationDetails == undefined) {
        applicationDetails = 'admin.png';
        applicationDetails_orgname = 'admin.png';

    } else {
        applicationDetails = req.body.applicationDetails[0].filename;
        applicationDetails_orgname = req.body.applicationDetails[0].originalname;
        //console.log("applicationDetails filename  " + applicationDetails);
        //console.log("applicationDetails orginal name  " + applicationDetails_orgname);
    }
    if (req.body.value.displaystatus != 'APPROVED') {
        displaystatus = "PENDING"
        status = "PENDING"
    } else {
        displaystatus = "APPROVED"
        status = "APPROVED"
    }
    knex('customer')
        .where("idcustomer", req.body.custid)
        .update({
            applieddate: nowdate,
            applytype: req.body.value.applytype,
            loanCategory: req.body.value.loanCategory,
            subLoanCategory: req.body.value.subLoanCategory,
            name: req.body.value.name,
            dob: nowdate1,
            gender: req.body.value.gender,
            address: req.body.value.address,
            pincode: req.body.value.pincode,
            mobile: req.body.value.mobile,
            altmobile: req.body.value.altmobile,
            email: req.body.value.email,
            cname: req.body.value.cname,
            caddress: req.body.value.caddress,
            cemail: req.body.value.cemail,
            emptype: req.body.value.emptype,
            designation: req.body.value.designation,
            salary: req.body.value.salary,
            aadharno: req.body.value.aadharno,
            panno: req.body.value.panno,
            dlno: req.body.value.dlno,
            voterno: req.body.value.voterno,
            whosecase: req.body.value.whosecase,
            amount: req.body.value.amount,
            subvendor: req.body.value.subvendor,
            sourcetype: req.body.value.sourcetype,
            // source: 'Application',
            topupstatus: 'topup',
            displaystatus: displaystatus,
            companykyc: companykyc,
            companykyc_orgname: comp_orgname,
            customerkyc: customerkyc,
            customerkyc_orgname: cust_orgname,
            itr: itr,
            itr_orgname: itr_orgname,
            bankstatement: bankstatement,
            bankstatement_orgname: bank_orgname,
            gstandreturns: gstandreturns,
            gstandreturns_orgname: gst_orgname,
            loanstatement: loanstatement,
            loanstatement_orgname: loan_orgname,
            applicationDetails: applicationDetails,
            applicationDetails_orgname: applicationDetails_orgname,
            status: status,
            comment: req.body.value.comment,
            editby: req.body.value.empid,
            editorname: req.body.value.empname,
            updateddate: nowdate2,
        })
        .then(function() {
            // console.log("conf", config);
            if (config !== undefined || config !== 'undefined') {
                // const vbs1 = JSON.parse(config);
                for (var j = 0; j < config.length; j++) {
                    var coname = config[j].coname
                    var copaddress = config[j].copaddress
                    var coraddress = config[j].coraddress
                    knex('co-customer')
                        .insert({
                            coappname: coname,
                            coappresaddress: copaddress,
                            coappperaddress: coraddress,
                            idcustomer: req.body.custid
                        }).then(function(re) {
                            res.json(re);
                        })
                }
            }
        })
})
router.get('/getaging/:date', function(req, res) {
    var date3 = format.asString('MM/dd/yyyy', new Date());

    var d = new Date(date3);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;


    var d1 = new Date(req.params.date);
    var e1 = d1.getDate();
    var m1 = d1.getMonth() + 1;
    var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;

    var date1 = new Date(y);
    var date4 = new Date(y1);
    var diff = new DateDiff(date1, date4);

    res.json(diff.days());

});

router.post('/applybank', (req, res, next) => {
    const id = req.body.bname;
    var id1 = id.substr(2);
    arr = [id1];
    ////console.log(arr);
    var str = arr.toString();
    var output = str.split(',');
    ////console.log(output.length);
    for (i = 0; i < output.length; i++) {
        ////console.log(req.body.idvalue);
        ////console.log(output[i]);
        knex('applybank')
            .insert({
                idbank: output[i],
                idcustomer: req.body.idvalue
            })
            .then(function(result) {
                ////console.log(result); 
                res.json('ApplyBank Added Successfully');
            })
    }

})

router.get('/homememberlist/:memberid', function(req, res) {
    ////console.log(req.params.memberid);
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where({ idemployee: req.params.memberid })
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        });
});

router.post('/memberlogin', (req, res, next) => {
    var username = req.body.mid;
    var password = req.body.password;
    const pwd = (sha1(password));
    knex.select()
        .from('customer')
        .where({ email: username, password: pwd })
        .then(function(result) {
            res.json(result);
        })
})

router.post('/businesslistinsert', (req, res) => {
    if (req.body.idlistforbusiness != null) {

        knex('listforbusiness')
            .where({ idlistforbusiness: req.body.idlistforbusiness })
            .update({
                list: req.body.list
            })
            .then(function(result) {
                res.json('Business List Updated Successfully');
            })

    } else {
        knex('listforbusiness')
            .insert({
                list: req.body.list,
                status: "active"
            })
            .then(function(result) {
                ////console.log(result); 
                res.json('Bank Added Successfully');
            })
    }
})

router.get('/getbusinesslist', (req, res) => {
    knex.select()
        .from('listforbusiness')
        .where('listforbusiness.status', 'active')
        .then(function(result) {

            res.json(result);
        })
})

router.get('/getviewbanklist/:id', (req, res) => {
    // //console.log(req.params);
    knex.select('applybank.*', 'bank.bankname', 'loantype.loantype')
        .from('applybank')
        .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('loantype', 'loantype.idloantype', 'applybank.idloan')
        .where('applybank.idcustomer', req.params.id)
        .where('applybank.status', 'PENDING')
        .then(function(result) {
            res.json(result);
        })
})

router.get('/getViewPrevBankList/:id', (req, res) => {
    // //console.log(req.params);
    knex.select('previousbankdetails.*', 'bank.bankname', 'loantype.loantype')
        .from('previousbankdetails')
        .join('customer', 'customer.idcustomer', 'previousbankdetails.idcustomer')
        .join('bank', 'bank.idbank', 'previousbankdetails.idbank')
        .join('loantype', 'loantype.idloantype', 'previousbankdetails.idloantype')
        .where('previousbankdetails.idcustomer', req.params.id)
        .then(function(result) {

            res.json(result);
        })
})

router.post('/addenquiry', (req, res) => {
    var abc = req.body.value.executive.split(",", 2);
    //console.log(abc);
    var localTime = format.asString('yyyy-MM-dd', new Date());
    knex('enquirydata')
        .insert({
            name: req.body.value.name,
            email: req.body.value.email,
            mobile: req.body.value.mobile,
            altmobile: req.body.value.altmobile,
            address: req.body.value.address,
            status: req.body.value.status,
            gender: req.body.value.gender,
            loantype: req.body.value.applytype,
            createddate: localTime,
            teleid: req.body.teleid,
            adminid: abc[0],
            adminname: abc[1],
            comment: req.body.value.comment,
            updateddate: localTime,
            turnover: req.body.value.turnover,
            adminexeStatus: "new",
            approchedBank: req.body.value.approchedBank,
            ownHouse: req.body.value.ohp,
            loanCategory: req.body.value.loanCategory,
            subLoanCategory: req.body.value.subLoanCategory
        })
        .then(function(result) {
            ////console.log(result); 
            res.json('Enquiry Added Successfully');
        })
})

router.get('/getenquirylist/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.dob')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.teleid', req.params.id)
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.teleid', req.params.id)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
})

router.get('/getPdlist/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select('customer.*', 'loantype.loantype', 'employee.name as empname')
        .from('customer')
        .join('loantype', 'loantype.idloantype', 'customer.applytype')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')
        .where({ 'customer.status': 'pd' })
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('customer')
                .join('loantype', 'loantype.idloantype', 'customer.applytype')
                .join('employee', 'employee.idemployee', 'customer.idexecutive')
                .where({ 'customer.status': 'pd' })
                .then(function(re) {
                    var a = re.length
                        //console.log(a);
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
})

router.get('/getApprovallist/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select('customer.*', 'loantype.loantype', 'employee.name as empname')
        .from('customer')
        .join('loantype', 'loantype.idloantype', 'customer.applytype')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')
        .where({ 'customer.status': 'approve' })
        .limit(pageSize).offset(skip)
        .then(function(result) {

            knex.select()
                .from('customer')
                .join('loantype', 'loantype.idloantype', 'customer.applytype')
                .join('employee', 'employee.idemployee', 'customer.idexecutive')

            .where({ 'customer.status': 'approve' })
                .then(function(re) {
                    var a = re.length
                        //console.log(a);
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
})

router.get('/getDisburstlist/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select('customer.*', 'loantype.loantype', 'employee.name as empname')
        .from('customer')
        .join('loantype', 'loantype.idloantype', 'customer.applytype')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')
        .where({ 'customer.status': 'disburse' })
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('customer')
                .join('loantype', 'loantype.idloantype', 'customer.applytype')
                .join('employee', 'employee.idemployee', 'customer.idexecutive')
                .where({ 'customer.status': 'disburse' })
                .then(function(re) {
                    var a = re.length
                        //console.log(a);
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
})

router.post('/approve', (req, res) => {
    var date1 = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var localTime = moment.utc(date1).toDate();
    knex('customer')
        .where({ idcustomer: req.body.idcustomer })
        .update({
            status: 'disburse',
            disbursedate: localTime,
            displaystatus: 'DISBURSED'
        })
        .then(function(result) {})
})

router.post('/pdapprove', (req, res) => {
    //console.log(req.body);
    knex('customer')
        .where({ idcustomer: req.body.idcustomer })
        .update({
            status: 'approve',
            displaystatus: 'APPROVED'
        })
        .then(function(result) {
            ////console.log(result); 
        })
})

router.post('/loginapprove', (req, res) => {
    //console.log(req.body);
    knex.select()
        .from('customer')
        .whereNot({ status: 'active' })
        .then(function(re) {
            var length = re.length;
            //console.log(length);
            var len = length + 1;
            //console.log(len);
            knex.select()
                .from('loantype')
                .where('loantype.idloantype ', req.body.applytype)
                .then(function(re) {
                    if (req.body.subvendor == '' || req.body.subvendor == null || req.body.subvendor == null || req.body.subvendor == undefined) {
                        //console.log("hi");
                        var code = re[0].code;
                        var x = Buffer.from(req.body.applieddate);
                        var y = x.slice(2, 4);
                        var abc = "MF" + code + y;
                        //console.log(abc);
                        var autoid = abc + zeropad(len, 4)
                            //console.log(autoid);
                        var password = generator.generate({
                            length: 8,
                            numbers: true
                        });
                    } else {
                        //console.log("yes");
                        var code = re[0].code;
                        var x = Buffer.from(req.body.applieddate);
                        var y = x.slice(2, 4);
                        var abc = "VEN" + code + y;
                        //console.log(abc);
                        var autoid = abc + zeropad(len, 4)
                            //console.log(autoid);
                        var password = generator.generate({
                            length: 8,
                            numbers: true
                        });
                    }
                    //    var code=re[0].code;
                    // var x = Buffer.from(req.body.applieddate);
                    // var y = x.slice(2,4);
                    // var abc="MF"+code+y;
                    // //console.log(abc);
                    // var autoid=abc+zeropad(len, 4)
                    // //console.log(autoid);
                    //   var password = generator.generate({
                    //       length: 8,
                    //       numbers: true
                    //   });
                    var dob = req.body.dob;
                    const nowdate = format.asString('yyyy-MM-dd', new Date(dob));
                    var nowdate1 = moment().format(nowdate)
                    const encryptedString = (sha1(password));


                    knex('customer')
                        .where({ idcustomer: req.body.idcustomer })
                        .update({
                            status: "pd",
                            autoid: autoid,
                            password: encryptedString,
                            orgpassword: password,
                            displaystatus: 'PD'
                        }).then(function(result) {
                            res.json('customer Updated Successfully');
                        })
                })
        })
})

router.get('/dataentrycount', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'active')
        .then(function(result) {
            res.json(result.length);
        })
})

router.get('/pdcount', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'pd')
        .then(function(result) {
            res.json(result.length);
        })
})

router.get('/approvcount', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'approve')
        .then(function(result) {
            res.json(result.length);
        })
})
router.get('/disbursecount', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'disburse')
        .then(function(result) {
            res.json(result.length);
        })
})
router.get('/enqcount', (req, res) => {
    knex.select()
        .from('enquirydata')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        // .where('enquirydata.status','')
        .then(function(result) {
            res.json(result.length);
        })
})

router.post('/bankapply', (req, res) => {
    const vbs = req.body.arr;
    for (var j = 0; j < vbs.length; j++) {
        var applytype = vbs[j].loanid
        var bankname = vbs[j].bankid
        var amt = vbs[j].previousamounttaken
        var vendor = vbs[j].vendor
        knex('applybank')
            .insert({
                idloan: applytype,
                idbank: bankname,
                amount: amt,
                idcustomer: req.body.idvalue,
                status: 'PENDING',
                vendor: vendor
            }).then(function(result) {
                //console.log(result);
            })
    }
})
router.get('/checktrack/:id', (req, res) => {
    //console.log(req.params.id);
    knex.select()
        .from('customer')
        .where('customer.autoid', req.params.id)
        .then(function(result) {
            res.json(result);
        })
})

router.post('/onChange', (req, res) => {
    //console.log(req.body);
    knex('applybank')
        .where({ idapplybank: req.body.idapplybank })
        .update({
            status: 'APPROVED'
        })
        .then(function(result) {
            ////console.log(result); 
        })
})

router.get('/getApprovedBankList/:id', (req, res) => {
    knex.select('applybank.*', 'bank.bankname', 'loantype.loantype', 'topup.period as p')
        .from('applybank')
        .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('loantype', 'loantype.idloantype', 'applybank.idloan')
        .join('topup', 'topup.idtopup', 'applybank.idtopup')
        .where('applybank.idcustomer', req.params.id)
        .where('applybank.status', 'ACTIVE')
        .then(function(result) {
            res.json(result);
            //console.log(result)
        })
})

router.get('/getApprovedBankListt/:id', (req, res) => {
    knex.select('applybank.*', 'bank.bankname', 'loantype.loantype')
        .from('applybank')
        .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('loantype', 'loantype.idloantype', 'applybank.idloan')
        .where('applybank.idcustomer', req.params.id)
        .where('applybank.status', 'APPROVED')
        .then(function(result) {
            res.json(result);
        })
})

router.get('/getRejectBankListt/:id', (req, res) => {
    knex.select('applybank.*', 'bank.bankname', 'loantype.loantype')
        .from('applybank')
        .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('loantype', 'loantype.idloantype', 'applybank.idloan')
        .where('applybank.idcustomer', req.params.id)
        .where('applybank.status', 'REJECTED')
        .then(function(result) {
            res.json(result);
        })
})

router.post('/addPeriod', (req, res) => {
    //console.log(req.body);
    knex('applybank')
        .where({ idapplybank: req.body.obj.idapplybank })
        .update({
            pf: req.body.obj.pf,
            roi: req.body.obj.roi,
            idtopup: req.body.obj.idtopup,
            insurance: req.body.obj.insurance,
            status: 'ACTIVE',
            disbusdate: req.body.obj.screateddate,
            product: req.body.obj.product,
            disbusamount: req.body.obj.disbusamount

        })
        .then(function(result) {
            res.json(result);
        })
})


router.get('/singleCustomer/:id', (req, res) => {
    knex.select('customer.*', 'loantype.loantype')
        .from('customer')
        .join('loantype', 'loantype.idloantype', 'customer.applytype')
        .where({ idcustomer: req.params.id })
        .then(function(result) {
            res.json(result);
        })
})

router.get('/gettopuplist/:id', (req, res) => {
    // //console.log(req.params.id);
    knex.select('applybank.disbusdate')
        .from('applybank')
        .where('applybank.idcustomer', req.params.id)
        .then(function(re) {
            // //console.log(re[0].disbursedate);

            knex.select('applybank.*', 'bank.bankname', 'topup.period as p', 'topup.eligibleperiod')
                .from('applybank')
                .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
                .join('topup', 'topup.idtopup', 'applybank.idtopup')
                .join('bank', 'bank.idbank', 'applybank.idbank')
                .where('applybank.idcustomer', req.params.id)
                .then(function(result) {
                    // //console.log(result.length);
                    for (var i = 0; i < result.length; i++) {
                        var local = moment(re[0].disbursedate).local().format('YYYY-MM-DD ');
                        var ex1 = moment(local).add(result[i].eligibleperiod, 'month');
                        var local1 = moment(ex1).local().format('YYYY-MM-DD ');
                        // //console.log(local1);
                        // //console.log(ex1);
                        var q = moment(ex1).format("dddd, MMMM Do YYYY");
                        // //console.log(result);
                        result[i].q = q;
                        // res.json({result});
                    }
                    res.json(result)
                })
        })
})

router.get('/getPeriod', (req, res) => {
    knex.select()
        .from('topup')
        .where({ status: 'active' })
        .then(function(result) {
            res.json(result);
        })
})


router.get('/checkcurrent/:id', (req, res) => {
    //console.log(req.params);
    knex.select()
        .from('employee')
        .where({ email: req.params.id })
        .then(function(result) {
            //console.log(result);
            if (result == undefined || result == '' || result == null) {
                //console.log("hi")
                res.json({ status: true });
            } else {
                //console.log("bye")
                res.json({
                    status: false
                });
            }
        });
})

router.post('/addtopup', (req, res) => {
    const nowdate1 = format.asString('yyyy-MM-dd', new Date());
    var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var localTime = moment.utc(date).toDate();
    localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
    //console.log("moment: " + localTime);

    if (req.body.idtopup != null) {
        knex('topup')
            .where({ idtopup: req.body.idtopup })
            .update({
                period: req.body.period,
                eligibleperiod: req.body.eligibleperiod
            })
            .then(function(result) {
                res.json('Topup Updated Successfully');
            })
    } else {

        knex('topup')
            .insert({
                period: req.body.period,
                status: "active",
                eligibleperiod: req.body.eligibleperiod
            })
            .then(function(result) {
                res.json('Topup Added Successfully');
            })
    }
})

router.get('/getperiodlist', function(req, res) {
    knex.select()
        .from('topup')
        .where('topup.status ', 'active')
        .then(function(result) {
            res.json(result);
        })
});

router.get('/rejectlist/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select('customer.*', 'loantype.loantype', 'employee.name as empname')
        .from('customer')
        .join('loantype', 'loantype.idloantype', 'customer.applytype')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')

    .where({ 'customer.status': 'reject' })
        .limit(pageSize).offset(skip)
        .then(function(result) {

            knex.select()
                .from('customer')
                .join('loantype', 'loantype.idloantype', 'customer.applytype')
                .join('employee', 'employee.idemployee', 'customer.idexecutive')

            .where({ 'customer.status': 'reject' })
                .then(function(re) {
                    var a = re.length
                        //console.log(a);
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
})


router.post('/programinsert', (req, res) => {
    //console.log(req.body);
    const nowdate1 = format.asString('yyyy-MM-dd', new Date());
    var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var localTime = moment.utc(date).toDate();
    localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
    //console.log("moment: " + localTime);

    if (req.body.id_program != null) {
        knex('programlist')
            .where({ id_program: req.body.id_program })
            .update({
                programname: req.body.programname
            })
            .then(function(result) {
                res.json('Programlist Updated Successfully');
            })
    } else {
        knex('programlist')
            .returning('id')
            .insert({
                programname: req.body.programname,
                status: "active"
            })
            .then(function(result) {
                res.json('Programlist Added Successfully');
            })
    }
})

router.get('/getprogramlist', (req, res) => {
    knex.select()
        .from('programlist')
        .where({ status: 'active' })
        .then(function(result) {
            res.json(result

            );
        })
})

router.get('/gettopupnotifylist/:obj', function(req, res) {

    knex.select('customer.*', 'applybank.*', 'topup.period as p', 'topup.eligibleperiod', 'employee.name as ename')
        .from('applybank')
        .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')
        .join('topup', 'topup.idtopup', 'applybank.idtopup')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .where('customer.status', 'APPROVED')
        .where('customer.topupstatus', 'topup')
        .then(function(resu) {
            // //console.log(resu);
            for (var i = 0; i < resu.length; i++) {
                var local = moment(resu[i].disbursedate).local().format('YYYY-MM-DD ');
                var ex1 = moment(local).add(resu[i].eligibleperiod, 'month');
                //  var local1 = moment(ex1).local().format('YYYY-MM-DD ');
                var q = moment(ex1).format("dddd, MMMM Do YYYY");
                resu[i].q = q;
                // //console.log(q);
            }
            res.json(resu);
        })
})


router.post('/topUpSucess', function(req, res) {

    //console.log(req.body);
    knex('applybank')
        .where({ idapplybank: req.body.idapplybank })
        .update({
            status: 'success'
        })
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })

})
router.get('/getexecutivetopuplist/:id', function(req, res) {

    knex.select('customer.*', 'customer.disbursedate', 'topup.period as p', 'topup.eligibleperiod', 'employee.name as ename')
        .from('applybank')
        .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')
        .join('topup', 'topup.idtopup', 'applybank.idtopup')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .where('customer.status', 'disburse')
        .where('customer.topupstatus', 'topup')
        .where('customer.idexecutive', req.params.id)

    .then(function(resu) {
        //console.log(resu);
        for (var i = 0; i < resu.length; i++) {
            var local = moment(resu[i].disbursedate).local().format('YYYY-MM-DD ');
            var ex1 = moment(local).add(resu[i].eligibleperiod, 'month');
            //  var local1 = moment(ex1).local().format('YYYY-MM-DD ');
            var q = moment(ex1).format("dddd, MMMM Do YYYY");
            resu[i].q = q;
            //console.log(q);
        }
        res.json(resu);
    })
})

router.get('/getSubVendor', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user', 'SUB VENDOR')
        .then(function(result) {
            res.json(result)
        })
})

router.get('/customerList/:id', function(req, res) {
    //console.log(req.params);
    knex.select('customer.*')
        .from('customer')
        .join('employee', 'employee.idemployee', 'customer.subvendor')
        .where('customer.subvendor', req.params.id)
        .then(function(result) {
            res.json(result)
        })

})
router.post('/addPayOut', (req, res) => {
    var date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    var date1 = year + '-' + month + '-' + dt;
    //console.log(date1);
    //console.log(req.body);
    if (req.body.idaccountdetails != null) {
        knex('accountdetails')
            .where({ idaccountdetails: req.body.idaccountdetails })
            .update({
                bankname: req.body.bankname,
                accountno: req.body.accountno,
                amount: req.body.amount,
                idcustomer: req.body.id,
                casename: req.body.casename,
                updateddate: date1

            })
            .then(function(result) {
                res.json('Payout Updated Successfully');
            })
    } else {
        knex('accountdetails')
            .insert({
                bankname: req.body.bankname,
                accountno: req.body.accountno,
                amount: req.body.amount,
                idcustomer: req.body.id,
                casename: req.body.casename,
                status: 'active',
                createddate: date1

            })
            .then(function(result) {
                res.json('Payout Added Successfully');
            })
    }
})







router.get('/getDisburseCustomerList', function(req, res) {
    knex.select()
        .from('customer')
        .where({ status: 'disburse' })
        .then(function(result) {
            res.json(result)
        })
})

router.post('/savePayout', function(req, res) {
    //console.log(req.body);
    knex('applybank')
        .where({ idapplybank: req.body.idapplybank })
        .update({
            payout: req.body.payout
        })
        .then(function(result) {
            res.json('Payout Updated Successfully');
        })
})

router.post('/checknumber', function(req, res) {
        //console.log(req.body);
        knex.select()
            .from('customer')
            .where({ idno: req.body.idno })
            .then(function(result) {
                //  //console.log(result);
                if (result == undefined || result == '' || result == null) {
                    // //console.log("hi")
                    res.json({ status: false, });
                } else {
                    //console.log("bye")
                    res.json({
                        result: result,
                        status: true,
                    });
                }
                //  res.json('result')
            })
    })
    //   res.json('res');
    // })



router.get('/getvendornames', function(req, res) {
    knex.select('employee.*')
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user', 'SUB VENDOR')
        .then(function(result) {
            res.json(result)
        })

})



router.get('/gettranscationdata/:id', function(req, res) {
    //console.log(req.params);
    knex.select('accountdetails.*', 'accountdetails.amount as aamount')
        .from('accountdetails')
        .join('customer', 'customer.idcustomer', 'accountdetails.idcustomer')
        .where('accountdetails.status', 'active')
        .where('accountdetails.idcustomer', req.params.id)
        .then(function(result) {
            //console.log(result);

            res.json(result)
        })
})

router.get('/getApproveBankList/:id', function(req, res) {
    //console.log("hiii");
    //console.log(req.params.id);
    knex.select('applybank.*', 'bank.*', 'loantype.*')
        .from('applybank')
        .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('loantype', 'loantype.idloantype', 'applybank.idloan')
        .where('applybank.status', 'ACTIVE')
        .where('applybank.idcustomer', req.params.id)
        .then(function(result) {
            // //console.log(result);

            res.json(result)
        })
})


router.post('/reloanapply',
    upload.fields([{ name: 'cimage' }, , { name: 'pimage' },
        { name: 'aimage' }
    ]), (req, res) => {
        var dob = req.body.dob;
        var applieddate = req.body.applieddate;
        const nowdate1 = format.asString('yyyy-MM-dd', new Date(dob));
        const nowdate = format.asString('yyyy-MM-dd', new Date(applieddate));
        let config = req.body.arr;
        //console.log(config);
        if (req.files.cimage != null) {
            cimage = req.files.cimage[0]['filename'];
        } else {
            cimage = req.body.cimage;
        }

        if (req.files.pimage != null) {
            pimage = req.files.pimage[0]['filename'];
        } else {
            pimage = req.body.pimage;
        }

        if (req.files.aimage != null) {
            aimage = req.files.aimage[0]['filename'];
        } else {
            aimage = req.body.aimage;
        }
        knex('customer')
            .where('idcustomer', req.body.idcustomer)
            .update({
                email: req.body.email,
                cemail: req.body.cemail,
                dob: nowdate1,
                salary: req.body.salary,
                altmobile: req.body.altmobile,
                address: req.body.address,
                cname: req.body.cname,
                designation: req.body.designation,
                caddress: req.body.caddress,
                pincode: req.body.pincode,
                idexecutive: req.body.idexecutive,
                gender: req.body.gender,
                amount: req.body.amount,
                applytype: req.body.applytype,
                cimage: cimage,
                pimage: pimage,
                aimage: aimage,
                status: 'active',
                displaystatus: 'Pending',
                applieddate: nowdate,
                source: 'Application',
                documents: req.body.documents,
                idno: req.body.idno,
                subvendor: req.body.subvendor,
                topupstatus: 'topup',
                sourcetype: req.body.sourcetype,
                aadharno: req.body.aadharno,
                panno: req.body.panno,
                dlno: req.body.dlno,
                voterno: req.body.voterno,
                emptype: req.body.emptype,
                editby: req.body.createdby
            })

        // .returning('id')
        .then(function(idcustomer) {
            //console.log(config);
            //console.log(config1);
            const ids = idcustomer.toString();
            if (config == undefined || config == 'undefined') {
                res.json("Not Inserted");
                //console.log("empty data")
            } else {
                const vbs = JSON.parse(config);
                for (var j = 0; j < vbs.length; j++) {
                    var previousapplytype = vbs[j].loanid
                    var previousbankname = vbs[j].bankid
                    var previousamounttaken = vbs[j].previousamounttaken
                    var roi = vbs[j].roi
                    var pf = vbs[j].pf
                    var pl = vbs[j].pl
                    var insurance = vbs[j].insurance
                    var maturity = vbs[j].maturity
                    const pmaturity = format.asString('yyyy-MM-dd', new Date(maturity));
                    var startdate = vbs[j].startdate
                    const pstartdate = format.asString('yyyy-MM-dd', new Date(startdate));
                    knex('previousbankdetails')
                        .insert({
                            idloantype: previousapplytype,
                            idbank: previousbankname,
                            amount: previousamounttaken,
                            roi: roi,
                            pf: pf,
                            pl: pl,
                            idcustomer: ids,
                            insurance: insurance,
                            startdate: pstartdate,
                            maturity: pmaturity
                        }).then(function(re) {
                            res.json(re);
                        })
                }
            }
            if (config1 == undefined || config1 == 'undefined') {
                res.json("Not Inserted");
                //console.log("empty data")
            } else {
                const vbs1 = JSON.parse(config1);
                for (var j = 0; j < vbs1.length; j++) {
                    var coname = vbs1[j].coname
                    var copaddress = vbs1[j].copaddress
                    var coraddress = vbs1[j].coraddress

                    knex('co-customer')
                        .insert({
                            coappname: coname,
                            coappresaddress: copaddress,
                            coappperaddress: coraddress,
                            idcustomer: ids

                        }).then(function(re) {
                            res.json(re);
                        })
                }
            }

        })
    });

router.post('/bulkSms', function(req, res) {
    //console.log(req.body);

    knex.select('customer.mobile')
        .from('customer')
        .where({ status: 'disburse' })
        .then(function(result) {
            res.json(result)


            for (var i = 0; i < result.length; i++) {
                request('http://13.127.28.222/vendorsms/pushsms.aspx?apikey=ef23d052-14d5-409e-b78a-becf4ad3dea6&clientid=a4fdddfc-9f2d-4bae-97a6-95f5496f5335&msisdn=' + result[i].mobile + '&sid=MAVYAH&msg=' + req.body.message + '&fl=0&gwid=2',
                    function(err, res, body) {
                        if (!err && res.statusCode == 200) {
                            //console.log(body);
                        }
                    })

            }
        })

})

router.post('/getDetails', function(req, res) {
    //console.log(req.body);
    knex.select('loantype.loantype', 'employee.name as ename', 'customer.*')
        .from('customer')
        // .join('previousbankdetails','previousbankdetails.idcustomer','customer.idcustomer')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')
        .join('loantype', 'loantype.idloantype', 'customer.applytype')
        .where({ autoid: req.body.bankname })
        .then(function(result) {
            res.json(result)
        })
})

router.post('/getPreviousBankDetails', function(req, res) {

    knex.select('customer.name as cname', 'bank.bankname', 'loantype.loantype', 'previousbankdetails.*')

    .from('previousbankdetails')
        .join('customer', 'customer.idcustomer', 'previousbankdetails.idcustomer')
        .join('loantype', 'loantype.idloantype', 'previousbankdetails.idloantype')
        .join('bank', 'bank.idbank', 'previousbankdetails.idbank')
        .where('customer.autoid', req.body.bankname)
        .then(function(result) {
            res.json(result)
        })
})

router.post('/getApprovedBankDetails', function(req, res) {
    knex.select('customer.name as cname', 'bank.bankname', 'loantype.loantype', 'applybank.*')
        .from('applybank')
        .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
        .join('loantype', 'loantype.idloantype', 'applybank.idloan')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .where('customer.autoid', req.body.bankname)
        .where('applybank.status', 'ACTIVE')
        .then(function(result) {
            res.json(result)
        })
})

router.post('/accountdetails', function(req, res) {
    knex.select('accountdetails.*')
        .from('accountdetails')
        .join('customer', 'customer.idcustomer', 'accountdetails.idcustomer')
        .where('customer.autoid', req.body.bankname)
        //  .where('applybank.status','ACTIVE')
        .then(function(result) {
            res.json(result)
        })
})

//Android Apis

//signup
router.post('/androidsignup', upload.fields([{ name: 'file' }]), (req, res) => {
    //console.log(req.files);
    //console.log(req.body);
    //console.log("hiii");

    var gen = otpGenerator.generate(5, { upperCase: false, specialChars: false, alphabets: false });
    //console.log(gen);
    // res.json({gen});
    var message = urlencode('Mindfin One Time Password For Sign up is ' + gen);
    var mobile = req.body.mobile;

    knex('customer')
        .insert({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            address: req.body.address,
            dob: req.body.dob,
            pincode: req.body.pincode,
            altmobile: req.body.altmobile,
            gender: req.body.gender,
            otp: gen
        })
        .then(function(result) {
            res.json('Customer Added Successfully');
        })
        //console.log(mobile);
    request('http://13.127.28.222/vendorsms/pushsms.aspx?apikey=ef23d052-14d5-409e-b78a-becf4ad3dea6&clientid=a4fdddfc-9f2d-4bae-97a6-95f5496f5335&msisdn=' + mobile + '&sid=MAVYAH&msg=' + message + '&fl=0&gwid=2',
        function(err, res, body) {
            if (!err && res.statusCode == 200) {
                //console.log(body);
            }
        })
})

//login
router.get('/androidadminlogin', (req, res) => {
    //console.log(req.query.username);
    //console.log("hiii");
    const username = req.query.username;
    const password = (sha1(req.query.password));
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where({ email: username, password: password })
        .then(function(result) {
            //console.log(result);
            if (result[0] == '' || result[0] == undefined || result[0] == 0 || result[0] == null) {
                knex.select()
                    .from('customer')
                    .where({ email: username, password: password })
                    .then(function(result1) {
                        res.json({
                            result: result1[0],
                            message: 'customer'
                        })
                    })
            } else if (result[0].user == 'SUPERADMIN') {
                //console.log('admin');
                res.json({
                    result: result[0],
                    message: 'admin'
                })
            } else if (result[0].user == 'EXECUTIVE') {
                //console.log('executive');

                res.json({
                    result: result[0],
                    message: 'executive'
                })
            } else if (result[0].user == 'DATAENTRY') {
                //console.log('dataentry');
                res.json({
                    result: result[0],
                    message: 'dataentry'
                })
            } else {
                //console.log('telecallers');
                res.json({
                    result: result[0],
                    message: 'telecallers'
                })
            }
        })
})


//checkotp
router.get('/checkotp', (req, res) => {
    const otpno = req.query.otpno;
    knex.select()
        .from('customer')
        .where({ otp: otpno })
        .then(function(result) {
            res.json({
                result: result[0],
                message: 'true'
            })
        })
})


//banklist
router.get('/getbanklist1', (req, res) => {
    knex.select()
        .from('bank')
        .where('bank.status', 'active')
        .then(function(result) {
            res.json({
                result: result,
                message: "Data found sucessfully",
                success: '1'
            });
        })
})

//loanlist
router.get('/getloanlist1', (req, res) => {
    knex.select()
        .from('loantype')
        .where('loantype.status', 'active')
        .then(function(result) {
            res.json({
                result: result,
                message: "Data found sucessfully",
                success: '1'
            });
        })
})

//pdlist
router.get('/getandroidpdlist', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'pd')
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})

//pdlistcount
router.get('/getandroidpdcount', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'pd')
        // .where('customer.displaystatus','Approved')
        .then(function(result) {
            res.json({
                result: result.length,
                status: 'true'
            });
        })
})

//logincount
router.get('/getandroidlogincount', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'active')
        // .where('customer.displaystatus','Pending')
        .then(function(result) {
            res.json({
                result: result.length,
                status: 'true'
            });
        })
})

//loginlist
router.get('/getandroidloginlist', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'active')
        // .where('customer.displaystatus','Pending')
        .then(function(result) {
            res.json(result);
        })
})


//rejectcount
router.get('/getrejectcustomercount', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'reject')
        // .where('customer.displaystatus','Reject')
        .then(function(result) {
            res.json({
                result: result.length,
                status: 'true'
            });
        })
})

//rejectlist
router.get('/getrejectcustomerlist', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'reject')
        // .where('customer.displaystatus','Reject')
        .then(function(result) {
            res.json(result);
        })
})

//executivecount
router.get('/getexecutivecount', (req, res) => {
        knex.select()
            .from('employee')
            .join('usertype', 'usertype.idusertype', 'employee.iduser')
            .where('usertype.user ', 'EXECUTIVE')
            .where('employee.status ', 'active')
            .then(function(result) {
                res.json({
                    result: result.length,
                    status: 'true'
                });
            })
    })
    // //approved list in id
    //   router.get('/getlist',(req,res)=>{
    //     //console.log(req.query);
    //     knex.select('customer.*,employee.name as ename')
    //     .from('customer')
    //     .join('employee','employee.idemployee','customer.idexecutive')
    //     .where('customer.idcustomer',req.query.id)
    //     .then(function(result){  
    //       res.json(result[0]);
    //     })    
    //   })
    //
    // router.get('/androidadminlogin1',(req,res)=>{
    //   //console.log(req.query.username);
    //   //console.log("hiii");
    // const username= req.query.username;
    // const password = (sha1(req.query.password));
    // knex.select()
    // .from('employee')
    // .join('usertype','usertype.idusertype','employee.iduser')
    // .where({email:username,password:password})
    // .then(function(result){  
    // if(result[0]==''||result[0]==undefined||result[0]==0||result[0]==null)
    // {
    //   knex.select()
    //   .from('approvedcustomer')
    //   .where({email:username,password:password})
    //   .then(function(result1){ 
    // res.json(result1[0],
    //   // message:'customer'
    // )
    // })
    // }
    // else if(result[0].user=='ADMIN')
    // {
    // res.json(result[0],
    //   // message:'admin'
    // )
    // }
    // else{
    //   res.json(result[0],
    //     // message:'executive'

// )
// }
// })
// })


//emplist
router.get('/getemployeelist1', (req, res) => {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.status', 'active')
        .where('usertype.user', 'EXECUTIVE')

    .then(function(result) {
        res.json(result);
    })
})


//emplist by id
router.get('/getemplist', (req, res) => {
    //console.log(req.query);
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.status', 'active')
        .where('employee.idemployee', req.query.id)
        .then(function(result) {
            res.json(result[0]);
        })
})

//approvelist
router.get('/getandroidapprovelist', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'approve')
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})

//approvecount
router.get('/getandroidapprovecount', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'approve')
        // .where('customer.displaystatus','Approved')
        .then(function(result) {
            res.json({
                result: result.length,
                status: 'true'
            });
        })
})

//disburselist
router.get('/getandroiddisburselist', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'disburse')
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})

//disbursecount
router.get('/getandroiddisbursecount', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', 'disburse')
        // .where('customer.displaystatus','Approved')
        .then(function(result) {
            res.json({
                result: result.length,
                status: 'true'
            });
        })
})


//disburselist
router.get('/getandroidtelecallerlist', (req, res) => {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.status', 'active')
        .where('usertype.user', 'TELECALLER')
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})

//disbursecount
router.get('/getandroidtelecallercount', (req, res) => {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.status', 'active')
        .where('usertype.user', 'TELECALLER')
        .then(function(result) {
            res.json({
                result: result.length,
                status: 'true'
            });
        })
})

router.get('/getandroiddataentrylist', (req, res) => {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.status', 'active')
        .where('usertype.user', 'DATAENTRY')
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})

//disbursecount
router.get('/getandroiddataentrycount', (req, res) => {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.status', 'active')
        .where('usertype.user', 'DATAENTRY')
        .then(function(result) {
            res.json({
                result: result.length,
                status: 'true'
            });
        })
})

router.post('/settings', upload.fields([{ name: 'leftimg' }]), (req, res) => {
    //console.log(req.body);
    //console.log(req.files);

    if (req.files.leftimg != null) {
        image = req.files.leftimg[0]['filename'];
    } else {
        image = req.body.leftimg;
    }
    //console.log(image)
    knex('settings')
        .where({ idsetting: req.body.idsetting })
        .update({
            emailpassword: req.body.emailpassword,
            emailuser: req.body.emailuser,
            fromemail1: req.body.fromemail1,
            fromemail2: req.body.fromemail2,
            hostmail: req.body.hostmail,
            mloginlink: req.body.mloginlink,
            subject: req.body.subject,
            regards: req.body.regards,
            cc: req.body.cc,
            bcc: req.body.bcc,
            bsubject: req.body.bsubject,
            status: 'active',
            address: req.body.address,
            image: image
        })
        .then(function(result) {
            //console.log(result);
            res.json('Settings Updated Successfully');
        })

});


router.get('/settinglist', (req, res) => {
    knex.select()
        .from('settings')
        // .count('member_table.pname as total')  
        // .join('member_table','member_table.pname','project.idproject')
        // .groupBy('member_table.pname')
        .then(function(result1) {
            res.json(result1);
        })
});

//approved list in id
router.get('/getlist', (req, res) => {
    //console.log(req.query);
    knex.select('customer.*', 'employee.name as ename')
        .from('customer')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')
        .where('customer.idcustomer', req.query.id)
        .then(function(result) {
            res.json(result[0]);
        })
})

router.get('/getappliedloanlist', (req, res) => {
    // //console.log(req.query);
    knex.select('applybank.*', 'bank.bankname', 'loantype.loantype')
        .from('applybank')
        .join('loantype', 'loantype.idloantype', 'applybank.idloan')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
        .where('applybank.idcustomer', req.query.id)
        .then(function(result) {
            res.json(result);
        })
})

router.get('/getsuccesstopuplist/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))

    knex.select()
        .from('customer')
        .where({ topupstatus: 'success' })
        .limit(pageSize).offset(skip)
        .then(function(result) {
            //   res.json(result);
            // })    
            // knex.select('customer.*','loantype.loantype','employee.name as empname')
            // .from('customer')
            // .join('loantype','loantype.idloantype','customer.applytype')
            // .join('employee','employee.idemployee','customer.idexecutive')
            // .where ({'customer.status':'approve'})
            // .limit(pageSize).offset(skip)
            // .then(function(result){

            knex.select()
                .from('customer')
                .where({ topupstatus: 'success' })
                .then(function(re) {
                    var a = re.length
                        // //console.log(a);
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
})
router.post('/checkaadharnumber', function(req, res) {
        //console.log(req.body);
        knex.select()
            .from('customer')
            .where({ aadharno: req.body.aadharno })
            .then(function(result) {
                if (result == undefined || result == '' || result == null) {

                    res.json({ status: false });
                } else {
                    //console.log("bye")
                    res.json({
                        result: result,
                        status: true,
                    });
                }

            })
    })
    //   res.json('res');
    // })
router.post('/checkpannumber', function(req, res) {
    //console.log(req.body.panNo);
    knex.select()
        .from('customer')
        .where({ panno: req.body.panNo })
        .then(function(result) {

            if (result == undefined || result == '' || result == null) {

                res.json({ status: false, });
            } else {
                //console.log("bye")
                res.json({
                    result: result,
                    status: true,
                });
            }

        })
})

router.post('/checkdlnumber', function(req, res) {
    //console.log(req.body);
    knex.select()
        .from('customer')
        .where({ dlno: req.body.dlNo })
        .then(function(result) {

            if (result == undefined || result == '' || result == null) {

                res.json({ status: false, });
            } else {
                //console.log("bye")
                res.json({
                    result: result,
                    status: true,
                });
            }

        })
})

router.post('/checkvoternumber', function(req, res) {
    //console.log(req.body);
    knex.select()
        .from('customer')
        .where({ voterno: req.body.voterNo })
        .then(function(result) {

            if (result == undefined || result == '' || result == null) {

                res.json({ status: false, });
            } else {
                //console.log("bye")
                res.json({
                    result: result,
                    status: true,
                });
            }

        })
})
router.get('/getemployeename/:id', (req, res) => {
    //console.log(req.params.id);
    knex.select()
        .from('employee')
        .where({ idemployee: req.params.id })
        .then(function(result) {
            //console.log(result);
            res.json(result);
        })
});
// router.get('/getemployeetypelist',(req,res)=>{
//   knex.select('emp_type')
//   .from('employeetype')
//   .then(function(result){
//     res.json(result);
//   })
// })
router.get('/rejectcustomer/:obj/:obj1', function(req, res) {
    // //console.log(req.params.obj);
    // //console.log(req.params.obj1);
    var date3 = format.asString('yyyy-MM-dd', new Date());
    knex('customer')
        .where({ idcustomer: req.params.obj1 })
        .update({
            status: "reject",
            displaystatus: "Reject",
            reject_reason: req.params.obj,
            updateddate: moment().format(date3)
        }).then(function(result) {
            // //console.log(result); 
            res.json('Approved custome Rejected Successfully');
        })
});
router.get('/rejectbank/:obj/:obj1', function(req, res) {
    // //console.log(req.params.obj);
    // //console.log(req.params.obj1);

    knex('applybank')
        .where({ idapplybank: req.params.obj1 })
        .update({
            status: "REJECTED",
            reject_reason: req.params.obj,

        }).then(function(result) {
            // //console.log(result); 
            res.json('Approved custome Rejected Successfully');
        })
});

router.get('/getbankname', (req, res) => {
    knex.select()
        .from('bank')
        .then(function(result) {
            res.json(result);
        })
});
// router.post('/addroutine/:empid', (req, res) => {
//   const nowdate = format.asString('yyyy-MM-dd', new Date());

//   knex('daily_routine')
//     .insert({
//       companyname: req.body.companyname,
//       bankid: req.body.bankname,
//       whosecase: req.body.whosecase,
//       status: req.body.status,
//       employeeid: req.params.empid,
//       createddate: nowdate
//     })
//     .then(function (result) {
//       res.json('daily_routine Added Successfully');
//     })
// });
router.post('/addroutine', (req, res) => {
    const vbs = req.body.arr;
    const nowdate = format.asString('yyyy-MM-dd', new Date());
    for (var j = 0; j < vbs.length; j++) {
        // var backendid = vbs[j].loanid
        var companyname = vbs[j].companyname
        var bankid = vbs[j].bankid
        var status = vbs[j].status
        var whosecase = vbs[j].whosecase
        var comment = vbs[j].comment
        knex('daily_routine')
            .insert({
                bankid: bankid,
                companyname: companyname,
                whosecase: whosecase,
                employeeid: req.body.idvalue,
                status: status,
                createddate: nowdate,
                comment: comment
            }).then(function(result) {
                //console.log(result);
            })
    }
});
router.get('/editdataa/:id', function(req, res) {
    knex.select('enquirydata.*', 'employee.idemployee as executive', 'enquirydata.createddate as enqdate', 'loantype.idloantype as applytype')
        .from('enquirydata')
        .join('employee', 'employee.idemployee', 'enquirydata.executiveid')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        // .join('previousbankdetails','previousbankdetails.idcustomer','customer.idcustomer')
        .where('enquirydata.idenquiry', req.params.id)
        .then(function(result) {
            //console.log(result);
            res.json(result);
        })
});
router.post('/updateenquiry', (req, res) => {
    //console.log(req.body);
    // var applieddate = req.body.value.enqdate;
    // //console.log(applieddate);
    // const localTime = format.asString('yyyy-MM-dd', new Date());
    // var date1 = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var localTime = format.asString('yyyy-MM-dd', new Date());
    knex('enquirydata')
        .where('idenquiry', req.body.idenquiry)
        .update({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            altmobile: req.body.altmobile,
            address: req.body.address,
            status: req.body.status,
            gender: req.body.gender,
            loantype: req.body.applytype,
            createddate: req.body.createddate,
            // teleid: req.body.teleid,
            // adminid: req.body.adminid,
            comment: req.body.comment,
            updateddate: localTime,
            turnover: req.body.turnover,
            approchedBank: req.body.approchedBank,
            loanCategory: req.body.value.loanCategory,
            subLoanCategory: req.body.value.subLoanCategory

        })
        .then(function(result) {
            ////console.log(result); 
            res.json('Enquiry update Successfully');
        })
});
router.get('/enquirycount1', (req, res) => {

    knex.select()
        .from('enquirydata')
        .then(function(result) {
            //console.log(result.length);
            res.json(result.length);
        })
});


router.get('/getEnquirylistexe/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);

    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.executiveid', req.params.id)
        .orderBy('enquirydata.assignedTime', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.executiveid', req.params.id)

            .orderBy('enquirydata.assignedTime', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/enquirycount2/:obj', (req, res) => {

    knex.select()
        .from('enquirydata')
        .where('executiveid', req.params.obj)
        .then(function(result) {
            //console.log(result.length);
            res.json(result.length);
        })
});
router.get('/viewroutine/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    //console.log(req.params.id);
    knex.select('daily_routine.*', 'bank.bankname')
        .from('daily_routine')
        .join('bank', 'bank.idbank', 'daily_routine.bankid')
        .where('employeeid', req.params.id)
        .orderBy('daily_routine.routineid', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {

            knex.select('daily_routine.*', 'bank.bankname')
                .from('daily_routine')
                .join('bank', 'bank.idbank', 'daily_routine.bankid')
                .where('employeeid', req.params.id)
                .orderBy('daily_routine.routineid', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/editdata1/:id', function(req, res) {
    knex.select('daily_routine.*', 'bank.bankname', 'bank.idbank')
        .from('daily_routine')
        .join('bank', 'bank.idbank', 'daily_routine.bankid')
        .where('routineid', req.params.id)
        .then(function(result) {
            //console.log(result);
            res.json(result);
        })
});
router.post('/editroutine', (req, res) => {
    const nowdate = format.asString('yyyy-MM-dd', new Date());
    //console.log(req.body);
    knex('daily_routine')
        .where('routineid', req.body.routineid)
        .update({
            companyname: req.body.companyname,
            bankid: req.body.bankid,
            whosecase: req.body.whosecase,
            status: req.body.status,
            // employeeid: req.params.empid,
            updateddate: nowdate,
            comment: req.body.comment
        })
        .then(function(result) {
            res.json('daily_routine update Successfully');
        })
});
router.get('/dataentrypiechart', function(req, res) {
    knex.select('status.status')
        .from('status')
        .count('status.statusid as total')
        // .join('employee', 'employee.iduser', 'usertype.idusertype')
        // .where('employee.status', 'active')
        .groupBy('status.status')
        .then(function(result) {
            res.json(result);
        })
});
router.get('/getbankrejectlist/:pagesize/:page/:id', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    var subquery = knex.select().from('status').max('status.statusid').groupBy('status.addbankid');
    knex.select('applybank.*', 'bank.*', 'customer.*', 'loantype.*', 'status.*', 'status.status as sstatus', 'status.createddate as screateddate',
            'loantype.loantype', 'applybank.reject_reason as areject_reason', 'applybank.amount as aamount')
        .from('applybank', 'customer')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
        // .join('loantype', 'loantype.idloantype', 'customer.applytype')
        .join('status', 'status.addbankid', 'applybank.idapplybank')
        .join('loantype', 'applybank.idloan', 'loantype.idloantype')
        .whereIn('status.statusid', subquery)
        .where('applybank.idcustomer', req.params.id)
        // knex.select('customer.*', 'applybank.*', 'bank.*', 'loantype.*', 'applybank.status as astatus')
        //     .from('applybank', 'customer')
        //     .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
        //     .join('bank', 'bank.idbank', 'applybank.idbank')
        //     .join('loantype', 'loantype.idloantype', 'customer.applytype')
        //     .where({ 'applybank.idcustomer': req.params.id })
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(result);
            knex.select()
                .from('applybank', 'customer')
                .join('bank', 'bank.idbank', 'applybank.idbank')
                .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
                // .join('loantype', 'loantype.idloantype', 'customer.applytype')
                .join('status', 'status.addbankid', 'applybank.idapplybank')
                .join('loantype', 'applybank.idloan', 'loantype.idloantype')
                .whereIn('status.statusid', subquery)
                .where('applybank.idcustomer', req.params.id)
                .then(function(re) {
                    var a = re.length
                        // //console.log(a);
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/approvalmember/:obj/:obj1', function(req, res) {
    // //console.log(req.params.obj);
    // //console.log(req.params.obj1);
    var date3 = format.asString('yyyy-MM-dd', new Date());
    knex('applybank')
        .where({ idapplybank: req.params.obj1 })
        .update({
            status: "APPROVED",
            amount: req.params.obj,
            updateddate: moment().format(date3)
        }).then(function(result) {
            // //console.log(result); 
            res.json('Approved custome Successfully');
        })
});
router.get('/topupcount/:obj', (req, res) => {
    var subquery = knex.select().from('status').max('status.statusid').groupBy('status.addbankid');
    knex.select('applybank.*', 'bank.bankname', 'bank.bankvendor', 'status.*', 'status.status as sstatus', 'loantype.loantype')
        .from('applybank')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('status', 'status.addbankid', 'applybank.idapplybank')
        .join('loantype', 'applybank.idloan', 'loantype.idloantype')
        .whereIn('status.statusid', subquery)
        .where('applybank.status', 'ACTIVE')
        .where('applybank.executiveid', req.params.obj)
        .then(function(result) {
            res.json(result.length);
        })
        // knex.select()
        //     .from('applybank')
        //     .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
        //     .join('employee', 'employee.idemployee', 'customer.idexecutive')
        //     .join('topup', 'topup.idtopup', 'applybank.idtopup')
        //     .join('bank', 'bank.idbank', 'applybank.idbank')
        //     .where('customer.status', 'disburse')
        //     .where('customer.topupstatus', 'topup')
        //     .where('customer.idexecutive', req.params.obj)
        //     .then(function (result) {
        //         //console.log(result.length);
        //         res.json(result.length);
        //     })
});
router.post('/custdocument', (req, res) => {
    //console.log(req.body);
    var companykyc;
    var comp_orgname;
    var customerkyc;
    var cust_orgname;
    var itr;
    var itr_orgname;
    var bankstatement;
    var bank_orgname;
    var loanstatement;
    var loan_orgname;
    var gstandreturns;
    var gst_orgname;
    var applicationDetails;
    var applicationDetails_orgname;
    var status;
    var displaystatus;

    var dob = req.body.value.dob;
    var applieddate = req.body.value.applieddate;
    const nowdate = format.asString('yyyy-MM-dd', new Date(applieddate));
    const nowdate1 = format.asString('yyyy-MM-dd', new Date(dob));
    const nowdate2 = format.asString('yyyy-MM-dd', new Date());

    let config = req.body.arr;

    if (req.body.companykyc == undefined) {
        companykyc = 'admin.png';
        comp_orgname = 'admin.png';

    } else {
        companykyc = req.body.companykyc[0].filename;
        comp_orgname = req.body.companykyc[0].originalname;
        //console.log("company kyc filename  " + companykyc);
        //console.log("comp orginal name  " + comp_orgname);
    }
    if (req.body.customerkyc == undefined) {
        customerkyc = 'admin.png';
        cust_orgname = 'admin.png';

    } else {
        customerkyc = req.body.customerkyc[0].filename;
        cust_orgname = req.body.customerkyc[0].originalname;
        //console.log("cust kyc filename  " + customerkyc);
        //console.log("cudt orginal name  " + cust_orgname);
    }
    if (req.body.itr == undefined) {
        itr = 'admin.png';
        itr_orgname = 'admin.png';

    } else {
        itr = req.body.itr[0].filename;
        itr_orgname = req.body.itr[0].originalname;
        //console.log("itr filename  " + itr);
        //console.log("itr orginal name  " + itr_orgname);
    }
    if (req.body.bankstatement == undefined) {
        bankstatement = 'admin.png';
        bank_orgname = 'admin.png';

    } else {
        bankstatement = req.body.bankstatement[0].filename;
        bank_orgname = req.body.bankstatement[0].originalname;
        //console.log("bankstatement filename  " + bankstatement);
        //console.log("bankstatement orginal name  " + bank_orgname);
    }
    if (req.body.loanstatement == undefined) {
        loanstatement = 'admin.png';
        loan_orgname = 'admin.png';

    } else {
        loanstatement = req.body.loanstatement[0].filename;
        loan_orgname = req.body.loanstatement[0].originalname;
        //console.log("loanstatement filename  " + loanstatement);
        //console.log("loanstatement orginal name  " + loan_orgname);
    }
    if (req.body.gstandreturns == undefined) {
        gstandreturns = 'admin.png';
        gst_orgname = 'admin.png';

    } else {
        gstandreturns = req.body.gstandreturns[0].filename;
        gst_orgname = req.body.gstandreturns[0].originalname;
        //console.log("gstandreturns filename  " + gstandreturns);
        //console.log("gstandreturns orginal name  " + gst_orgname);
    }
    if (req.body.applicationDetails == undefined) {
        applicationDetails = 'admin.png';
        applicationDetails_orgname = 'admin.png';

    } else {
        applicationDetails = req.body.applicationDetails[0].filename;
        applicationDetails_orgname = req.body.applicationDetails[0].originalname;
        //console.log("applicationDetails filename  " + applicationDetails);
        //console.log("applicationDetails orginal name  " + applicationDetails_orgname);
    }
    if (req.body.value.displaystatus != 'APPROVED') {
        displaystatus = "PENDING"
        status = "PENDING"
    } else {
        displaystatus = "APPROVED"
        status = "APPROVED"
    }
    knex('customer')
        .insert({
            applieddate: nowdate,
            applytype: req.body.value.applytype,
            loanCategory: req.body.value.loanCategory,
            subLoanCategory: req.body.value.subLoanCategory,
            name: req.body.value.name,
            dob: nowdate1,
            gender: req.body.value.gender,
            address: req.body.value.address,
            pincode: req.body.value.pincode,
            mobile: req.body.value.mobile,
            altmobile: req.body.value.altmobile,
            email: req.body.value.email,
            cname: req.body.value.cname,
            caddress: req.body.value.caddress,
            cemail: req.body.value.cemail,
            emptype: req.body.value.emptype,
            designation: req.body.value.designation,
            salary: req.body.value.salary,
            aadharno: req.body.value.aadharno,
            panno: req.body.value.panno,
            dlno: req.body.value.dlno,
            voterno: req.body.value.voterno,
            whosecase: req.body.value.whosecase,
            idexecutive: req.body.abc[0],
            executivename: req.body.abc[1],
            amount: req.body.value.amount,
            subvendor: req.body.value.subvendor,
            sourcetype: req.body.value.sourcetype,
            // source: 'Application',
            topupstatus: 'topup',
            displaystatus: displaystatus,
            companykyc: companykyc,
            companykyc_orgname: comp_orgname,
            customerkyc: customerkyc,
            customerkyc_orgname: cust_orgname,
            itr: itr,
            itr_orgname: itr_orgname,
            bankstatement: bankstatement,
            bankstatement_orgname: bank_orgname,
            gstandreturns: gstandreturns,
            gstandreturns_orgname: gst_orgname,
            loanstatement: loanstatement,
            loanstatement_orgname: loan_orgname,
            applicationDetails: applicationDetails,
            applicationDetails_orgname: applicationDetails_orgname,
            status: status,
            createdby: req.body.empid,
            comment: req.body.value.comment,
            createdbyname: req.body.empname,
        })
        // .returning('id')
        .then(function(id) {
            //console.log("conf", config);

            const ids = id.toString();
            if (config == undefined || config == 'undefined') {
                res.json("Not Inserted");
                //console.log("empty data")
            } else {
                // const vbs1 = JSON.parse(config);
                for (var j = 0; j < config.length; j++) {
                    var coname = config[j].coname
                    var copaddress = config[j].copaddress
                    var coraddress = config[j].coraddress
                    knex('co-customer')
                        .insert({
                            coappname: coname,
                            coappresaddress: copaddress,
                            coappperaddress: coraddress,
                            idcustomer: ids

                        }).then(function(re) {
                            res.json("inserted");
                            console.log("inserted")
                        })
                }
            }
        })
});
router.get('/getdocument/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))


    knex.select('customer.*', 'employee.name as ename')
        .from('customer', 'employee')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')
        .orderBy('customer.idcustomer', 'desc')
        // .where({ 'createdby': req.params.exeid })
        .limit(pageSize).offset(skip)
        .then(function(result) {

            knex.select()
                .from('customer', 'employee')
                .join('employee', 'employee.idemployee', 'customer.idexecutive')
                .orderBy('customer.idcustomer', 'desc')
                .then(function(re) {
                    var a = re.length
                        //console.log(a);
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getdocument3/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select('customer.*', 'employee.name as ename')
        .from('customer', 'employee')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')
        .orderBy('customer.idcustomer', 'desc')
        .where({ 'customer.status': "APPROVED" })
        .limit(pageSize).offset(skip)
        .then(function(result) {

            knex.select()
                .from('customer', 'employee')
                .join('employee', 'employee.idemployee', 'customer.idexecutive')
                .where({ 'customer.status': "APPROVED" })
                .orderBy('customer.idcustomer', 'desc')
                .then(function(re) {
                    var a = re.length
                        //console.log(a);
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })

    // knex.select('backend_operator.*', 'employee.name as ename')
    //   .from('backend_operator', 'employee')
    //   .join('employee', 'employee.idemployee', 'backend_operator.executiveid')
    //   // .where({ 'createdby': req.params.exeid })
    //   .limit(pageSize).offset(skip)
    //   .then(function (result) {

    //     knex.select()
    //       .from('backend_operator', 'employee')
    //       .join('employee', 'employee.idemployee', 'backend_operator.executiveid')
    //       // .where({ 'createdby': req.params.exeid })
    //       .then(function (re) {
    //         var a = re.length
    //         //console.log(a);
    //         res.status(200).json({
    //           message: "Memberlists fetched",
    //           posts: result,
    //           maxPosts: re.length
    //         });
    //       })
    //   })
});
router.get('/backendedit/:id', function(req, res) {
    knex.select()
        .from('customer')
        // .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('customer.idcustomer', req.params.id)
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
});
router.post('/editcustdoc', (req, res) => {

    const nowdate = format.asString('yyyy-MM-dd', new Date());
    var companykyc;
    var comp_orgname;
    var customerkyc;
    var cust_orgname;
    var itr;
    var itr_orgname;
    var bankstatement;
    var bank_orgname;
    var loanstatement;
    var loan_orgname;
    var gstandreturns;
    var gst_orgname;
    var applicationDetails;
    var applicationDetails_orgname;
    var status;
    var displaystatus;
    if (req.body.companykyc == undefined) {
        companykyc = req.body.value.companykyc;

    } else {
        companykyc = req.body.companykyc[0].filename;
        comp_orgname = req.body.companykyc[0].originalname;
        //console.log("company kyc filename  " + companykyc);
        //console.log("comp orginal name  " + comp_orgname);
    }
    if (req.body.customerkyc == undefined) {
        customerkyc = req.body.value.customerkyc;

    } else {
        customerkyc = req.body.customerkyc[0].filename;
        cust_orgname = req.body.customerkyc[0].originalname;
        //console.log("cust kyc filename  " + customerkyc);
        //console.log("cudt orginal name  " + cust_orgname);
    }
    if (req.body.itr == undefined) {
        itr = req.body.value.itr;

    } else {
        itr = req.body.itr[0].filename;
        itr_orgname = req.body.itr[0].originalname;
        //console.log("itr filename  " + itr);
        //console.log("itr orginal name  " + itr_orgname);
    }
    if (req.body.bankstatement == undefined) {
        bankstatement = req.body.value.bankstatement;

    } else {
        bankstatement = req.body.bankstatement[0].filename;
        bank_orgname = req.body.bankstatement[0].originalname;
        //console.log("bankstatement filename  " + bankstatement);
        //console.log("bankstatement orginal name  " + bank_orgname);
    }
    if (req.body.loanstatement == undefined) {
        loanstatement = req.body.value.loanstatement;

    } else {
        loanstatement = req.body.loanstatement[0].filename;
        loan_orgname = req.body.loanstatement[0].originalname;
        //console.log("loanstatement filename  " + loanstatement);
        //console.log("loanstatement orginal name  " + loan_orgname);
    }
    if (req.body.gstandreturns == undefined) {
        gstandreturns = req.body.value.gstandreturns;

    } else {
        gstandreturns = req.body.gstandreturns[0].filename;
        gst_orgname = req.body.gstandreturns[0].originalname;
        //console.log("gstandreturns filename  " + gstandreturns);
        //console.log("gstandreturns orginal name  " + gst_orgname);
    }
    if (req.body.applicationDetails == undefined) {
        applicationDetails = 'admin.png';
        applicationDetails_orgname = 'admin.png';

    } else {
        applicationDetails = req.body.applicationDetails[0].filename;
        applicationDetails_orgname = req.body.applicationDetails[0].originalname;
        //console.log("applicationDetails filename  " + applicationDetails);
        //console.log("applicationDetails orginal name  " + applicationDetails_orgname);
    }
    if (req.body.applicationDetails == undefined) {
        applicationDetails = 'admin.png';
        applicationDetails_orgname = 'admin.png';

    } else {
        applicationDetails = req.body.applicationDetails[0].filename;
        applicationDetails_orgname = req.body.applicationDetails[0].originalname;
        //console.log("applicationDetails filename  " + applicationDetails);
        //console.log("applicationDetails orginal name  " + applicationDetails_orgname);
    }
    if (req.body.value.displaystatus != 'APPROVED') {
        displaystatus = "PENDING"
        status = "PENDING"
    } else {
        displaystatus = "APPROVED"
        status = "APPROVED"
    }
    knex('customer')
        .update({
            cname: req.body.value.companyname,
            name: req.body.value.customername,
            whosecase: req.body.value.whosecase,
            idexecutive: req.body.value.idexecutive,
            displaystatus: displaystatus,
            companykyc: companykyc,
            companykyc_orgname: comp_orgname,
            customerkyc: customerkyc,
            customerkyc_orgname: cust_orgname,
            itr: itr,
            itr_orgname: itr_orgname,
            bankstatement: bankstatement,
            bankstatement_orgname: bank_orgname,
            gstandreturns: gstandreturns,
            gstandreturns_orgname: gst_orgname,
            loanstatement: loanstatement,
            loanstatement_orgname: loan_orgname,
            applicationDetails: applicationDetails,
            applicationDetails_orgname: applicationDetails_orgname,
            status: status,
            updateddate: nowdate,
            createdby: req.body.empid,
            comment: req.body.value.comment,
            mobile: req.body.value.mobile,
            aadharno: req.body.value.aadharno,
            panno: req.body.value.panno,
            createdbyname: req.body.empname,
        })
        .where('idcustomer', req.body.custid)
        .then(function(result) {
            ////console.log(result); 
            res.json('customer document Updated Successfully');
        })

});
router.post('/backendbankinsert', (req, res) => {
    const vbs = req.body.arr;
    const nowdate = format.asString('yyyy-MM-dd', new Date());
    for (var j = 0; j < vbs.length; j++) {
        // var backendid = vbs[j].loanid
        var bankid = vbs[j].bankid
        var vendor = vbs[j].vendor
        var amount = vbs[j].amount
        var status = vbs[j].status
        var product = vbs[j].product
        var executiveid = vbs[j].executiveid
        var executivename = vbs[j].executivename
        var idloan = vbs[j].loanid

        knex('applybank')
            .insert({
                idbank: bankid,
                amount: amount,
                idcustomer: req.body.idvalue,
                createdby: req.body.empid,
                status: status,
                product: product,
                createddate: nowdate,
                vendor: vendor,
                executiveid: executiveid,
                executivename: executivename,
                createdbyname: req.body.createdbyname,
                idloan: idloan,
            })
            // .returning('id')
            .then(function(id) {
                const ids = id.toString();
                const createddate = format.asString('yyyy-MM-dd', new Date());
                knex('status')
                    .insert({
                        addbankid: ids,
                        createddate: createddate,
                        status: status,
                        createdbyname: req.body.createdbyname,
                        createdby: req.body.empid,
                    }).then(function(re) {

                    })
            })
    }
    res.json("hi");
});
router.get('/getdocument1/:pagesize/:page/:obj', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    if (req.params.obj == 'Login Head') {
        knex.select('customer.*')
            .from('customer')
            .where({ 'customer.status': "APPROVED" })
            .orderBy('customer.idcustomer', 'desc')
            .limit(pageSize).offset(skip)
            .then(function(result) {

                knex.select()
                    .from('customer')
                    .where({ 'customer.status': "APPROVED" })
                    .orderBy('customer.idcustomer', 'desc')
                    .then(function(re) {
                        var a = re.length
                            //console.log(a);
                        res.status(200).json({
                            message: "Memberlists fetched",
                            posts: result,
                            maxPosts: re.length
                        });
                    })
            })
    } else {
        knex.select('backend_operator.*', 'employee.name as ename', 'addbank.*')
            .from('backend_operator', 'employee')
            .join('employee', 'employee.idemployee', 'backend_operator.executiveid')
            .join('addbank', 'addbank.logincreadtedby', 'employee.idemployee')
            .where({ 'backend_operator.status': "APPROVED" })
            .where({ 'addbank.logincreadtedby': req.params.obj })
            .orderBy('customer.idcustomer', 'desc')
            .limit(pageSize).offset(skip)
            .then(function(result) {

                knex.select()
                    .from('backend_operator', 'employee')
                    .join('employee', 'employee.idemployee', 'backend_operator.executiveid')
                    .join('addbank', 'addbank.logincreadtedby', 'employee.idemployee')
                    .where({ 'backend_operator.status': "APPROVED" })
                    .where({ 'addbank.logincreadtedby': req.params.obj })
                    .orderBy('customer.idcustomer', 'desc')
                    .then(function(re) {
                        var a = re.length
                            //console.log(a);
                        res.status(200).json({
                            message: "Memberlists fetched",
                            posts: result,
                            maxPosts: re.length
                        });
                    })
            })
    }
});
router.get('/getbackendviewbanklist/:id', (req, res) => {
    // //console.log(req.params);
    var subquery = knex.select().from('status').max('status.statusid').groupBy('status.addbankid');
    knex.select('applybank.*', 'bank.bankname', 'bank.bankvendor', 'status.*', 'status.status as sstatus', 'loantype.loantype',
            'applybank.createdbyname as bcreatedbyname')
        .from('applybank')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('status', 'status.addbankid', 'applybank.idapplybank')
        .join('loantype', 'applybank.idloan', 'loantype.idloantype')
        .whereIn('status.statusid', subquery)
        .where('applybank.idcustomer', req.params.id)
        .then(function(result) {
            res.json(result);
        })
});
router.post('/editstatus', function(req, res) {
    // //console.log(req.params.obj);
    // //console.log(req.params.obj1);
    var date3 = format.asString('yyyy-MM-dd', new Date());
    knex('status')
        // .where({addbankid: req.params.obj1 })
        .insert({
            status: req.body.obj.sstatus,
            comment: req.body.obj.comment,
            createddate: date3,
            addbankid: req.body.obj.idapplybank,
            createdby: req.body.empid,
            createdbyname: req.body.empname

        }).then(function(result) {
            res.json('sent added Successfully');
        })
});
router.get('/getloginexecutivelist', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user ', 'LOGIN')
        .where('employee.status ', 'active')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});

router.post('/sentlogexe/:obj/:obj2', function(req, res) {
    // //console.log(req.params.obj);
    // //console.log(req.params.obj1);
    var date3 = format.asString('yyyy-MM-dd', new Date());
    var abc1 = req.body.loginexeid.split(",", 2);
    knex.select()
        .from('applybank')
        .where({ 'applybank.idapplybank': req.body.idapplybank })
        .update({
            loginexeid: abc1[0],
            loginexename: abc1[1],
            timing: req.body.timing,
            logincreadtedby: req.params.obj,
            logincreadtedbyname: req.params.obj2,
            logindate: date3,
            lstatus: "loginsent"
        }).then(function(result) {
            // //console.log(result); 
            res.json('sent added Successfully');
        })
});
router.get('/sentexelogedit1/:id', function(req, res) {
    knex.select()
        .from('applybank')
        .where('idapplybank', req.params.id)
        .then(function(result) {
            //console.log(result);
            res.json(result);
        })
});
router.get('/getloginlist/:pagesize/:page/:obj', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))

    if (req.params.obj == 'Login Head') {
        knex.select('customer.*', 'applybank.*', 'bank.*', 'applybank.status as astatus')
            .from('applybank')
            .join('bank', 'bank.idbank', 'applybank.idbank')
            .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
            .where({ 'applybank.lstatus': "loginsent" })
            .limit(pageSize).offset(skip)
            .then(function(result) {

                knex.select()
                    .from('applybank')
                    .join('bank', 'bank.idbank', 'applybank.idbank')
                    .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
                    .where({ 'applybank.lstatus': "loginsent" })
                    .then(function(re) {
                        var a = re.length
                            //console.log(a);
                        res.status(200).json({
                            message: "Memberlists fetched",
                            posts: result,
                            maxPosts: re.length
                        });
                    })
            })
    } else {
        knex.select('customer.*', 'applybank.*', 'bank.*', 'applybank.status as astatus')
            .from('applybank')
            .join('bank', 'bank.idbank', 'applybank.idbank')
            .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
            .where({ 'applybank.lstatus': "loginsent" })
            .where({ 'applybank.logincreadtedby': req.params.obj })
            .limit(pageSize).offset(skip)
            .then(function(result) {

                knex.select()
                    .from('applybank')
                    .join('bank', 'bank.idbank', 'applybank.idbank')
                    .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
                    .where({ 'applybank.lstatus': "loginsent" })
                    .where({ 'applybank.logincreadtedby': req.params.obj })
                    .then(function(re) {
                        var a = re.length
                            //console.log(a);
                        res.status(200).json({
                            message: "Memberlists fetched",
                            posts: result,
                            maxPosts: re.length
                        });
                    })
            })
    }
});

router.post('/addloginroutine', (req, res) => {
    const vbs = req.body.arr;
    const nowdate = format.asString('yyyy-MM-dd', new Date());
    for (var j = 0; j < vbs.length; j++) {
        // var backendid = vbs[j].loanid
        var companyname = vbs[j].companyname
        var bankid = vbs[j].bankid
        var status = vbs[j].status
        var whosecase = vbs[j].whosecase
        var handover = vbs[j].handover
        var timings = vbs[j].timings
        var pov = vbs[j].pov
        var casedetail = vbs[j].casedetail
        knex('daily_routine')
            .insert({
                bankid: bankid,
                companyname: companyname,
                whosecase: whosecase,
                employeeid: req.body.idvalue,
                status: status,
                handover: handover,
                timings: timings,
                createddate: nowdate,
                casedetail: casedetail,
                poVisit: pov
            }).then(function(result) {
                //console.log(result);
            })
    }
});
router.post('/editloginroutine/:empid', (req, res) => {
    const nowdate = format.asString('yyyy-MM-dd', new Date());
    //console.log(req.body);
    knex('daily_routine')
        .where('routineid', req.body.routineid)
        .update({
            companyname: req.body.companyname,
            bankid: req.body.bankid,
            whosecase: req.body.whosecase,
            status: req.body.status,
            employeeid: req.params.empid,
            updateddate: nowdate,
            handover: req.body.handover,
            timings: req.body.timings
        })
        .then(function(result) {
            res.json('daily_routine update Successfully');
        })
});
router.post('/checkcustomer', function(req, res) {
    //console.log(req.body);
    knex.select()
        .from('customer').where(function() {
            this.where({ aadharno: req.body.checkno })
                .orWhere({ panno: req.body.checkno })
                .orWhere({ mobile: req.body.checkno })
        })
        // .where({ aadharno: req.body.aadharno })
        // .orWhere({panno:req.body.aadharno})
        // .orWhere({mobile:req.aadharno})
        .then(function(result) {

            res.json(result);

        })
})
router.get('/logincount/:obj', (req, res) => {
    // //console.log(req.body.obj)
    if (req.params.obj == 'Login Head') {
        knex.select()
            .from('applybank')
            .where('lstatus', "loginsent")
            .then(function(result) {
                //console.log(result.length);
                res.json(result.length);
            })
    } else {
        res.json(0)
    }
});
router.get('/completlist/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select('customer.*', 'loantype.loantype')
        .from('customer')
        .join('loantype', 'loantype.idloantype', 'customer.applytype')
        // .join('employee', 'employee.idemployee', 'customer.idexecutive')

    // .where({ 'customer.status': 'reject' })
    .limit(pageSize).offset(skip)
        .then(function(result) {

            knex.select()
                .from('customer')
                .join('loantype', 'loantype.idloantype', 'customer.applytype')
                // .join('employee', 'employee.idemployee', 'customer.idexecutive')

            // .where({ 'customer.status': 'reject' })
            .then(function(re) {
                var a = re.length
                    //console.log(a);
                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re.length
                });
            })
        })
});
router.get('/getDataEnquirylist/:pagesize/:page/:sdate/:edate', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as empname', 'employee.branch')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.createddate', '>=', sdate)
        .where('enquirydata.createddate', '<=', edate)
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.createddate', '>=', sdate)
                .where('enquirydata.createddate', '<=', edate)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});

router.get('/getBackendlist/:pagesize/:page/:sdate/:edate', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    knex.select('applybank.*', 'bank.bankname', 'customer.*', 'status.*', 'customer.createdbyname as ccreatedbyname',
            'status.createddate as acreateddate', 'status.status as astatus', 'applybank.amount as aamount',
            'status.comment as scomment', 'applybank.executivename as aexecutivename', 'applybank.createdbyname as acreatedbyname', 'status.createdbyname as screatedbyname')
        .from('applybank', 'customer', 'status')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('status', 'status.addbankid', 'applybank.idapplybank')
        .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
        .where(function() {
            this.where({
                'status.status': 'LOGIN',
            }).orWhere({
                'status.status': 'LOGIN HOLD',
            }).orWhere({
                'status.status': 'usWORK IN PROGRESSername',
            }).orWhere({
                'status.status': 'PD',
            }).orWhere({
                'status.status': 'PD PENDING',
            }).orWhere({
                'status.status': 'POST PD PENDING',
            }).orWhere({
                'status.status': 'APPROVED',
            }).orWhere({
                'status.status': 'REJECT',
            }).orWhere({
                'status.status': 'DISBURSED',
            })
        })
        .where('status.createddate', '>=', sdate)
        .where('status.createddate', '<=', edate)
        .orderBy('status.statusid', 'desc')

    .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('applybank', 'customer', 'status')
                .join('bank', 'bank.idbank', 'applybank.idbank')
                .join('status', 'status.addbankid', 'applybank.idapplybank')
                .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
                .where(function() {
                    this.where({
                        'status.status': 'LOGIN',
                    }).orWhere({
                        'status.status': 'LOGIN HOLD',
                    }).orWhere({
                        'status.status': 'usWORK IN PROGRESSername',
                    }).orWhere({
                        'status.status': 'PD',
                    }).orWhere({
                        'status.status': 'PD PENDING',
                    }).orWhere({
                        'status.status': 'POST PD PENDING',
                    }).orWhere({
                        'status.status': 'APPROVED',
                    }).orWhere({
                        'status.status': 'REJECT',
                    }).orWhere({
                        'status.status': 'DISBURSED',
                    })
                })
                .where('status.createddate', '>=', sdate)
                .where('status.createddate', '<=', edate)
                .orderBy('status.statusid', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getLoginreportlist/:pagesize/:page/:sdate/:edate', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    //console.log(sdate);
    //console.log(edate);
    knex.select('customer.*', 'applybank.*', 'bank.*',
            'applybank.status as astatus', 'applybank.executivename as aexecutivename')
        .from('applybank', 'customer')
        // .join('employee', 'employee.idemployee', 'backend_operator.executiveid')
        .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
        // .join('employee', 'employee.idemployee', 'applybank.loginexeid')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .where({ 'applybank.lstatus': 'loginsent' })
        .where('applybank.logindate', '>=', sdate)
        .where('applybank.logindate', '<=', edate)
        .orderBy('applybank.idapplybank', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('applybank', 'customer')
                // .join('employee', 'employee.idemployee', 'backend_operator.executiveid')
                // .join('employee', 'employee.idemployee', 'applybank.loginexeid')
                .join('bank', 'bank.idbank', 'applybank.idbank')
                .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
                .where({ 'applybank.lstatus': 'loginsent' })
                .where('applybank.logindate', '>=', sdate)
                .where('applybank.logindate', '<=', edate)
                .orderBy('applybank.idapplybank', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getLoginroutinelist/:pagesize/:page/:sdate/:edate', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    knex.select('daily_routine.*', 'bank.bankname', 'bank.bankvendor', 'employee.*', 'employee.name as empname', 'usertype.*', 'daily_routine.createddate as dcreateddate', 'daily_routine.status as dstatus')
        .from('daily_routine', 'employee')
        .join('bank', 'bank.idbank', 'daily_routine.bankid')
        .join('employee', 'employee.idemployee', 'daily_routine.employeeid')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user', 'LOGIN')
        .where('daily_routine.createddate', '>=', sdate)
        .where('daily_routine.createddate', '<=', edate)
        .orderBy('daily_routine.routineid', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('daily_routine', 'employee')
                .join('bank', 'bank.idbank', 'daily_routine.bankid')
                .join('employee', 'employee.idemployee', 'daily_routine.employeeid')
                .join('usertype', 'usertype.idusertype', 'employee.iduser')
                .where('usertype.user', 'LOGIN')
                .where('daily_routine.createddate', '>=', sdate)
                .where('daily_routine.createddate', '<=', edate)
                .orderBy('daily_routine.routineid', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getExecutiveroutinelist/:pagesize/:page/:sdate/:edate', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    knex.select('daily_routine.*', 'bank.bankname', 'employee.*', 'employee.name as empname', 'usertype.*', 'daily_routine.createddate as dcreateddate', 'daily_routine.status as dstatus')
        .from('daily_routine', 'employee')
        .join('bank', 'bank.idbank', 'daily_routine.bankid')
        .join('employee', 'employee.idemployee', 'daily_routine.employeeid')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user', 'EXECUTIVE')
        .where('daily_routine.createddate', '>=', sdate)
        .where('daily_routine.createddate', '<=', edate)
        .orderBy('daily_routine.routineid', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('daily_routine', 'employee')
                .join('bank', 'bank.idbank', 'daily_routine.bankid')
                .join('employee', 'employee.idemployee', 'daily_routine.employeeid')
                .join('usertype', 'usertype.idusertype', 'employee.iduser')
                .where('usertype.user', 'EXECUTIVE')
                .where('daily_routine.createddate', '>=', sdate)
                .where('daily_routine.createddate', '<=', edate)
                .orderBy('daily_routine.routineid', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getDataentryReportlist/:pagesize/:page/:sdate/:edate', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    var subquery = knex.select().from('status').max('status.statusid').groupBy('status.addbankid');
    knex.select('customer.*', 'bank.bankname', 'bank.bankvendor', 'applybank.*', 'status.createddate as screateddate',
            'status.status as bstatus', 'status.*', 'applybank.executivename as aexecutivename',
            'applybank.amount as bamount', 'applybank.reject_reason as brejectreason',
            'customer.name as custname')
        .from('customer')
        .join('applybank', 'applybank.idcustomer', 'customer.idcustomer')
        .join('status', 'status.addbankid', 'applybank.idapplybank')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .whereIn('status.statusid', subquery)
        .where('customer.editdate', '>=', sdate)
        .where('customer.editdate', '<=', edate)
        .orderBy('customer.idcustomer', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('customer')
                .join('applybank', 'applybank.idcustomer', 'customer.idcustomer')
                .join('status', 'status.addbankid', 'applybank.idapplybank')
                .join('bank', 'bank.idbank', 'applybank.idbank')
                .whereIn('status.statusid', subquery)
                .where('customer.editdate', '>=', sdate)
                .where('customer.editdate', '<=', edate)
                .orderBy('customer.idcustomer', 'desc')

            .then(function(re) {
                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re.length
                });
            })
        })
});
router.get('/geEnquiryDatalist/:pagesize/:page/:sdate/:exeid', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename', 'employee.branch')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.createddate', sdate)
        .where('executiveid', req.params.exeid)
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.createddate', sdate)
                .where('executiveid', req.params.exeid)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/casedoccount', (req, res) => {
    knex.select()
        .from('customer')
        .where('customer.status', "APPROVED")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/caselogin', (req, res) => {
    knex.select()
        .from('status')
        .where('status.status', "LOGIN")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/casepd', (req, res) => {
    knex.select()
        .from('status')
        .where('status.status', "PD")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/caseapproval', (req, res) => {
    knex.select()
        .from('status')
        .where('status.status', "APPROVED")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/casereject', (req, res) => {
    knex.select()
        .from('status')
        .where('status.status', "REJECT")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/casedisburse', (req, res) => {
    knex.select()
        .from('status')
        .where('status.status', "DISBURSED")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/casewip', (req, res) => {
    knex.select()
        .from('status')
        .where('status.status', "WORK IN PROGRESS")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/getdocument2/:pagesize/:page/:sdate/:obj', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    if (req.params.obj == 'Login Head') {
        knex.select()
            .from('customer')
            .where('customer.applieddate', sdate)
            .where({ 'customer.status': "APPROVED" })
            .limit(pageSize).offset(skip)
            .then(function(result) {

                knex.select()
                    .from('customer')
                    .where('customer.applieddate', sdate)
                    .where({ 'customer.status': "APPROVED" })
                    .then(function(re) {
                        var a = re.length
                            //console.log(a);
                        res.status(200).json({
                            message: "Memberlists fetched",
                            posts: result,
                            maxPosts: re.length
                        });
                    })
            })
    } else {
        knex.select()
            .from('customer')
            .where('customer.applieddate', sdate)
            .where({ 'customer.status': "APPROVED" })
            .where({ 'addbank.logincreadtedby': req.params.obj })
            .limit(pageSize).offset(skip)
            .then(function(result) {

                knex.select()
                    .from('customer')
                    .where('customer.applieddate', sdate)
                    .where({ 'customer.status': "APPROVED" })
                    .where({ 'addbank.logincreadtedby': req.params.obj })
                    .then(function(re) {
                        var a = re.length
                            //console.log(a);
                        res.status(200).json({
                            message: "Memberlists fetched",
                            posts: result,
                            maxPosts: re.length
                        });
                    })
            })
    }
});
router.get('/getloginlist1/:pagesize/:page/:sdate/:obj', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    if (req.params.obj == 'Login Head') {
        knex.select('customer.*', 'applybank.*', 'bank.*', 'applybank.status as astatus')
            .from('applybank')
            .join('bank', 'bank.idbank', 'applybank.idbank')
            .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
            .where({ 'applybank.lstatus': "loginsent" })
            .where('applybank.logindate', sdate)
            .orderBy('applybank.idapplybank', 'desc')
            .limit(pageSize).offset(skip)
            .then(function(result) {

                knex.select()
                    .from('addbank')
                    .from('applybank')
                    .join('bank', 'bank.idbank', 'applybank.idbank')
                    .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
                    .where({ 'applybank.lstatus': "loginsent" })
                    .where('applybank.logindate', sdate)
                    .orderBy('applybank.idapplybank', 'desc')
                    .then(function(re) {
                        var a = re.length
                            //console.log(a);
                        res.status(200).json({
                            message: "Memberlists fetched",
                            posts: result,
                            maxPosts: re.length
                        });
                    })
            })
    } else {
        knex.select('customer.*', 'applybank.*', 'bank.*', 'applybank.status as astatus')
            .from('applybank')
            .join('bank', 'bank.idbank', 'applybank.idbank')
            .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
            .where({ 'applybank.lstatus': "loginsent" })
            .where('applybank.logindate', sdate)
            .where({ 'addbank.logincreadtedby': req.params.obj })
            .limit(pageSize).offset(skip)
            .then(function(result) {

                knex.select()
                    .from('applybank')
                    .join('bank', 'bank.idbank', 'applybank.idbank')
                    .join('customer', 'applybank.idcustomer', 'customer.idcustomer')
                    .where({ 'applybank.lstatus': "loginsent" })
                    .where('applybank.logindate', sdate)
                    .where({ 'addbank.logincreadtedby': req.params.obj })
                    .then(function(re) {
                        var a = re.length
                            //console.log(a);
                        res.status(200).json({
                            message: "Memberlists fetched",
                            posts: result,
                            maxPosts: re.length
                        });
                    })
            })
    }
});
router.post('/checkcase', function(req, res) {
    //console.log(req.body);
    knex.select()
        .from('customer').where(function() {
            this.where({ aadharno: req.body.checkno })
                .orWhere({ panno: req.body.checkno })
                .orWhere({ mobile: req.body.checkno })
                .orWhere({ cname: req.body.checkno })
        })
        .then(function(result) {

            res.json(result);

        })
});
router.get('/getdocument4/:pagesize/:page/:sdate', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));

    knex.select('customer.*', 'employee.name as ename')
        .from('customer', 'employee')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')
        .where('customer.applieddate', sdate)
        .orderBy('customer.idcustomer', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {

            knex.select()
                .from('customer', 'employee')
                .join('employee', 'employee.idemployee', 'customer.idexecutive')
                .where('customer.applieddate', sdate)
                .orderBy('customer.idcustomer', 'desc')
                .then(function(re) {
                    var a = re.length
                        //console.log(a);
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getdocument5/:pagesize/:page/:sdate', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    knex.select('customer.*', 'employee.name as ename')
        .from('customer', 'employee')
        .join('employee', 'employee.idemployee', 'customer.idexecutive')

    .where({ 'customer.status': "APPROVED" })
        .where('customer.applieddate', sdate)
        .orderBy('customer.idcustomer', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {

            knex.select()
                .from('customer', 'employee')
                .join('employee', 'employee.idemployee', 'customer.idexecutive')
                .where({ 'customer.status': "APPROVED" })
                .where('customer.applieddate', sdate)
                .orderBy('customer.idcustomer', 'desc')
                .then(function(re) {
                    var a = re.length
                        //console.log(a);
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getviewbanklistt/:id', (req, res) => {
    // //console.log(req.params);
    // knex.select('applybank.*', 'bank.bankname', 'loantype.loantype')
    //     .from('applybank')
    //     .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
    //     .join('bank', 'bank.idbank', 'applybank.idbank')
    //     .join('loantype', 'loantype.idloantype', 'applybank.idloan')
    //     .where('applybank.idcustomer', req.params.id)
    //     .where('applybank.status', 'APPROVED')
    var subquery = knex.select().from('status').max('status.statusid').groupBy('status.addbankid');
    knex.select('applybank.*', 'bank.bankname', 'bank.bankvendor', 'status.*', 'status.status as sstatus', 'status.createddate as screateddate', 'loantype.loantype')
        .from('applybank')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('status', 'status.addbankid', 'applybank.idapplybank')
        .join('loantype', 'applybank.idloan', 'loantype.idloantype')
        .whereIn('status.statusid', subquery)
        .where('applybank.idapplybank', req.params.id)

    .then(function(result) {
        res.json(result);
    })

})

router.get('/getcocustomer/:id', function(req, res) {
    knex.select()
        .from('co-customer')

    .where('idcustomer', req.params.id)
        .then(function(result) {
            ////console.log(result); 
            res.json(result);
        })
})
router.post('/editcocust', (req, res, next) => {
    //console.log(req.body);
    knex('co-customer')
        .where({ cocustomerid: req.body.cocustomerid })
        .update({
            coappname: req.body.coappname,
            coappresaddress: req.body.coappresaddress,
            coappperaddress: req.body.coappperaddress,
            idcustomer: req.body.idcustomer
        }).then(function(result) {
            res.json('co-customer updated Successfully');
        })
});
router.get('/getadminexecutivelist', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user ', 'EXECUTIVE')
        .where('employee.designation', 'Admin')
        .where('employee.status ', 'active')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.get('/getteamhead', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.teamHead ', 'true')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.get('/getEnquirylistexe1/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);

    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.adminid', req.params.id)
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.adminid', req.params.id)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/teleeditData/:id', function(req, res) {
    knex.select('enquirydata.*', 'employee.idemployee as executive', 'enquirydata.createddate as enqdate', 'loantype.idloantype as applytype')
        .from('enquirydata')
        .join('employee', 'employee.idemployee', 'enquirydata.adminid')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        // .join('previousbankdetails','previousbankdetails.idcustomer','customer.idcustomer')
        .where('enquirydata.idenquiry', req.params.id)
        .then(function(result) {
            //console.log(result);
            res.json(result);
        })
});
router.get('/getDataEnquirylist1/:pagesize/:page/:sdate/:edate/:eid', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.adminid', req.params.eid)
        .where('enquirydata.createddate', '>=', sdate)
        .where('enquirydata.createddate', '<=', edate)
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.createddate', '>=', sdate)
                .where('enquirydata.createddate', '<=', edate)
                .where('enquirydata.adminid', req.params.eid)
                .orderBy('enquirydata.idenquiry', 'desc')

            .then(function(re) {
                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re.length
                });
            })
        })
});
router.post('/assignexe', function(req, res) {
    // //console.log(req.params.obj);
    // //console.log(req.params.obj1);
    var abc = req.body.value.executive.split(",", 2);
    var empname = abc[1];
    var date1 = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var localTime = moment.utc(date1).toDate();
    knex('enquirydata')
        .where('idenquiry', req.body.value.idenquiry)
        .update({
            assignedTime: localTime,
            executiveid: abc[0],
            executivename: empname,
            adminexeStatus: 'assigned',
            executiveStatus: 'new'
        })
        .then(function(result) {
            res.json('Employee Added Successfully');
            const output = `<html style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">

            <head>
                <meta charset="UTF-8">
                <meta content="width=device-width, initial-scale=1" name="viewport">
                <!--[if (mso 16)]>
                <style type="text/css">
                a {text-decoration: none;}
                </style>
                <![endif]-->
                <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
                <style type="text/css">
                    @media only screen and (max-width:600px) {
                        p,
                        ul li,
                        ol li,
                        a {
                            font-size: 12px!important;
                            line-height: 150%!important
                        }
                        h1 {
                            font-size: 30px!important;
                            text-align: center;
                            line-height: 120%!important
                        }
                        h2 {
                            font-size: 26px!important;
                            text-align: center;
                            line-height: 120%!important
                        }
                        h3 {
                            font-size: 20px!important;
                            text-align: center;
                            line-height: 120%!important
                        }
                        .es-menu td a {
                            font-size: 10px!important
                        }
                        .es-header-body p,
                        .es-header-body ul li,
                        .es-header-body ol li,
                        .es-header-body a {
                            font-size: 10px!important
                        }
                        .es-footer-body p,
                        .es-footer-body ul li,
                        .es-footer-body ol li,
                        .es-footer-body a {
                            font-size: 12px!important
                        }
                        .es-infoblock p,
                        .es-infoblock ul li,
                        .es-infoblock ol li,
                        .es-infoblock a {
                            font-size: 12px!important
                        }
                        *[class="gmail-fix"] {
                            display: none!important
                        }
                        .es-m-txt-c {
                            text-align: center!important
                        }
                        .es-m-txt-r {
                            text-align: right!important
                        }
                        .es-m-txt-l {
                            text-align: left!important
                        }
                        .es-m-txt-r img,
                        .es-m-txt-c img,
                        .es-m-txt-l img {
                            display: inline!important
                        }
                        .es-button-border {
                            display: block!important
                        }
                        a.es-button {
                            font-size: 20px!important;
                            display: block!important;
                            border-left-width: 0px!important;
                            border-right-width: 0px!important
                        }
                        .es-btn-fw {
                            border-width: 10px 0px!important;
                            text-align: center!important
                        }
                        .es-adaptive table,
                        .es-btn-fw,
                        .es-btn-fw-brdr,
                        .es-left,
                        .es-right {
                            width: 100%!important
                        }
                        .es-content table,
                        .es-header table,
                        .es-footer table,
                        .es-content,
                        .es-footer,
                        .es-header {
                            width: 100%!important;
                            max-width: 600px!important
                        }
                        .es-adapt-td {
                            display: block!important;
                            width: 100%!important
                        }
                        .adapt-img {
                            width: 100%!important;
                            height: auto!important
                        }
                        .es-m-p0 {
                            padding: 0px!important
                        }
                        .es-m-p0r {
                            padding-right: 0px!important
                        }
                        .es-m-p0l {
                            padding-left: 0px!important
                        }
                        .es-m-p0t {
                            padding-top: 0px!important
                        }
                        .es-m-p0b {
                            padding-bottom: 0!important
                        }
                        .es-m-p20b {
                            padding-bottom: 20px!important
                        }
                        .es-mobile-hidden,
                        .es-hidden {
                            display: none!important
                        }
                        .es-desk-hidden {
                            display: table-row!important;
                            width: auto!important;
                            overflow: visible!important;
                            float: none!important;
                            max-height: inherit!important;
                            line-height: inherit!important
                        }
                        .es-desk-menu-hidden {
                            display: table-cell!important
                        }
                        table.es-table-not-adapt,
                        .esd-block-html table {
                            width: auto!important
                        }
                        table.es-social td {
                            display: inline-block!important
                        }
                        table.es-social {
                            display: inline-block!important
                        }
                    }
                    
                    #outlook a {
                        padding: 0;
                    }
                    
                    .ExternalClass {
                        width: 100%;
                    }
                    
                    .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                        line-height: 100%;
                    }
                    
                    .es-button {
                        mso-style-priority: 100!important;
                        text-decoration: none!important;
                    }
                    
                    a[x-apple-data-detectors] {
                        color: inherit!important;
                        text-decoration: none!important;
                        font-size: inherit!important;
                        font-family: inherit!important;
                        font-weight: inherit!important;
                        line-height: inherit!important;
                    }
                    
                    .es-desk-hidden {
                        display: none;
                        float: left;
                        overflow: hidden;
                        width: 0;
                        max-height: 0;
                        line-height: 0;
                        mso-hide: all;
                    }
                </style>
            </head>
            
            <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
                <div class="es-wrapper-color" style="background-color:#CCCCCC;">
                    <!--[if gte mso 9]>
                        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                            <v:fill type="tile" color="#cccccc"></v:fill>
                        </v:background>
                    <![endif]-->
                    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;">
                        <tbody>
                            <tr style="border-collapse:collapse;">
                                <td valign="top" style="padding:0;Margin:0;">
                                    <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                        <tbody>
                                            <tr style="border-collapse:collapse;">
                                                <td class="es-adaptive" align="center" style="padding:0;Margin:0;">
                                                    <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;" width="720" cellspacing="0" cellpadding="0" bgcolor="#efefef" align="center">
                                                        <tbody>
                                                            <tr style="border-collapse:collapse;">
                                                                <td align="left" style="padding:0;Margin:0;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tbody>
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td width="720" align="center" valign="top" style="padding:0;Margin:0;">
                                                                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tbody>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td align="left" style="padding:0;Margin:0;">
                                                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;"><br></p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                                        <tbody>
                                            <tr style="border-collapse:collapse;">
                                                <td align="center" style="padding:0;Margin:0;">
                                                    <table class="es-header-body" width="720" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;">
                                                        <tbody>
                                                            <tr style="border-collapse:collapse;">
                                                                <td align="left" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px;">
                                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tbody>
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td width="700" valign="top" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tbody>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td align="center" style="padding:0;Margin:0;">
                                                                                                    <a href="https://mindfin.co.in" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:14px;text-decoration:underline;color:#CCCCCC;"><img src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" alt="Smart home logo" title="Smart home logo" width="109" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr style="border-collapse:collapse;">
                                                                <td style="padding:0;Margin:0;padding-left:5px;padding-right:5px;background-color:#0B5394;" bgcolor="#4a7eb0" align="left">
                                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tbody>
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td width="710" valign="top" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tbody>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td style="padding:0;Margin:0;">
                                                                                                    <table class="es-menu" width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                                        <tbody>
                                                                                                            <tr class="images" style="border-collapse:collapse;">
                                                                                                                <td style="Margin:0;padding-left:5px;padding-right:5px;padding-top:0px;padding-bottom:7px;border:0;" width="100%" bgcolor="transparent" align="center"><img src="" alt="" title="" height="0" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></td>
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                        <tbody>
                                            <tr style="border-collapse:collapse;">
                                                <td align="center" style="padding:0;Margin:0;">
                                                    <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;" width="720" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                        <tbody>
                                                            <tr style="border-collapse:collapse;">
                                                                <td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px;">
                                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tbody>
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td width="640" valign="top" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tbody>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td align="left" style="padding:0;Margin:0;">
                                                                                                    <h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#4A7EB0;">Case Assigned&nbsp;</h1>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:20px;">
                                                                                                    <table width="5%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                                        <tbody>
                                                                                                            <tr style="border-collapse:collapse;">
                                                                                                                <td style="padding:0;Margin:0px;border-bottom:2px solid #999999;background:rgba(0, 0, 0, 0) none repeat scroll 0% 0%;height:1px;width:100%;margin:0px;"></td>
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td align="left" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;"><span style="font-size:16px;line-height:24px;">Hi Manu,</span></p>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td align="left" style="padding:0;Margin:0;">
                                                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;">I hereby would like to inform you that the <strong>case:</strong><span style="color:#008000;"><u><strong>` + req.body.value.name + `</strong></u></span> is assigned to<span style="color:#008000;"><u><strong>&nbsp;` + empname + `</strong></u></span>&nbsp;
                                                                                                        Enquiry list given by <span style="color:#008000;"><u><strong>` + req.body.value.ename + `</strong></u></span> turnover is <span style="color:#008000;"><u><strong>` + req.body.value.turnover + `</strong></u></span> and own House <span style="color:#008000;"><u><strong>` + req.body.value.ownHouse + `</strong></u></span>. </p>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td align="left" style="padding:0;Margin:0;">
                                                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;"><br></p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
            
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                                        <tbody>
                                            <tr style="border-collapse:collapse;">
                                                <td align="center" style="padding:0;Margin:0;">
                                                    <table class="es-footer-body" width="720" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;">
                                                        <tbody>
                                                            <tr style="border-collapse:collapse;">
                                                                <td align="left" bgcolor="#ffffff" style="padding:20px;Margin:0;background-color:#FFFFFF;">
                                                                    <!--[if mso]><table width="680" cellpadding="0" cellspacing="0"><tr><td width="242"><![endif]-->
                                                                    <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">
                                                                        <tbody>
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td class="es-m-p0r es-m-p20b" width="222" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tbody>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td esdev-links-color="#333333" align="left" class="es-m-txt-с es-m-txt-l" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#0066FF;"><strong>Thanks And Regards</strong></p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                                <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td>
                                                                            </tr>
            
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td class="es-m-p0r es-m-p20b" width="222" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tbody>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td class="es-m-txt-l" esdev-links-color="#333333" align="left" style="padding:0;Margin:0;">
                                                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:13px;color:#333333;"><strong>&nbsp;Mindfin Admin</strong><br>+91 9513040055<br><br>No. 10, 1st Floor,<br>Krishna Block, 1st Main <br>Road,Seshadripuram,<br>Bangalore- 560020<br><br></p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                                <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td>
                                                                            </tr>
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td class="es-m-p0r es-m-p20b" width="222" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tbody>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td class="es-m-p0l" align="left" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                                                    <a href="https://mindfin.co.in" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:13px;text-decoration:underline;color:#333333;"><img src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" alt="" width="103" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                                <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <!--[if mso]></td><td width="209"><![endif]-->
                                                                    <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">
                                                                        <tbody>
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td class="es-m-p0r es-m-p20b" width="209" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tbody>
                                                                                            <tr class="es-mobile-hidden" style="border-collapse:collapse;">
                                                                                                <td align="left" style="padding:0;Margin:0;">
                                                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#333333;"><br><br></p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <!--[if mso]></td><td width="20"></td><td width="209"><![endif]-->
                                                                    <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;">
                                                                        <tbody>
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td class="es-m-p0r es-m-p20b" width="209" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tbody>
                                                                                            <tr class="es-mobile-hidden" style="border-collapse:collapse;">
                                                                                                <td align="left" style="padding:0;Margin:0;">
                                                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#333333;"><br></p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                                </td>
                                                            </tr>
                                                            <tr style="border-collapse:collapse;">
                                                                <td align="left" style="padding:0;Margin:0;padding-bottom:15px;padding-left:20px;padding-right:20px;">
                                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tbody>
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td width="680" valign="top" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tbody>
                                                                                            <tr style="border-collapse:collapse;">
                                                                                                <td esdev-links-color="#333333" align="left" style="padding:0;Margin:0;">
                                                                                                    <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#333333;"></p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            
            
            </body>
            
            </html>`;

            let transporter = nodemailer.createTransport({
                host: req.body.emails[0].hostmail,
                port: 587,
                transportMethod: 'SMTP',
                // secure: false, // true for 465, false for other ports
                auth: {
                    user: req.body.emails[0].emailuser, // gmail id
                    pass: req.body.emails[0].emailpassword // gmail password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            // setup email data with unicode symbols
            let mailOptions = {
                from: req.body.emails[0].fromemail1,
                to: req.body.emails[0].bcc, // list of receivers
                cc: req.body.emails[0].fromemail2,
                // bcc: req.body.emails[0].bcc,
                subject: req.body.value.name + " Assigned ", //"Project Payment Update From", // Subject line
                text: 'Hello world?', // plain text body
                html: output // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return //console.log(error);
                }
                //console.log('Message sent: %s', info.messageId);
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // res.render('contact', { msg: 'Email has been sent' });
            });



        })

});
router.get('/getContactformlist/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    //console.log(req.params.id);

    knex.select()
        .from('website')
        .where('website.formtype', 'Contactform')
        .orderBy('website.webid', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('website')
                .where('website.formtype', 'Contactform')
                .orderBy('website.webid', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});

router.get('/getcareerformlist/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    //console.log(req.params.id);

    knex.select()
        .from('website')
        .where('website.formtype', 'Careerform')
        .orderBy('website.webid', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('website')
                .where('website.formtype', 'Careerform')
                .orderBy('website.webid', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getCallbackformlist/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    //console.log(req.params.id);

    knex.select()
        .from('website')
        .where('website.formtype', 'Callbackform')
        .orderBy('website.webid', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('website')
                .where('website.formtype', 'Callbackform')
                .orderBy('website.webid', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});

router.post('/image-upload', upload.any(), (req, res) => {
    //console.log(req.files)

    // res.json(req.files.filename)
    return res.json({ 'imageUrl': req.files });
});
router.post('/addemployee', (req, res) => {
    //console.log(req.body);

    const nowdate = format.asString('yyyy-MM-dd', new Date());
    const nowdate1 = format.asString('yyyy-MM-dd', new Date(req.body.value.dob));
    const nowdate2 = format.asString('yyyy-MM-dd', new Date(req.body.value.joiningdate));
    var cimage;
    var pimage;
    var aimage;

    if (req.body.cimg == undefined) {
        cimage = 'admin.png';
    } else {
        cimage = req.body.cimg[0].filename;
        //console.log("filename  " + cimage);
    }
    if (req.body.pimg == undefined) {
        pimage = 'admin.png';
    } else {
        pimage = req.body.pimg[0].filename;
        //console.log(pimage);
    }
    if (req.body.aimg == undefined) {
        aimage = 'admin.png';
    } else {
        aimage = req.body.aimg[0].filename;
        //console.log(aimage);
    }
    knex('employee')
        .insert({
            name: req.body.value.name,
            mobile: req.body.value.mobile,
            email: req.body.value.email,
            dob: nowdate1,
            ifsc: req.body.value.ifsc,
            altmobile: req.body.value.altmobile,
            address: req.body.value.address,
            qualification: req.body.value.qualification,
            accno: req.body.value.accno,
            branch: req.body.value.branch,
            pincode: req.body.value.pincode,
            iduser: req.body.value.idusertype,
            gender: req.body.value.gender,
            cimage: cimage,
            pimage: pimage,
            aimage: aimage,
            status: 'active',
            password: req.body.password.encryptedString,
            orgpassword: req.body.password.password,
            joiningdate: nowdate2,
            createddate: nowdate,
            designation: req.body.value.designation,
            createdby: req.body.createdby

        })
        .then(function(result) {
            res.json('Employee Added Successfully');
            const output = `<html style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">

            <head>
                <style type="text/css">
                    @media only screen and (max-width:600px) {
                        p,
                        ul li,
                        ol li,
                        a {
                            font-size: 11px!important;
                            line-height: 100%!important
                        }
                        h1 {
                            font-size: 20px!important;
                            text-align: center;
                            line-height: 120%!important
                        }
                        h2 {
                            font-size: 16px!important;
                            text-align: left;
                            line-height: 120%!important
                        }
                        h3 {
                            font-size: 20px!important;
                            text-align: center;
                            line-height: 120%!important
                        }
                        h1 a {
                            font-size: 20px!important
                        }
                        h2 a {
                            font-size: 16px!important;
                            text-align: left
                        }
                        h3 a {
                            font-size: 20px!important
                        }
                        .es-menu td a {
                            font-size: 14px!important
                        }
                        .es-header-body p,
                        .es-header-body ul li,
                        .es-header-body ol li,
                        .es-header-body a {
                            font-size: 9px!important
                        }
                        .es-footer-body p,
                        .es-footer-body ul li,
                        .es-footer-body ol li,
                        .es-footer-body a {
                            font-size: 12px!important
                        }
                        .es-infoblock p,
                        .es-infoblock ul li,
                        .es-infoblock ol li,
                        .es-infoblock a {
                            font-size: 12px!important
                        }
                        *[class="gmail-fix"] {
                            display: none!important
                        }
                        .es-m-txt-c,
                        .es-m-txt-c h1,
                        .es-m-txt-c h2,
                        .es-m-txt-c h3 {
                            text-align: center!important
                        }
                        .es-m-txt-r,
                        .es-m-txt-r h1,
                        .es-m-txt-r h2,
                        .es-m-txt-r h3 {
                            text-align: right!important
                        }
                        .es-m-txt-l,
                        .es-m-txt-l h1,
                        .es-m-txt-l h2,
                        .es-m-txt-l h3 {
                            text-align: left!important
                        }
                        .es-m-txt-r img,
                        .es-m-txt-c img,
                        .es-m-txt-l img {
                            display: inline!important
                        }
                        .es-button-border {
                            display: block!important
                        }
                        a.es-button {
                            font-size: 14px!important;
                            display: block!important;
                            border-left-width: 0px!important;
                            border-right-width: 0px!important
                        }
                        .es-btn-fw {
                            border-width: 10px 0px!important;
                            text-align: center!important
                        }
                        .es-adaptive table,
                        .es-btn-fw,
                        .es-btn-fw-brdr,
                        .es-left,
                        .es-right {
                            width: 100%!important
                        }
                        .es-content table,
                        .es-header table,
                        .es-footer table,
                        .es-content,
                        .es-footer,
                        .es-header {
                            width: 100%!important;
                            max-width: 600px!important
                        }
                        .es-adapt-td {
                            display: block!important;
                            width: 100%!important
                        }
                        .adapt-img {
                            width: 100%!important;
                            height: auto!important
                        }
                        .es-m-p0 {
                            padding: 0px!important
                        }
                        .es-m-p0r {
                            padding-right: 0px!important
                        }
                        .es-m-p0l {
                            padding-left: 0px!important
                        }
                        .es-m-p0t {
                            padding-top: 0px!important
                        }
                        .es-m-p0b {
                            padding-bottom: 0!important
                        }
                        .es-m-p20b {
                            padding-bottom: 20px!important
                        }
                        .es-mobile-hidden,
                        .es-hidden {
                            display: none!important
                        }
                        .es-desk-hidden {
                            display: table-row!important;
                            width: auto!important;
                            overflow: visible!important;
                            float: none!important;
                            max-height: inherit!important;
                            line-height: inherit!important
                        }
                        .es-desk-menu-hidden {
                            display: table-cell!important
                        }
                        table.es-table-not-adapt,
                        .esd-block-html table {
                            width: auto!important
                        }
                        table.es-social {
                            display: inline-block!important
                        }
                        table.es-social td {
                            display: inline-block!important
                        }
                    }
                    
                    #outlook a {
                        padding: 0;
                    }
                    
                    .ExternalClass {
                        width: 100%;
                    }
                    
                    .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                        line-height: 100%;
                    }
                    
                    .es-button {
                        mso-style-priority: 100!important;
                        text-decoration: none!important;
                    }
                    
                    a[x-apple-data-detectors] {
                        color: inherit!important;
                        text-decoration: none!important;
                        font-size: inherit!important;
                        font-family: inherit!important;
                        font-weight: inherit!important;
                        line-height: inherit!important;
                    }
                    
                    .es-desk-hidden {
                        display: none;
                        float: left;
                        overflow: hidden;
                        width: 0;
                        max-height: 0;
                        line-height: 0;
                        mso-hide: all;
                    }
                    
                    .es-button-border:hover a.es-button {
                        background: #e5e5e5!important;
                        border-color: #e5e5e5!important;
                    }
                </style>
            </head>
            
            <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
                <div class="es-wrapper-color" style="background-color:#FAFAFA;">
                    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;">
                        <tr style="border-collapse:collapse;">
                            <td valign="top" style="padding:0;Margin:0;">
                                <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                    <tr style="border-collapse:collapse;">
                                        <td class="es-adaptive" align="center" style="padding:0;Margin:0;">
                                            <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="660" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tr style="border-collapse:collapse;">
                                                    <td align="left" style="padding:10px;Margin:0;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td width="640" valign="top" align="center" style="padding:0;Margin:0;">
                                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" class="es-infoblock" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:14px;color:#CCCCCC;"><br></p>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                                    <tr style="border-collapse:collapse;">
                                        <td class="es-adaptive" align="center" style="padding:0;Margin:0;">
                                            <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;" width="660" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tr style="border-collapse:collapse;">
                                                    <td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-color:#FFFFFF;background-position:left top;" bgcolor="#ffffff" align="left">
                                                        <table cellspacing="0" cellpadding="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td width="620" align="left" style="padding:0;Margin:0;">
                                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" style="padding:0;Margin:0;">
                                                                                <a target="_blank" href="https://mindfin.co.in" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:14px;text-decoration:none;color:#1376C8;"><img class="adapt-img" src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"
                                                                                        width="100"></a>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                    <tr style="border-collapse:collapse;">
                                        <td style="padding:0;Margin:0;background-color:#FAFAFA;" bgcolor="#fafafa" align="center">
                                            <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;" width="660" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tr style="border-collapse:collapse;">
                                                    <td style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;background-color:transparent;background-position:left top;" bgcolor="transparent" align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td width="620" valign="top" align="center" style="padding:0;Margin:0;">
                                                                    <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top;" width="100%" cellspacing="0" cellpadding="0">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;"><img src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/login.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"
                                                                                    width="175"></td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;">
                                                                                <h1 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#333333;"><strong>YOUR </strong></h1>
                                                                                <h1 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#333333;"><strong>&nbsp;PASSWORD?</strong></h1>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" style="padding:0;Margin:0;padding-left:40px;padding-right:40px;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#666666;">HI,&nbsp;` + req.body.value.name + `</p>
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#666666;"><br></p>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" style="padding:0;Margin:0;padding-right:35px;padding-left:40px;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#666666;">Please note your CRM credentials!!! .</p>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" style="padding:0;Margin:0;padding-right:35px;padding-left:40px;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#666666;"><br></p>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" bgcolor="#6fa8dc" style="padding:0;Margin:0;padding-top:25px;padding-left:40px;padding-right:40px;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#FFFFFF;"><strong>User Id</strong>: (&nbsp;<u><strong>` + req.body.value.email + `</strong></u>&nbsp;) <br></p>
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#FFFFFF;">or<br></p>
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#FFFFFF;">
                                                                                    ( <u><strong>` + req.body.value.mobile + `</strong></u> ),<br><br></p>
                                                                                    
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#FFFFFF;"><strong>Password </strong>: (&nbsp;<u><strong> ` + req.body.password.password + ` )</strong></u></p>
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#FFFFFF;"><br></p>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" style="padding:0;Margin:0;padding-top:25px;padding-left:40px;padding-right:40px;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#666666;">Login To Start Your Process.....</p>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td class="es-m-txt-c" align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:40px;padding-bottom:40px;"><span class="es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#FFFFFF;border-width:1px;display:inline-block;border-radius:10px;width:auto;"><a href="` + req.body.emails[0].mloginlink + `" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:14px;color:#3D5CA3;border-style:solid;border-color:#FFFFFF;border-width:15px 20px 15px 20px;display:inline-block;background:#FFFFFF;border-radius:10px;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center;border-left-width:20px;border-right-width:20px;">Login </a></span></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr style="border-collapse:collapse;">
                                                    <td align="left" style="padding:0;Margin:0;">
                                                        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td width="660" align="center" valign="top" style="padding:0;Margin:0;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="left" style="padding:0;Margin:0;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#060403;"><strong>  Thanks And Regards</strong></p>
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#060403;"><br></p>
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#060403;">  Mindfin Admin</p>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr style="border-collapse:collapse;">
                                                    <td align="left" style="padding:0;Margin:0;">
                                                        <!--[if mso]><table width="660" cellpadding="0" cellspacing="0"><tr><td width="320" valign="top"><![endif]-->
                                                        <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td width="320" class="es-m-p20b" align="left" style="padding:0;Margin:0;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="left" style="padding:0;Margin:0;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:19px;color:#666666;"><br></p>
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:19px;color:#666666;">  No. 10, 1st Floor,</p>
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:19px;color:#666666;">  Krishna Block, 1st Main</p>
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:19px;color:#666666;">  Road, Seshadripuram,</p>
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:19px;color:#666666;">  Bangalore- 560020</p>
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:19px;color:#666666;"><br></p>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <!--[if mso]></td><td width="20"></td><td width="320" valign="top"><![endif]-->
                                                        <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td width="320" align="left" style="padding:0;Margin:0;">
                                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="left" style="padding:0;Margin:0;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#666666;"><br></p>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                    </td>
                                                </tr>
                                                <tr style="border-collapse:collapse;">
                                                    <td style="padding:0;Margin:0;padding-left:10px;padding-right:10px;padding-top:20px;background-position:center center;" align="left">
                                                        <!--[if mso]><table width="640" cellpadding="0" cellspacing="0"><tr><td width="229" valign="top"><![endif]-->
                                                        <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td width="229" align="left" style="padding:0;Margin:0;">
                                                                    <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:center center;" width="100%" cellspacing="0" cellpadding="0">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td class="es-m-txt-c" align="right" style="padding:0;Margin:0;padding-top:15px;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:16px;color:#666666;"><strong>Follow us:</strong></p>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <!--[if mso]></td><td width="20"></td><td width="391" valign="top"><![endif]-->
                                                        <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td width="391" align="left" style="padding:0;Margin:0;">
                                                                    <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:center center;" width="100%" cellspacing="0" cellpadding="0">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;padding-bottom:5px;padding-top:10px;">
                                                                                <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px;">
                                                                                            <a target="_blank" href="https://www.facebook.com/mindfinser/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:16px;text-decoration:none;color:#0B5394;"><img src="https://etgtyc.stripocdn.email/content/assets/img/social-icons/rounded-gray/facebook-rounded-gray.png" alt="Fb" title="Facebook" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a>
                                                                                        </td>
                                                                                        <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px;">
                                                                                            <a target="_blank" href="https://twitter.com/mindfinser" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:16px;text-decoration:none;color:#0B5394;"><img src="https://etgtyc.stripocdn.email/content/assets/img/social-icons/rounded-gray/twitter-rounded-gray.png" alt="Tw" title="Twitter" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a>
                                                                                        </td>
                                                                                        <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px;">
                                                                                            <a target="_blank" href="https://www.instagram.com/mindfinser/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:16px;text-decoration:none;color:#0B5394;"><img src="https://etgtyc.stripocdn.email/content/assets/img/social-icons/rounded-gray/instagram-rounded-gray.png" alt="Ig" title="Instagram" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a>
                                                                                        </td>
                                                                                        <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px;">
                                                                                            <a target="_blank" href="https://www.youtube.com/channel/UCakZtPkEsR88sllkJqqs6Mw" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:16px;text-decoration:none;color:#0B5394;"><img src="https://etgtyc.stripocdn.email/content/assets/img/social-icons/rounded-gray/youtube-rounded-gray.png" alt="Yt" title="Youtube" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a>
                                                                                        </td>
                                                                                        <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px;">
                                                                                            <a target="_blank" href="https://www.linkedin.com/company/mindfin/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:16px;text-decoration:none;color:#0B5394;"><img src="https://etgtyc.stripocdn.email/content/assets/img/social-icons/rounded-gray/linkedin-rounded-gray.png" alt="In" title="Linkedin" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                    </td>
                                                </tr>
                                                <tr style="border-collapse:collapse;">
                                                    <td style="Margin:0;padding-top:5px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-position:left top;" align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td width="620" valign="top" align="center" style="padding:0;Margin:0;">
                                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" style="padding:0;Margin:0;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:14px;color:#666666;">Contact us: +91 9513040055 | hr@mindfin.co.in</p>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                    <tr style="border-collapse:collapse;">
                                        <td style="padding:0;Margin:0;background-color:#FAFAFA;" bgcolor="#fafafa" align="center">
                                            <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="660" cellspacing="0" cellpadding="0" bgcolor="transparent" align="center">
                                                <tr style="border-collapse:collapse;">
                                                    <td style="padding:0;Margin:0;padding-top:15px;background-position:left top;" align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td width="660" valign="top" align="center" style="padding:0;Margin:0;">
                                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" style="padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px;">
                                                                                <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td style="padding:0;Margin:0px;border-bottom:1px solid #FAFAFA;background:none;height:1px;width:100%;margin:0px;"></td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                                    <tr style="border-collapse:collapse;">
                                        <td style="padding:0;Margin:0;background-color:#FAFAFA;" bgcolor="#fafafa" align="center">
                                            <table class="es-footer-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="660" cellspacing="0" cellpadding="0" bgcolor="transparent" align="center">
                                                <tr style="border-collapse:collapse;">
                                                    <td align="left" style="Margin:0;padding-bottom:5px;padding-top:15px;padding-left:20px;padding-right:20px;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td width="620" valign="top" align="center" style="padding:0;Margin:0;">
                                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" style="padding:0;Margin:0;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:12px;color:#666666;">This login password&nbsp; was sent&nbsp;from <a href="` + req.body.emails[0].mloginlink + `" target="_blank">bank.mindfin.co.in </a></p>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
            
            </html>`;

            let transporter = nodemailer.createTransport({
                host: req.body.emails[0].hostmail,
                port: 587,
                transportMethod: 'SMTP',
                // secure: false, // true for 465, false for other ports
                auth: {
                    user: req.body.emails[0].emailuser, // gmail id
                    pass: req.body.emails[0].emailpassword // gmail password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            // setup email data with unicode symbols
            let mailOptions = {
                from: req.body.emails[0].fromemail1,
                to: req.body.value.email, // list of receivers
                cc: req.body.emails[0].cc,
                bcc: req.body.emails[0].bcc,
                subject: req.body.value.name + req.body.emails[0].bsubject, //"Project Payment Update From", // Subject line
                text: 'Hello world?', // plain text body
                html: output // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return //console.log(error);
                }
                //console.log('Message sent: %s', info.messageId);
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // res.render('contact', { msg: 'Email has been sent' });
            });



        })

});
router.post('/suggbox', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    knex('suggestionbox')
        .insert({
            appliedDate: date,
            suggestion: req.body.value.reason,
            empID: req.body.empid,
            empName: req.body.empname,
            status: 'Pending'
        })
        .then(function(result) {
            res.json('Suggestion sent Successfully');
            const output = `<html style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">

            <head>
            
                <!--[if (mso 16)]>
                <style type="text/css">
                a {text-decoration: none;}
                </style>
                <![endif]-->
                <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
                <!--[if !mso]> -->
                <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
                <!--<![endif]-->
                <style type="text/css">
                    @media only screen and (max-width:600px) {
                        p,
                        ul li,
                        ol li,
                        a {
                            font-size: 11px!important;
                            line-height: 150%!important
                        }
                        h1 {
                            font-size: 14px!important;
                            text-align: center;
                            line-height: 120%!important
                        }
                        h2 {
                            font-size: 14px!important;
                            text-align: center;
                            line-height: 120%!important
                        }
                        h3 {
                            font-size: 13px!important;
                            text-align: center;
                            line-height: 120%!important
                        }
                        h1 a {
                            font-size: 14px!important
                        }
                        h2 a {
                            font-size: 14px!important
                        }
                        h3 a {
                            font-size: 13px!important
                        }
                        .es-menu td a {
                            font-size: 11px!important
                        }
                        .es-header-body p,
                        .es-header-body ul li,
                        .es-header-body ol li,
                        .es-header-body a {
                            font-size: 10px!important
                        }
                        .es-footer-body p,
                        .es-footer-body ul li,
                        .es-footer-body ol li,
                        .es-footer-body a {
                            font-size: 11px!important
                        }
                        .es-infoblock p,
                        .es-infoblock ul li,
                        .es-infoblock ol li,
                        .es-infoblock a {
                            font-size: 10px!important
                        }
                        *[class="gmail-fix"] {
                            display: none!important
                        }
                        .es-m-txt-c,
                        .es-m-txt-c h1,
                        .es-m-txt-c h2,
                        .es-m-txt-c h3 {
                            text-align: center!important
                        }
                        .es-m-txt-r,
                        .es-m-txt-r h1,
                        .es-m-txt-r h2,
                        .es-m-txt-r h3 {
                            text-align: right!important
                        }
                        .es-m-txt-l,
                        .es-m-txt-l h1,
                        .es-m-txt-l h2,
                        .es-m-txt-l h3 {
                            text-align: left!important
                        }
                        .es-m-txt-r img,
                        .es-m-txt-c img,
                        .es-m-txt-l img {
                            display: inline!important
                        }
                        .es-button-border {
                            display: block!important
                        }
                        a.es-button {
                            font-size: 14px!important;
                            display: block!important;
                            border-left-width: 0px!important;
                            border-right-width: 0px!important;
                            border-top-width: 0px!important;
                            border-bottom-width: 0px!important
                        }
                        .es-btn-fw {
                            border-width: 10px 0px!important;
                            text-align: center!important
                        }
                        .es-adaptive table,
                        .es-btn-fw,
                        .es-btn-fw-brdr,
                        .es-left,
                        .es-right {
                            width: 100%!important
                        }
                        .es-content table,
                        .es-header table,
                        .es-footer table,
                        .es-content,
                        .es-footer,
                        .es-header {
                            width: 100%!important;
                            max-width: 600px!important
                        }
                        .es-adapt-td {
                            display: block!important;
                            width: 100%!important
                        }
                        .adapt-img {
                            width: 100%!important;
                            height: auto!important
                        }
                        .es-m-p0 {
                            padding: 0px!important
                        }
                        .es-m-p0r {
                            padding-right: 0px!important
                        }
                        .es-m-p0l {
                            padding-left: 0px!important
                        }
                        .es-m-p0t {
                            padding-top: 0px!important
                        }
                        .es-m-p0b {
                            padding-bottom: 0!important
                        }
                        .es-m-p20b {
                            padding-bottom: 20px!important
                        }
                        .es-mobile-hidden,
                        .es-hidden {
                            display: none!important
                        }
                        .es-desk-hidden {
                            display: table-row!important;
                            width: auto!important;
                            overflow: visible!important;
                            float: none!important;
                            max-height: inherit!important;
                            line-height: inherit!important
                        }
                        .es-desk-menu-hidden {
                            display: table-cell!important
                        }
                        table.es-table-not-adapt,
                        .esd-block-html table {
                            width: auto!important
                        }
                        table.es-social {
                            display: inline-block!important
                        }
                        table.es-social td {
                            display: inline-block!important
                        }
                    }
                    
                    #outlook a {
                        padding: 0;
                    }
                    
                    .ExternalClass {
                        width: 100%;
                    }
                    
                    .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                        line-height: 100%;
                    }
                    
                    .es-button {
                        mso-style-priority: 100!important;
                        text-decoration: none!important;
                    }
                    
                    a[x-apple-data-detectors] {
                        color: inherit!important;
                        text-decoration: none!important;
                        font-size: inherit!important;
                        font-family: inherit!important;
                        font-weight: inherit!important;
                        line-height: inherit!important;
                    }
                    
                    .es-desk-hidden {
                        display: none;
                        float: left;
                        overflow: hidden;
                        width: 0;
                        max-height: 0;
                        line-height: 0;
                        mso-hide: all;
                    }
                </style>
            </head>
            
            <body style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
                <div class="es-wrapper-color" style="background-color:#EFEFEF;">
                    <!--[if gte mso 9]>
                        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                            <v:fill type="tile" color="#efefef"></v:fill>
                        </v:background>
                    <![endif]-->
                    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;">
                        <tr style="border-collapse:collapse;">
                            <td valign="top" style="padding:0;Margin:0;">
                                <table class="es-content es-visible-simple-html-only" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                    <tr style="border-collapse:collapse;">
                                        <td align="center" style="padding:0;Margin:0;background-image:url(https://fwolvc.stripocdn.email/content/guids/CABINET_b973b22d987cd123ef00929992e4a0fc/images/92761567150995235.png);background-position:center top;background-repeat:no-repeat;" background="https://fwolvc.stripocdn.email/content/guids/CABINET_b973b22d987cd123ef00929992e4a0fc/images/92761567150995235.png">
                                            <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="transparent" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;">
                                                <tr style="border-collapse:collapse;">
                                                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td class="es-m-p20b" width="560" valign="top" align="center" style="padding:0;Margin:0;">
                                                                    <table width="100%" cellspacing="0" cellpadding="0" bgcolor="transparent" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" role="presentation">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" height="35" style="padding:0;Margin:0;"></td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" height="35" style="padding:0;Margin:0;"></td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td class="es-m-txt-l" bgcolor="transparent" align="left" style="padding:0;Margin:0;padding-bottom:5px;padding-left:20px;">
                                                                                <h3 style="Margin:0;line-height:18px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;font-style:normal;font-weight:bold;color:#333333;"><br><br>Hi Team,</h3>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td bgcolor="transparent" align="center" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:15px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:23px;color:#333333;">New Suggestions / concern / complaints by <span style="color:#008000;"><u><b>` + req.body.empname + `</b></u></span><br><span style="color:#000080;"><b> ` + req.body.value.reason + `</b></span></p>
                                                                            </td>
                                                                        </tr>
            
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td bgcolor="transparent" align="left" style="padding:0;Margin:0;padding-bottom:5px;padding-left:10px;padding-right:10px;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:11px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:11px;color:#333333;"><br style="font-family:'times new roman', times, baskerville, georgia, serif;"><br><span style="color:#000080;"><strong>Thanks And Regards</strong></span><br><br><strong>Mindfin Admin</strong><br>+91
                                                                                    9513040055
                                                                                    <br><br>No. 10, 1st Floor,<br>Krishna Block, 1st Main<br>Road,Seshadripuram,<br>Bangalore- 560020</p>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td class="es-m-txt-l" align="left" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                                <a target="_blank" href="https://mindfin.co.in" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:11px;text-decoration:underline;color:#333333;"><img src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="137"></a>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" height="103" style="padding:0;Margin:0;"></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
            
            </html>`;

            let transporter = nodemailer.createTransport({
                host: req.body.emails[0].hostmail,
                port: 587,
                transportMethod: 'SMTP',
                // secure: false, // true for 465, false for other ports
                auth: {
                    user: req.body.emails[0].emailuser, // gmail id
                    pass: req.body.emails[0].emailpassword // gmail password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            // setup email data with unicode symbols
            let mailOptions = {
                from: req.body.emails[0].fromemail1,
                to: req.body.emails[0].bcc + ',' + req.body.emails[0].cc, // list of receivers
                cc: req.body.emails[0].boss,
                // bcc: req.body.emails[0].fromemail2,
                subject: req.body.empname + ' Applied  Suggestion or concern or complaint ', //"Project Payment Update From", // Subject line
                text: 'Hello world?', // plain text body
                html: output // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return //console.log(error);
                }
                //console.log('Message sent: %s', info.messageId);
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // res.render('contact', { msg: 'Email has been sent' });
            });



        })
});
router.post('/leaveapp', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    var from = format.asString('yyyy-MM-dd', new Date(req.body.value.from[0]));
    var to = format.asString('yyyy-MM-dd', new Date(req.body.value.from[1]));
    var NOD;
    var date1 = new Date(req.body.value.from[0]);
    var date2 = new Date(req.body.value.from[1]);
    var Difference_In_Time = date1.getTime() - date2.getTime();

    if (req.body.value.half == undefined) {
        NOD = (1 - (Difference_In_Time / (1000 * 3600 * 24)));
    } else {
        NOD = (0.5 - (Difference_In_Time / (1000 * 3600 * 24)));
    }
    //console.log(NOD)
    knex('leaveapplication')
        .insert({
            appliedDate: date,
            reason: req.body.value.reason,
            leaveFrom: from,
            leaveTo: to,
            noDays: NOD,
            empID: req.body.empid,
            empName: req.body.empname,
            status: 'Pending'
        })
        .then(function(result) {
            res.json('leave application sent Successfully');
            const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
            
            <head>
                <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <meta content="width=device-width" name="viewport" />
                <!--[if !mso]><!-->
                <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" />
                <!--<![endif]-->
                <style type="text/css">
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    
                    table,
                    td,
                    tr {
                        vertical-align: top;
                        border-collapse: collapse;
                    }
                    
                    * {
                        line-height: inherit;
                    }
                    
                    a[x-apple-data-detectors=true] {
                        color: inherit !important;
                        text-decoration: none !important;
                    }
                </style>
                <style id="media-query" type="text/css">
                    @media (max-width: 640px) {
                        .block-grid,
                        .col {
                            min-width: 320px !important;
                            max-width: 100% !important;
                            display: block !important;
                        }
                        .block-grid {
                            width: 100% !important;
                        }
                        .col {
                            width: 100% !important;
                        }
                        .col>div {
                            margin: 0 auto;
                        }
                        img.fullwidth,
                        img.fullwidthOnMobile {
                            max-width: 100% !important;
                        }
                        .no-stack .col {
                            min-width: 0 !important;
                            display: table-cell !important;
                        }
                        .no-stack.two-up .col {
                            width: 50% !important;
                        }
                        .no-stack .col.num4 {
                            width: 33% !important;
                        }
                        .no-stack .col.num8 {
                            width: 66% !important;
                        }
                        .no-stack .col.num4 {
                            width: 33% !important;
                        }
                        .no-stack .col.num3 {
                            width: 25% !important;
                        }
                        .no-stack .col.num6 {
                            width: 50% !important;
                        }
                        .no-stack .col.num9 {
                            width: 75% !important;
                        }
                        .video-block {
                            max-width: none !important;
                        }
                        .mobile_hide {
                            min-height: 0px;
                            max-height: 0px;
                            max-width: 0px;
                            display: none;
                            overflow: hidden;
                            font-size: 0px;
                        }
                        .desktop_hide {
                            display: block !important;
                            max-height: none !important;
                        }
                    }
                </style>
            </head>
            
            <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
                <!--[if IE]><div class="ie-browser"><![endif]-->
                <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
                    valign="top" width="100%">
                    <tbody>
                        <tr style="vertical-align: top;" valign="top">
                            <td style="word-break: break-word; vertical-align: top;" valign="top">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="620" style="background-color:transparent;width:620px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 620px; display: table-cell; vertical-align: top; width: 620px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <div align="center" class="img-container center" style="padding-right: 0px;padding-left: 0px;">
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center" src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 248px; display: block;"
                                                                title="Image" width="248" />
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </div>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="620" style="background-color:transparent;width:620px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 620px; display: table-cell; vertical-align: top; width: 620px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                            valign="top" width="100%">
                                                            <tbody>
                                                                <tr style="vertical-align: top;" valign="top">
                                                                    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 15px; padding-left: 10px;" valign="top">
                                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #222222; width: 100%;"
                                                                            valign="top" width="100%">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top;" valign="top">
                                                                                    <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="620" style="background-color:transparent;width:620px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:10px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 620px; display: table-cell; vertical-align: top; width: 620px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 5px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:5px;padding-left:10px;">
                                                            <div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; mso-line-height-alt: 17px; margin: 0;"><strong><span style="font-size: 18px;">Hi Manu,</span></strong></p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 25px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                        <div style="color:#71777D;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:25px;padding-left:10px;">
                                                            <div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #71777D; mso-line-height-alt: 14px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 17px; margin: 0;">I would like to inform you that <u><strong>` + req.body.empname + `</strong></u> has applied leave for below mentioned dates. Kindly respond with reject/ approve accordingly </p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid mixed-two-up" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="413" style="background-color:#FFFFFF;width:413px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num8" style="display: table-cell; vertical-align: top; min-width: 320px; max-width: 408px; width: 413px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
                                                            <div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><strong><span style="color: #000000; font-size: 14px;"><a rel="noopener" style="text-decoration: none; color: #000000;" target="_blank">From</a></span></strong></p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td><td align="center" width="206" style="background-color:#FFFFFF;width:206px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num4" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 204px; width: 206px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
                                                            <div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">` + from + `</p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid mixed-two-up" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="413" style="background-color:#FFFFFF;width:413px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num8" style="display: table-cell; vertical-align: top; min-width: 320px; max-width: 408px; width: 413px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
                                                            <div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><strong>TO</strong></p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td><td align="center" width="206" style="background-color:#FFFFFF;width:206px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num4" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 204px; width: 206px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
                                                            <div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">` + to + `</p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid mixed-two-up" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="413" style="background-color:#FFFFFF;width:413px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num8" style="display: table-cell; vertical-align: top; min-width: 320px; max-width: 408px; width: 413px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
                                                            <div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><strong>Reason</strong></p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td><td align="center" width="206" style="background-color:#FFFFFF;width:206px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num4" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 204px; width: 206px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
                                                            <div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">` + req.body.value.reason + `</p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="620" style="background-color:transparent;width:620px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 620px; display: table-cell; vertical-align: top; width: 620px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                            valign="top" width="100%">
                                                            <tbody>
                                                                <tr style="vertical-align: top;" valign="top">
                                                                    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px dotted #CCCCCC; width: 100%;"
                                                                            valign="top" width="100%">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top;" valign="top">
                                                                                    <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid mixed-two-up" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="413" style="background-color:#FFFFFF;width:413px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num8" style="display: table-cell; vertical-align: top; min-width: 320px; max-width: 408px; width: 413px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 5px; padding-bottom: 5px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:5px;padding-right:20px;padding-bottom:5px;padding-left:20px;">
                                                            <div style="line-height: 1.2; font-size: 12px; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
                                                                <p style="line-height: 1.2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"><strong>No of Days</strong></p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td><td align="center" width="206" style="background-color:#FFFFFF;width:206px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num4" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 204px; width: 206px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 5px; padding-bottom: 5px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:5px;padding-right:20px;padding-bottom:5px;padding-left:20px;">
                                                            <div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">` + NOD + `</p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="620" style="background-color:transparent;width:620px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:5px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 620px; display: table-cell; vertical-align: top; width: 620px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                            valign="top" width="100%">
                                                            <tbody>
                                                                <tr style="vertical-align: top;" valign="top">
                                                                    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 15px; padding-right: 10px; padding-bottom: 15px; padding-left: 10px;" valign="top">
                                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px dotted #CCCCCC; width: 100%;"
                                                                            valign="top" width="100%">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top;" valign="top">
                                                                                    <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="620" style="background-color:transparent;width:620px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 620px; display: table-cell; vertical-align: top; width: 620px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
            
                                                        <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                            valign="top" width="100%">
                                                            <tbody>
                                                                <tr style="vertical-align: top;" valign="top">
                                                                    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 15px; padding-right: 10px; padding-bottom: 15px; padding-left: 10px;" valign="top">
                                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px dotted #CCCCCC; width: 100%;"
                                                                            valign="top" width="100%">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top;" valign="top">
                                                                                    <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="620" style="background-color:transparent;width:620px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 620px; display: table-cell; vertical-align: top; width: 620px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                        <div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                            <div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                                                                <p style="font-size: 12px; line-height: 1.2; text-align: center; word-break: break-word; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px; margin: 0;"><span style="font-size: 12px;">Copyright © 2020 Mindfin ser. All rights reserved. </span></p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--[if (IE)]></div><![endif]-->
            </body>
            
            </html>`;

            let transporter = nodemailer.createTransport({
                host: req.body.emails[0].hostmail,
                port: 587,
                transportMethod: 'SMTP',
                // secure: false, // true for 465, false for other ports
                auth: {
                    user: req.body.emails[0].emailuser, // gmail id
                    pass: req.body.emails[0].emailpassword // gmail password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            // setup email data with unicode symbols
            let mailOptions = {
                from: req.body.emails[0].fromemail1,
                to: req.body.emails[0].bcc, // list of receivers
                cc: req.body.emails[0].cc,
                // bcc: req.body.emails[0].fromemail2,
                subject: req.body.empname + ' Leave Application ', //"Project Payment Update From", // Subject line
                text: 'Hello world?', // plain text body
                html: output // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return //console.log(error);
                }
                //console.log('Message sent: %s', info.messageId);
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // res.render('contact', { msg: 'Email has been sent' });
            });



        })

});

router.post('/conves', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    var conImg;
    var categories;
    if (req.body.catimg == undefined) {
        conImg = 'admin.png';
        orgName = 'admin.png';
    } else {
        conImg = req.body.catimg[0].filename;
        orgName = req.body.catimg[0].originalname;
        //console.log("convens filename  " + conImg);
        //console.log("convens orginal name  " + orgName);
    }
    if (req.body.value.catgory == "other") {
        categories = "OTHERS (" + req.body.value.other + ")"
    } else {
        categories = req.body.value.catgory;
    }
    knex('conveniences')
        .insert({
            appliedDate: date,
            categories: categories,
            conImg: conImg,
            orgName: orgName,
            empID: req.body.empid,
            empName: req.body.empname,
            status: 'Pending',
            comment: req.body.value.comment
        })
        .then(function(result) {
            res.json('conveniences sent Successfully');
            const output = `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

            <head>
            
                <!--[if !mso]><!-->
                <!--<![endif]-->
                <style type="text/css">
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    
                    table,
                    td,
                    tr {
                        vertical-align: top;
                        border-collapse: collapse;
                    }
                    
                    * {
                        line-height: inherit;
                    }
                    
                    a[x-apple-data-detectors=true] {
                        color: inherit !important;
                        text-decoration: none !important;
                    }
                </style>
                <style id="media-query" type="text/css">
                    @media (max-width: 620px) {
                        .block-grid,
                        .col {
                            min-width: 320px !important;
                            max-width: 100% !important;
                            display: block !important;
                        }
                        .block-grid {
                            width: 100% !important;
                        }
                        .col {
                            width: 100% !important;
                        }
                        .col>div {
                            margin: 0 auto;
                        }
                        img.fullwidth,
                        img.fullwidthOnMobile {
                            max-width: 100% !important;
                        }
                        .no-stack .col {
                            min-width: 0 !important;
                            display: table-cell !important;
                        }
                        .no-stack.two-up .col {
                            width: 50% !important;
                        }
                        .no-stack .col.num4 {
                            width: 33% !important;
                        }
                        .no-stack .col.num8 {
                            width: 66% !important;
                        }
                        .no-stack .col.num4 {
                            width: 33% !important;
                        }
                        .no-stack .col.num3 {
                            width: 25% !important;
                        }
                        .no-stack .col.num6 {
                            width: 50% !important;
                        }
                        .no-stack .col.num9 {
                            width: 75% !important;
                        }
                        .video-block {
                            max-width: none !important;
                        }
                        .mobile_hide {
                            min-height: 0px;
                            max-height: 0px;
                            max-width: 0px;
                            display: none;
                            overflow: hidden;
                            font-size: 0px;
                        }
                        .desktop_hide {
                            display: block !important;
                            max-height: none !important;
                        }
                    }
                </style>
            </head>
            
            <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
                <!--[if IE]><div class="ie-browser"><![endif]-->
                <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
                    valign="top" width="100%">
                    <tbody>
                        <tr style="vertical-align: top;" valign="top">
                            <td style="word-break: break-word; vertical-align: top;" valign="top">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:20px; padding-bottom:20px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:20px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                            <a href="https://mindfin.co.in" style="outline:none" tabindex="-1" target="_blank"> <img align="center" alt="Logo" border="0" class="center fixedwidth" src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; width: 100%; max-width: 180px; display: block;"
                                                                    title="Logo" width="180" /></a>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </div>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#ffffff;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                            <div style="font-size: 14px; line-height: 1.2; color: #000000; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                                <p style="font-size: 17px; line-height: 1.2; word-break: break-word; text-align: left; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;"><strong>Hi Team,</strong></span></p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                            <div style="font-size: 14px; line-height: 1.2; color: #000000; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                                <p style="line-height: 1.2; word-break: break-word; text-align: left; mso-line-height-alt: NaNpx; margin: 0;"> </p>
                                                                <p style="line-height: 1.2; word-break: break-word; text-align: left; font-size: 14px; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;">           I would like to inform you that, <strong><span style="color: #008000;"><u>` + req.body.empname + `</u></span></strong> has applied<strong> </strong>Conveniences. Kindly respond
                                                                    with reject / approve accordingly</span>
                                                                </p>
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 17px; margin: 0;"> </p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid three-up" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #8cc0e8;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#8cc0e8;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#8cc0e8"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="200" style="background-color:#8cc0e8;width:200px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:30px; padding-bottom:15px;"><![endif]-->
                                            <div class="col num4" style="max-width: 320px; min-width: 200px; display: table-cell; vertical-align: top; width: 200px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:30px; padding-bottom:15px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                                        <div style="color:#ffffff;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                            <div style="font-size: 14px; line-height: 1.2; color: #ffffff; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; mso-line-height-alt: 17px; margin: 0;"><strong>Reason: </strong>` + categories + `</p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td><td align="center" width="200" style="background-color:#8cc0e8;width:200px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:25px; padding-bottom:15px;"><![endif]-->
                                            <div class="col num4" style="max-width: 320px; min-width: 200px; display: table-cell; vertical-align: top; width: 200px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:25px; padding-bottom:15px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                                        <div style="color:#ffffff;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.8;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                            <div style="font-size: 14px; line-height: 1.8; color: #ffffff; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 25px;">
                                                                <p style="font-size: 14px; line-height: 1.8; word-break: break-word; text-align: left; mso-line-height-alt: 25px; margin: 0;"><strong>Date: </strong>` + date + `</p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td><td align="center" width="200" style="background-color:#8cc0e8;width:200px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:25px; padding-bottom:15px;"><![endif]-->
                                            <div class="col num4" style="max-width: 320px; min-width: 200px; display: table-cell; vertical-align: top; width: 200px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:25px; padding-bottom:15px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                                        <div style="color:#ffffff;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                            <div style="font-size: 14px; line-height: 1.2; color: #ffffff; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; mso-line-height-alt: 17px; margin: 0;"><strong>Comments: </strong>` + req.body.value.comment + `</p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #9dcefe;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#9dcefe;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:#9dcefe"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:#9dcefe;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://test.mindfin.co.in" style="height:27pt; width:266.25pt; v-text-anchor:middle;" arcsize="0%" stroke="false" fillcolor="#ffde79"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#000000; font-family:Arial, sans-serif; font-size:18px"><![endif]--><a href="https://test.mindfin.co.in" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #000000; background-color: #ffde79; border-radius: 0px; -webkit-border-radius: 0px; -moz-border-radius: 0px; width: auto; width: auto; border-top: 1px solid #ffde79; border-right: 1px solid #ffde79; border-bottom: 1px solid #ffde79; border-left: 1px solid #ffde79; padding-top: 0px; padding-bottom: 0px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"
                                                                target="_blank"><span style="padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span data-mce-style="font-size: 18px; line-height: 36px;" style="font-size: 18px; line-height: 36px;"><strong>Approve or Reject</strong></span></span></span></a>
                                                            <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                        </div>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color:transparent;width:600px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                        <div style="color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                            <div style="font-size: 14px; line-height: 1.2; color: #555555; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 17px; margin: 0;"> </p>
                                                                <p style="font-size: 11px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 13px; margin: 0;"><span style="font-size: 11px;">Copyright © 2020 All Rights Reserved</span></p>
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 17px; margin: 0;"> </p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--[if (IE)]></div><![endif]-->
            </body>
            
            </html>`;

            let transporter = nodemailer.createTransport({
                host: req.body.emails[0].hostmail,
                port: 587,
                transportMethod: 'SMTP',
                // secure: false, // true for 465, false for other ports
                auth: {
                    user: req.body.emails[0].emailuser, // gmail id
                    pass: req.body.emails[0].emailpassword // gmail password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            // setup email data with unicode symbols
            let mailOptions = {
                from: req.body.emails[0].fromemail1,
                to: req.body.emails[0].accounts + ',' + req.body.emails[0].finance + ',' + req.body.emails[0].account, // list of receivers
                cc: req.body.emails[0].cc + ',' + req.body.emails[0].bcc + ',' + req.body.emails[0].boss,
                // bcc: req.body.emails[0].boss,
                subject: req.body.empname + ' Applied  new Conveniences ', //"Project Payment Update From", // Subject line
                text: 'Hello world?', // plain text body
                html: output // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return //console.log(error);
                }
                //console.log('Message sent: %s', info.messageId);
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // res.render('contact', { msg: 'Email has been sent' });
            });



        })
});
router.post('/activeemp', function(req, res) {
    var date3 = format.asString('yyyy-MM-dd', new Date());
    knex('employee')
        .where({ idemployee: req.body.idemployee })
        .update({
            status: "active",
            updateddate: moment().format(date3)
        }).then(function(result) {
            ////console.log(result); 
            res.json('Employee Deleted Successfully');
        })
});
router.get('/getinactiveemployeelist/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.status', 'inactive')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('employee')
                .join('usertype', 'usertype.idusertype', 'employee.iduser')
                .where('employee.status', 'inactive')


            .then(function(re) {
                ////console.log(re);
                ////console.log(result);

                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re.length
                });

            })
        })
});
router.get('/gettopleave/:pagesize/:page/:empid', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    knex.select()
        .from('leaveapplication')
        .where('empID', req.params.empid)
        .orderBy('laID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            res.json(result);
            // //console.log(result);
        });
});
router.get('/gettopconven/:pagesize/:page/:empid', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    knex.select()
        .from('conveniences')
        .where('empID', req.params.empid)
        .orderBy('conID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            res.json(result);
            // //console.log(result);
        });
});
router.get('/gettopsug/:pagesize/:page/:empid', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    knex.select()
        .from('suggestionbox')
        .where('empID', req.params.empid)
        .orderBy('sbID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            res.json(result);
            // //console.log(result);
        });
});
router.get('/getconven/:pagesize/:page/:empid', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('conveniences')
        .where('empID', req.params.empid)
        .orderBy('conID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('conveniences')
                .where('empID', req.params.empid)
                .orderBy('conID', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });

                })
        })
});
router.get('/getleavapp/:pagesize/:page/:empid', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('leaveapplication')
        .where('empID', req.params.empid)
        .orderBy('laID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('leaveapplication')
                .where('empID', req.params.empid)
                .orderBy('laID', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });

                })
        })
});
router.get('/getsug/:pagesize/:page/:empid', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('suggestionbox')
        .where('empID', req.params.empid)
        .orderBy('sbID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('suggestionbox')
                .where('empID', req.params.empid)
                .orderBy('sbID', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });

                })
        })
});
router.get('/getsugpending', (req, res) => {
    knex.select()
        .from('suggestionbox')
        .where('status', "Pending")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/getconvpending', (req, res) => {
    knex.select()
        .from('conveniences')
        .where('status', "Pending")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/getleaveapp', (req, res) => {
    knex.select()
        .from('leaveapplication')
        .where('status', "Pending")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/getallconven/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('conveniences')
        .orderBy('conID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('conveniences')
                .orderBy('conID', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });

                })
        })
});
router.get('/getallleavapp/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('leaveapplication')
        .orderBy('laID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('leaveapplication')
                .orderBy('laID', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });

                })
        })
});
router.get('/getallsug/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('suggestionbox')
        .orderBy('sbID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('suggestionbox')
                .orderBy('sbID', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });

                })
        })
});
router.post('/editconves', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('conveniences')
        .where({ conID: req.body.value.element.conID })
        .update({
            approvedDate: date,
            status: req.body.value.element.status,
            response: req.body.value.element.response,
            approverId: req.body.empid,
            approverName: req.body.empname,
        })
        .then(function(result) {
            res.json('Updated Successfully');
        })
});
router.post('/editleavapp', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('leaveapplication')
        .where({ laID: req.body.value.element.laID })
        .update({
            approvedDate: date,
            status: req.body.value.element.status,
            response: req.body.value.element.response,
            approverID: req.body.empid,
            approverName: req.body.empname,
        })
        .then(function(result) {
            res.json('Updated Successfully');
        })
});
router.post('/editsug', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('suggestionbox')
        .where({ sbID: req.body.value.element.sbID })
        .update({
            updateDate: date,
            status: req.body.value.element.status,
            response: req.body.value.element.response,
            acceptorID: req.body.empid,
            acceptorName: req.body.empname,
        })
        .then(function(result) {
            res.json('Updated Successfully');
        })
});

router.post('/conveopenstatus', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('conveniences')
        .where({ status: 'Pending' })
        .update({
            approvedDate: date,
            status: 'Opened',
            approverId: req.body.empid,
            approverName: req.body.empname,
        })
        .then(function(result) {
            res.json('Updated Successfully');
        })
});
router.post('/leavappeopenstatus', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('leaveapplication')
        .where({ status: 'Pending' })
        .update({
            approvedDate: date,
            status: 'Opened',
            approverID: req.body.empid,
            approverName: req.body.empname,
        })
        .then(function(result) {
            res.json('Updated Successfully');
        })
});
router.post('/sugopenstatus', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('suggestionbox')
        .where({ status: 'Pending' })
        .update({
            updateDate: date,
            status: 'Opened',
            acceptorID: req.body.empid,
            acceptorName: req.body.empname,
        })
        .then(function(result) {
            res.json('Updated Successfully');
        })
});
router.get('/getpasswords', (req, res) => {
    var password = generator.generate({
        length: 8,
        numbers: true
    });

    const encryptedString = sha1(password);

    //console.log(encryptedString)
    result = { password: password, encryptedString: encryptedString }
    res.json(result)

});
router.get('/getwhosecase', (req, res) => {
    knex.select()
        .from('whosecase')
        .then(function(result) {
            res.json(result);
        })
});
router.get('/getBackendCustomerlist/:pagesize/:page/:sdate/:edate', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    knex.select('customer.*', 'employee.iduser', 'usertype.*')
        .from('customer')
        .join('employee', 'customer.createdby', 'employee.idemployee')
        .join('usertype', 'employee.iduser', 'usertype.idusertype')

    .where('customer.applieddate', '>=', sdate)
        .where('customer.applieddate', '<=', edate)
        .where('employee.iduser', 8)
        .orderBy('customer.idcustomer', 'desc')


    .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('customer')
                .join('employee', 'customer.createdby', 'employee.idemployee')
                .join('usertype', 'employee.iduser', 'usertype.idusertype')
                .where('customer.applieddate', '>=', sdate)
                .where('customer.applieddate', '<=', edate)
                .where('employee.iduser', 8)
                .orderBy('customer.idcustomer', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getBackendBanklist/:pagesize/:page/:sdate/:edate', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    knex.select('applybank.*', 'bank.bankname', 'customer.*', 'applybank.createdbyname as acreatedbyname',
            'applybank.createddate as acreateddate', 'applybank.status as astatus', 'applybank.amount as aamount',
            'applybank.executivename as aexecutivename', 'customer.executivename as cexecutivename')
        .from('applybank', 'customer')
        .join('bank', 'bank.idbank', 'applybank.idbank')
        .join('customer', 'customer.idcustomer', 'applybank.idcustomer')

    .where('applybank.createddate', '>=', sdate)
        .where('applybank.createddate', '<=', edate)
        .orderBy('applybank.idapplybank', 'desc')

    .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('applybank', 'customer')
                .join('bank', 'bank.idbank', 'applybank.idbank')
                .join('customer', 'customer.idcustomer', 'applybank.idcustomer')
                .where('applybank.createddate', '>=', sdate)
                .where('applybank.createddate', '<=', edate)
                .orderBy('applybank.idapplybank', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getWebsiteLead/:pagesize/:page/:sdate/:edate', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    knex.select('loantype.loantype', 'customer.*')
        .from('customer')
        .join('loantype', 'customer.applytype', 'loantype.idloantype')
        .where('customer.applieddate', '>=', sdate)
        .where('customer.applieddate', '<=', edate)
        .where('customer.source', 'Website')
        .orderBy('customer.idcustomer', 'desc')

    .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('customer')
                .join('loantype', 'customer.applytype', 'loantype.idloantype')
                .where('customer.applieddate', '>=', sdate)
                .where('customer.applieddate', '<=', edate)
                .where('customer.source', 'Website')
                .orderBy('customer.idcustomer', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.post('/savecomment', function(req, res) {
    var date3 = format.asString('yyyy-MM-dd', new Date());
    knex('customer')
        .where({ idcustomer: req.body.value.idcustomer })
        .update({
            status: req.body.value.status,
            displaystatus: req.body.value.status,
            createdbyname: req.body.empname,
            createdby: req.body.empid,
            comment: req.body.value.comment,
            updateddate: moment().format(date3)
        }).then(function(result) {
            ////console.log(result); 
            res.json('updated Successfully');
        })
});
router.get('/getweblead', (req, res) => {
    knex.select()
        .from('customer')
        .where('status', "PENDING")
        .where('source', "Website")
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/webleadopenstatus', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('customer')
        .where({ status: 'PENDING' })
        .where({ source: 'Website' })
        .update({
            updateddate: date,
            status: 'Opened',
            createdby: req.body.empid,
            createdbyname: req.body.empname,
        })
        .then(function(result) {
            res.json('Updated Successfully');
        })
});
// router.post('/downloadall', function(req, res) {
//     var zip = new JSZip();
//     zip.file("https://mindfin-files.oss-ap-south-1.aliyuncs.com/" + req.body.companykyc);
//     zip.file("https://mindfin-files.oss-ap-south-1.aliyuncs.com/" + req.body.customerkyc);
//     zip.file("https://mindfin-files.oss-ap-south-1.aliyuncs.com/" + req.body.bankstatement);
//     zip.file("https://mindfin-files.oss-ap-south-1.aliyuncs.com/" + req.body.itr);
//     zip.file("https://mindfin-files.oss-ap-south-1.aliyuncs.com/" + req.body.gstandreturns);
//     zip.file("https://mindfin-files.oss-ap-south-1.aliyuncs.com/" + req.body.loanstatement);

//     zip.generateAsync({ type: 'nodebuffer', mimeType: "application/zip" })
//         .then(function(content) {
//             // see FileSaver.js
//             output = "complete Zip of" + req.body.cname + ".zip"
//                 // FileSaver.saveAs(content, output);

//         });
// });
router.post('/earlygo', function(req, res) {
    //console.log(req.body);
    var date = format.asString('yyyy-MM-dd', new Date());
    knex('earlygo')
        .insert({
            appliedDate: date,
            reason: req.body.value.reason,
            empID: req.body.empid,
            empName: req.body.empname,
            type: req.body.value.type,
            status: '1'
        })
        .then(function(result) {
            res.json('application sent Successfully');
            const output = `<html style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">

            <head>
            
                <!--[if (mso 16)]>
                <style type="text/css">
                a {text-decoration: none;}
                </style>
                <![endif]-->
                <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
                <!--[if !mso]><!-- -->
                <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
                <!--<![endif]-->
                <style type="text/css">
                    @media only screen and (max-width:600px) {
                        p,
                        ul li,
                        ol li,
                        a {
                            font-size: 11px!important;
                            line-height: 150%!important
                        }
                        h1 {
                            font-size: 14px!important;
                            text-align: center;
                            line-height: 120%!important
                        }
                        h2 {
                            font-size: 14px!important;
                            text-align: center;
                            line-height: 120%!important
                        }
                        h3 {
                            font-size: 13px!important;
                            text-align: center;
                            line-height: 120%!important
                        }
                        h1 a {
                            font-size: 14px!important
                        }
                        h2 a {
                            font-size: 14px!important
                        }
                        h3 a {
                            font-size: 13px!important
                        }
                        .es-menu td a {
                            font-size: 11px!important
                        }
                        .es-header-body p,
                        .es-header-body ul li,
                        .es-header-body ol li,
                        .es-header-body a {
                            font-size: 10px!important
                        }
                        .es-footer-body p,
                        .es-footer-body ul li,
                        .es-footer-body ol li,
                        .es-footer-body a {
                            font-size: 11px!important
                        }
                        .es-infoblock p,
                        .es-infoblock ul li,
                        .es-infoblock ol li,
                        .es-infoblock a {
                            font-size: 10px!important
                        }
                        *[class="gmail-fix"] {
                            display: none!important
                        }
                        .es-m-txt-c,
                        .es-m-txt-c h1,
                        .es-m-txt-c h2,
                        .es-m-txt-c h3 {
                            text-align: center!important
                        }
                        .es-m-txt-r,
                        .es-m-txt-r h1,
                        .es-m-txt-r h2,
                        .es-m-txt-r h3 {
                            text-align: right!important
                        }
                        .es-m-txt-l,
                        .es-m-txt-l h1,
                        .es-m-txt-l h2,
                        .es-m-txt-l h3 {
                            text-align: left!important
                        }
                        .es-m-txt-r img,
                        .es-m-txt-c img,
                        .es-m-txt-l img {
                            display: inline!important
                        }
                        .es-button-border {
                            display: block!important
                        }
                        a.es-button {
                            font-size: 14px!important;
                            display: block!important;
                            border-left-width: 0px!important;
                            border-right-width: 0px!important;
                            border-top-width: 0px!important;
                            border-bottom-width: 0px!important
                        }
                        .es-btn-fw {
                            border-width: 10px 0px!important;
                            text-align: center!important
                        }
                        .es-adaptive table,
                        .es-btn-fw,
                        .es-btn-fw-brdr,
                        .es-left,
                        .es-right {
                            width: 100%!important
                        }
                        .es-content table,
                        .es-header table,
                        .es-footer table,
                        .es-content,
                        .es-footer,
                        .es-header {
                            width: 100%!important;
                            max-width: 600px!important
                        }
                        .es-adapt-td {
                            display: block!important;
                            width: 100%!important
                        }
                        .adapt-img {
                            width: 100%!important;
                            height: auto!important
                        }
                        .es-m-p0 {
                            padding: 0px!important
                        }
                        .es-m-p0r {
                            padding-right: 0px!important
                        }
                        .es-m-p0l {
                            padding-left: 0px!important
                        }
                        .es-m-p0t {
                            padding-top: 0px!important
                        }
                        .es-m-p0b {
                            padding-bottom: 0!important
                        }
                        .es-m-p20b {
                            padding-bottom: 20px!important
                        }
                        .es-mobile-hidden,
                        .es-hidden {
                            display: none!important
                        }
                        .es-desk-hidden {
                            display: table-row!important;
                            width: auto!important;
                            overflow: visible!important;
                            float: none!important;
                            max-height: inherit!important;
                            line-height: inherit!important
                        }
                        .es-desk-menu-hidden {
                            display: table-cell!important
                        }
                        table.es-table-not-adapt,
                        .esd-block-html table {
                            width: auto!important
                        }
                        table.es-social {
                            display: inline-block!important
                        }
                        table.es-social td {
                            display: inline-block!important
                        }
                    }
                    
                    #outlook a {
                        padding: 0;
                    }
                    
                    .ExternalClass {
                        width: 100%;
                    }
                    
                    .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                        line-height: 100%;
                    }
                    
                    .es-button {
                        mso-style-priority: 100!important;
                        text-decoration: none!important;
                    }
                    
                    a[x-apple-data-detectors] {
                        color: inherit!important;
                        text-decoration: none!important;
                        font-size: inherit!important;
                        font-family: inherit!important;
                        font-weight: inherit!important;
                        line-height: inherit!important;
                    }
                    
                    .es-desk-hidden {
                        display: none;
                        float: left;
                        overflow: hidden;
                        width: 0;
                        max-height: 0;
                        line-height: 0;
                        mso-hide: all;
                    }
                </style>
            </head>
            
            <body style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
                <div class="es-wrapper-color" style="background-color:#EFEFEF;">
                    <!--[if gte mso 9]>
                        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                            <v:fill type="tile" color="#efefef"></v:fill>
                        </v:background>
                    <![endif]-->
                    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;">
                        <tr style="border-collapse:collapse;">
                            <td valign="top" style="padding:0;Margin:0;">
                                <table class="es-content es-visible-simple-html-only" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                    <tr style="border-collapse:collapse;">
                                        <td align="center" style="padding:0;Margin:0;background-image:url(https://fwolvc.stripocdn.email/content/guids/CABINET_b973b22d987cd123ef00929992e4a0fc/images/92761567150995235.png);background-position:center top;background-repeat:no-repeat;" background="https://fwolvc.stripocdn.email/content/guids/CABINET_b973b22d987cd123ef00929992e4a0fc/images/92761567150995235.png">
                                            <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="transparent" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;">
                                                <tr style="border-collapse:collapse;">
                                                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                            <tr style="border-collapse:collapse;">
                                                                <td class="es-m-p20b" width="560" valign="top" align="center" style="padding:0;Margin:0;">
                                                                    <table width="100%" cellspacing="0" cellpadding="0" bgcolor="transparent" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" role="presentation">
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" height="35" style="padding:0;Margin:0;"></td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" height="35" style="padding:0;Margin:0;"></td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td class="es-m-txt-l" bgcolor="transparent" align="left" style="padding:0;Margin:0;padding-bottom:5px;padding-left:20px;">
                                                                                <h3 style="Margin:0;line-height:18px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;font-style:normal;font-weight:bold;color:#333333;"><br><br>Hi Manu,</h3>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td bgcolor="transparent" align="center" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px;">
                                                                                <p>I would like to inform you that <span style="color:#008000;"><u><strong>` + req.body.empname + `</strong></u></span> has applied <span style="color:#008000;"><u><strong>` + req.body.value.type + `</strong></u></span> and
                                                                                    the reason is <u><strong><span style="color:#008000;">` + req.body.value.reason + `</span></strong></u></p>
                                                                            </td>
                                                                        </tr>
            
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td bgcolor="transparent" align="left" style="padding:0;Margin:0;padding-bottom:5px;padding-left:10px;padding-right:10px;">
                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:11px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:11px;color:#333333;"><br style="font-family:'times new roman', times, baskerville, georgia, serif;"><br><span style="color:#000080;"><strong>Thanks And Regards</strong></span><br><br><strong>Mindfin Admin</strong><br>+91
                                                                                    9513040055
                                                                                    <br><br>No. 10, 1st Floor,<br>Krishna Block, 1st Main<br>Road,Seshadripuram,<br>Bangalore- 560020</p>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td class="es-m-txt-l" align="left" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                                <a target="_blank" href="https://mindfin.co.in" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:11px;text-decoration:underline;color:#333333;"><img src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="137"></a>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse;">
                                                                            <td align="center" height="103" style="padding:0;Margin:0;"></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
            
            </html>`;

            let transporter = nodemailer.createTransport({
                host: req.body.emails[0].hostmail,
                port: 587,
                transportMethod: 'SMTP',
                // secure: false, // true for 465, false for other ports
                auth: {
                    user: req.body.emails[0].emailuser, // gmail id
                    pass: req.body.emails[0].emailpassword // gmail password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            // setup email data with unicode symbols
            let mailOptions = {
                from: req.body.emails[0].fromemail1,
                to: req.body.emails[0].bcc, // list of receivers
                cc: req.body.emails[0].cc,
                // bcc: req.body.emails[0].fromemail2,
                subject: req.body.empname + ' Applied ' + req.body.value.type, //"Project Payment Update From", // Subject line
                text: 'Hello world?', // plain text body
                html: output // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return //console.log(error);
                }
                //console.log('Message sent: %s', info.messageId);
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // res.render('contact', { msg: 'Email has been sent' });
            });



        })
});
router.get('/getEarlygo//:pagesize/:page/:empid', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    knex.select()
        .from('earlygo')
        .where('earlygo.empID', req.params.empid)
        .orderBy('earlygo.earlyGoID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            res.json(result);
        })
});
router.get('/getearlygocount', (req, res) => {
    knex.select()
        .from('earlygo')
        .where('status', "1")
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/earlygoopenstatus', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('earlygo')
        .where({ status: '1' })
        .update({
            updateDate: date,
            status: '0',
        })
        .then(function(result) {
            res.json('Updated Successfully');
        })
});
router.get('/getallearlygo/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('earlygo')
        .orderBy('earlyGoID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('earlygo')
                .orderBy('earlyGoID', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });

                })
        })
});
router.get('/getnewtelcount', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('adminexeStatus', "new")
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/getnewtelcount1', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('adminid', req.body.empid)
        .where('adminexeStatus', "new")
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/getnewappocount', (req, res) => {
    //console.log("empid", req.body.empid)
    knex.select()
        .from('enquirydata')
        .where('executiveStatus', "new")
        .where('executiveid', req.body.empid)
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/teldataopenstatus', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('enquirydata')
        .where({ adminexeStatus: 'new' })
        .update({
            updateddate: date,
            adminexeStatus: 'opened',
            adminid: req.body.empid,
            adminname: req.body.empname,
            // executiveStatus: 'new'
        })
        .then(function(result) {
            res.json('Updated Successfully');
        })
});
router.post('/appointmentopenstatus', function(req, res) {
    // var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('enquirydata')
        .where({ executiveStatus: 'new' })
        .where({ executiveid: req.body.empid })
        .update({
            // updateddate: date,
            executiveStatus: 'opened'
        })
        .then(function(result) {
            //console.log(result)
            res.json('Updated Successfully');
        })
});
router.post('/downloadCount', (req, res) => {
    // //console.log(req.params);
    var count = req.body.downloadCount
    var dcount = count + 1;
    knex('employee')
        .where('employee.idemployee', req.body.idemployee)
        .update({
            downloadCount: dcount
        })
        .then(function(result) {
            res.json('Employee Updated Successfully');
        })
});
router.post('/cimageUpload', (req, res) => {
    // //console.log(req.params);
    var cimage;

    if (req.body.cimgupload == undefined) {
        cimage = req.body.empid.cimage;

    } else {
        cimage = req.body.cimgupload[0].filename;
        //console.log("filename  " + cimage);
    }
    knex('employee')
        .where('employee.idemployee', req.body.empid.idemployee)
        .update({
            cimage: cimage,
            cimgUploadCount: '1'
        })
        .then(function(result) {
            res.json('Employee Updated Successfully');
        })
});
router.get('/getemployee', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('employee.status ', 'active')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.post('/individualNotification', (req, res) => {
    var notificationImg;
    const createddate = format.asString('yyyy-MM-dd', new Date());
    if (req.body.notificationImg == undefined) {
        notificationImg = req.body.value.notificationImg;
        notificationImg_org = req.body.value.notificationImg_org

    } else {
        notificationImg = req.body.notificationImg[0].filename;
        notificationImg_org = req.body.notificationImg[0].originalname;
        //console.log("filename  " + notificationImg);
    }
    knex('sendernotifications')
        .insert({
            createdDate: createddate,
            senderID: req.body.empid,
            senderName: req.body.empname,
            notificationSubject: req.body.value.notificationSubject,
            notification: req.body.value.notification,
            notificationImg: notificationImg,
            notificationImg_org: notificationImg_org,
            senderStatus: 'sent',
        })
        .then(function(id) {
            const ids = id.toString();
            knex('receivernotification')
                .insert({
                    senderNotificationID: ids,
                    receiverID: req.body.abc[0],
                    receiverName: req.body.abc[1],
                    receiverStatus: 'received',
                }).then(function(re) {
                    res.json('Notification Sent Successfully');
                })
        })
});
router.get('/getteleemp', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user ', 'TELECALLER')
        .where('employee.status ', 'active')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.get('/getbackendemp', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user ', 'BACKEND')
        .where('employee.status ', 'active')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.get('/getaccemp', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user ', 'ACCOUNTANT')
        .where('employee.status ', 'active')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.get('/getdataentrtemp', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user ', 'DATAENTRY')
        .where('employee.status ', 'active')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.post('/generalNotification', (req, res) => {
    var notificationImg;
    const createddate = format.asString('yyyy-MM-dd', new Date());
    var config = req.body.abc;
    if (req.body.notificationImg == undefined) {
        notificationImg = req.body.value.notificationImg;
        notificationImg_org = req.body.value.notificationImg_org

    } else {
        notificationImg = req.body.notificationImg[0].filename;
        notificationImg_org = req.body.notificationImg[0].originalname;
        //console.log("filename  " + notificationImg);
    }
    knex('sendernotifications')
        .insert({
            createdDate: createddate,
            senderID: req.body.empid,
            senderName: req.body.empname,
            notificationSubject: req.body.value.notificationSubject,
            notification: req.body.value.notification,
            notificationImg: notificationImg,
            notificationImg_org: notificationImg_org,
            senderStatus: 'sent',
        })
        .then(function(id) {
            const ids = id.toString();
            if (config == undefined || config == 'undefined') {
                res.json("Not Inserted");
                //console.log("empty data")
            } else {
                // const vbs1 = JSON.parse(config);
                for (var j = 0; j < config.length; j++) {
                    var empid = config[j].idemployee
                    var empname = config[j].name
                    knex('receivernotification')
                        .insert({
                            senderNotificationID: ids,
                            receiverID: empid,
                            receiverName: empname,
                            receiverStatus: 'received',
                        }).then(function(re) {

                        })
                }
            }
            res.json('Notification Sent Successfully');
        })
});
router.get('/getGroupNotification', (req, res) => {
    var subquery = knex.select().from('sendernotifications').max('sendernotifications.senderNotificationID').groupBy('sendernotifications.senderID')
    knex.select('sendernotifications.*')
        .from('sendernotifications')
        .where('sendernotifications.senderStatus ', 'sent')
        .whereIn('sendernotifications.senderNotificationID', subquery)
        .orderBy('sendernotifications.senderNotificationID', 'desc')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.get('/getEmployeeNotification/:id', (req, res) => {
    var subquery = knex.select().from('sendernotifications').max('sendernotifications.senderNotificationID').groupBy('sendernotifications.senderID')
    knex.select('sendernotifications.*', 'receivernotification.*')
        .from('sendernotifications', 'receivernotification.*')
        .join('receivernotification', 'receivernotification.senderNotificationID', 'sendernotifications.senderNotificationID')
        .where('sendernotifications.senderStatus ', 'sent')
        .where('receivernotification.receiverStatus ', 'seen')
        .where('receivernotification.receiverID', req.params.id)
        .whereIn('sendernotifications.senderNotificationID', subquery)
        .orderBy('sendernotifications.senderNotificationID', 'desc')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.post('/getnewnotification', (req, res) => {
    knex.select('sendernotifications.*', 'receivernotification.*')
        .from('sendernotifications', 'receivernotification')
        .join('receivernotification', 'receivernotification.senderNotificationID', 'sendernotifications.senderNotificationID')
        .where('sendernotifications.senderStatus ', 'sent')
        .where('receivernotification.receiverStatus ', 'received')
        .where('receivernotification.receiverID', req.body.empid)
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/opennotification', (req, res) => {
    var date = format.asString('yyyy-MM-dd', new Date());
    //console.log(req.body)
    knex('receivernotification')
        .where('receivernotification.receiverStatus ', 'received')
        .where('receivernotification.receiverID', req.body.empid)
        .update({
            openedDate: date,
            receiverStatus: "seen",
        })
        .then(function(result) {
            res.json('Updated Successfully');
        })
});
router.post('/deleteNotification', function(req, res) {
    //console.log(req.body)
    var date3 = format.asString('yyyy-MM-dd', new Date());
    knex('sendernotifications')
        .where({ senderNotificationID: req.body.id })
        .update({
            senderStatus: "inactive",
            updatedDate: moment().format(date3)
        }).then(function(result) {
            ////console.log(result); 
            res.json('Notification Deleted Successfully');
        })
});
router.get('/getSeenBy/:id', (req, res) => {
    knex.select('receivernotification.*')
        .from('receivernotification')
        .where('receivernotification.senderNotificationID ', req.params.id)
        .orderBy('receivernotification.receiverNotficationID', 'desc')
        .then(function(result) {
            res.json(result);
        })
});
router.post('/gettodolist', (req, res) => {
    knex.select()
        .from('todolist')
        .where('todolist.status ', 'open')
        .where('todolist.createdBy', req.body.empid)
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/addToDo', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    knex('todolist')
        .insert({
            createdDate: date,
            title: req.body.value.title,
            Description: req.body.value.desc,
            createdBy: req.body.empid,
            createdByName: req.body.empname,
            status: 'open'
        }).then(function(result) {
            res.json('suggestion sent Successfully')
                //console.log(result);
        })
});
router.post('/gettodo', (req, res) => {
    knex.select()
        .from('todolist')
        .where('todolist.status ', 'open')
        .where('todolist.createdBy', req.body.empid)
        .orderBy('todolist.todoID', 'desc')
        .then(function(result) {
            res.json(result);
        })
});
router.get('/closetodo/:id', function(req, res) {
    var date3 = format.asString('yyyy-MM-dd', new Date());
    knex('todolist')
        .where({ todoID: req.params.id })
        .update({
            status: "close",
            closeDate: moment().format(date3)
        }).then(function(result) {
            res.json(' To DO closed Successfully');
        })
});

router.get('/getemailSettings', (req, res) => {
    //console.log(req.params.id);
    knex.select()
        .from('settings')
        .where({ status: 'active' })
        .then(function(result) {
            //console.log(result);
            res.json(result);
        })
})
router.get('/enquirycount/:id', (req, res) => {
    //console.log(req.params.id);
    knex.select()
        .from('enquirydata')
        .where({ teleid: req.params.id })
        .then(function(result) {
            //console.log(result.length);
            res.json(result.length);
        })
})
router.post('/addEvent', (req, res) => {
    var date = format.asString('yyyy-MM-dd', new Date());
    var start = format.asString('yyyy-MM-dd', new Date(req.body.value.start));
    var end = format.asString('yyyy-MM-dd', new Date(req.body.value.end));
    knex('calendar')
        .insert({
            title: req.body.value.title,
            start: start,
            end: end,
            primary: req.body.abc[0],
            secondary: req.body.abc[1],
            draggable: "false",
            createdDate: date,
            createdBy: req.body.empid,
            createdByName: req.body.empname,
            status: 'active',
            color: req.body.abc[2]
        })
        .then(function(result) {
            //console.log(result);
            res.json('customer document Added Successfully');
        })

});
router.get('/getEvent', (req, res) => {
    knex.select()
        .from('calendar')
        .where('calendar.status ', 'active')
        // .where('todolist.createdBy', req.body.empid)
        .orderBy('calendar.eventID', 'desc')
        .then(function(result) {
            res.json(result);
            // return result;
            // console.log(result)
        })
});


router.get('/mappedgetEvent', (req, res) => {
    knex.select()
        .from('calendar')
        .where('calendar.status ', 'active')
        // .where('todolist.createdBy', req.body.empid)
        // .orderBy('calendar.eventID', 'desc')
        .then(function(result) {
            // console.log(result);

            // return result;
            res.json(result);

        })
});
router.post('/deleteEvent', function(req, res) {
    var date3 = format.asString('yyyy-MM-dd', new Date());
    knex('calendar')
        .where({ eventID: req.body.eventID })
        .update({
            status: "close",
            updatedDate: moment().format(date3)
        }).then(function(result) {
            res.json(' Event Deleted Successfully');
        })
});
router.get('/enquiryapprovecount/:id', (req, res) => {
    //console.log(req.params.id);
    knex.select()
        .from('enquirydata')
        .where({ teleid: req.params.id })
        .where({ status: 'APPROVED' })
        .then(function(result) {
            //console.log(result.length);
            res.json(result.length);
        })
})
router.get('/enquirydisbursecount/:id', (req, res) => {
    //console.log(req.params.id);
    knex.select()
        .from('enquirydata')
        .where({ teleid: req.params.id })
        .where({ status: 'DISBURSED' })
        .then(function(result) {
            //console.log(result.length);
            res.json(result.length);
        })
})
router.get('/enquiryrejectcount/:id', (req, res) => {
    //console.log(req.params.id);
    knex.select()
        .from('enquirydata')
        .where({ teleid: req.params.id })
        .where({ status: 'REJECTED' })
        .then(function(result) {
            //console.log(result.length);
            res.json(result.length);
        })
})
router.get('/getEnquiryApprovedlist/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.dob')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.teleid', req.params.id)
        .where('enquirydata.status', 'APPROVED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.teleid', req.params.id)
                .where('enquirydata.status', 'APPROVED')
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
})
router.get('/getEnquiryRejectlist/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.dob')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.teleid', req.params.id)
        .where('enquirydata.status', 'REJECTED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.teleid', req.params.id)
                .where('enquirydata.status', 'REJECTED')
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
})
router.get('/getEnquiryDisburslistDetailsDetails/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.dob')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.teleid', req.params.id)
        .where('enquirydata.status', 'DISBURSED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.teleid', req.params.id)
                .where('enquirydata.status', 'DISBURSED')
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.post('/notopenedlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('adminid', req.body.empid)
        .where('executiveStatus', "new")
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/filepickedlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('adminid', req.body.empid)
        .where('status', "FILE PICKED")
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/contactedlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('adminid', req.body.empid)
        .where('status', "CONTACTED")
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/loginlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('adminid', req.body.empid)
        .where('status', "LOGIN")
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/wiplist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('adminid', req.body.empid)
        .where('status', "WORK IN PROGRESS")
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/approvedlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('adminid', req.body.empid)
        .where('status', "APPROVED")
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/disbursedlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('adminid', req.body.empid)
        .where('status', "DISBURSED")
        .then(function(result) {
            res.json(result.length);
        })
});
router.post('/rejectlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('adminid', req.body.empid)
        .where('status', "REJECTED")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/getEnquiryApprovelistexe/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.adminid', req.params.id)
        .where('enquirydata.status', 'APPROVED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'APPROVED')
                .where('enquirydata.adminid', req.params.id)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquirycontactedlistexe/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.adminid', req.params.id)
        .where('enquirydata.status', 'CONTACTED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'CONTACTED')
                .where('enquirydata.adminid', req.params.id)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquirydisburselistexe/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.adminid', req.params.id)
        .where('enquirydata.status', 'DISBURSED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'DISBURSED')
                .where('enquirydata.adminid', req.params.id)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquiryfilepicklistexe/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.adminid', req.params.id)
        .where('enquirydata.status', 'FILE PICKED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'FILE PICKED')
                .where('enquirydata.adminid', req.params.id)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquiryloginlistexe/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.adminid', req.params.id)
        .where('enquirydata.status', 'LOGIN')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'LOGIN')
                .where('enquirydata.adminid', req.params.id)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquirynotopenlistexe/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.adminid', req.params.id)
        .where('executiveStatus', "new")
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].assignedTime);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('executiveStatus', "new")
                .where('enquirydata.adminid', req.params.id)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquiryrejectlistexe/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.adminid', req.params.id)
        .where('enquirydata.status', 'REJECTED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'REJECTED')
                .where('enquirydata.adminid', req.params.id)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquirywiplistexe/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.adminid', req.params.id)
        .where('enquirydata.status', 'WORK IN PROGRESS')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'WORK IN PROGRESS')
                .where('enquirydata.adminid', req.params.id)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.post('/notify', function(req, res) {
    // //console.log(req.params.obj);
    // //console.log(req.params.obj1);

    var date1 = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var localTime = moment.utc(date1).toDate();
    knex('enquirydata')
        .where('idenquiry', req.body.value.idenquiry)
        .update({
            remindDate: localTime,
        })
        .then(function(result) {
            res.json('Reminder Added Successfully');
            knex('sendernotifications')
                .insert({
                    createdDate: localTime,
                    senderID: req.body.value.adminid,
                    senderName: req.body.value.adminname,
                    notification: "I hereby would like to inform you that the case:" + req.body.value.name + "still in the status of" + req.body.value.status + "If failed to update the case will be removed from your enquiry list.",
                    notificationSubject: "Case Reminder",
                    notificationImg: undefined,
                    notificationImg_org: undefined,
                    senderStatus: 'sent',
                })
                .then(function(id) {
                    const ids = id.toString();
                    knex('receivernotification')
                        .insert({
                            senderNotificationID: ids,
                            receiverID: req.body.value.executiveid,
                            receiverName: req.body.value.executivename,
                            receiverStatus: 'received',
                        }).then(function(re) {
                            // res.json('Notification Sent Successfully');
                            const output = `<html style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"><head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <!--[if (mso 16)]>
            <style type="text/css">
            a {text-decoration: none;}
            </style>
            <![endif]-->
            <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
            <style type="text/css">
                @media only screen and (max-width:600px) {
                    p,
                    ul li,
                    ol li,
                    a {
                        font-size: 12px!important;
                        line-height: 150%!important
                    }
                    h1 {
                        font-size: 30px!important;
                        text-align: center;
                        line-height: 120%!important
                    }
                    h2 {
                        font-size: 26px!important;
                        text-align: center;
                        line-height: 120%!important
                    }
                    h3 {
                        font-size: 20px!important;
                        text-align: center;
                        line-height: 120%!important
                    }
                    .es-menu td a {
                        font-size: 10px!important
                    }
                    .es-header-body p,
                    .es-header-body ul li,
                    .es-header-body ol li,
                    .es-header-body a {
                        font-size: 10px!important
                    }
                    .es-footer-body p,
                    .es-footer-body ul li,
                    .es-footer-body ol li,
                    .es-footer-body a {
                        font-size: 12px!important
                    }
                    .es-infoblock p,
                    .es-infoblock ul li,
                    .es-infoblock ol li,
                    .es-infoblock a {
                        font-size: 12px!important
                    }
                    *[class="gmail-fix"] {
                        display: none!important
                    }
                    .es-m-txt-c {
                        text-align: center!important
                    }
                    .es-m-txt-r {
                        text-align: right!important
                    }
                    .es-m-txt-l {
                        text-align: left!important
                    }
                    .es-m-txt-r img,
                    .es-m-txt-c img,
                    .es-m-txt-l img {
                        display: inline!important
                    }
                    .es-button-border {
                        display: block!important
                    }
                    a.es-button {
                        font-size: 20px!important;
                        display: block!important;
                        border-left-width: 0px!important;
                        border-right-width: 0px!important
                    }
                    .es-btn-fw {
                        border-width: 10px 0px!important;
                        text-align: center!important
                    }
                    .es-adaptive table,
                    .es-btn-fw,
                    .es-btn-fw-brdr,
                    .es-left,
                    .es-right {
                        width: 100%!important
                    }
                    .es-content table,
                    .es-header table,
                    .es-footer table,
                    .es-content,
                    .es-footer,
                    .es-header {
                        width: 100%!important;
                        max-width: 600px!important
                    }
                    .es-adapt-td {
                        display: block!important;
                        width: 100%!important
                    }
                    .adapt-img {
                        width: 100%!important;
                        height: auto!important
                    }
                    .es-m-p0 {
                        padding: 0px!important
                    }
                    .es-m-p0r {
                        padding-right: 0px!important
                    }
                    .es-m-p0l {
                        padding-left: 0px!important
                    }
                    .es-m-p0t {
                        padding-top: 0px!important
                    }
                    .es-m-p0b {
                        padding-bottom: 0!important
                    }
                    .es-m-p20b {
                        padding-bottom: 20px!important
                    }
                    .es-mobile-hidden,
                    .es-hidden {
                        display: none!important
                    }
                    .es-desk-hidden {
                        display: table-row!important;
                        width: auto!important;
                        overflow: visible!important;
                        float: none!important;
                        max-height: inherit!important;
                        line-height: inherit!important
                    }
                    .es-desk-menu-hidden {
                        display: table-cell!important
                    }
                    table.es-table-not-adapt,
                    .esd-block-html table {
                        width: auto!important
                    }
                    table.es-social td {
                        display: inline-block!important
                    }
                    table.es-social {
                        display: inline-block!important
                    }
                }
                
                #outlook a {
                    padding: 0;
                }
                
                .ExternalClass {
                    width: 100%;
                }
                
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                    line-height: 100%;
                }
                
                .es-button {
                    mso-style-priority: 100!important;
                    text-decoration: none!important;
                }
                
                a[x-apple-data-detectors] {
                    color: inherit!important;
                    text-decoration: none!important;
                    font-size: inherit!important;
                    font-family: inherit!important;
                    font-weight: inherit!important;
                    line-height: inherit!important;
                }
                
                .es-desk-hidden {
                    display: none;
                    float: left;
                    overflow: hidden;
                    width: 0;
                    max-height: 0;
                    line-height: 0;
                    mso-hide: all;
                }
            </style>
        </head>
        
        <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
            <div class="es-wrapper-color" style="background-color:#CCCCCC;">
                <!--[if gte mso 9]>
                    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                        <v:fill type="tile" color="#cccccc"></v:fill>
                    </v:background>
                <![endif]-->
                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;">
                    <tbody><tr style="border-collapse:collapse;">
                        <td valign="top" style="padding:0;Margin:0;">
                            <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                <tbody><tr style="border-collapse:collapse;">
                                    <td class="es-adaptive" align="center" style="padding:0;Margin:0;">
                                        <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;" width="720" cellspacing="0" cellpadding="0" bgcolor="#efefef" align="center">
                                            <tbody><tr style="border-collapse:collapse;">
                                                <td align="left" style="padding:0;Margin:0;">
                                                    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                        <tbody><tr style="border-collapse:collapse;">
                                                            <td width="720" align="center" valign="top" style="padding:0;Margin:0;">
                                                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tbody><tr style="border-collapse:collapse;">
                                                                        <td align="left" style="padding:0;Margin:0;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;"><br></p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody></table>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </td>
                                </tr>
                            </tbody></table>
                            <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                                <tbody><tr style="border-collapse:collapse;">
                                    <td align="center" style="padding:0;Margin:0;">
                                        <table class="es-header-body" width="720" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;">
                                            <tbody><tr style="border-collapse:collapse;">
                                                <td align="left" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px;">
                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                        <tbody><tr style="border-collapse:collapse;">
                                                            <td width="700" valign="top" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tbody><tr style="border-collapse:collapse;">
                                                                        <td align="center" style="padding:0;Margin:0;">
                                                                            <a href="https://mindfin.co.in" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:14px;text-decoration:underline;color:#CCCCCC;"><img src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" alt="Smart home logo" title="Smart home logo" width="109" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" height="46"></a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody></table>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                </td>
                                            </tr>
                                            <tr style="border-collapse:collapse;">
                                                <td style="padding:0;Margin:0;padding-left:5px;padding-right:5px;background-color:#4A7EB0;" bgcolor="#4a7eb0" align="left">
                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                        <tbody><tr style="border-collapse:collapse;">
                                                            <td width="710" valign="top" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tbody><tr style="border-collapse:collapse;">
                                                                        <td style="padding:0;Margin:0;">
                                                                            <table class="es-menu" width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                <tbody><tr class="images" style="border-collapse:collapse;">
                                                                                    <td style="Margin:0;padding-left:5px;padding-right:5px;padding-top:0px;padding-bottom:7px;border:0;" width="100%" bgcolor="transparent" align="center"><img src="images/default-img.png" alt="" title="" height="0" width="0" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></td>
                                                                                </tr>
                                                                            </tbody></table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody></table>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </td>
                                </tr>
                            </tbody></table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                <tbody><tr style="border-collapse:collapse;">
                                    <td align="center" style="padding:0;Margin:0;">
                                        <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;" width="720" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                            <tbody><tr style="border-collapse:collapse;">
                                                <td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px;">
                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                        <tbody><tr style="border-collapse:collapse;">
                                                            <td width="640" valign="top" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tbody><tr style="border-collapse:collapse;">
                                                                        <td align="left" style="padding:0;Margin:0;">
                                                                            <h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#4A7EB0;">Case Reminder</h1>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:20px;">
                                                                            <table width="5%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                <tbody><tr style="border-collapse:collapse;">
                                                                                    <td style="padding:0;Margin:0px;border-bottom:2px solid #999999;background:rgba(0, 0, 0, 0) none repeat scroll 0% 0%;height:1px;width:100%;margin:0px;"></td>
                                                                                </tr>
                                                                            </tbody></table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td align="left" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;"><span style="font-size:16px;line-height:24px;">Hi Manu,</span></p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td align="left" style="padding:0;Margin:0;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;">I hereby would like to inform you that the <strong>case: </strong> <span style="color:#008000;"><u><strong>` + req.body.value.name + `</strong></u></span> has been assigned to<span style="color:#008000;"><u><strong> ` + req.body.value.executivename + `</strong></u></span>                                                                        on<span style="color:#008000;"><u><strong> ` + req.body.value.assignedTime + `</strong></u></span> and the case is still in the <span style="color:#008000;"><u><strong>` + req.body.value.status + `</strong></u></span> state. If failed to update the&nbsp;case&nbsp;will
                                                                                be removed from <span style="color:#008000;"><u><strong>` + req.body.value.executivename + `</strong></u></span> and the same will be reassign to another executive.</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td align="left" style="padding:0;Margin:0;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;"><br></p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody></table>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                </td>
                                            </tr>
        
                                        </tbody></table>
                                    </td>
                                </tr>
                            </tbody></table>
                            <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                                <tbody><tr style="border-collapse:collapse;">
                                    <td align="center" style="padding:0;Margin:0;">
                                        <table class="es-footer-body" width="720" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;">
                                            <tbody><tr style="border-collapse:collapse;">
                                                <td align="left" bgcolor="#ffffff" style="padding:20px;Margin:0;background-color:#FFFFFF;">
                                                    <!--[if mso]><table width="680" cellpadding="0" cellspacing="0"><tr><td width="242"><![endif]-->
                                                    <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">
                                                        <tbody><tr style="border-collapse:collapse;">
                                                            <td class="es-m-p0r es-m-p20b" width="222" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tbody><tr style="border-collapse:collapse;">
                                                                        <td esdev-links-color="#333333" align="left" class="es-m-txt-с es-m-txt-l" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#0066FF;"><strong>Thanks And Regards</strong></p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody></table>
                                                            </td>
                                                            <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td>
                                                        </tr>
        
                                                        <tr style="border-collapse:collapse;">
                                                            <td class="es-m-p0r es-m-p20b" width="222" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tbody><tr style="border-collapse:collapse;">
                                                                        <td class="es-m-txt-l" esdev-links-color="#333333" align="left" style="padding:0;Margin:0;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:13px;color:#333333;"><strong>&nbsp;Mindfin Admin</strong><br>+91 9513040055<br><br>No. 10, 1st Floor,<br>Krishna Block, 1st Main<br> Road,Seshadripuram,<br>Bangalore- 560020 <br><br></p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody></table>
                                                            </td>
                                                            <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td>
                                                        </tr>
                                                        <tr style="border-collapse:collapse;">
                                                            <td class="es-m-p0r es-m-p20b" width="222" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tbody><tr style="border-collapse:collapse;">
                                                                        <td class="es-m-p0l" align="left" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                            <a href="https://mindfin.co.in" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:13px;text-decoration:underline;color:#333333;"><img src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" alt="" width="103" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" height="43"></a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody></table>
                                                            </td>
                                                            <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td>
                                                        </tr>
                                                    </tbody></table>
                                                    <!--[if mso]></td><td width="209"><![endif]-->
                                                    <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">
                                                        <tbody><tr style="border-collapse:collapse;">
                                                            <td class="es-m-p0r es-m-p20b" width="209" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tbody><tr class="es-mobile-hidden" style="border-collapse:collapse;">
                                                                        <td align="left" style="padding:0;Margin:0;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#333333;"><br><br></p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody></table>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                    <!--[if mso]></td><td width="20"></td><td width="209"><![endif]-->
                                                    <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;">
                                                        <tbody><tr style="border-collapse:collapse;">
                                                            <td class="es-m-p0r es-m-p20b" width="209" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tbody><tr class="es-mobile-hidden" style="border-collapse:collapse;">
                                                                        <td align="left" style="padding:0;Margin:0;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#333333;"><br></p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody></table>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </td>
                                            </tr>
                                            <tr style="border-collapse:collapse;">
                                                <td align="left" style="padding:0;Margin:0;padding-bottom:15px;padding-left:20px;padding-right:20px;">
                                                    <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                        <tbody><tr style="border-collapse:collapse;">
                                                            <td width="680" valign="top" align="center" style="padding:0;Margin:0;">
                                                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                    <tbody><tr style="border-collapse:collapse;">
                                                                        <td esdev-links-color="#333333" align="left" style="padding:0;Margin:0;">
                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#333333;"></p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody></table>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </td>
                                </tr>
                            </tbody></table>
                        </td>
                    </tr>
                </tbody></table>
            </div>
        
        
        </body></html>`;

                            let transporter = nodemailer.createTransport({
                                host: req.body.emails[0].hostmail,
                                port: 587,
                                transportMethod: 'SMTP',
                                // secure: false, // true for 465, false for other ports
                                auth: {
                                    user: req.body.emails[0].emailuser, // gmail id
                                    pass: req.body.emails[0].emailpassword // gmail password
                                },
                                tls: {
                                    rejectUnauthorized: false
                                }
                            });
                            // setup email data with unicode symbols
                            let mailOptions = {
                                from: req.body.emails[0].fromemail1,
                                to: req.body.emails[0].bcc, // list of receivers
                                cc: req.body.emails[0].fromemail2,
                                // bcc: req.body.emails[0].bcc,
                                subject: req.body.value.name + " Reminder ", //"Project Payment Update From", // Subject line
                                text: 'Hello world?', // plain text body
                                html: output // html body
                            };
                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return //console.log(error);
                                }
                                //console.log('Message sent: %s', info.messageId);
                                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                // res.render('contact', { msg: 'Email has been sent' });
                            });
                        })
                })

        })

});
router.post('/removeCase', function(req, res) {
    // //console.log(req.params.obj);
    // //console.log(req.params.obj1);

    var date1 = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var localTime = moment.utc(date1).toDate();
    knex('enquirydata')
        .where('idenquiry', req.body.value.idenquiry)
        .update({
            updateddate: localTime,
        })
        .then(function(result) {
            res.json('Reminder Added Successfully');
            knex('sendernotifications')
                .insert({
                    createdDate: localTime,
                    senderID: req.body.value.adminid,
                    senderName: req.body.value.adminname,
                    notification: "I hereby would like to inform you that the case:" + req.body.value.name + "has been removed from your enquired List.",
                    notificationSubject: "Case Reminder",
                    notificationImg: undefined,
                    notificationImg_org: undefined,
                    senderStatus: 'sent',
                })
                .then(function(id) {
                    const ids = id.toString();
                    knex('receivernotification')
                        .insert({
                            senderNotificationID: ids,
                            receiverID: req.body.value.executiveid,
                            receiverName: req.body.value.executivename,
                            receiverStatus: 'received',
                        }).then(function(re) {
                            // res.json('Notification Sent Successfully');
                            const output = `<html style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">

                            <head>
                                <meta charset="UTF-8">
                                <meta content="width=device-width, initial-scale=1" name="viewport">
                                <!--[if (mso 16)]>
                                <style type="text/css">
                                a {text-decoration: none;}
                                </style>
                                <![endif]-->
                                <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
                                <style type="text/css">
                                    @media only screen and (max-width:600px) {
                                        p,
                                        ul li,
                                        ol li,
                                        a {
                                            font-size: 12px!important;
                                            line-height: 150%!important
                                        }
                                        h1 {
                                            font-size: 30px!important;
                                            text-align: center;
                                            line-height: 120%!important
                                        }
                                        h2 {
                                            font-size: 26px!important;
                                            text-align: center;
                                            line-height: 120%!important
                                        }
                                        h3 {
                                            font-size: 20px!important;
                                            text-align: center;
                                            line-height: 120%!important
                                        }
                                        .es-menu td a {
                                            font-size: 10px!important
                                        }
                                        .es-header-body p,
                                        .es-header-body ul li,
                                        .es-header-body ol li,
                                        .es-header-body a {
                                            font-size: 10px!important
                                        }
                                        .es-footer-body p,
                                        .es-footer-body ul li,
                                        .es-footer-body ol li,
                                        .es-footer-body a {
                                            font-size: 12px!important
                                        }
                                        .es-infoblock p,
                                        .es-infoblock ul li,
                                        .es-infoblock ol li,
                                        .es-infoblock a {
                                            font-size: 12px!important
                                        }
                                        *[class="gmail-fix"] {
                                            display: none!important
                                        }
                                        .es-m-txt-c {
                                            text-align: center!important
                                        }
                                        .es-m-txt-r {
                                            text-align: right!important
                                        }
                                        .es-m-txt-l {
                                            text-align: left!important
                                        }
                                        .es-m-txt-r img,
                                        .es-m-txt-c img,
                                        .es-m-txt-l img {
                                            display: inline!important
                                        }
                                        .es-button-border {
                                            display: block!important
                                        }
                                        a.es-button {
                                            font-size: 20px!important;
                                            display: block!important;
                                            border-left-width: 0px!important;
                                            border-right-width: 0px!important
                                        }
                                        .es-btn-fw {
                                            border-width: 10px 0px!important;
                                            text-align: center!important
                                        }
                                        .es-adaptive table,
                                        .es-btn-fw,
                                        .es-btn-fw-brdr,
                                        .es-left,
                                        .es-right {
                                            width: 100%!important
                                        }
                                        .es-content table,
                                        .es-header table,
                                        .es-footer table,
                                        .es-content,
                                        .es-footer,
                                        .es-header {
                                            width: 100%!important;
                                            max-width: 600px!important
                                        }
                                        .es-adapt-td {
                                            display: block!important;
                                            width: 100%!important
                                        }
                                        .adapt-img {
                                            width: 100%!important;
                                            height: auto!important
                                        }
                                        .es-m-p0 {
                                            padding: 0px!important
                                        }
                                        .es-m-p0r {
                                            padding-right: 0px!important
                                        }
                                        .es-m-p0l {
                                            padding-left: 0px!important
                                        }
                                        .es-m-p0t {
                                            padding-top: 0px!important
                                        }
                                        .es-m-p0b {
                                            padding-bottom: 0!important
                                        }
                                        .es-m-p20b {
                                            padding-bottom: 20px!important
                                        }
                                        .es-mobile-hidden,
                                        .es-hidden {
                                            display: none!important
                                        }
                                        .es-desk-hidden {
                                            display: table-row!important;
                                            width: auto!important;
                                            overflow: visible!important;
                                            float: none!important;
                                            max-height: inherit!important;
                                            line-height: inherit!important
                                        }
                                        .es-desk-menu-hidden {
                                            display: table-cell!important
                                        }
                                        table.es-table-not-adapt,
                                        .esd-block-html table {
                                            width: auto!important
                                        }
                                        table.es-social td {
                                            display: inline-block!important
                                        }
                                        table.es-social {
                                            display: inline-block!important
                                        }
                                    }
                                    
                                    #outlook a {
                                        padding: 0;
                                    }
                                    
                                    .ExternalClass {
                                        width: 100%;
                                    }
                                    
                                    .ExternalClass,
                                    .ExternalClass p,
                                    .ExternalClass span,
                                    .ExternalClass font,
                                    .ExternalClass td,
                                    .ExternalClass div {
                                        line-height: 100%;
                                    }
                                    
                                    .es-button {
                                        mso-style-priority: 100!important;
                                        text-decoration: none!important;
                                    }
                                    
                                    a[x-apple-data-detectors] {
                                        color: inherit!important;
                                        text-decoration: none!important;
                                        font-size: inherit!important;
                                        font-family: inherit!important;
                                        font-weight: inherit!important;
                                        line-height: inherit!important;
                                    }
                                    
                                    .es-desk-hidden {
                                        display: none;
                                        float: left;
                                        overflow: hidden;
                                        width: 0;
                                        max-height: 0;
                                        line-height: 0;
                                        mso-hide: all;
                                    }
                                </style>
                            </head>
                            
                            <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
                                <div class="es-wrapper-color" style="background-color:#CCCCCC;">
                                    <!--[if gte mso 9]>
                                        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                            <v:fill type="tile" color="#cccccc"></v:fill>
                                        </v:background>
                                    <![endif]-->
                                    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;">
                                        <tr style="border-collapse:collapse;">
                                            <td valign="top" style="padding:0;Margin:0;">
                                                <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                                    <tr style="border-collapse:collapse;">
                                                        <td class="es-adaptive" align="center" style="padding:0;Margin:0;">
                                                            <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;" width="720" cellspacing="0" cellpadding="0" bgcolor="#efefef" align="center">
                                                                <tr style="border-collapse:collapse;">
                                                                    <td align="left" style="padding:0;Margin:0;">
                                                                        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td width="720" align="center" valign="top" style="padding:0;Margin:0;">
                                                                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td align="left" style="padding:0;Margin:0;">
                                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;"><br></p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                                                    <tr style="border-collapse:collapse;">
                                                        <td align="center" style="padding:0;Margin:0;">
                                                            <table class="es-header-body" width="720" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;">
                                                                <tr style="border-collapse:collapse;">
                                                                    <td align="left" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:10px;padding-right:10px;">
                                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td width="700" valign="top" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td align="center" style="padding:0;Margin:0;">
                                                                                                <a href="https://mindfin.co.in" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:14px;text-decoration:underline;color:#CCCCCC;"><img src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" alt="Smart home logo" title="Smart home logo" width="109" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr style="border-collapse:collapse;">
                                                                    <td style="padding:0;Margin:0;padding-left:5px;padding-right:5px;background-color:#0B5394;" bgcolor="#4a7eb0" align="left">
                                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td width="710" valign="top" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td style="padding:0;Margin:0;">
                                                                                                <table class="es-menu" width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                                    <tr class="images" style="border-collapse:collapse;">
                                                                                                        <td style="Margin:0;padding-left:5px;padding-right:5px;padding-top:0px;padding-bottom:7px;border:0;" width="100%" bgcolor="transparent" align="center"><img src="" alt title height="0" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                                    <tr style="border-collapse:collapse;">
                                                        <td align="center" style="padding:0;Margin:0;">
                                                            <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;" width="720" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                                <tr style="border-collapse:collapse;">
                                                                    <td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px;">
                                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td width="640" valign="top" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td align="left" style="padding:0;Margin:0;">
                                                                                                <h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#4A7EB0;">Case Removed&nbsp;</h1>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:20px;">
                                                                                                <table width="5%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                                    <tr style="border-collapse:collapse;">
                                                                                                        <td style="padding:0;Margin:0px;border-bottom:2px solid #999999;background:rgba(0, 0, 0, 0) none repeat scroll 0% 0%;height:1px;width:100%;margin:0px;"></td>
                                                                                                    </tr>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td align="left" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;"><span style="font-size:16px;line-height:24px;">Hi Manu,</span></p>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td align="left" style="padding:0;Margin:0;">
                                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;">I hereby would like to inform you that the <strong>case:</strong><span style="color:#008000;"><u><strong>` + req.body.value.name + `</strong></u></span> is removed from<span style="color:#008000;"><u><strong>&nbsp;` + req.body.value.executivename + `</strong></u></span>&nbsp;
                                                                                                    Enquiry list as he didn't take any action on the same even after reminder on <span style="color:#008000;"><u><strong>` + req.body.value.remindDate + `</strong></u></span>.</p>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td align="left" style="padding:0;Margin:0;">
                                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#666666;"><br></p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                            
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                                                    <tr style="border-collapse:collapse;">
                                                        <td align="center" style="padding:0;Margin:0;">
                                                            <table class="es-footer-body" width="720" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;">
                                                                <tr style="border-collapse:collapse;">
                                                                    <td align="left" bgcolor="#ffffff" style="padding:20px;Margin:0;background-color:#FFFFFF;">
                                                                        <!--[if mso]><table width="680" cellpadding="0" cellspacing="0"><tr><td width="242"><![endif]-->
                                                                        <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td class="es-m-p0r es-m-p20b" width="222" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td esdev-links-color="#333333" align="left" class="es-m-txt-с es-m-txt-l" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#0066FF;"><strong>Thanks And Regards</strong></p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                                <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td>
                                                                            </tr>
                            
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td class="es-m-p0r es-m-p20b" width="222" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td class="es-m-txt-l" esdev-links-color="#333333" align="left" style="padding:0;Margin:0;">
                                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:13px;color:#333333;"><strong>&nbsp;Mindfin Admin</strong><br>+91 9513040055<br><br>No. 10, 1st Floor,<br>Krishna Block, 1st Main <br>Road,Seshadripuram,<br>Bangalore- 560020<br><br></p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                                <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td>
                                                                            </tr>
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td class="es-m-p0r es-m-p20b" width="222" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td class="es-m-p0l" align="left" style="padding:0;Margin:0;padding-bottom:10px;">
                                                                                                <a href="https://mindfin.co.in" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:13px;text-decoration:underline;color:#333333;"><img src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" alt width="103" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></a>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                                <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td>
                                                                            </tr>
                                                                        </table>
                                                                        <!--[if mso]></td><td width="209"><![endif]-->
                                                                        <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td class="es-m-p0r es-m-p20b" width="209" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tr class="es-mobile-hidden" style="border-collapse:collapse;">
                                                                                            <td align="left" style="padding:0;Margin:0;">
                                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#333333;"><br><br></p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <!--[if mso]></td><td width="20"></td><td width="209"><![endif]-->
                                                                        <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;">
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td class="es-m-p0r es-m-p20b" width="209" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tr class="es-mobile-hidden" style="border-collapse:collapse;">
                                                                                            <td align="left" style="padding:0;Margin:0;">
                                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:13px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px;color:#333333;"><br></p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                                    </td>
                                                                </tr>
                                                                <tr style="border-collapse:collapse;">
                                                                    <td align="left" style="padding:0;Margin:0;padding-bottom:15px;padding-left:20px;padding-right:20px;">
                                                                        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                            <tr style="border-collapse:collapse;">
                                                                                <td width="680" valign="top" align="center" style="padding:0;Margin:0;">
                                                                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                        <tr style="border-collapse:collapse;">
                                                                                            <td esdev-links-color="#333333" align="left" style="padding:0;Margin:0;">
                                                                                                <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:18px;color:#333333;"></p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </body>
                            
                            </html>`;

                            let transporter = nodemailer.createTransport({
                                host: req.body.emails[0].hostmail,
                                port: 587,
                                transportMethod: 'SMTP',
                                // secure: false, // true for 465, false for other ports
                                auth: {
                                    user: req.body.emails[0].emailuser, // gmail id
                                    pass: req.body.emails[0].emailpassword // gmail password
                                },
                                tls: {
                                    rejectUnauthorized: false
                                }
                            });
                            // setup email data with unicode symbols
                            let mailOptions = {
                                from: req.body.emails[0].fromemail1,
                                to: req.body.emails[0].bcc, // list of receivers
                                cc: req.body.emails[0].fromemail2,
                                // bcc: req.body.emails[0].bcc,
                                subject: req.body.value.name + " Removed From " + req.body.value.executivename, //"Project Payment Update From", // Subject line
                                text: 'Hello world?', // plain text body
                                html: output // html body
                            };
                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return //console.log(error);
                                }
                                //console.log('Message sent: %s', info.messageId);
                                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                // res.render('contact', { msg: 'Email has been sent' });
                            });
                        })
                })

        })

});
router.post('/nofallowup', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('adminid', req.body.empid)
        .where('status', "REQUIRED")
        .where('executiveStatus', "opened")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/getEnquirynofollowuplistexe/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.adminid', req.params.id)
        .where('enquirydata.status', "REQUIRED")
        .where('enquirydata.executiveStatus', "opened")
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].assignedTime);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', "REQUIRED")
                .where('enquirydata.executiveStatus', "opened")
                .where('enquirydata.adminid', req.params.id)
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.post('/getEarlyGoStatus', (req, res, next) => {
    console.log(req.body);
    var empid = req.body.empid;
    var date = format.asString('yyyy-MM-dd', new Date());
    var subquery = knex.select().from('earlygo').max('earlygo.earlyGoID').where(
        'earlygo.type',
        'Early Go');
    // console.log(subquery)
    knex.select()
        .from('earlygo')
        .whereIn('earlygo.earlyGoID', subquery)
        .where({ empID: empid })
        .then(function(result) {
            console.log(result);
            if (result[0] == '' || result[0] == undefined || result[0] == 0 || result[0] == null || result[0].appliedDate != date) {
                console.log("hi")
                res.json({ status: false, });
            } else {
                console.log("bye")
                res.json({
                    status: true,
                });
            }
        });
});
router.post('/getLateInStatus', (req, res, next) => {
    console.log(req.body);
    var empid = req.body.empid;
    var date = format.asString('yyyy-MM-dd', new Date());
    var subquery = knex.select().from('earlygo').max('earlygo.earlyGoID').where(
        'earlygo.type',
        'Late In');
    // console.log(subquery)
    knex.select()
        .from('earlygo')
        .whereIn('earlygo.earlyGoID', subquery)
        .where({ empID: empid })
        // .where({ type: 'Late In' })
        .then(function(result) {
            console.log(result);
            if (result[0] == '' || result[0] == undefined || result[0] == 0 || result[0] == null || result[0].appliedDate != date) {
                console.log("hi")
                res.json({ status: false, });
            } else {
                console.log("bye")
                res.json({
                    status: true,
                });
            }
        });
});

router.get('/casecount/:obj', (req, res) => {
    knex.select()
        .from('applybank')
        .where('executiveid', req.params.obj)
        .groupBy('idcustomer')
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/viewcustomerid/:pagesize/:page/:id', (req, res, next) => {
    //console.log(req.params);
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    var subquery = knex.select().from('applybank').max('applybank.idapplybank').groupBy('applybank.idcustomer')
    knex.select()
        .from('customer')
        .join('applybank', 'customer.idcustomer', 'applybank.idcustomer')
        .where('applybank.executiveid', req.params.id)
        .whereIn('applybank.idapplybank', subquery)
        .orderBy('applybank.idapplybank', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('customer')
                .join('applybank', 'customer.idcustomer', 'applybank.idcustomer')
                .where('applybank.executiveid', req.params.id)
                .whereIn('applybank.idapplybank', subquery)
                .groupBy('applybank.idcustomer')
                .orderBy('applybank.idapplybank', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/adminnotopenedlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('executiveStatus', "new")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/adminfilepickedlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('status', "FILE PICKED")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/admincontactedlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('status', "CONTACTED")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/adminloginlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('status', "LOGIN")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/adminwiplist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('status', "WORK IN PROGRESS")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/adminapprovedlist', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('status', "APPROVED")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/adminnofallowup', (req, res) => {
    knex.select()
        .from('enquirydata')
        .where('status', "REQUIRED")
        .where('executiveStatus', "opened")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/empgetallearlygo/:pagesize/:page/:id', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('earlygo')
        .where('empID', req.params.id)
        .orderBy('earlyGoID', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('earlygo')
                .where('empID', req.params.id)
                .orderBy('earlyGoID', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });

                })
        })
});
router.get('/getEnquiryApprovelistexe1/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.status', 'APPROVED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'APPROVED')
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquirycontactedlistexe1/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.status', 'CONTACTED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'CONTACTED')
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquirydisburselistexe1/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.status', 'DISBURSED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'DISBURSED')
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquiryfilepicklistexe1/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.status', 'FILE PICKED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'FILE PICKED')
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquiryloginlistexe1/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.status', 'LOGIN')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'LOGIN')
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquirynotopenlistexe1/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('executiveStatus', "new")
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].assignedTime);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('executiveStatus', "new")
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquiryrejectlistexe1/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.status', 'REJECTED')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'REJECTED')
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquirywiplistexe1/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.status', 'WORK IN PROGRESS')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].updateddate);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', 'WORK IN PROGRESS')
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getEnquirynofollowuplistexe1/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);
    var date3 = format.asString('MM/dd/yyyy', new Date());
    var ddd = moment().format(date3);
    var d = new Date(ddd);
    var e = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear() + ',' + m + ',' + e;
    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .where('enquirydata.status', "REQUIRED")
        .where('enquirydata.executiveStatus', "opened")
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            var a = result.length
            for (i = 0; i < a; i++) {
                var d1 = new Date(result[i].assignedTime);
                var e1 = d1.getDate();
                var m1 = d1.getMonth() + 1;
                var y1 = d1.getFullYear() + ',' + m1 + ',' + e1;
                var date1 = new Date(y);
                var date4 = new Date(y1);
                var diff = new DateDiff(date1, date4);
                var opt = diff.days();
                //console.log(opt);
                result[i].opt = opt;
            }
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .where('enquirydata.status', "REQUIRED")
                .where('enquirydata.executiveStatus', "opened")
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getadminEnquirylist/:pagesize/:page', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    // //console.log(req.params.id);

    knex.select('enquirydata.*', 'loantype.loantype', 'employee.name as ename')
        .from('enquirydata')
        .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
        .join('employee', 'employee.idemployee', 'enquirydata.teleid')
        .orderBy('enquirydata.idenquiry', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            // //console.log(res);
            knex.select()
                .from('enquirydata')
                .join('loantype', 'loantype.idloantype', 'enquirydata.loantype')
                .join('employee', 'employee.idemployee', 'enquirydata.teleid')
                .orderBy('enquirydata.idenquiry', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.post('/getNotificationById', (req, res) => {
    knex.select('sendernotifications.*', 'receivernotification.*')
        .from('sendernotifications', 'receivernotification.*')
        .join('receivernotification', 'receivernotification.senderNotificationID', 'sendernotifications.senderNotificationID')
        .where('sendernotifications.senderStatus ', 'sent')
        .where('receivernotification.receiverStatus ', 'seen')
        .where('receivernotification.receiverID', req.body.empid)
        .where('sendernotifications.senderID', req.body.value)
        .orderBy('sendernotifications.senderNotificationID', 'desc')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.get('/getAllNotificationById/:id', (req, res) => {
    knex.select('sendernotifications.*')
        .from('sendernotifications')
        .where('sendernotifications.senderID', req.params.id)
        .where('sendernotifications.senderStatus ', 'sent')
        .orderBy('sendernotifications.senderNotificationID', 'desc')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.get('/gettodo1/:id', (req, res) => {
    knex.select('todolist.*')
        .from('todolist')
        .where('todolist.todoID', req.params.id)
        .then(function(result) {
            res.json(result);
        })
});
router.post('/addvisitor', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    var abc = req.body.value.toMeetWhom.split(",", 2);
    knex('visitorform')
        .insert({
            createdDate: date,
            visitorName: req.body.value.visitorName,
            visitorPhoto: req.body.visitorPhoto,
            organizationName: req.body.value.organizationName,
            numberOfVisitors: req.body.value.numberOfVisitors,
            emailId: req.body.value.emailId,
            gender: req.body.value.gender,
            mobileNumber: req.body.value.mobileNumber,
            alternativeNumber: req.body.value.alternativeNumber,
            address: req.body.value.address,
            visitReason: req.body.value.visitReason,
            referenceName: req.body.value.referenceName,
            whomUMeetID: abc[0],
            toMeetWhom: abc[1],
            existingAppointment: req.body.value.existingAppointment,
            status: '0',
        })
        .then(function(result) {
            res.json('Appointment sent Successfully');
            const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
    <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width" name="viewport" />
    <!--[if !mso]><!-->
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <!--<![endif]-->

    <!--[if !mso]><!-->
    <!--<![endif]-->
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
        }
        
        table,
        td,
        tr {
            vertical-align: top;
            border-collapse: collapse;
        }
        
        * {
            line-height: inherit;
        }
        
        a[x-apple-data-detectors=true] {
            color: inherit !important;
            text-decoration: none !important;
        }
    </style>
    <style id="media-query" type="text/css">
        @media (max-width: 660px) {
            .block-grid,
            .col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
            }
            .block-grid {
                width: 100% !important;
            }
            .col {
                width: 100% !important;
            }
            .col>div {
                margin: 0 auto;
            }
            img.fullwidth,
            img.fullwidthOnMobile {
                max-width: 100% !important;
            }
            .no-stack .col {
                min-width: 0 !important;
                display: table-cell !important;
            }
            .no-stack.two-up .col {
                width: 50% !important;
            }
            .no-stack .col.num4 {
                width: 33% !important;
            }
            .no-stack .col.num8 {
                width: 66% !important;
            }
            .no-stack .col.num4 {
                width: 33% !important;
            }
            .no-stack .col.num3 {
                width: 25% !important;
            }
            .no-stack .col.num6 {
                width: 50% !important;
            }
            .no-stack .col.num9 {
                width: 75% !important;
            }
            .video-block {
                max-width: none !important;
            }
            .mobile_hide {
                min-height: 0px;
                max-height: 0px;
                max-width: 0px;
                display: none;
                overflow: hidden;
                font-size: 0px;
            }
            .desktop_hide {
                display: block !important;
                max-height: none !important;
            }
        }
    </style>
</head>

<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #f1f1f1;">
    <!--[if IE]><div class="ie-browser"><![endif]-->
    <table bgcolor="#f1f1f1" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f1f1f1; width: 100%;"
        valign="top" width="100%">
        <tbody>
            <tr style="vertical-align: top;" valign="top">
                <td style="word-break: break-word; vertical-align: top;" valign="top">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#f1f1f1"><![endif]-->
                    <div style="background-color:transparent;">
                        <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #f1f1f1;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#f1f1f1;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#f1f1f1"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#f1f1f1;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                    <div style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                            <!--<![endif]-->
                                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                valign="top" width="100%">
                                                <tbody>
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;"
                                                                valign="top" width="100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top;" valign="top">
                                                                        <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div style="background-color:transparent;">
                        <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#ffffff;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:15px;"><![endif]-->
                                <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                    <div style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:15px; padding-right: 0px; padding-left: 0px;">
                                            <!--<![endif]-->
                                            <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                <a href="https://mindfin.co.in/" style="outline:none" tabindex="-1" target="_blank"> <img align="center" alt="Logo" border="0" class="center fixedwidth" src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; width: 100%; max-width: 224px; display: block;"
                                                        title="Logo" width="224" /></a>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                            </div>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div style="background-color:transparent;">
                        <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="320" style="background-color:#ffffff;width:320px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 35px; padding-left: 35px; padding-top:10px; padding-bottom:5px;"><![endif]-->
                                <div class="col num6" style="min-width: 320px; max-width: 320px; display: table-cell; vertical-align: top; width: 320px;">
                                    <div style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:10px; padding-bottom:5px; padding-right: 35px; padding-left: 35px;">
                                            <!--<![endif]-->
                                            <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center fixedwidth" src="` + req.body.visitorPhoto + `"style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 137px; display: block;"
                                                    title="Alternate text" width="137" />
                                                <!--[if mso]></td></tr></table><![endif]-->
                                            </div>
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 10px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                            <div style="color:#555555;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                <div style="font-size: 14px; line-height: 1.2; color: #555555; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                    <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">VISITOR NAME : ` + req.body.value.visitorName + `</p>
                                                </div>
                                            </div>
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 5px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                            <div style="color:#80c1d8;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:5px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                <div style="font-size: 14px; line-height: 1.2; color: #80c1d8; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                    <p style="font-size: 13px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 16px; mso-ansi-font-size: 14px; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;">ORGANIZATION NAME : ` + req.body.value.organizationName + `</span></p>
                                                </div>
                                            </div>
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 10px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                            <div style="color:#555555;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                <div style="font-size: 14px; line-height: 1.2; color: #555555; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                    <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">ADDRESS : ` + req.body.value.address + `</p>
                                                </div>
                                            </div>
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 10px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                            <div style="color:#555555;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                <div style="font-size: 14px; line-height: 1.2; color: #555555; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                    <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">MOBILE NUMBER : ` + req.body.value.mobileNumber + `</p>
                                                </div>
                                            </div>
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 10px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                            <div style="color:#555555;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                <div style="font-size: 14px; line-height: 1.2; color: #555555; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                    <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">EMAIL ID : ` + req.body.value.emailId + `</p>
                                                </div>
                                            </div>
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 5px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                            <div style="color:#80c1d8;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:5px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                <div style="font-size: 14px; line-height: 1.2; color: #80c1d8; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                    <p style="font-size: 13px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 16px; mso-ansi-font-size: 14px; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;">NUMBER OF VISITOR'S : ` + req.body.value.numberOfVisitors + `</span></p>
                                                </div>
                                            </div>
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                            <div style="color:#80c1d8;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:0px;padding-bottom:10px;padding-left:0px;">
                                                <div style="font-size: 14px; line-height: 1.2; color: #80c1d8; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                <p style="font-size: 13px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 16px; mso-ansi-font-size: 14px; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;">VISIT REASON : </span></p>

                                                    <p style="font-size: 30px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 36px; margin: 0;"><span style="font-size: 30px;"><strong>` + req.body.value.visitReason + `</strong></span></p>
                                                </div>
                                            </div>
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 5px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                            <div style="color:#80c1d8;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:5px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                <div style="font-size: 14px; line-height: 1.2; color: #80c1d8; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                    <p style="font-size: 13px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 16px; mso-ansi-font-size: 14px; margin: 0;"><span style="font-size: 13px; mso-ansi-font-size: 14px;">MEET WHOM : ` + abc[1] + `</span></p>
                                                </div>
                                            </div>
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td><td align="center" width="320" style="background-color:#ffffff;width:320px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:10px; padding-bottom:0px;"><![endif]-->
                                <div class="col num6" style="min-width: 320px; max-width: 320px; display: table-cell; vertical-align: top; width: 320px;">
                                    <div style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:10px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                            <!--<![endif]-->
                                            <div class="mobile_hide">
<div align="right" class="img-container right autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="right"><![endif]--><img align="right" alt="Image" border="0" class="right autowidth" src="https://midnfin-images.oss-ap-south-1.aliyuncs.com/featured-image.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 254px; float: none; display: block;" title="Image" width="254"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
</div>
                                            
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div style="background-color:transparent;">
                        <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #f1f1f1;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#f1f1f1;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#f1f1f1"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#f1f1f1;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                    <div style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                            <!--<![endif]-->
                                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                valign="top" width="100%">
                                                <tbody>
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;"
                                                                valign="top" width="100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top;" valign="top">
                                                                        <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div style="background-color:transparent;">
                        <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#ffffff;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                    <div style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                            <!--<![endif]-->
                                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                valign="top" width="100%">
                                                <tbody>
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;"
                                                                valign="top" width="100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top;" valign="top">
                                                                        <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div style="background-color:transparent;">
                        <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="320" style="background-color:#ffffff;width:320px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                <div class="col num6" style="min-width: 320px; max-width: 320px; display: table-cell; vertical-align: top; width: 320px;">
                                    <div style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                            <!--<![endif]-->
                                            <div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center autowidth" src="https://midnfin-images.oss-ap-south-1.aliyuncs.com/image-01_14.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 320px; display: block;"
                                                    title="Image" width="320" />
                                                <!--[if mso]></td></tr></table><![endif]-->
                                            </div>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td><td align="center" width="320" style="background-color:#ffffff;width:320px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:35px; padding-bottom:5px;"><![endif]-->
                                <div class="col num6" style="min-width: 320px; max-width: 320px; display: table-cell; vertical-align: top; width: 320px;">
                                    <div style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:35px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                            <!--<![endif]-->
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                            <div style="color:#80c1d8;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                <div style="font-size: 14px; line-height: 1.2; color: #80c1d8; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                    <p style="font-size: 30px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 36px; margin: 0;"><span style="font-size: 30px;"><strong>Schedule a Call</strong></span></p>
                                                </div>
                                            </div>
                                            <!--[if mso]></td></tr></table><![endif]-->
                                            <div align="center" class="button-container" style="padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 0px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://test.mindfin.co.in" style="height:30.75pt; width:130.5pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#80c1d8"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="https://test.mindfin.co.in" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #80c1d8; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: auto; width: auto; border-top: 1px solid #80c1d8; border-right: 1px solid #80c1d8; border-bottom: 1px solid #80c1d8; border-left: 1px solid #80c1d8; padding-top: 5px; padding-bottom: 5px; font-family: Poppins, Arial, Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"
                                                    target="_blank"><span style="padding-left:25px;padding-right:25px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">Schedule</span></span></a>
                                                <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                            </div>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div style="background-color:transparent;">
                        <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#ffffff;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                    <div style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                            <!--<![endif]-->
                                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                valign="top" width="100%">
                                                <tbody>
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;"
                                                                valign="top" width="100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top;" valign="top">
                                                                        <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div style="background-color:transparent;">
                        <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #f1f1f1;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#f1f1f1;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#f1f1f1"><![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#f1f1f1;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                    <div style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                            <!--<![endif]-->
                                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                valign="top" width="100%">
                                                <tbody>
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;"
                                                                valign="top" width="100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top;" valign="top">
                                                                        <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                </td>
            </tr>
        </tbody>
    </table>
    <!--[if (IE)]></div><![endif]-->
</body>

</html>`;

            let transporter = nodemailer.createTransport({
                host: req.body.emails[0].hostmail,
                port: 587,
                transportMethod: 'SMTP',
                // secure: false, // true for 465, false for other ports
                auth: {
                    user: req.body.emails[0].emailuser, // gmail id
                    pass: req.body.emails[0].emailpassword // gmail password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            // setup email data with unicode symbols
            let mailOptions = {
                from: req.body.emails[0].fromemail1,
                to: req.body.emails[0].vikas, // list of receivers
                cc: req.body.emails[0].bcc + ',' + req.body.emails[0].boss,

                // to: req.body.emails[0].bcc, // list of receivers
                // cc: req.body.emails[0].cc,
                // bcc: req.body.emails[0].fromemail2,
                subject: ' New Visitor Form ', //"Project Payment Update From", // Subject line
                text: 'Hello world?', // plain text body
                html: output // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return //console.log(error);
                }
                //console.log('Message sent: %s', info.messageId);
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // res.render('contact', { msg: 'Email has been sent' });
            });



        })

});
router.get('/getvisitorcount', (req, res) => {
    knex.select()
        .from('visitorform')
        .where('status', "0")
        .then(function(result) {
            res.json(result.length);
        })
});
router.get('/getAllVisitors/:pagesize/:page', function(req, res) {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('visitorform')
        .orderBy('visitorId', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('visitorform')
                .orderBy('visitorId', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });

                })
        })
});
router.post('/respondVisitor', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('visitorform')
        .where({ visitorId: req.body.value.element.visitorId })
        .update({
            UpdatedDate: date,
            status: '1',
            response: req.body.value.element.response,
            responseGivenby: req.body.empid,
            responseGivenbyName: req.body.empname,
        })
        .then(function(result) {
            res.json('Response sent Successfully');
            const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
            
            <head>
                <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <meta content="width=device-width" name="viewport" />
                <!--[if !mso]><!-->
                <meta content="IE=edge" http-equiv="X-UA-Compatible" />
                <!--<![endif]-->
                <title></title>
                <!--[if !mso]><!-->
                <!--<![endif]-->
                <style type="text/css">
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    
                    table,
                    td,
                    tr {
                        vertical-align: top;
                        border-collapse: collapse;
                    }
                    
                    * {
                        line-height: inherit;
                    }
                    
                    a[x-apple-data-detectors=true] {
                        color: inherit !important;
                        text-decoration: none !important;
                    }
                </style>
                <style id="media-query" type="text/css">
                    @media (max-width: 660px) {
                        .block-grid,
                        .col {
                            min-width: 320px !important;
                            max-width: 100% !important;
                            display: block !important;
                        }
                        .block-grid {
                            width: 100% !important;
                        }
                        .col {
                            width: 100% !important;
                        }
                        .col>div {
                            margin: 0 auto;
                        }
                        img.fullwidth,
                        img.fullwidthOnMobile {
                            max-width: 100% !important;
                        }
                        .no-stack .col {
                            min-width: 0 !important;
                            display: table-cell !important;
                        }
                        .no-stack.two-up .col {
                            width: 50% !important;
                        }
                        .no-stack .col.num4 {
                            width: 33% !important;
                        }
                        .no-stack .col.num8 {
                            width: 66% !important;
                        }
                        .no-stack .col.num4 {
                            width: 33% !important;
                        }
                        .no-stack .col.num3 {
                            width: 25% !important;
                        }
                        .no-stack .col.num6 {
                            width: 50% !important;
                        }
                        .no-stack .col.num9 {
                            width: 75% !important;
                        }
                        .video-block {
                            max-width: none !important;
                        }
                        .mobile_hide {
                            min-height: 0px;
                            max-height: 0px;
                            max-width: 0px;
                            display: none;
                            overflow: hidden;
                            font-size: 0px;
                        }
                        .desktop_hide {
                            display: block !important;
                            max-height: none !important;
                        }
                    }
                </style>
            </head>
            
            <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #f1f1f1;">
                <!--[if IE]><div class="ie-browser"><![endif]-->
                <table bgcolor="#f1f1f1" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f1f1f1; width: 100%;"
                    valign="top" width="100%">
                    <tbody>
                        <tr style="vertical-align: top;" valign="top">
                            <td style="word-break: break-word; vertical-align: top;" valign="top">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#f1f1f1"><![endif]-->
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #f1f1f1;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#f1f1f1;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#f1f1f1"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#f1f1f1;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                            valign="top" width="100%">
                                                            <tbody>
                                                                <tr style="vertical-align: top;" valign="top">
                                                                    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;"
                                                                            valign="top" width="100%">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top;" valign="top">
                                                                                    <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="320" style="background-color:#ffffff;width:320px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 35px; padding-left: 35px; padding-top:10px; padding-bottom:5px;"><![endif]-->
                                            <div class="col num6" style="min-width: 320px; max-width: 320px; display: table-cell; vertical-align: top; width: 320px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:10px; padding-bottom:5px; padding-right: 35px; padding-left: 35px;">
                                                        <!--<![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 10px; padding-bottom: 0px; font-family: Arial, sans-serif"><![endif]-->
                                                        <div style="color:#555555;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                            <div style="font-size: 14px; line-height: 1.2; color: #555555; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">Dear ` + req.body.value.element.visitorName + `,</p>
                                                                <p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> </p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                        <div style="color:#80c1d8;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:0px;padding-bottom:10px;padding-left:0px;">
                                                            <div style="font-size: 14px; line-height: 1.2; color: #80c1d8; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                                                <p style="font-size: 18px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 22px; margin: 0;"><span style="font-size: 18px;"><strong>Your Appointment to meet </strong></span></p>
                                                                <p style="font-size: 18px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 22px; margin: 0;"><span style="font-size: 18px;"><strong>` + req.body.value.element.toMeetWhom + ` is set to</strong></span></p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 5px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                        <div style="color:#808080;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:2;padding-top:5px;padding-right:0px;padding-bottom:10px;padding-left:0px;">
                                                            <div style="font-size: 14px; line-height: 2; color: #808080; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 28px;">
                                                                <p style="font-size: 14px; line-height: 2; word-break: break-word; mso-line-height-alt: 28px; margin: 0;">📅 <span style="font-size: 16px;">` + req.body.value.element.createdDate + `</span></p>
                                                                ` + req.body.value.element.response + `
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 5px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                        <div style="color:#000000;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:2;padding-top:5px;padding-right:0px;padding-bottom:10px;padding-left:0px;">
                                                            <div style="font-size: 14px; line-height: 2; color: #000000; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 28px;">
                                                                <p style="line-height: 2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Thanks And Regards</p>
                                                                <p style="line-height: 2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;"><strong>Mindfin Admin</strong></p>
                                                                <p style="line-height: 2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">No. 10, 1st Floor,</p>
                                                                <p style="line-height: 2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Krishna Block, 1st Main</p>
                                                                <p style="line-height: 2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Road, Seshadripuram,</p>
                                                                <p style="line-height: 2; word-break: break-word; mso-line-height-alt: NaNpx; margin: 0;">Bangalore- 560020</p>
                                                            </div>
                                                        </div>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                        <div align="left" class="img-container left fixedwidth" style="padding-right: 0px;padding-left: 0px;">
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="left"><![endif]--><img alt="Alternate text" border="0" class="left fixedwidth" src="https://mindfin-files.oss-ap-south-1.aliyuncs.com/logo.jpg" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 150px; display: block;"
                                                                title="Alternate text" width="150" />
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </div>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td><td align="center" width="320" style="background-color:#ffffff;width:320px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:10px; padding-bottom:0px;"><![endif]-->
                                            <div class="col num6" style="min-width: 320px; max-width: 320px; display: table-cell; vertical-align: top; width: 320px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:10px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <div align="right" class="img-container right autowidth" style="padding-right: 0px;padding-left: 0px;">
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="right"><![endif]--><img align="right" alt="Image" border="0" class="right autowidth" src="https://midnfin-images.oss-ap-south-1.aliyuncs.com/featured-image.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 254px; float: none; display: block;"
                                                                title="Image" width="254" />
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </div>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <div style="background-color:transparent;">
                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #f1f1f1;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#f1f1f1;">
                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#f1f1f1"><![endif]-->
                                            <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#f1f1f1;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                            <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                                <div style="width:100% !important;">
                                                    <!--[if (!mso)&(!IE)]><!-->
                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                        <!--<![endif]-->
                                                        <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                            valign="top" width="100%">
                                                            <tbody>
                                                                <tr style="vertical-align: top;" valign="top">
                                                                    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;"
                                                                            valign="top" width="100%">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top;" valign="top">
                                                                                    <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                    </div>
                                                    <!--<![endif]-->
                                                </div>
                                            </div>
                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                        </div>
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--[if (IE)]></div><![endif]-->
            </body>
            
            </html>`;

            let transporter = nodemailer.createTransport({
                host: req.body.emails[0].hostmail,
                port: 587,
                transportMethod: 'SMTP',
                // secure: false, // true for 465, false for other ports
                auth: {
                    user: req.body.emails[0].emailuser, // gmail id
                    pass: req.body.emails[0].emailpassword // gmail password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            // setup email data with unicode symbols
            let mailOptions = {
                from: req.body.emails[0].emailuser,
                to: req.body.value.element.emailId,
                cc: req.body.emails[0].vikas + ',' + req.body.emails[0].bcc + ',' + req.body.emails[0].boss,
                // list of receivers
                cc: req.body.emails[0].cc,
                // bcc: req.body.emails[0].fromemail2,
                subject: req.body.value.element.visitReason, //"Project Payment Update From", // Subject line
                text: 'Hello world?', // plain text body
                html: output // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return //console.log(error);
                }
                //console.log('Message sent: %s', info.messageId);
                //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // res.render('contact', { msg: 'Email has been sent' });
            });



        })
});
router.post('/visitoropenstatus', function(req, res) {
    var date = format.asString('yyyy-MM-dd', new Date());
    // //console.log(req.body)
    knex('visitorform')
        .where({ status: '0' })
        .update({
            UpdatedDate: date,
            status: 'Opened',
            responseGivenby: req.body.empid,
            responseGivenbyName: req.body.empname,
        })
        .then(function(result) {
            res.json('Updated Successfully');
        })
});
router.get('/getexecutivelistWithBranch/:branch', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user ', 'EXECUTIVE')
        .where('branch', req.params.branch)
        .where('employee.status ', 'active')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.get('/getheadofficeEmployee', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        // .where('usertype.user ', 'EXECUTIVE')
        .where('branch', 'Head Office')
        .where('employee.status ', 'active')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});
router.get('/getBackendroutinelist/:pagesize/:page/:sdate/:edate', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    knex.select('daily_routine.*', 'bank.bankname', 'employee.*', 'employee.name as empname', 'usertype.*', 'daily_routine.createddate as dcreateddate', 'daily_routine.status as dstatus')
        .from('daily_routine', 'employee')
        .join('bank', 'bank.idbank', 'daily_routine.bankid')
        .join('employee', 'employee.idemployee', 'daily_routine.employeeid')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user', 'BACKEND')
        .where('daily_routine.createddate', '>=', sdate)
        .where('daily_routine.createddate', '<=', edate)
        .orderBy('daily_routine.routineid', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('daily_routine', 'employee')
                .join('bank', 'bank.idbank', 'daily_routine.bankid')
                .join('employee', 'employee.idemployee', 'daily_routine.employeeid')
                .join('usertype', 'usertype.idusertype', 'employee.iduser')
                .where('usertype.user', 'BACKEND')
                .where('daily_routine.createddate', '>=', sdate)
                .where('daily_routine.createddate', '<=', edate)
                .orderBy('daily_routine.routineid', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getallexecutivelist', function(req, res) {
    knex.select()
        .from('employee')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where((user) =>
            user.whereIn('usertype.user', ['EXECUTIVE', 'BACKEND', 'DATAENTRY'])
        )
        // .where('usertype.user ', 'EXECUTIVE')
        // .where('usertype.user', 'BACKEND')
        // .where('usertype.user', 'DATAENTRY')
        .where('employee.status ', 'active')
        .then(function(result) {
            ////console.log(result);
            res.json(result);
        })
});

router.post('/request', function(req, res) {
    // //console.log(req.params.obj);
    // //console.log(req.params.obj1);

    var date1 = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var localTime = moment.utc(date1).toDate();
    knex('sendernotifications')
        .insert({
            createdDate: localTime,
            senderID: '1',
            senderName: 'Admin',
            notification: req.body.empname + " Requesting " + req.body.Data.cname + "," + req.body.File + "   Use Download Document under Customer to Share File,           Keywords to search case: Company Name: " + req.body.Data.cname + ", Mobile No: " + req.body.Data.mobile + ", Aadhar or pan: " + req.body.Data.aadharno + "/" + req.body.Data.panno,
            notificationSubject: "Requesting File to download",
            notificationImg: undefined,
            notificationImg_org: undefined,
            senderStatus: 'sent',
        })
        .then(function(id) {
            const ids = id.toString();
            knex('receivernotification')
                .insert({
                    senderNotificationID: ids,
                    receiverID: "43",
                    receiverName: "Vikas",
                    receiverStatus: 'received',
                }).then(function(re) {
                    res.json('Notification Sent Successfully');
                    const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

                            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
                            
                            <head>
                                <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
                                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                                <meta content="width=device-width" name="viewport" />
                                <!--[if !mso]><!-->
                                <meta content="IE=edge" http-equiv="X-UA-Compatible" />
                                <!--<![endif]-->
                                <title></title>
                                <!--[if !mso]><!-->
                                <!--<![endif]-->
                                <style type="text/css">
                                    body {
                                        margin: 0;
                                        padding: 0;
                                    }
                                    
                                    table,
                                    td,
                                    tr {
                                        vertical-align: top;
                                        border-collapse: collapse;
                                    }
                                    
                                    * {
                                        line-height: inherit;
                                    }
                                    
                                    a[x-apple-data-detectors=true] {
                                        color: inherit !important;
                                        text-decoration: none !important;
                                    }
                                </style>
                                <style id="media-query" type="text/css">
                                    @media (max-width: 660px) {
                                        .block-grid,
                                        .col {
                                            min-width: 320px !important;
                                            max-width: 100% !important;
                                            display: block !important;
                                        }
                                        .block-grid {
                                            width: 100% !important;
                                        }
                                        .col {
                                            width: 100% !important;
                                        }
                                        .col>div {
                                            margin: 0 auto;
                                        }
                                        img.fullwidth,
                                        img.fullwidthOnMobile {
                                            max-width: 100% !important;
                                        }
                                        .no-stack .col {
                                            min-width: 0 !important;
                                            display: table-cell !important;
                                        }
                                        .no-stack.two-up .col {
                                            width: 50% !important;
                                        }
                                        .no-stack .col.num4 {
                                            width: 33% !important;
                                        }
                                        .no-stack .col.num8 {
                                            width: 66% !important;
                                        }
                                        .no-stack .col.num4 {
                                            width: 33% !important;
                                        }
                                        .no-stack .col.num3 {
                                            width: 25% !important;
                                        }
                                        .no-stack .col.num6 {
                                            width: 50% !important;
                                        }
                                        .no-stack .col.num9 {
                                            width: 75% !important;
                                        }
                                        .video-block {
                                            max-width: none !important;
                                        }
                                        .mobile_hide {
                                            min-height: 0px;
                                            max-height: 0px;
                                            max-width: 0px;
                                            display: none;
                                            overflow: hidden;
                                            font-size: 0px;
                                        }
                                        .desktop_hide {
                                            display: block !important;
                                            max-height: none !important;
                                        }
                                    }
                                </style>
                            </head>
                            
                            <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #f6f8f8;">
                                <!--[if IE]><div class="ie-browser"><![endif]-->
                                <table bgcolor="#f6f8f8" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f8f8; width: 100%;"
                                    valign="top" width="100%">
                                    <tbody>
                                        <tr style="vertical-align: top;" valign="top">
                                            <td style="word-break: break-word; vertical-align: top;" valign="top">
                                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#f6f8f8"><![endif]-->
                                                <div style="background-color:#2b3940;">
                                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#2b3940;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                                            <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:transparent;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                                                            <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                                                <div style="width:100% !important;">
                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                                        <!--<![endif]-->
                                                                        <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                            valign="top" width="100%">
                                                                            <tbody>
                                                                                <tr style="vertical-align: top;" valign="top">
                                                                                    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 20px; padding-bottom: 0px; padding-left: 20px;" valign="top">
                                                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #404D53; width: 100%;"
                                                                                            valign="top" width="100%">
                                                                                            <tbody>
                                                                                                <tr style="vertical-align: top;" valign="top">
                                                                                                    <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                    </div>
                                                                    <!--<![endif]-->
                                                                </div>
                                                            </div>
                                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style="background-color:transparent;">
                                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                                            <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#ffffff;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                                                            <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                                                <div style="width:100% !important;">
                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                                        <!--<![endif]-->
                                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 30px; font-family: 'Times New Roman', Georgia, serif"><![endif]-->
                                                                        <div style="color:#555555;font-family:TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:30px;padding-left:10px;">
                                                                            <div style="font-size: 14px; line-height: 1.5; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; color: #555555; mso-line-height-alt: 21px;">
                                                                                <p style="font-size: 18px; line-height: 1.5; word-break: break-word; text-align: left; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; mso-line-height-alt: 27px; margin: 0;"><span style="color: #2b3940; font-size: 18px;"><span style="">Hello Team,</span></span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                    </div>
                                                                    <!--<![endif]-->
                                                                </div>
                                                            </div>
                                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div style="background-color:transparent;">
                                                    <div class="block-grid mixed-two-up no-stack" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                                            <!--[if (mso)|(IE)]><td align="center" width="213" style="background-color:#ffffff;width:213px; border-top: none; border-left: none; border-bottom: none; border-right: none;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr bgcolor='#FFFFFF'><td colspan='3' style='font-size:7px;line-height:16px'>&nbsp;</td></tr><tr><td style='padding-top:0px;padding-bottom:0px' width='16' bgcolor='#FFFFFF'><table role='presentation' width='16' cellpadding='0' cellspacing='0' border='0'><tr><td>&nbsp;</td></tr></table></td><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;background-color:#e5f7f1;"><![endif]-->
                                                            <div class="col num4" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 212px; background-color: #e5f7f1; width: 167px;">
                                                                <div style="width:100% !important;">
                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                    <div style="border-top:16px solid #FFFFFF; border-left:16px solid #FFFFFF; border-bottom:16px solid #FFFFFF; border-right:30px solid #FFFFFF; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                                        <!--<![endif]-->
                                                                        <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
                                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                                            <div style="font-size:1px;line-height:20px"> </div><img align="center" alt="Image" border="0" class="center fixedwidth" src="https://midnfin-images.oss-ap-south-1.aliyuncs.com/admin.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 75px; display: block;"
                                                                                title="Image" width="75" />
                                                                            <div style="font-size:1px;line-height:20px"> </div>
                                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                                        </div>
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                    </div>
                                                                    <!--<![endif]-->
                                                                </div>
                                                            </div>
                                                            <!--[if (mso)|(IE)]></td><td style='padding-top:0px;padding-bottom:0px' width='30' bgcolor='#FFFFFF'><table role='presentation' width='30' cellpadding='0' cellspacing='0' border='0'><tr><td>&nbsp;</td></tr></table></td></tr><tr bgcolor='#FFFFFF'><td colspan='3' style='font-size:7px;line-height:16px'>&nbsp;</td></tr></table><![endif]-->
                                                            <!--[if (mso)|(IE)]></td><td align="center" width="426" style="background-color:#ffffff;width:426px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                                            <div class="col num8" style="display: table-cell; vertical-align: top; min-width: 320px; max-width: 424px; width: 426px;">
                                                                <div style="width:100% !important;">
                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                                        <!--<![endif]-->
                                                                        <div class="mobile_hide">
                                                                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top" width="100%">
                                                                                <tbody>
                                                                                    <tr style="vertical-align: top;" valign="top">
                                                                                        <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;"
                                                                                                valign="top" width="100%">
                                                                                                <tbody>
                                                                                                    <tr style="vertical-align: top;" valign="top">
                                                                                                        <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        <div align="left" class="button-container" style="padding-top:8px;padding-right:10px;padding-bottom:10px;padding-left:0px;">
                                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 8px; padding-right: 10px; padding-bottom: 10px; padding-left: 0px" align="left"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:26.25pt; width:70.5pt; v-text-anchor:middle;" arcsize="9%" stroke="false" fillcolor="#e5f7f1"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#00b074; font-family:'Times New Roman', Georgia, serif; font-size:12px"><![endif]-->
                                                                            <div style="text-decoration:none;display:inline-block;color:#00b074;background-color:#e5f7f1;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:auto; width:auto;;border-top:1px solid #e5f7f1;border-right:1px solid #e5f7f1;border-bottom:1px solid #e5f7f1;border-left:1px solid #e5f7f1;padding-top:1px;padding-bottom:2px;font-family:TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:10px;padding-right:10px;font-size:12px;display:inline-block;"><span style="font-size: 16px; margin: 0; line-height: 2; word-break: break-word; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; mso-line-height-alt: 32px;"><strong><span data-mce-style="font-size: 12px; line-height: 24px;" style="font-size: 12px; line-height: 24px;">` + req.body.empname + ` </span></strong>
                                                                                </span>
                                                                                </span>
                                                                            </div>
                                                                            <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                                        </div>
                                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 0px; padding-top: 5px; padding-bottom: 5px; font-family: 'Times New Roman', Georgia, serif"><![endif]-->
                                                                        <div style="color:#555555;font-family:TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif;line-height:1.2;padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:0px;">
                                                                            <div style="line-height: 1.2; font-size: 12px; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; color: #555555; mso-line-height-alt: 14px;">
                                                                                <p style="font-size: 20px; line-height: 1.2; text-align: left; word-break: break-word; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 20px; color: #2b3940;"><strong>` + req.body.email + `</strong></span></p>
                                                                            </div>
                                                                        </div>
                                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                    </div>
                                                                    <!--<![endif]-->
                                                                </div>
                                                            </div>
                                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div style="background-color:transparent;">
                                                    <div class="block-grid mixed-two-up no-stack" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                                            <!--[if (mso)|(IE)]><td align="center" width="213" style="background-color:#ffffff;width:213px; border-top: none; border-left: none; border-bottom: none; border-right: none;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr bgcolor='#FFFFFF'><td colspan='3' style='font-size:7px;line-height:16px'>&nbsp;</td></tr><tr><td style='padding-top:0px;padding-bottom:0px' width='16' bgcolor='#FFFFFF'><table role='presentation' width='16' cellpadding='0' cellspacing='0' border='0'><tr><td>&nbsp;</td></tr></table></td><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;background-color:#e5f7f1;"><![endif]-->
                                                            <div class="col num4" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 212px; background-color: #e5f7f1; width: 167px;">
                                                                <div style="width:100% !important;">
                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                    <div style="border-top:16px solid #FFFFFF; border-left:16px solid #FFFFFF; border-bottom:16px solid #FFFFFF; border-right:30px solid #FFFFFF; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                                        <!--<![endif]-->
                                                                        <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
                                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                                            <div style="font-size:1px;line-height:30px"> </div><img align="center" alt="Image" border="0" class="center fixedwidth" src="https://midnfin-images.oss-ap-south-1.aliyuncs.com/download.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 75px; display: block;"
                                                                                title="Image" width="75" />
                                                                            <div style="font-size:1px;line-height:30px"> </div>
                                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                                        </div>
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                    </div>
                                                                    <!--<![endif]-->
                                                                </div>
                                                            </div>
                                                            <!--[if (mso)|(IE)]></td><td style='padding-top:0px;padding-bottom:0px' width='30' bgcolor='#FFFFFF'><table role='presentation' width='30' cellpadding='0' cellspacing='0' border='0'><tr><td>&nbsp;</td></tr></table></td></tr><tr bgcolor='#FFFFFF'><td colspan='3' style='font-size:7px;line-height:16px'>&nbsp;</td></tr></table><![endif]-->
                                                            <!--[if (mso)|(IE)]></td><td align="center" width="426" style="background-color:#ffffff;width:426px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                                            <div class="col num8" style="display: table-cell; vertical-align: top; min-width: 320px; max-width: 424px; width: 426px;">
                                                                <div style="width:100% !important;">
                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                                        <!--<![endif]-->
                                                                        <div class="mobile_hide">
                                                                            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top" width="100%">
                                                                                <tbody>
                                                                                    <tr style="vertical-align: top;" valign="top">
                                                                                        <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 9px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;"
                                                                                                valign="top" width="100%">
                                                                                                <tbody>
                                                                                                    <tr style="vertical-align: top;" valign="top">
                                                                                                        <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        <div align="left" class="button-container" style="padding-top:8px;padding-right:10px;padding-bottom:10px;padding-left:0px;">
                                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 8px; padding-right: 10px; padding-bottom: 10px; padding-left: 0px" align="left"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:26.25pt; width:69.75pt; v-text-anchor:middle;" arcsize="9%" stroke="false" fillcolor="#e5f7f1"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#00b074; font-family:'Times New Roman', Georgia, serif; font-size:12px"><![endif]-->
                                                                            <div style="text-decoration:none;display:inline-block;color:#00b074;background-color:#e5f7f1;border-radius:3px;-webkit-border-radius:3px;-moz-border-radius:3px;width:auto; width:auto;;border-top:1px solid #e5f7f1;border-right:1px solid #e5f7f1;border-bottom:1px solid #e5f7f1;border-left:1px solid #e5f7f1;padding-top:1px;padding-bottom:2px;font-family:TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:10px;padding-right:10px;font-size:12px;display:inline-block;"><span style="font-size: 16px; margin: 0; line-height: 2; word-break: break-word; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; mso-line-height-alt: 32px;"><strong><span data-mce-style="font-size: 12px; line-height: 24px;" style="font-size: 12px; line-height: 24px;">Requested File</span></strong>
                                                                                </span>
                                                                                </span>
                                                                            </div>
                                                                            <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                                        </div>
                                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 0px; padding-top: 5px; padding-bottom: 5px; font-family: 'Times New Roman', Georgia, serif"><![endif]-->
                                                                        <div style="color:#555555;font-family:TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif;line-height:1.2;padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:0px;">
                                                                            <div style="line-height: 1.2; font-size: 12px; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; color: #555555; mso-line-height-alt: 14px;">
                                                                                <p style="font-size: 20px; line-height: 1.2; text-align: left; word-break: break-word; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 20px; color: #2b3940;"><strong>` + req.body.File + ` of ` + req.body.Data.cname + `</strong></span></p>
                                                                            </div>
                                                                        </div>
                                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                    </div>
                                                                    <!--<![endif]-->
                                                                </div>
                                                            </div>
                                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style="background-color:transparent;">
                                                    <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                                                        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                                            <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#ffffff;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                                                            <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                                                <div style="width:100% !important;">
                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                                        <!--<![endif]-->
                                                                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 30px; font-family: 'Times New Roman', Georgia, serif"><![endif]-->
                                                                        <div style="color:#555555;font-family:TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:30px;padding-left:10px;">
                                                                            <div style="font-size: 14px; line-height: 1.5; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; color: #555555; mso-line-height-alt: 21px;">
                                                                                <p style="font-size: 18px; line-height: 1.5; word-break: break-word; text-align: left; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; mso-line-height-alt: 27px; margin: 0;"><span style="color: #2b3940; font-size: 18px;"><span style="">Thanks and Regards,</span></span>
                                                                                </p>
                                                                                <p style="font-size: 18px; line-height: 1.5; word-break: break-word; text-align: left; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; mso-line-height-alt: 27px; margin: 0;"><span style="color: #2b3940; font-size: 18px;"><span style="">Mindfin Ser Pvt. Ltd.</span></span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                                        <!--[if (!mso)&(!IE)]><!-->
                                                                    </div>
                                                                    <!--<![endif]-->
                                                                </div>
                                                            </div>
                                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!--[if (IE)]></div><![endif]-->
                            </body>
                            
                            </html>`;
                    let transporter = nodemailer.createTransport({
                        host: req.body.emails[0].hostmail,
                        port: 587,
                        transportMethod: 'SMTP',
                        // secure: false, // true for 465, false for other ports
                        auth: {
                            user: req.body.emails[0].emailuser, // gmail id
                            pass: req.body.emails[0].emailpassword // gmail password
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });
                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: req.body.emails[0].fromemail1,
                        to: req.body.emails[0].vikas, // list of receivers
                        cc: req.body.emails[0].bcc + "," + req.body.emails[0].boss,
                        // bcc: req.body.emails[0].bcc,
                        subject: req.body.empname + " Requested File Download", //"Project Payment Update From", // Subject line
                        text: 'Hello world?', // plain text body
                        html: output // html body
                    };
                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return //console.log(error);
                        }
                        //console.log('Message sent: %s', info.messageId);
                        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        // res.render('contact', { msg: 'Email has been sent' });
                    });
                })
        })

});
router.post('/shareFile', function(req, res) {
    // //console.log(req.params.obj);
    // //console.log(req.params.obj1);
    const vbs = req.body.arr;
    var fileName;
    var OSSName;
    var requesterid;
    var requesteraName;
    var requesteraemail;
    var comment;
    var companyName;
    // const nowdate = format.asString('yyyy-MM-dd', new Date());
    var date1 = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var localTime = moment.utc(date1).toDate();
    for (var j = 0; j < vbs.length; j++) {
        // var backendid = vbs[j].loanid
        fileName = vbs[j].fileName
        OSSName = vbs[j].OSSName
        requesterid = vbs[j].requesterid
        requesteraName = vbs[j].requesteraName
        requesteraemail = vbs[j].requesteraemail
        comment = vbs[j].comment
        companyName = vbs[j].companyName
        knex('sendernotifications')
            .insert({
                createdDate: localTime,
                senderID: req.body.empID,
                senderName: req.body.empName,
                notification: "Requested company:  " + companyName + ", File: " + fileName + ", Comments: " + comment + ".",
                notificationSubject: "Requested File ready to download",
                notificationImg: OSSName,
                notificationImg_org: fileName,
                senderStatus: 'sent',
            })
            .then(function(id) {
                const ids = id.toString();
                knex('receivernotification')
                    .insert({
                        senderNotificationID: ids,
                        receiverID: requesterid,
                        receiverName: requesteraName,
                        receiverStatus: 'received',
                    }).then(function(re) {
                        res.json('Notification Sent Successfully');
                    })

            })
    }
    const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
    
    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }
            
            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }
            
            * {
                line-height: inherit;
            }
            
            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }
        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 660px) {
                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }
                .block-grid {
                    width: 100% !important;
                }
                .col {
                    width: 100% !important;
                }
                .col>div {
                    margin: 0 auto;
                }
                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }
                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }
                .no-stack.two-up .col {
                    width: 50% !important;
                }
                .no-stack .col.num4 {
                    width: 33% !important;
                }
                .no-stack .col.num8 {
                    width: 66% !important;
                }
                .no-stack .col.num4 {
                    width: 33% !important;
                }
                .no-stack .col.num3 {
                    width: 25% !important;
                }
                .no-stack .col.num6 {
                    width: 50% !important;
                }
                .no-stack .col.num9 {
                    width: 75% !important;
                }
                .video-block {
                    max-width: none !important;
                }
                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }
                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }
        </style>
    </head>
    
    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #f6f8f8;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#f6f8f8" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f8f8; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#f6f8f8"><![endif]-->
                        <div style="background-color:#2b3940;">
                            <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#2b3940;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:transparent;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                                    <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                        <div style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                <!--<![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 20px; padding-bottom: 0px; padding-left: 20px;" valign="top">
                                                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #404D53; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <div style="background-color:transparent;">
                            <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                                <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#ffffff;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                                    <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                        <div style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                <!--<![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 30px; font-family: 'Times New Roman', Georgia, serif"><![endif]-->
                                                <div style="color:#555555;font-family:TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:30px;padding-left:10px;">
                                                    <div style="font-size: 14px; line-height: 1.5; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; color: #555555; mso-line-height-alt: 21px;">
                                                        <p style="font-size: 18px; line-height: 1.5; word-break: break-word; text-align: left; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; mso-line-height-alt: 27px; margin: 0;"><span style="color: #2b3940; font-size: 18px;"><span style="">Hello ` + requesteraName + `,</span></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <div style="background-color:transparent;">
                            <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:transparent;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                                    <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                        <div style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                <!--<![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;" valign="top">
                                                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="30" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 30px; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td height="30" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <div style="background-color:transparent;">
                            <div class="block-grid mixed-two-up no-stack" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                                <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="213" style="background-color:#ffffff;width:213px; border-top: none; border-left: none; border-bottom: none; border-right: none;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr bgcolor='#FFFFFF'><td colspan='3' style='font-size:7px;line-height:16px'>&nbsp;</td></tr><tr><td style='padding-top:0px;padding-bottom:0px' width='16' bgcolor='#FFFFFF'><table role='presentation' width='16' cellpadding='0' cellspacing='0' border='0'><tr><td>&nbsp;</td></tr></table></td><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;background-color:#e5f7f1;"><![endif]-->
                                    <div class="col num4" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 212px; background-color: #e5f7f1; width: 167px;">
                                        <div style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border-top:16px solid #FFFFFF; border-left:16px solid #FFFFFF; border-bottom:16px solid #FFFFFF; border-right:30px solid #FFFFFF; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                <!--<![endif]-->
                                                <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                    <div style="font-size:1px;line-height:20px"> </div><img align="center" alt="Image" border="0" class="center fixedwidth" src="https://midnfin-images.oss-ap-south-1.aliyuncs.com/download.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 75px; display: block;"
                                                        title="Image" width="75" />
                                                    <div style="font-size:1px;line-height:20px"> </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td><td style='padding-top:0px;padding-bottom:0px' width='30' bgcolor='#FFFFFF'><table role='presentation' width='30' cellpadding='0' cellspacing='0' border='0'><tr><td>&nbsp;</td></tr></table></td></tr><tr bgcolor='#FFFFFF'><td colspan='3' style='font-size:7px;line-height:16px'>&nbsp;</td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td><td align="center" width="426" style="background-color:#ffffff;width:426px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num8" style="display: table-cell; vertical-align: top; min-width: 320px; max-width: 424px; width: 426px;">
                                        <div style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                <!--<![endif]-->
                                                <div class="mobile_hide">
                                                    <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                        valign="top" width="100%">
                                                        <tbody>
                                                            <tr style="vertical-align: top;" valign="top">
                                                                <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                                                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;"
                                                                        valign="top" width="100%">
                                                                        <tbody>
                                                                            <tr style="vertical-align: top;" valign="top">
                                                                                <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 0px; padding-top: 5px; padding-bottom: 5px; font-family: 'Times New Roman', Georgia, serif"><![endif]-->
                                                <div style="color:#555555;font-family:TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif;line-height:1.2;padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:0px;">
                                                    <div style="line-height: 1.2; font-size: 12px; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; color: #555555; mso-line-height-alt: 14px;">
                                                        <p style="font-size: 17px; line-height: 1.2; text-align: left; word-break: break-word; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; mso-line-height-alt: 20px; mso-ansi-font-size: 18px; margin: 0;"><span style="font-size: 17px; mso-ansi-font-size: 18px;"><strong style="color: #2b3940; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif;">Your requested file is ready to download. Check Your LOS </strong><span style="color: #2b3940;"><strong>notification</strong></span>
                                                            <strong style="color: #2b3940; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif;"> to download file</strong>
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <div style="background-color:transparent;">
                            <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:transparent;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                                    <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                        <div style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                <!--<![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;" valign="top">
                                                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="30" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 30px; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td height="30" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <div style="background-color:transparent;">
                            <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;">
                                <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#ffffff;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
                                    <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
                                        <div style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                <!--<![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 30px; font-family: 'Times New Roman', Georgia, serif"><![endif]-->
                                                <div style="color:#555555;font-family:TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:30px;padding-left:10px;">
                                                    <div style="font-size: 14px; line-height: 1.5; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; color: #555555; mso-line-height-alt: 21px;">
                                                        <p style="font-size: 18px; line-height: 1.5; word-break: break-word; text-align: left; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; mso-line-height-alt: 27px; margin: 0;"><span style="color: #2b3940; font-size: 18px;"><span style="">Thanks and Regards,</span></span>
                                                        </p>
                                                        <p style="font-size: 18px; line-height: 1.5; word-break: break-word; text-align: left; font-family: TimesNewRoman, 'Times New Roman', Times, Beskerville, Georgia, serif; mso-line-height-alt: 27px; margin: 0;"><span style="color: #2b3940; font-size: 18px;"><span style="">Mindfin Ser Pvt. Ltd.</span></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>
    
    </html>`;
    let transporter = nodemailer.createTransport({
        host: req.body.emails[0].hostmail,
        port: 587,
        transportMethod: 'SMTP',
        // secure: false, // true for 465, false for other ports
        auth: {
            user: req.body.emails[0].emailuser, // gmail id
            pass: req.body.emails[0].emailpassword // gmail password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: req.body.emails[0].fromemail1,
        to: requesteraemail, // list of receivers
        cc: req.body.emails[0].bcc + "," + req.body.emails[0].boss + "," + req.body.emails[0].vikas,
        // bcc: req.body.emails[0].bcc,
        subject: companyName + ": Your Requested file is ready to Download", //"Project Payment Update From", // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return //console.log(error);
        }
        //console.log('Message sent: %s', info.messageId);
        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // res.render('contact', { msg: 'Email has been sent' });
    });

});
router.post('/addteleroutine', (req, res) => {

    const nowdate = format.asString('yyyy-MM-dd', new Date());

    knex('daily_routine')
        .insert({
            noOfCalls: req.body.data.NOC,
            noOfFollowUp: req.body.data.NOF,
            noOfLeadGenrated: req.body.data.NOLG,
            employeeid: req.body.empID,
            createddate: nowdate,
            comment: req.body.data.comment
        }).then(function(result) {
            console.log(result);
            res.json(result);
        })
});
router.get('/getTopRoutine//:pagesize/:page/:empid', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    knex.select()
        .from('daily_routine')
        .where('daily_routine.employeeid', req.params.empid)
        .orderBy('daily_routine.routineid', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            res.json(result);
        })
});
router.get('/viewTeleroutine/:pagesize/:page/:id', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    //console.log(req.params.id);
    knex.select('daily_routine.*')
        .from('daily_routine')
        .where('employeeid', req.params.id)
        .orderBy('daily_routine.routineid', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {

            knex.select('daily_routine.*')
                .from('daily_routine')
                .where('employeeid', req.params.id)
                .orderBy('daily_routine.routineid', 'desc')
                .then(function(re) {

                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
router.get('/getTeleroutinelist/:pagesize/:page/:sdate/:edate', (req, res, next) => {
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1));
    const sdate = format.asString('yyyy-MM-dd', new Date(req.params.sdate));
    const edate = format.asString('yyyy-MM-dd', new Date(req.params.edate));
    knex.select('daily_routine.*', 'employee.*', 'employee.name as empname', 'usertype.*', 'daily_routine.createddate as dcreateddate', 'daily_routine.status as dstatus')
        .from('daily_routine', 'employee')
        .join('employee', 'employee.idemployee', 'daily_routine.employeeid')
        .join('usertype', 'usertype.idusertype', 'employee.iduser')
        .where('usertype.user', 'TELECALLER')
        .where('daily_routine.createddate', '>=', sdate)
        .where('daily_routine.createddate', '<=', edate)
        .orderBy('daily_routine.routineid', 'desc')
        .limit(pageSize).offset(skip)
        .then(function(result) {
            knex.select()
                .from('daily_routine', 'employee')
                .join('employee', 'employee.idemployee', 'daily_routine.employeeid')
                .join('usertype', 'usertype.idusertype', 'employee.iduser')
                .where('usertype.user', 'TELECALLER')
                .where('daily_routine.createddate', '>=', sdate)
                .where('daily_routine.createddate', '<=', edate)
                .orderBy('daily_routine.routineid', 'desc')
                .then(function(re) {
                    res.status(200).json({
                        message: "Memberlists fetched",
                        posts: result,
                        maxPosts: re.length
                    });
                })
        })
});
module.exports = router;