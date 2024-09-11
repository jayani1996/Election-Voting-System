var electionList = [];
var partyAllList = [];
var candidateList = [];
var electionmapping = []
var processedData = []
$(document).ready(function(){
    // call the get data API on load page
    getAllcandidates();
    getAllparties();
    loadElectionTable();
});

function loadElectionTable() {
    $.ajax({
        type: "GET",
        url: "/get_elections",
    }).done(function(response) {
        if(response.error) {
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            electionList = response.data
            $.ajax({
                type: "GET",
                url: "/get_election_candidates",
            }).done(function(response3) {
                if(response3.error) {
                    Toast.fire({
                        icon: 'error',
                        title: response3.message
                    })
                } else {
                    processedData = []
                    electionmapping = response3.data
                    electionList.forEach(election => {
                        processedData.push({
                            ...election,
                            candidates: _.filter(electionmapping, function(o) { return o.eid == election.eid; })
                        })
                    });

                    console.log(processedData, "processedData")
                    $('#electionTbl').DataTable( {
                        data: processedData,
                        "pageLength": 2,
                        "lengthMenu": [ 2, 10, 25, 50, 75, 100 ],
                        "bDestroy": true,
                        columns: [
                            { data: 'eid' },
                            { data: 'e_name' },
                            { data: 'e_type'},
                            { data: 'startdate'},
                            { 
                                data: 'eid',
                                render: function ( data, type, row ) {
                                    let element = '<ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">'
                                    row.candidates.forEach(candidate => {
                                        element += '<li class="pb-3 sm:pb-4">' + 
                                            '<div class="flex items-center space-x-4">' +
                                                '<div class="flex-shrink-0">' +
                                                    '<img class="w-8 h-8 rounded-full" src="' + candidate.cimage_url + '" alt="Neil image">' +
                                                '</div>' + 
                                                '<div class="flex-1 min-w-0">' +
                                                    '<input type="hidden" value="'+candidate.eid+'-'+candidate.cid+'">' +
                                                    '<p class="text-sm font-medium text-gray-900 truncate dark:text-white">' + 
                                                        candidate.cname + 
                                                    '</p>' + 
                                                    '<p class="text-sm text-gray-500 truncate dark:text-gray-400">' + 
                                                        candidate.pname + 
                                                    '</p>' + 
                                                '</div>' + 
                                            '</div>' + 
                                        '</li>'
                                    })
                                    element += '</ul>'
                                    return element
                               }
                            },
                            { 
                                data: 'eid',
                                render: function ( data, type, row ) {
                                    return '<div class="flex items-center space-x-4 text-sm">' +
                                    '<button onclick="openUpdateElectionModal('+ data + ',`'+ row.e_type +'`)"' +
                                      'class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-orange-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"' +
                                      'aria-label="Edit">' +
                                      '<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">' +
                                        '<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"' +
                                        '></path>' +
                                      '</svg>' +
                                    '</button>' +
                                  '</div>'
                               }
                            }
                        ]
                    } );
                }
            })
        }
    })
}

function closeModalMapping(){
    $('#updateElectionMappingModal').modal('hide');
}

function getAllcandidates() {
    $.ajax({
        type: "GET",
        url: "/get_candidates",
    }).done(function(response) {
        if(response.error) {
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            candidateList = response.data
        }
    })
}

function getAllparties() {
    $.ajax({
        type: "GET",
        url: "/get_parties_with_candidates",
    }).done(function(response) {
        if(response.error) {
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            partyAllList = response.data;
        }
    })
}

function openUpdateElectionModal(electionId, electionType) {
    $('#updateElectionMappingModal').modal('show');
    var selectedElection = _.find(processedData, function(o) { return o.eid == electionId });
    $("#eid").val(selectedElection.eid);
    $("#ename").val(selectedElection.e_name);
    $("#estart").val(selectedElection.startdate);
    $("#etype").val(selectedElection.e_type);
    var groupedParties = []
    var parties =  partyAllList;
    parties.forEach(element => {
        groupedParties.push({
            pid: element.id,
            pname: element.pname,
            candidates : _.filter(candidateList, function(o) { return o.pname == element.pname; })
        })
    });
    let inputs = '';
    groupedParties.forEach(element => {
        if(selectedElection.e_type == "provincial") {
            var multiVal = _.map(_.filter(selectedElection.candidates, function(o) { return o.id == element.pid }), 'cid');
        } 
        var selectedParty = _.find(selectedElection.candidates, function(o) { return o.id == element.pid });
        if(!selectedParty) {
            var selectedParty = {
                cid: 0
            }
        }
        
        inputs += '<div class="col-6 form-group">' +
                    '<label for="recipient-name" class="text-sm col-form-label">' + element.pname + '</label>' +
                    '<select ' + (electionType == "provincial" ? ('multiple="multiple"' ) : ' ') + ' class="form-select form-control form-control-sm select2Inp" id="party-' + element.pid + '" name="party-' + element.pid + '">'
                        element.candidates.forEach(candidate => {
                            if(selectedElection.e_type == "provincial"){
                                if(multiVal.indexOf(candidate.cid) >= 0) {
                                    inputs += '<option value="' + candidate.cid + '" selected >' + candidate.cname + '</option>' 
                                } else {
                                    inputs += '<option value="' + candidate.cid + '">' + candidate.cname + '</option>'  
                                }
                            } else {
                                if(candidate.cid == selectedParty.cid) {
                                    inputs += '<option value="' + candidate.cid + '" selected >' + candidate.cname + '</option>' 
                                } else {
                                    inputs += '<option value="' + candidate.cid + '">' + candidate.cname + '</option>'  
                                }
                            }
                        });
        inputs += '</select> </div>'
    });
    $('.inputData').html(inputs)
}

$("#updateMapping").submit(function(e) {
    var data = {};
    e.preventDefault();
    $.each($(this).serializeArray(), function(i, field) { // get all input fields along with the values
        console.log(field)
        var avoid = "[]";
        if (field.name.includes('party-')) {
            data[field.name] = {
                val: $('#'+field.name).val(),
                prev: $('#'+field.name).attr("data-prevcid")
            }
        } else {
            data[field.name] = field.value;
        }
    });
    var json = JSON.stringify(data); 
    console.log(json)
    $.ajax({
        type: "POST",
        url: "/update_election_mapping",
        data: {
            "formData": json
        }
    }).done(function(response) {
        if(response.error) {
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            Toast.fire({
                icon: 'success',
                title: 'Updated successfully'
            })
            loadElectionTable();
            $('#updateElectionMappingModal').modal('hide'); 
        }
    })
    
})