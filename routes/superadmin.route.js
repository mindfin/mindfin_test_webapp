const express = require('express');
const router = express.Router();
var sha1 = require('sha1');
var generator = require('generate-password');
const format = require('date-format');
const knex = require('../knex/knex.js');

router.get('/getintroducer1', (req, res) => {


    knex.select()
        .from('introducer1')
        // .where ({receiptno:rno})
        .then(function(result) {
            console.log(result);
            res.json(result);

        })

})


router.get('/getintroducer2', (req, res) => {


    knex.select()
        .from('introducer2')
        // .where ({receiptno:rno})
        .then(function(result) {
            console.log(result);
            res.json(result);

        })

})


router.post('/addintroducer1', (req, res) => {
    if (req.body.idintroducer1 != null) {

        knex('introducer1')
            .where({ idintroducer1: req.body.idintroducer1 })
            .update({
                introducer1_name: req.body.introducer1_name

            })
            .then(function(result) {
                console.log(result);
                res.json('introducer1 Updated Successfully');
            })

    } else {
        knex('introducer1')
            .insert({ introducer1_name: req.body.introducer1_name })
            .then(function(result) {
                console.log(result);
                res.json('Project Added Successfully');
            })
    }
})


router.post('/addintroducer2', (req, res) => {
    if (req.body.idintroducer2 != null) {

        knex('introducer2')
            .where({ idintroducer2: req.body.idintroducer2 })
            .update({
                introducer2_name: req.body.introducer2_name

            })
            .then(function(result) {
                console.log(result);
                res.json('introducer2 Updated Successfully');
            })

    } else {
        knex('introducer2')
            .insert({ introducer2_name: req.body.introducer2_name })
            .then(function(result) {
                console.log(result);
                res.json('Project Added Successfully');
            })


    }
})

router.get('/gettransfer/:pagesize/:page', (req, res) => {
    console.log("hi");
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('transfer')
        .join('project', 'project.idproject', 'transfer.pname')
        .join('plotsize', 'plotsize.idplotsize', 'transfer.psize')
        .join('land', 'land.idland', 'transfer.idland')
        .where({ selectstatus: 'active' })
        .then(function(result) {
            knex.select()
                .from('transfer')
                .join('project', 'project.idproject', 'transfer.pname')
                .join('plotsize', 'plotsize.idplotsize', 'transfer.psize')
                .join('land', 'land.idland', 'transfer.idland')
                .where({ selectstatus: 'active' })
                .count({ a: 'transfer.idtransfer' })

            .then(function(re) {



                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re[0].a
                });
            })
        })
});

// router.get('/gettransfer/:pagesize/:page',(req,res)=>{
//   console.log("routes");
//   const pageSize = req.params.pagesize;
//   const currentPage = req.params.page;
//   // const pageSize = 2;
//   // const currentPage = 1;
//   const skip = (pageSize*(currentPage-1))
//   const postQuery = "Select  m.*,p.*,pl.*,l.* from transfer as m join project as p join plotsize as pl join land as l where selectstatus='active'  and p.idproject=m.pname and pl.idplotsize=m.psize and m.idland=l.idland  LIMIT "+skip+","+pageSize+"";
//   connection.query(postQuery,function(err,res1){
//       console.log(postQuery);
//       const count = "select COUNT(*) as c from transfer  where selectstatus='active'";
//       connection.query(count,function(err,res2){
//           console.log(res2[0].c);
//           res.status(200).json({
//               message: "Posts fetched successfully!",
//               posts: res1,
//               maxPosts: res2[0].c
//             });
//       })

//   })
// })
router.get('/memberlist/:pagesize/:page', (req, res) => {
    console.log("hi");
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('approvalbooking')
        .join('project', 'project.idproject', 'approvalbooking.pname')
        .join('plotsize', 'plotsize.idplotsize', 'approvalbooking.psize')
        .join('land', 'land.idland', 'approvalbooking.idland')
        .join('introducer1', 'introducer1.idintroducer1', 'approvalbooking.introducer1')
        .join('introducer2', 'introducer2.idintroducer2', 'approvalbooking.introducer2')

    .where({ status: 'pending' })
        // .limit(skip,pageSize)
        .then(function(result) {
            knex.select()
                .from('approvalbooking')
                .join('project', 'project.idproject', 'approvalbooking.pname')
                .join('plotsize', 'plotsize.idplotsize', 'approvalbooking.psize')
                .join('land', 'land.idland', 'approvalbooking.idland')
                .join('introducer1', 'introducer1.idintroducer1', 'approvalbooking.introducer1')
                .join('introducer2', 'introducer2.idintroducer2', 'approvalbooking.introducer2')

            .where({ status: 'pending' })
                .count({ a: 'approvalbooking.idapprovalbooking' })

            // .limit(skip,pageSize)
            .then(function(re) {

                // console.log(result); 
                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re[0].a
                });
            })
        })
});
router.post('/approvemember', (req, res, next) => {

    console.log(req.body);
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    var date = req.body.pdate;
    const nowdate = format.asString('yyyy-MM-dd', new Date(date));
    var dob = req.body.dob;
    const nowdate1 = format.asString('yyyy-MM-dd', new Date(dob));

    const encryptedString = sha1(password);



    knex('member_table')
        .returning('id')
        .insert({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            dob: nowdate1,
            landline: req.body.landline,
            altmob: req.body.altmob,
            fathus: req.body.fathus,
            address: req.body.address,
            cname: req.body.cname,
            designation: req.body.designation,
            caddress: req.body.caddress,
            accno: req.body.accno,
            ifsc: req.body.ifsc,
            branch: req.body.branch,
            pan: req.body.pan,
            nname: req.body.nname,
            age: req.body.age,
            relation: req.body.relation,
            raddress: req.body.raddress,
            pname: req.body.pname,
            psize: req.body.psize,
            site: req.body.site,
            sid: req.body.sid,
            mid: req.body.mid,
            idland: req.body.idland,
            mode: req.body.mode,
            bankname: req.body.bankname,
            pdate: nowdate,
            dd: req.body.dd,
            tid: req.body.tid,
            cno: req.body.cno,
            payamount: req.body.payamount,
            share: req.body.share,
            applicationfee: req.body.applicationfee,
            admissionfee: req.body.admissionfee,
            sharefee: req.body.sharefee,
            welfarefund: req.body.welfarefund,
            finalamt: req.body.finalamt,
            dueamount: req.body.dueamount,
            dp: req.body.dp,
            membername1: req.body.membername1,
            memberage1: req.body.memberage1,
            memberrelation1: req.body.memberrelation1,
            membername2: req.body.membername2,
            memberage2: req.body.memberage2,
            memberrelation2: req.body.memberrelation2,
            totalamount: req.body.finalamt,
            password: encryptedString,
            idpresident: req.body.idpresident,
            selectstatus: 'active',
            receiptno: req.body.receiptno,
            paybranch: req.body.paybranch,
            pprice: req.body.pprice,
            introducer1: req.body.introducer1,
            introducer2: req.body.introducer2
        })
        .then(function(id) {
            knex('approvalbooking')
                .where({ idapprovalbooking: req.body.idapprovalbooking })
                .update({
                    status: 'approved',
                    bookingid: id
                })
                .then(function(result) {
                    console.log(result);
                    // res.json('Project Updated Successfully');
                })

            // });

            knex('receipt')
                .insert({
                    share: req.body.share,
                    applicationfee: req.body.applicationfee,
                    admissionfee: req.body.admissionfee,
                    sharefee: req.body.sharefee,
                    welfarefund: req.body.welfarefund,
                    idbooking: id,
                    pname: req.body.pname,
                    psize: req.body.psize,
                    payamount: req.body.payamount,
                    finalamt: req.body.finalamt,
                    paymode: req.body.mode,
                    bankname: req.body.bankname,
                    paydate: nowdate,
                    dd: req.body.dd,
                    tid: req.body.tid,
                    cno: req.body.cno,
                    projectprice: req.body.pprice,
                    receiptno: req.body.receiptno,
                    paybranch: req.body.paybranch,
                    dp: req.body.dp,
                    idpresident: req.body.idpresident,
                    paymentstatus: req.body.paymentstatus,
                    status: 'active'

                })
                .then(function(result) {
                    console.log(result);
                    res.json('Receipt Added Successfully');

                })

        });
});



router.post('/rejectmember', function(req, res) {
    console.log(req.body);
    knex('approvalbooking')
        .where({ idapprovalbooking: req.body.idapprovalbooking })
        .update({
            status: 'reject'

        })
        .then(function(result) {
            console.log(result);
            res.json('Project Updated Successfully');
        })

});



router.post('/rejecteditmember', function(req, res) {
    console.log(req.body);
    knex('approvalbooking')
        .where({ idapprovalbooking: req.body.idapprovalbooking })
        .update({
            editstatus: 'reject'

        })
        .then(function(result) {
            knex('member_table')
                .where({ idmember: req.body.bookingid })
                .update({
                    editstatus: 'notapproved'

                })
                .then(function(res) {


                    console.log(res);
                    res.json('Project Updated Successfully');
                })
        })
});



router.get('/editmemberlist/:pagesize/:page', (req, res) => {
    console.log("hi");
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('approvalbooking')
        .join('project', 'project.idproject', 'approvalbooking.pname')
        .join('plotsize', 'plotsize.idplotsize', 'approvalbooking.psize')
        .join('land', 'land.idland', 'approvalbooking.idland')
        .join('introducer1', 'introducer1.idintroducer1', 'approvalbooking.introducer1')
        .join('introducer2', 'introducer2.idintroducer2', 'approvalbooking.introducer2')

    .where({ editstatus: 'pending' })
        .then(function(result) {
            knex.select()
                .from('approvalbooking')
                .join('project', 'project.idproject', 'approvalbooking.pname')
                .join('plotsize', 'plotsize.idplotsize', 'approvalbooking.psize')
                .join('land', 'land.idland', 'approvalbooking.idland')
                .join('introducer1', 'introducer1.idintroducer1', 'approvalbooking.introducer1')
                .join('introducer2', 'introducer2.idintroducer2', 'approvalbooking.introducer2')

            .where({ editstatus: 'pending' })
                .count({ a: 'approvalbooking.idapprovalbooking' })

            .then(function(re) {


                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re[0].a
                });
            })
        })
});


router.post('/editapprovemember', function(req, res) {
        console.log(req.body);
        var date = req.body.dob;
        const nowdate = format.asString('yyyy-MM-dd', new Date(date));
        var a = req.body.pprice - req.body.totalamount;

        knex('member_table')
            .where({ idmember: req.body.bookingid })
            .update({
                name: req.body.name,
                mobile: req.body.mobile,
                email: req.body.email,
                dob: nowdate,
                landline: req.body.landline,
                altmob: req.body.altmob,
                fathus: req.body.fathus,
                address: req.body.address,
                cname: req.body.cname,
                designation: req.body.designation,
                caddress: req.body.caddress,
                accno: req.body.accno,
                ifsc: req.body.ifsc,
                branch: req.body.branch,
                pan: req.body.pan,
                nname: req.body.nname,
                age: req.body.age,
                relation: req.body.relation,
                raddress: req.body.raddress,
                pprice: req.body.pprice,
                pname: req.body.pname,
                psize: req.body.psize,
                site: req.body.site,
                sid: req.body.sid,
                mid: req.body.mid,
                idland: req.body.idland,
                membername1: req.body.membername1,
                memberage1: req.body.memberage1,
                memberrelation1: req.body.memberrelation1,
                membername2: req.body.membername2,
                memberage2: req.body.memberage2,
                memberrelation2: req.body.memberrelation2,
                dueamount: a,
                introducer1: req.body.introducer1,
                introducer2: req.body.introducer2,
                editstatus: 'approved'

            })
            .then(function(result) {
                console.log(result);
                res.json('Project Updated Successfully');
            })

        knex('approvalbooking')
            .where({ bookingid: req.body.bookingid })
            .update({
                editstatus: 'approved'

            })
            .then(function(result) {
                console.log(result);
                // res.json('Project Updated Successfully');
            })

        knex('receipt')
            .where({ bookingid: req.body.bookingid })
            .update({
                projectprice: req.body.pprice,
                pname: req.body.pname,
                psize: req.body.psize,
                paymentstatus: req.body.paymentstatus,
                idbooking: req.body.bookingid

            })
            .then(function(result) {
                console.log(result);
                // res.json('Project Updated Successfully');
            })
            // var a2=connection.query('update approvalbooking set editstatus=? where bookingid=?',
            // ['approved',req.body.bookingid],function(err,result1){
            //   console.log(a2);
            // })
            //  var a3= connection.query('update receipt set projectprice=?,pname=?,psize=?,paymentstatus=? where idbooking=?',
            //   [req.body.pprice,req.body.pname,req.body.psize,req.body.paymentstatus,req.body.bookingid],function(err,result1){
            //     console.log(a3);
            //   })
    })
    // });


router.get('/getdeleteMember/:pagesize/:page', (req, res) => {
    console.log("hi");
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('member_table')
        .join('project', 'project.idproject', 'member_table.pname')
        .join('plotsize', 'plotsize.idplotsize', 'member_table.psize')
        .join('land', 'land.idland', 'member_table.idland')

    .where({ deletestatus: 'pending' })
        .then(function(result) {
            knex.select()
                .from('member_table')
                .join('project', 'project.idproject', 'member_table.pname')
                .join('plotsize', 'plotsize.idplotsize', 'member_table.psize')
                .join('land', 'land.idland', 'member_table.idland')

            .where({ deletestatus: 'pending' })
                .count({ a: 'member_table.idmember' })

            .then(function(re) {

                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re[0].a
                });
            })
        })
});


router.post('/deleteapprovemember', function(req, res) {

    knex('member_table')
        .where({ idmember: req.body.idmember })
        .update({
            selectstatus: 'inactive',
            deletestatus: 'approved'
        })
        .then(function(result) {
            knex('receipt')
                .where({ idbooking: req.body.idmember })
                .update({
                    status: 'inactive'

                })
                .then(function(result) {})
            knex('approvalbooking')
                .where({ bookingid: req.body.idmember })
                .update({
                    status: 'deleted',
                    editstatus: 'deleted'

                })
                .then(function(result) {
                    console.log(result);
                    res.json('Project Updated Successfully');
                })
        })

});



router.post('/rejectdeletemember', function(req, res) {

    knex('member_table')
        .where({ idmember: req.body.idmember })
        .update({
            deletestatus: 'reject'
        })
        .then(function(result) {
            console.log(result);
            res.json('Project Updated Successfully');
        })
})

router.post('/deletebooking', function(req, res) {

    knex('member_table')
        .where({ idmember: req.body.idmember })
        .update({
            deletestatus: 'pending'
        })
        .then(function(result) {
            console.log(result);
            res.json('Project Updated Successfully');
        })
});



router.get('/gethistoryMember/:pagesize/:page', (req, res) => {
    console.log("hi");
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('member_table')
        .join('project', 'project.idproject', 'member_table.pname')
        .join('plotsize', 'plotsize.idplotsize', 'member_table.psize')
        .join('land', 'land.idland', 'member_table.idland')

    .where({ selectstatus: 'inactive' })
        // .limit(skip,pageSize)
        .then(function(result) {

            const skip = (pageSize * (currentPage - 1))
            knex.select()
                .from('member_table')
                .join('project', 'project.idproject', 'member_table.pname')
                .join('plotsize', 'plotsize.idplotsize', 'member_table.psize')
                .join('land', 'land.idland', 'member_table.idland')

            .where({ selectstatus: 'inactive' })
                .count({ a: 'member_table.idmember' })

            .then(function(re) {
                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re[0].a
                });
            })
        })
});



//   router.get('/gethistoryMember/:pagesize/:page',(req,res)=>{
//     // console.log("routes");
//     const pageSize = req.params.pagesize;
//     const currentPage = req.params.page;
//     // const pageSize = 2;
//     // const currentPage = 1;
//     const skip = (pageSize*(currentPage-1))
//     const postQuery = "Select m.*,p.*,pl.*,l.* from member_table as m join project as p join plotsize as pl join land as l where m.selectstatus='inactive' and p.idproject=m.pname and pl.idplotsize=m.psize and m.idland=l.idland LIMIT "+skip+","+pageSize+"";
//     connection.query(postQuery,function(err,res1){
//         console.log(res1.length);
//         const count = "select COUNT(*) as c from member_table where selectstatus='inactive'";
//         connection.query(count,function(err,res2){
//             console.log(res2[0].c);
//             res.status(200).json({
//                 message: "Posts fetched successfully!",
//                 posts: res1,
//                 maxPosts: res2[0].c
//               });
//         })

//     })
//   })

router.get('/getReceiptapproval/:pagesize/:page', (req, res) => {
    console.log("hi");
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select('approvalreceipt.*', 'member_table.name', 'member_table.mobile', 'member_table.email', 'member_table.pname', 'member_table.psize', 'member_table.idland')
        .from('approvalreceipt')
        .join('member_table', 'member_table.idmember', 'approvalreceipt.idbooking')
        // .join('plotsize','plotsize.idplotsize','member_table.psize')
        // .join('land','land.idland','member_table.idland')
        .where({ receiptapproval: 'pending' })
        .then(function(result) {
            knex.select('approvalreceipt.*', 'member_table.name', 'member_table.mobile', 'member_table.email', 'member_table.pname', 'member_table.psize', 'member_table.idland')
                .from('approvalreceipt')
                .join('member_table', 'member_table.idmember', 'approvalreceipt.idbooking')
                // .join('plotsize','plotsize.idplotsize','member_table.psize')
                // .join('land','land.idland','member_table.idland')
                .where({ receiptapproval: 'pending' })
                .count({ a: 'approvalreceipt.idapprovalreceipt' })

            .then(function(re) {
                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re[0].a
                });
            })
        })
});

//   router.get('/getReceiptapproval/:pagesize/:page',(req,res)=>{
//     // console.log("routes");
//     const pageSize = req.params.pagesize;
//     const currentPage = req.params.page;
//     // const pageSize = 2;
//     // const currentPage = 1;
//     const skip = (pageSize*(currentPage-1))
//     const postQuery = "Select a.*,b.name,b.mobile,b.email,b.pname,b.psize,b.idland
//from approvalreceipt as a join member_table as b 
//where a.receiptapproval='pending' and a.idbooking=b.idmember  LIMIT  "+skip+","+pageSize+"";
//     console.log(postQuery);
//     connection.query(postQuery,function(err,res1){
//         console.log(res1.length);
//         // console.log(postQuery)
//         const count = "select COUNT(*) as c from approvalreceipt as a join member_table as b where a.receiptapproval='pending' and a.idbooking=b.idmember  ";
//         connection.query(count,function(err,res2){
//             console.log(res2[0].c);
//             res.status(200).json({
//                 message: "Posts fetched successfully!",
//                 posts: res1,
//                 maxPosts: res2[0].c
//               });
//         })

//     })
//   })

router.post('/approvereceipt', function(req, res) {
    var date = req.body.paydate;
    const nowdate = format.asString('yyyy-MM-dd', new Date(date));
    console.log(req.body);
    console.log("hiii");

    knex('receipt')
        .insert({
            share: req.body.share,
            applicationfee: req.body.applicationfee,
            admissionfee: req.body.admissionfee,
            sharefee: req.body.sharefee,
            welfarefund: req.body.welfarefund,
            idbooking: req.body.idbooking,
            pname: req.body.pname,
            psize: req.body.psize,
            payamount: req.body.payamount,
            finalamt: req.body.finalamt,
            paymode: req.body.paymode,
            bankname: req.body.bankname,
            paydate: nowdate,
            dd: req.body.dd,
            tid: req.body.tid,
            cno: req.body.cno,
            projectprice: req.body.pprice,
            receiptno: req.body.receiptno,
            paybranch: req.body.paybranch,
            dp: req.body.dp,
            idpresident: req.body.idpresident,
            paymentstatus: req.body.paymentstatus,
            status: 'active'

        })
        .then(function(result) {
            console.log(result);
            // res.json('land Added Successfully');

        })
    knex('member_table')
        .where({ idmember: req.body.idbooking })
        .update({
            dueamount: req.body.rdueamount,
            totalamount: req.body.rtotalamount

        }).then(function(result) {
            console.log(result);
            // res.json('Receipt Added Successfully');

        })
    knex('approvalreceipt')
        .where({ idapprovalreceipt: req.body.idapprovalreceipt })
        .update({
            receiptapproval: 'approved'
        }).then(function(result) {
            console.log(result);
            res.json('Receipt Added Successfully');

        })
        //   var recadd= connection.query('insert into receipt(share,applicationfee,admissionfee,
        //     sharefee,welfarefund,idbooking,pname,psize,payamount,finalamt,paymode,bankname,paydate,
        //     dd,tid,cno,projectprice,receiptno,paybranch,dp,idpresident,paymentstatus,status)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        // [req.body.share,req.body.applicationfee,req.body.admissionfee,req.body.sharefee,
        //   req.body.welfarefund,req.body.idbooking,req.body.pname,
        //   req.body.psize,req.body.payamount,req.body.payamount,req.body.paymode,
        //   req.body.bankname,nowdate,
        // req.body.dd,req.body.tid,req.body.cno,req.body.pprice,req.body.receiptno,req.body.paybranch,
        // req.body.dp,req.body.idpresident,req.body.paymentstatus,'active'],function(err,result1){
        // console.log(recadd);
        // var abc1 = connection.query('update member_table set dueamount=?,totalamount=? where idmember=?',
        // [req.body.rdueamount,req.body.rtotalamount,req.body.idbooking],function(err,result2){
        //   console.log(abc1);

    // })
    //  var as= connection.query('update approvalreceipt set receiptapproval=? where idapprovalreceipt=?',
    //   ['approved',req.body.idapprovalreceipt],function(err,result1){
    //     console.log(as);

    //   })

    // })
});




router.post('/rejectreceipt', function(req, res) {
    knex('approvalreceipt')
        .where({ idapprovalreceipt: req.body.idapprovalreceipt })
        .update({
            receiptapproval: 'reject'
        }).then(function(result) {
            console.log(result);
            res.json('Receipt Added Successfully');

        })
        // connection.query('update approvalreceipt set receiptapproval=? where idapprovalreceipt=?',
        // ['reject',req.body.idapprovalreceipt],function(err,result1){

    // })
})


router.get('/getseniorityid', (req, res) => {

    knex.select()
        .from('member_table')
        .where({ selectstatus: 'active' })
        .then(function(result) {
            console.log(result);
            res.json(result);

        })
        // var query = 'SELECT sid FROM member_table';
        // connection.query(query,function (err, result) {
        //   res.json(result);
        // });
})



router.get('/getseniordetails/:id', (req, res) => {
    console.log(req.params.id);

    const uri = decodeURIComponent(req.params.id);
    knex.select()
        .from('member_table')
        .where({ sid: uri })
        .then(function(result) {
            console.log(result);
            res.json(result);

        })
        // var query = "SELECT * FROM member_table where sid='"+uri+"'";
        // console.log(query);
        // connection.query(query,function (err, result) {
        //   res.json(result);
        // });

})

router.post('/updateplot', function(req, res) {
    console.log(req.body);

    var date = req.body.dob;
    const nowdate = format.asString('yyyy-MM-dd', new Date(date));
    var date1 = req.body.pdate;
    const nowdate1 = format.asString('yyyy-MM-dd', new Date(date1));
    // var a = req.body.pprice - req.body.totalamount;
    knex('transfer')
        // .returning('id')
        .insert({
            name: req.body.tname,
            mobile: req.body.tmobile,
            email: req.body.temail,
            dob: nowdate,
            landline: req.body.landline,
            altmob: req.body.altmob,
            fathus: req.body.fathus,
            address: req.body.taddress,
            cname: req.body.tcname,
            designation: req.body.tdesignation,
            caddress: req.body.tcaddress,
            accno: req.body.taccno,
            ifsc: req.body.tifsc,
            branch: req.body.tbranch,
            pan: req.body.tpan,
            nname: req.body.tnname,
            age: req.body.tage,
            relation: req.body.trelation,
            raddress: req.body.traddress,
            pname: req.body.pname,
            psize: req.body.psize,
            site: req.body.site,
            sid: req.body.sid,
            mid: req.body.mid,
            idland: req.body.idland,
            mode: req.body.mode,
            bankname: req.body.bankname,
            pdate: nowdate1,
            dd: req.body.dd,
            tid: req.body.tid,
            cno: req.body.cno,
            payamount: req.body.payamount,
            share: req.body.share,
            applicationfee: req.body.applicationfee,
            admissionfee: req.body.admissionfee,
            sharefee: req.body.sharefee,
            welfarefund: req.body.welfarefund,
            finalamt: req.body.finalamt,
            dueamount: req.body.dueamount,
            dp: req.body.dp,
            membername1: req.body.membername1,
            memberage1: req.body.memberage1,
            memberrelation1: req.body.memberrelation1,
            membername2: req.body.membername2,
            memberage2: req.body.memberage2,
            memberrelation2: req.body.memberrelation2,
            totalamount: req.body.finalamt,
            password: req.body.password,
            idpresident: req.body.idpresident,
            selectstatus: 'active',
            transferstatus: 'active',
            receiptno: req.body.receiptno,
            paybranch: req.body.paybranch,
            pprice: req.body.pprice,
            introducer1: req.body.introducer1,
            introducer2: req.body.introducer2,
            reason: req.body.reason,
            userid: req.body.idmember,
            pastname: req.body.name
        })

    .then(function(result) {
        console.log(result);
        res.json(result);

    })


    //   var abc =connection.query('insert into transfer(name,mobile,email,dob,landline,altmob,fathus,address,cname,designation,caddress,accno,ifsc,branch,pan,nname,age,relation,raddress,pname,psize,site,sid,mid,idland,mode,bankname,pdate,dd,tid,cno,payamount,share,applicationfee,admissionfee,sharefee,welfarefund
    //,finalamt,dueamount,dp,membername1,memberage1,memberrelation1,membername2,memberage2,
    //memberrelation2,totalamount,password,idpresident,transferstatus,receiptno,paybranch
    //,pprice,introducer1,introducer2,reason,userid,pastname) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    //   [req.body.tname,req.body.tmobile,req.body.temail,nowdate,req.body.landline,
    //     req.body.altmob,req.body.fathus,req.body.taddress,req.body.tcname,req.body.tdesignation,
    //     req.body.tcaddress,req.body.taccno,req.body.tifsc,req.body.tbranch,req.body.tpan,req.body.tnname,
    //     req.body.tage,req.body.trelation,req.body.traddress,req.body.pname,req.body.psize,req.body.site,
    //     req.body.sid,req.body.mid,req.body.idland,req.body.mode,req.body.bankname,nowdate1,
    //     req.body.dd,req.body.tid,req.body.cno,req.body.payamount,req.body.share,
    //     req.body.applicationfee,req.body.admissionfee,req.body.sharefee,req.body.welfarefund,
    //     req.body.finalamt,req.body.dueamount,req.body.dp,req.body.membername1,req.body.memberage1,
    //     req.body.memberrelation1,req.body.membername2,req.body.memberage2,req.body.memberrelation2,
    //     req.body.finalamt,req.body.password,req.body.idpresident,'active',
    //req.body.receiptno,req.body.paybranch,req.body.pprice,
    //req.body.introducer1,req.body.introducer2,req.body.reason,req.body.idmember,req.body.name],function(err,result){

    // console.log(abc);



    //     })
});

router.get('/gettransferapproval/:pagesize/:page', (req, res) => {
    console.log("hi");
    const pageSize = req.params.pagesize;
    const currentPage = req.params.page;
    const skip = (pageSize * (currentPage - 1))
    knex.select()
        .from('transfer')
        .join('project', 'project.idproject', 'transfer.pname')
        .join('plotsize', 'plotsize.idplotsize', 'transfer.psize')
        .join('land', 'land.idland', 'transfer.idland')
        .where({ transferstatus: 'active' })
        .then(function(result) {

            knex.select()
                .from('transfer')
                .join('project', 'project.idproject', 'transfer.pname')
                .join('plotsize', 'plotsize.idplotsize', 'transfer.psize')
                .join('land', 'land.idland', 'transfer.idland')
                .where({ transferstatus: 'active' })
                .count({ a: 'transfer.idtransfer' })

            .then(function(re) {

                // console.log(result); 
                res.status(200).json({
                    message: "Memberlists fetched",
                    posts: result,
                    maxPosts: re[0].a
                });
            })
        })
})

// router.get('/gettransferapproval/:pagesize/:page',(req,res)=>{
//   console.log("transferapproval");
//   const pageSize = req.params.pagesize;
//   const currentPage = req.params.page;

//   const skip = (pageSize*(currentPage-1))

//   const postQuery = "Select  m.*,p.*,pl.*,l.* from transfer as m join project as p 
//join plotsize as pl join land as l 
//where m.transferstatus='active'  and p.idproject=m.pname and pl.idplotsize=m.psize 
//and m.idland=l.idland  LIMIT  "+skip+","+pageSize+"";
//   console.log(postQuery);
//   connection.query(postQuery,function(err,res1){
//       console.log(res1.length);
//       // console.log(postQuery)
//       const count = "select COUNT(*) as c from transfer where transferstatus='active'  ";
//       connection.query(count,function(err,res2){
//           console.log(res2[0].c);
//           res.status(200).json({
//               message: "Posts fetched successfully!",
//               posts: res1,
//               maxPosts: res2[0].c
//             });
//       })

//   })
// })






router.post('/approvetransfer', function(req, res) {
    console.log(req.body);
    var date = req.body.dob;
    const nowdate = format.asString('yyyy-MM-dd', new Date(date));
    knex('member_table')
        .where({ idmember: req.body.userid })
        .update({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            dob: nowdate,
            landline: req.body.landline,
            altmob: req.body.altmob,
            fathus: req.body.fathus,
            address: req.body.address,
            cname: req.body.cname,
            designation: req.body.designation,
            caddress: req.body.caddress,
            accno: req.body.accno,
            ifsc: req.body.ifsc,
            branch: req.body.branch,
            pan: req.body.pan,
            nname: req.body.nname,
            age: req.body.age,
            relation: req.body.relation,
            raddress: req.body.raddress,
            site: req.body.site,
            membername1: req.body.membername1,
            memberage1: req.body.memberage1,
            memberrelation1: req.body.memberrelation1,
            membername2: req.body.membername2,
            memberage2: req.body.memberage2,
            memberrelation2: req.body.memberrelation2
        }).then(function(result) {
            console.log(result);
            res.json('Receipt Added Successfully');
        })
    knex('transfer')
        .where({ idtransfer: req.body.idtransfer })
        .update({
            transferstatus: 'approved',
            selectstatus: 'active'
        }).then(function(result) {
            console.log(result);

        })
        //   var abc = connection.query('update member_table set name=?,mobile=?,email=?,dob=?,
        //   landline=?,altmob=?,fathus=?,address=?,cname=?,designation=?,caddress=?,accno=?,
        //   ifsc=?,branch=?,pan=?,nname=?,age=?,relation=?,raddress=?,site=?,membername1=?,
        //   memberage1=?,memberrelation1=?,membername2=?,memberage2=?,memberrelation2=? where idmember=?',
        // [req.body.name,req.body.mobile,req.body.email,nowdate,req.body.landline,req.body.altmob,
        //   req.body.fathus,req.body.address,req.body.cname,req.body.designation,req.body.caddress,
        //   req.body.accno,req.body.ifsc,req.body.branch,req.body.pan,req.body.nname,req.body.age,
        //   req.body.relation,req.body.raddress,
        //   req.body.site,req.body.membername1,
        //   req.body.memberage1,req.body.memberrelation1,req.body.membername2,req.body.memberage2,
        //   req.body.memberrelation2,
        //   req.body.userid
        //     ],function(err,result){
        //       console.log(abc)
        //       var q= connection.query('update transfer set transferstatus=?,selectstatus=? where idtransfer=?',
        //       ['approved','active',req.body.idtransfer],function(err,result1){  
        //         console.log(q);
        //       })


    //     })
});


router.post('/rejecttransfermember', function(req, res) {

    knex('transfer')
        .where({ idtransfer: req.body.idtransfer })
        .update({
            transferstatus: 'reject',
            selectstatus: 'reject'
        }).then(function(result) {
            console.log(result);
            res.json('Receipt Added Successfully');

        })
        //  var q= connection.query('update transfer set transferstatus=?,selectstatus=? where idtransfer=?',
        //     ['reject','reject',req.body.idtransfer],function(err,result1){  
        //     })
});



router.get('/getaffidivate', (req, res) => {
    knex.select()
        .from('affidivate')
        // .where({sid:uri})
        .then(function(result) {
            console.log(result);
            res.json(result);

        })


});




router.post('/superadmin', (req, res) => {
    console.log(req.body.mid);
    console.log(req.body.password);
    username = req.body.mid;

    const password = (sha1(req.body.password));
    console.log(password);


    knex.select()
        .from('admin').where({ username: username, password: password, role: 'SUPERADMIN' })
        .then(function(result) {
            console.log(result);
            res.json(result);
            //     })
            //     var query = 'SELECT * FROM admin where username = ? and password = ? and role=?';
            //     connection.query(query,[username,password,'SUPERADMIN'] ,function (err, result) {
            // console.log(query);
            // if(result==''||result== undefined || result==0 || err){
            //   console.log("fail");
            //   res.json({message:"INVALID USER",status:false});
            //   }else{
            //     console.log("pass");
            //       res.json({
            //           result:result,      
            //           status:true,    
            //   }
            //       );
            //    }



        })


})

router.get('/presidentlist1', (req, res) => {
    knex.select()
        .from('president').where({ status: 'active' })
        .then(function(result) {
            console.log(result);
            res.json(result);
        })
        // connection.query('select * from president where status="active"',function(err, result1){
        //     //console.log('');
        //     res.json(result1);
        // });

});


module.exports = router;