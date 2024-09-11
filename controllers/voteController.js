const { query } = require('express');
const dbConn  = require('../services/dbConnection');
const { forEach } = require('lodash');

exports.check_fingerprint = async function (req, res) {
    const { imageName, eid, vcenter} = req.body; // get the passed data from the front end
    dbConn.query('SELECT * FROM voting_user WHERE fingerprint_code = "' + imageName + '"', function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'error'
            })
        } else {
            if(results.length == 0){
                res.send({
                    error: true,
                    message: "Invalid Fingerprint !!"
                })
            } else {
                let votin_userID = results[0].vid;
                let votin_userCenter = results[0].user_vcenter;
                if(votin_userCenter == vcenter) {
                    dbConn.query('SELECT * FROM voting_user vu CROSS JOIN user_votes vv ON vu.vid=vv.vuser_id WHERE vv.election_id=' + eid + ' AND vu.vid=' + votin_userID, function(err, results2, fields) {
                        if (err) {
                            console.log(err)
                            res.send({
                                error: true,
                                message: 'error'
                            })
                        } else {
                            if(results2.length > 0){
                                res.send({
                                    error: true,
                                    message: 'Vote already given !!',
                                    data: results2
                                })
                            } else {
                                res.send({
                                    error: false,
                                    message: 'Data Available',
                                    data: results
                                })
                            }
                        }
                    });
                } else {
                    res.send({
                        error: true,
                        message: "Invalid Voting center !!"
                    })
                }
            }
        }
    })
}

exports.get_election_candidates = async function (req, res) {
    let { e_type, eid, partyID} = req.body; // get the passed data from the front end
    let province = req.session.user.province

    let query = ''
    if(e_type == "provincial") {
        // query = 'SELECT * FROM candidate INNER JOIN party ON candidate.party = party.id WHERE candidate.cprovince = "' + province + '" AND party.id='+partyID+';'
        query = 'SELECT * FROM election_candidate ec inner JOIN candidate cd inner JOIN party pt ON	pt.id = cd.party ON cd.cid = ec.cid WHERE ec.eid=' + eid + ' AND cd.cprovince = "' + province + '" AND pt.id='+partyID+';'
    } else {
        query = 'SELECT * FROM election_candidate ec inner JOIN candidate cd inner JOIN party pt ON	pt.id = cd.party ON cd.cid = ec.cid WHERE ec.eid=' + eid
    }

    dbConn.query(query, function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'error'
            })
        } else {
            if(results.length > 0){
                res.send({
                    error: false,
                    message: 'Data Available',
                    data: results
                })
            } else {
                res.send({
                    error: true,
                    message: 'No Data'
                })
            }
        }
    });

}

exports.store_vote_data = async function (req, res) {
    let { 
        eid,
        vid,
        votes
    } = req.body;
    votes = JSON.parse(votes)
    console.log(votes.length)
    console.log(votes)
    let query = ''
    if(votes.length == 1 && !votes[0].cid) {
        query += 'INSERT INTO user_votes (election_id, vuser_id, vote, candidate_party_id) VALUES (' + eid + ',' + vid + ', 0, NULL);'
    } else {
        votes.forEach(element => {
            query += 'INSERT INTO user_votes (election_id, vuser_id, vote, candidate_party_id) VALUES (' + eid + ',' + vid + ',' + element.cid + ','+ element.party +');' 
        });
    }

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