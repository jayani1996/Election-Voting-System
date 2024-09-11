let globalPartyList = []

$(document).ready(function(){
    // call the get data API on load page
    getParties();
    loadElectionTable();
    loadPartyTable();
    loadCandidateTable();

    $('#candidateModal, #createElectionModal, #partyModal').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
    })
});

function getParties() {
    $.ajax({
        type: "GET",
        url: "/get_parties",
    }).done(function(response) {
        if(response.error) {
            console.log("partyListError")
        } else {
            let partyList = response.data;
            globalPartyList = partyList;
            let options = setParties(partyList);
            $('#cparty').html(options);
        }
    })
}

function loadPartyTable() {
    $.ajax({
        type: "GET",
        url: "/get_parties",
    }).done(function(response) {
        if(response.error) {
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            $('#partyTable').DataTable( {
                data: response.data,
                "bDestroy": true,
                columns: [
                    { data: 'id' },
                    {
                        data: 'pimage_url',
                        render: function ( data, type, row ) {
                             return '<div class="flex items-center text-sm">' +
                                        '<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block" >' +
                                        '<img class="object-cover w-full h-full rounded-full" src="'+ data + '"' +
                                            'alt="" loading="lazy"/>' +
                                        '<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" ></div>' +
                                        '</div>' +
                                    '</div>'
                        }
                    },
                    { data: 'pname' },
                    { data: 'pNo'},
                    { 
                        data: 'id',
                        render: function ( data, type, row ) {
                            return '<div class="flex items-center space-x-4 text-sm">' +
                            '<button onclick="openUpdateModal('+ data + ')"' +
                              'class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-orange-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"' +
                              'aria-label="Edit">' +
                              '<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">' +
                                '<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"' +
                                '></path>' +
                              '</svg>' +
                            '</button>' +
                            '<button onclick="deleteParty('+ data +')" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Delete">' +
                              '<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">' +
                                '<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>' +
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

$("#partyCreate").submit(function(e) {
    e.preventDefault();
    var formData = new FormData($(this)[0]);

    var name = $("#name").val();
    var pimage = $('#image').prop('files')[0];
    var pnumber = $("#pnumber").val();

    if(!validateUser_input(name)){
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".nameError").text("Name required !!");
        $(".nameError").show();
    } else if(!validateUser_input(pimage)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".fileError").text("Image required !!");
        $(".fileError").show();
    } else if(!validateFileType(pimage.type)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".fileError").text("Invalid Image !!");
        $(".fileError").show();
    } else if(!validateUser_input(pnumber)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".pnumberError").text("Party No. required !!");
        $(".pnumberError").show();
    } else {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        formData.append('pname', name);
        formData.append('pno', pnumber);
        $.ajax({
            type: "POST",
            url: "/add_party",
            processData: false,
            contentType: false,
            data: formData
        }).done(function(response) {
            if(response.error) {
                Toast.fire({
                    icon: 'error',
                    title: response.message
                })
            } else {
                Toast.fire({
                    icon: 'success',
                    title: 'Created successfully'
                })
                loadPartyTable();
                $('#partyModal').modal('hide'); 
            }
        })
    }
})

function openUpdateModal(partyData) {
    $('#updatepartyModal').modal('show');
    $.ajax({
        type: "POST",
        data: {
            id: partyData
        },
        url: "/get_party",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
           var partyDetails = response.data[0];
           $("#pname").val(partyDetails.pname);
           $("#ppnumber").val(partyDetails.pNo);
           $("#pid").val(partyDetails.id);
        }
    })
}

$("#updateParty").submit(function(e) {
    e.preventDefault();
    var formData2 = new FormData($(this)[0]);

    var id = $("#pid").val();
    var name = $("#pname").val();
    var pimage = $('#pimage').prop('files')[0];
    var pnumber = $("#ppnumber").val();

    if(!validateUser_input(name)){
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".nameError2").text("Name required !!");
        $(".nameError2").show();
    } else if(pimage && !validateFileType(pimage.type)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".fileError2").text("Invalid Image !!");
        $(".fileError2").show();
    } else if(!validateUser_input(pnumber)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".usernameError2").text("Party No. required !!");
        $(".usernameError2").show();
    } else {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        formData2.append('id', id);
        formData2.append('pname', name);
        formData2.append('pno', pnumber);

        $.ajax({
            method: "POST",
            url: "/update_party",
            processData: false,
            contentType: false,
            data: formData2
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
                loadPartyTable();
                $('#updatepartyModal').modal('hide'); 
            }
        })
    }
})

function setParties(partyList) {
    let options = '';
    partyList.forEach(element => {
        options += '<option value="' + element.id + '">'+ element.pname +'</option>'
    });
    return options
}


// ///////////// CANDIDATE SECTION

function loadCandidateTable() {
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
            $('#candidateTbl').DataTable( {
                data: response.data,
                "bDestroy": true,
                columns: [
                    { data: 'cid' },
                    {
                        data: 'cimage_url',
                        render: function ( data, type, row ) {
                             return '<div class="flex items-center text-sm">' +
                                        '<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block" >' +
                                            '<img class="object-cover w-full h-full rounded-full" src="'+ data + '"' +
                                                'alt="" loading="lazy"/>' +
                                            '<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" ></div>' +
                                        '</div>' +
                                        '<div>' +
                                            '<p class="font-semibold">' + row.cname + '</p>' +
                                            '<p class="text-xs text-gray-600 dark:text-gray-400">' +
                                                row.cprovince +
                                            '</p>' +
                                        '</div>' +
                                    '</div>'
                        }
                    },
                    { 
                        data: 'image',
                        render: function ( data, type, row ) {
                            return '<div class="flex items-center text-sm">' +
                                       '<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block" >' +
                                           '<img class="object-cover w-full h-full rounded-full" src="'+ data + '"' +
                                               'alt="" loading="lazy"/>' +
                                           '<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" ></div>' +
                                       '</div>' +
                                       '<div>' +
                                           '<p class="font-semibold">' + row.pname + '</p>' +
                                       '</div>' +
                                   '</div>'
                       }
                    },
                    { 
                        data: 'cid',
                        render: function ( data, type, row ) {
                            return '<div class="flex items-center space-x-4 text-sm">' +
                            '<button onclick="openUpdateCandidateModal('+ data + ')"' +
                              'class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-orange-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"' +
                              'aria-label="Edit">' +
                              '<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">' +
                                '<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"' +
                                '></path>' +
                              '</svg>' +
                            '</button>' +
                            '<button onclick="deleteCandidate('+ data +')" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Delete">' +
                              '<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">' +
                                '<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>' +
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

function openCandidateCreateModal() {
    $('#candidateModal123').modal('show');
}

$("#candidateCreate").submit(function(e) {
    e.preventDefault();
    var formData = new FormData($(this)[0]);

    var cname = $("#cname").val();
    var cimage = $('#cimage').prop('files')[0];
    var cprovince = $("#cprovince").val();
    var cparty = $("#cparty").val();

    if(!validateUser_input(cname)){
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".cnameError").text("Name required !!");
        $(".cnameError").show();
    } else if(!validateUser_input(cimage)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".cfileError").text("Image required !!");
        $(".cfileError").show();
    } else if(!validateFileType(cimage.type)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".cfileError").text("Invalid Image !!");
        $(".cfileError").show();
    } else {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        formData.append('cname', cname);
        formData.append('cprovince', cprovince);
        formData.append('party', cparty);
        $.ajax({
            type: "POST",
            url: "/add_candidate",
            processData: false,
            contentType: false,
            data: formData
        }).done(function(response) {
            if(response.error) {
                Toast.fire({
                    icon: 'error',
                    title: response.message
                })
            } else {
                Toast.fire({
                    icon: 'success',
                    title: 'Created successfully'
                })
                $('#candidateModal123').modal('hide'); 
                loadCandidateTable();
            }
        })
    }
})

function openUpdateCandidateModal(candidateData) {
    $('#updateCandidateModal').modal('show');
    let options = setParties(globalPartyList);
    $('#ccparty').html(options);
    $.ajax({
        type: "POST",
        data: {
            cid: candidateData
        },
        url: "/get_candidate",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
           var candidateDetails = response.data[0];
           $("#cid").val(candidateDetails.cid);
           $("#ccname").val(candidateDetails.cname);
           $("#ccparty").val(candidateDetails.party);
           $("#ccprovince").val(candidateDetails.cprovince);
        }
    })
}

$("#candidateUpdate").submit(function(e) {
    e.preventDefault();
    var formData2 = new FormData($(this)[0]);

    var id = $("#cid").val();
    var name = $("#ccname").val();
    var cimage = $('#ccimage').prop('files')[0];
    var cparty = $("#ccparty").val();
    var cprovince = $("#ccprovince").val();

    if(!validateUser_input(name)){
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".nameError2").text("Name required !!");
        $(".nameError2").show();
    } else if(cimage && !validateFileType(cimage.type)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".fileError2").text("Invalid Image !!");
        $(".fileError2").show();
    } else {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        formData2.append('cid', id);
        formData2.append('cname', name);
        formData2.append('cprovince', cprovince);
        formData2.append('party', cparty);

        $.ajax({
            method: "POST",
            url: "/update_candidate",
            processData: false,
            contentType: false,
            data: formData2
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
                loadCandidateTable();
                $('#updateCandidateModal').modal('hide'); 
            }
        })
    }
})

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
            $('#electionTbl').DataTable( {
                data: response.data,
                "bDestroy": true,
                columns: [
                    { data: 'eid' },
                    { data: 'e_name' },
                    { data: 'e_type'},
                    { data: 'startdate'},
                    { data: 'enddate'},
                    { 
                        data: 'eid',
                        render: function ( data, type, row ) {
                            return '<div class="flex items-center space-x-4 text-sm">' +
                            '<button onclick="openUpdateElectionModal('+ data + ')"' +
                              'class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-orange-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"' +
                              'aria-label="Edit">' +
                              '<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">' +
                                '<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"' +
                                '></path>' +
                              '</svg>' +
                            '</button>' +
                            '<button onclick="deleteElection('+ data +')" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Delete">' +
                              '<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">' +
                                '<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>' +
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

$("#createElection").click(function(){
    var ename = $("#ename").val();
    var etype = $("#etype").val();
    var startdate = $("#estart").val();
    var enddate = $("#eend").val();

    if(!validateUser_input(ename)){
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".elecnameError").text("Name required !!");
        $(".elecnameError").show();
    } else if(!validateUser_input(startdate)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".elecStartError").text("Date required !!");
        $(".elecStartError").show();
    } else if(!validateUser_input(enddate)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".elecEndError").text("Date required !!");
        $(".elecEndError").show();
    }else {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        
        $.ajax({
            method: "POST",
            url: "/add_election",
            data: {
                e_name: ename,
                e_type : etype,
                startdate: startdate,
                enddate: enddate
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
                    title: 'Created successfully'
                })
                loadElectionTable();
                $('#createElectionModal').modal('hide'); 
            }
        })
    }
})

function openUpdateElectionModal(electionId) {
    $('#updateElectionModal').modal('show');
    $.ajax({
        type: "POST",
        data: {
            eid: electionId
        },
        url: "/get_election",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
           var electionDetails = response.data[0];
           $("#eid").val(electionDetails.eid);
           $("#eename").val(electionDetails.e_name);
           $("#eestart").val(electionDetails.startdate);
           $("#eetype").val(electionDetails.e_type);
           $("#eeend").val(electionDetails.enddate);
        }
    })
}

$("#updateElection").click(function(){
    var eid = $("#eid").val();
    var ename = $("#eename").val();
    var etype = $("#eetype").val();
    var startdate = $("#eestart").val();
    var enddate = $("#eeend").val();

    if(!validateUser_input(ename)){
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".eelecnameError").text("Name required !!");
        $(".eelecnameError").show();
    } else if(!validateUser_input(startdate)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".eelecStartError").text("Date required !!");
        $(".eelecStartError").show();
    } else if(!validateUser_input(enddate)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".eelecEndError").text("Date required !!");
        $(".eelecEndError").show();
    } else {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        
        $.ajax({
            method: "POST",
            url: "/update_election",
            data: {
                eid: eid,
                e_name: ename,
                e_type : etype,
                startdate: startdate,
                enddate: enddate
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
                $('#updateElectionModal').modal('hide'); 
            }
        })
    }
})

function showModal(modalId) {
    $('#'+ modalId).modal('show');
}

function closeModal(modalId) {
    $('#'+ modalId).modal('hide');
}