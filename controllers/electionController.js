const dbConn  = require('../services/dbConnection');
const _ = require('lodash');
const moment = require('moment');

exports.get_party_list = async function (req, res) {
    dbConn.query('SELECT * FROM party', function(err, results, fields) {
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

exports.get_parties_with_candidates = async function (req, res) {
    dbConn.query('SELECT p.id, p.pname, p.pNo, p.pimage_url FROM candidate c INNER JOIN party p ON p.id=c.party GROUP BY p.id, p.pname, p.pNo, p.pimage_url', function(err, results, fields) {
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

exports.create_party = async function (req, res) {
    let {pname, pno} = req.body;
    let image = "/images/parties/" + req.file.filename;
    let party_data = {
        pname,
        pNo: pno,
        pimage_url: image
    }

    // insert query
    dbConn.query('INSERT INTO party SET ?', party_data, function(err, result) {
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

exports.get_party = async function (req, res) {
    let partyID = req.body.id
    dbConn.query('SELECT * FROM party WHERE id='+ partyID , function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'No data'
            })
        } else {
            if(results.length > 0){
                res.send({
                    error: false,
                    message: 'party valid',
                    data: results
                })
            } else {
                res.send({
                    error: true,
                    message: 'party invalid'
                })
            }
        }
    });
}

exports.delete_party = async function (req, res) {
    let {pid} = req.body;
    dbConn.query('DELETE FROM party WHERE id = ' + pid, function(err, results, fields) {
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

exports.update_party = async function (req, res) {
    let {id, pname, pno, } = req.body;
    let query = 'UPDATE party SET pname = "' + pname + '", pNo = ' + pno ;
    if(req.file) {
        query += ', pimage_url = "' + '/images/parties/' + req.file.filename + '"'
    }
    query += ' WHERE id = ' + id

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

// /////////////election related functions
exports.get_election_list = async function (req, res) {
    dbConn.query('SELECT * FROM election ORDER BY eid DESC', function(err, results, fields) {
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

exports.create_election = async function (req, res) {
    let {e_name, e_type, startdate, enddate} = req.body;
    let election_data = {
        e_name,
        e_type,
        startdate,
        enddate
    }

    // insert query
    dbConn.query('INSERT INTO election SET ?', election_data, function(err, result) {
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

exports.get_election = async function (req, res) {
    let eid = req.body.eid
    dbConn.query('SELECT * FROM election WHERE eid='+ eid , function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'No data'
            })
        } else {
            if(results.length > 0){
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

exports.delete_election = async function (req, res) {
    let {eid} = req.body;
    dbConn.query('DELETE FROM election WHERE eid = ' + eid, function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'No data'
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

exports.update_election = async function (req, res) {
    let {e_name, e_type, startdate, eid, enddate} = req.body;
    let query = 'UPDATE election SET e_name = "' + e_name + '", e_type = "' + e_type + '", startdate = "' + startdate + '", enddate ="' + enddate + '" WHERE eid = ' + eid ;

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

exports.get_election_summery = async function (req, res) {
    let userObj = req.session.user;
    let userProvince = userObj.province
    dbConn.query('SELECT * FROM voting_user vu INNER JOIN user_votes v ON vu.vid=v.vuser_id INNER JOIN election e ON e.eid = v.election_id WHERE e.e_type="presidential" OR vu.province="'+ userProvince +'"; SELECT * FROM voting_user;' , function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'No data'
            })
        } else {
            if(results.length > 0){
                res.send({
                    error: false,
                    message: 'data valid',
                    data: {
                        votingData : results[0],
                        votingUsers: results[1]
                    }
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

exports.get_party_list_for_province = async function (req, res) {
    let province = req.session.user.province
    dbConn.query('SELECT COUNT(candidate.cname), party.id, party.pname, party.pNo, party.pimage_url FROM candidate INNER JOIN party ON candidate.party = party.id WHERE candidate.cprovince ="'+ province +'" GROUP BY party.id, party.pname, party.pNo, party.pimage_url;', function(err, results, fields) {
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