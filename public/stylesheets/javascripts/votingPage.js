let ElectionData = []
let voter = {}
let firstSelected = {}

$(window).on('load', function() {
    $('#myModal').modal('show');
    // loadVotingTable()
});

$(".submitBtn").click(function(){
    var filename = $('.fingerPrint').val().replace(/C:\\fakepath\\/i, '')
    var eid = getUrlParameter('eid');
    var vcenter = $('#userVcenter').val();

    if(!filename) {
        $(".fileError").text("Image required !!");
        $(".fileError").show();
    } else {
        $(".fileError").text("");
        $(".fileError").hide();
        enablepreloader('Please Wait While We Validate Your Fingerprint...');
        setTimeout(
            function() 
            {
                $.ajax({
                    type: "POST",
                    url: "/check_fingerprint",
                    data: {
                        imageName: filename,
                        eid: eid,
                        vcenter: vcenter
                    }
                }).done(function(response) {
                    disablePreloader();
                    if(response.error) {
                        console.log(response.error)
                        Toast.fire({
                            icon: 'error',
                            title: response.message
                        })
                    } else {
                        voter = response.data[0];
                        $('#myModal').modal('hide');
                        $(".voterName").text(response.data[0].fname);
                        getElectionData();
                        Toast.fire({
                            icon: 'success',
                            title: 'Logged successfully'
                        })
                    }
                })
            }, 2500);
    }

})

$(document.body).on("change", 'input[type="checkbox"]', function (e) {
    var inputName = $(this).attr("name");
    if ($(this).prop('checked') == false ) {
        $(this).prop('checked', true)
        Toast.fire({
            icon: 'info',
            title: "You cannot change once it is checked"
        })
    }
    var total=$('input[type="checkbox"]').not('input[name="rejected"]').filter(':checked').length
    if(inputName == 'rejected') {
        $('input[type="checkbox"]').not(this).prop('checked', false);
        $(".backgroundGreen").css('background-color', '')
    } else {
        if(ElectionData.e_type == "presidential") {
            Toast.fire({
                icon: 'info',
                title: "You can only Vote for 1 candidate"
            })
            $('input[type="checkbox"]').not(this).prop('checked', false);
            $(".backgroundGreen").css('background-color', '')
            $(this).closest('tr').addClass("backgroundGreen");
            $(this).closest('tr').css('background-color', 'lightgreen')
            var inputName = $(this).attr("name");
            var partyID = $(this).data('party')
            var arr = inputName.split('-');
            firstSelected = {
                cid: arr[1],
                cname: arr[0],
                party: partyID
            }
        } else {
            $('#rejectedCheck').prop('checked', false);
            if(total == 1 ) {
                var inputName = $(this).attr("name");
                var partyID = $(this).data('party')
                var arr = inputName.split('-');
                firstSelected = {
                    cid: arr[1],
                    cname: arr[0],
                    party: partyID
                }
                $(this).closest('tr').addClass("backgroundGreen");
                $(this).closest('tr').css('background-color', 'lightgreen')
            } else if(total > 3) {
                Toast.fire({
                    icon: 'error',
                    title: "You can only Vote for 3 candidates"
                })
                $(this).prop('checked', false);
            } 
        }
    }
    $(".submitVote").prop("disabled", false);
});

$(".clearBtn").click(function(){
    $('input[type="checkbox"]').not(this).prop('checked', false);
    $(".submitVote").prop("disabled", true);
    $(".backgroundGreen").css('background-color', '')
})


$(".submitVote").click(function(){
    // var vdata = []
    // $('input[type="checkbox"]').not('input[name="rejected"]').each(function(){
    //     var inputVal = $(this)[0].checked;
    //     var inputName = $(this).attr("name");
    //     var partyID = $(this).data('party')
    //     if(inputVal) {
    //         var arr = inputName.split('-');
    //         vdata.push({
    //             cid: arr[1],
    //             cname: arr[0],
    //             party: partyID
    //         })
    //     }
    // });

    // console.log(vdata)
    $.ajax({
        type: "POST",
        url: "/store_vote",
        data: {
            e_type: ElectionData.e_type,
            eid: ElectionData.eid,
            vid : voter.vid,
            votes: JSON.stringify([firstSelected])
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
                title: 'Vote Given'
            })
            window.location.href = '/scan';
        }
    })
})


function getElectionData() {
    var eid = getUrlParameter('eid')
    $.ajax({
        type: "POST",
        url: "/get_election",
        data: {
            eid: eid
        }
    }).done(function(response) {
        if(response.error) {
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            var electionDetails = response.data[0];
            ElectionData = electionDetails
            $('.electName').text(electionDetails.e_name)
            if(electionDetails.e_type == 'provincial') {
                loadPartySelection();
            } else {
                loadVotingTable(electionDetails.e_type, eid, 0)
            }
        }
    })
}

function loadVotingTable(type, eid, partyID) {
    $('#myModal2').modal('hide');
    $.ajax({
        type: "POST",
        data: {
            e_type: type,
            eid: eid,
            partyID: partyID
        },
        url: "/get_election_candidates",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            $('#voteTable').DataTable( {
                data: response.data,
                "bDestroy": true,
                "bPaginate": false,
                "bInfo": false,
                columns: [
                    {
                        data: 'cname',
                        render: function ( data, type, row ) {
                             return '<div class="flex items-center text-sm">' +
                             '<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">' +
                               '<img' +
                                 ' class="object-cover w-full h-full rounded-full"' +
                                 ' src="' + row.cimage_url + '"' +
                                 'alt="" loading="lazy" />' +
                               '<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>' +
                             '</div>' +
                             '<div>' +
                               '<p class="font-semibold">' + data + '</p>' +
                             '</div>' +
                           '</div>'
                        }
                    },
                    { data: 'cprovince' },
                    { 
                        data: 'pname',
                        render: function ( data, type, row ) {
                            return '<div class="flex items-center text-sm">' +
                             '<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">' +
                               '<img' +
                                 ' class="object-cover w-full h-full rounded-full"' +
                                 ' src="' + row.pimage_url + '"' +
                                 'alt="" loading="lazy" />' +
                               '<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>' +
                             '</div>' +
                             '<div>' +
                               '<p class="font-semibold">' + data + '</p>' +
                             '</div>' +
                           '</div>'
                        } 
                    },
                    { 
                        data: 'id',
                        render: function ( data, type, row ) {
                            return '<div class="flex items-center space-x-4 text-sm">' +
                                            '<input id="" type="checkbox" data-party="'+ row.party +'" value="" name="'+ row.cname + '-' + row.cid +'" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">' +
                                    '</div>'
                       }
                    }
                ]
            } );
        }
    })
}

function loadPartySelection() {
    var eid = getUrlParameter('eid')
    $.ajax({
        type: "GET",
        url: "/get_party_list_for_province",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            var parties = response.data;
            var partytiles =''
            parties.forEach(element => {
                partytiles += '<div class="col-6 col">' +
                `<button onClick="loadVotingTable('`+ElectionData.e_type+`',`+eid+`,` + element.id +`)" class="bg-[#2f9dcd] hover:bg-[#2a82a9] text-white font-bold mb-4 py-2 px-4 w-52 h-36 rounded">`+
                  '<div class="flex items-center text-sm">' +
                    '<div class="relative hidden w-16 h-16 mr-3 rounded-full md:block">' +
                      '<img class="object-cover w-full h-full rounded-full"' +
                        'src="'+ element.pimage_url +'"'+
                        'alt="" loading="lazy" />' +
                      '<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" ></div>' +
                    '</div>'+
                    '<div>'+
                      '<p class="font-semibold">'+element.pname+'</p>'+
                    '</div>' +
                  '</div>'+
                '</button>'+
              '</div>'
            });

            $('.partyTiles').html(partytiles);
            $('#myModal2').modal('show');
        }
    })
}
