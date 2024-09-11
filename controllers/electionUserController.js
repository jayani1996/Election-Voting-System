const dbConn  = require('../services/dbConnection');
const _ = require('lodash');

/////////////election related functions
exports.get_election_mapping_list = async function (req, res) {
    dbConn.query('SELECT * FROM election_candidate', function(err, results, fields) {
        if (err) {
        console.log(err)
        res.send({
            error: true,
            message: 'No data'
        })
        } else {
            res.send({
                error: false,
                message: 'data valid',
                data: data
            })
        }
    });
}

exports.get_election_candidate_list = async function (req, res) {
    dbConn.query('SELECT * FROM election_candidate ec INNER JOIN candidate cd INNER JOIN party pt ON pt.id=cd.party ON cd.cid = ec.cid', function(err, results, fields) {
        if (err) {
        console.log(err)
        res.send({
            error: true,
            message: 'No data'
        })
        } else {
            res.send({
                error: false,
                message: 'data valid',
                data: results
            })
        }
    })

}

exports.update_election_candidates = async function (req, res) {
    let {formData} = req.body
    formData = JSON.parse(formData);
    console.log(formData)
    let query = ""
    query += 'DELETE FROM election_candidate WHERE eid=' + formData.eid + ';'
    if(formData.etype == 'provincial') {
        for (let key in formData) {
            if(key.includes("party-")) {
                formData[key].val.forEach(element => {
                    query += 'INSERT INTO election_candidate (cid, eid) VALUES ('+ element +','+ formData.eid +');'
                });
            }
        }
    } else {
        for (let key in formData) {
            if(key.includes("party-")) {
                query += 'INSERT INTO election_candidate (cid, eid) VALUES ('+ formData[key].val +','+ formData.eid +');'
            }
        }
    }
    console.log(query)
    dbConn.query(query, function(err, results, fields) {
        if (err) {
        console.log(err)
        res.send({
            error: true,
            message: 'No data'
        })
        } else {
            res.send({
                error: false,
                message: 'data valid',
                data: results
            })
        }
    })

}