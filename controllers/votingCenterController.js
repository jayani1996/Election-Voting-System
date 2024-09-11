const dbConn  = require('../services/dbConnection');

exports.get_voting_center_list = async function (req, res) {
    dbConn.query('SELECT * FROM voting_center', function(err, results, fields) {
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

exports.get_voting_center = async function (req, res) {
    let centerID = req.body.id
    dbConn.query('SELECT * FROM voting_center WHERE center_id='+ centerID , function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'No user'
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
                    message: 'center ID invalid'
                })
            }
        }
    });
}

exports.create_voting_center = async function (req, res) {
    let {vcName, vcProvince} = req.body;
    let vc_data = {
        center_name: vcName,
        center_province: vcProvince
    }

    // insert query
    dbConn.query('INSERT INTO voting_center SET ?', vc_data, function(err, result) {
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

exports.update_voting_center = async function (req, res) {
    let {vcId, name, province} = req.body;
    let query = 'UPDATE voting_center SET center_name = "' + name + '", center_province = "' + province + '"';
    query += ' WHERE center_id = ' + vcId

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

exports.delete_center = async function (req, res) {
    let {vcID} = req.body;
    dbConn.query('DELETE FROM voting_center WHERE center_id = ' + vcID, function(err, results, fields) {
        if (err) {
            console.log(err)
            res.send({
                error: true,
                message: 'No users'
            })
        } else {
            res.send({
                error: false,
                message: 'data deleted',
                data: results
            })
        }
    });
}
