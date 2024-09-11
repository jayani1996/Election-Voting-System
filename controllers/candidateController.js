const dbConn  = require('../services/dbConnection');
const _ = require('lodash');

exports.get_candidate_list = async function (req, res) {
    dbConn.query('SELECT * FROM candidate CROSS JOIN party WHERE candidate.party = party.id;', function(err, results, fields) {
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
    });
}

exports.create_candidate = async function (req, res) {
    let {cname, cprovince, party} = req.body;
    let cimage = "/images/candidates/" + req.file.filename;
    let candidate_data = {
        cname,
        cprovince,
        cimage_url: cimage,
        party
    }

    // insert query
    dbConn.query('INSERT INTO candidate  SET ?', candidate_data, function(err, result) {
        //if(err) throw err
        if (err) {
            res.send({
                error: true,
                message: 'Invalid data'
            })
        } else {
            res.send({
                error: false,
                message: 'Success'
            });
        }
    })
}

exports.get_candidate = async function (req, res) {
    let candidateID = req.body.cid
    dbConn.query('SELECT * FROM candidate CROSS JOIN party WHERE candidate.party = party.id AND candidate.cid=' + candidateID , function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'No data'
            })
        } else {
            if(results.length > 0){
                req.session.user = results[0];
                res.send({
                    error: false,
                    message: 'data valid',
                    data: results
                })
            } else {
                res.send({
                    error: true,
                    message: 'data invalid'
                })
            }
        }
    });
}

exports.delete_candidate = async function (req, res) {
    let {cid} = req.body;
    dbConn.query('DELETE FROM candidate WHERE cid = ' + cid, function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'No party'
            })
        } else {
            res.send({
                error: false,
                message: 'success',
                data: results
            })
        }
    });
}

exports.update_candidate = async function (req, res) {
    let {cid, cname, cprovince, party } = req.body;
    let query = 'UPDATE candidate SET cname = "' + cname + '", cprovince = "' + cprovince + '", party = ' + party ;
    if(req.file) {
        query += ', cimage_url = "' + '/images/candidates/' + req.file.filename + '"'
    }
    query += ' WHERE cid = ' + cid

    // insert query
    dbConn.query(query, function(err, result) {
        //if(err) throw err
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'Invalid data'
            })
        } else {
            res.send({
                error: false,
                message: 'Success'
            });
        }
    })
}
