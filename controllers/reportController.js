const dbConn  = require('../services/dbConnection');

exports.get_election_results = async function (req, res) {
    let {eid} = req.body;
    let query = 
            'SELECT COUNT(uv.vote) AS vote_count, uv.candidate_party_id, e.e_name, e.e_type, e.startdate, c.cid, c.cname, c.cprovince, c.cimage_url, p.pname, p.pNo, p.pimage_url' + 
            ' FROM user_votes uv' + 
            ' INNER JOIN election e' +
            ' ON uv.election_id = e.eid' +
            ' INNER JOIN candidate c' +
            ' ON uv.vote = c.cid' +
            ' INNER JOIN party p' +
            ' ON uv.candidate_party_id = p.id' +
            ' WHERE uv.election_id=' + eid +
            ' GROUP BY c.cid, p.id, p.pname, p.pNo, p.pimage_url'
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
    });
}

exports.get_vote_list = async function (req, res) {
    let {eid} = req.body;
    dbConn.query('SELECT * FROM user_votes WHERE election_id=' + eid +'; SELECT * FROM voting_user;', function(err, results, fields) {
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
                data: {
                    votingData : results[0],
                    votingUsers: results[1]
                }

            })
        }
    });
}