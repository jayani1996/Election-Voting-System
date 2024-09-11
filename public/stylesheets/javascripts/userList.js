var vCenters = [];

$(document).ready(function(){
    // call the get data API on load page
    loadTable();
    loadVotingCenterTable();
});

function loadVcenters(data) {
    var vcOptions = '<option value="all">All</option>';
    data.forEach(vc => {
        vcOptions += '<option value="' + vc.center_name +'">' + vc.center_name + '</option>'
    });
    $('#uVcenter').html(vcOptions);
    $('#uuVcenter').html(vcOptions);
}


function openModal(userData) {
    $('#exampleModal2').modal('show');
    $.ajax({
        type: "POST",
        data: {
            id: userData
        },
        url: "/get_user",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
           var userDetails = response.data[0];
           $("#name2").val(userDetails.name);
           $("#type2").val(userDetails.type);
           $("#province2").val(userDetails.province);
           $("#username2").val(userDetails.username);
           $("#status2").val(userDetails.status);
           $("#id2").val(userDetails.id);
           $("#uuVcenter").val(userDetails.uvoting_center);
        }
    })
}

function openVcModal(vcData) {
    console.log(vcData)
    $.ajax({
        type: "POST",
        data: {
            id: vcData
        },
        url: "/get_voting_center",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            var vcDetails = response.data[0];
            $("#vcname2").val(vcDetails.center_name);
            $("#vcprovince2").val(vcDetails.center_province);
            $("#vcid2").val(vcDetails.center_id);
            $('#vcUpdateModal').modal('show');
        }
    })
}

function loadTable() {
    $.ajax({
        type: "GET",
        url: "/get_users",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            $('#myTable2').DataTable( {
                data: response.data,
                "bDestroy": true,
                columns: [
                    { data: 'id' },
                    {
                        data: 'name',
                        render: function ( data, type, row ) {
                             return '<div class="flex items-center text-sm">' +
                                        '<div class="relative hidden w-8 h-8 mr-3 rounded-full md:block" >' +
                                        '<img class="object-cover w-full h-full rounded-full" src="'+ row.uimage_url + '"' +
                                            'alt="" loading="lazy"/>' +
                                        '<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" ></div>' +
                                        '</div>' + 
                                        '<div>' +
                                        '<p class="font-semibold">' + data + '</p>' +
                                        '</div>' +
                                    '</div>'
                        }
                    },
                    { data: 'username' },
                    { data: 'type'},
                    { data: 'province' },
                    { data: 'uvoting_center'},
                    { 
                        data: 'status',
                        render: function ( data, type, row ) {
                            if(data == "active" ) {
                                return '<span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">' +
                                        'Active' +
                                    '</span>'
                            } else {
                                return '<span class="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700">' + 
                                            'Inactive' +
                                        '</span>'
                            }
                        } 
                    },
                    { 
                        data: 'id',
                        render: function ( data, type, row ) {
                            return '<div class="flex items-center space-x-4 text-sm">' +
                            '<button onclick="openModal('+ data + ')"' +
                              'class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-orange-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"' +
                              'aria-label="Edit">' +
                              '<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">' +
                                '<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"' +
                                '></path>' +
                              '</svg>' +
                            '</button>' +
                            '<button onclick="deactivateUser('+ data +')" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Delete">' +
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

function loadVotingCenterTable() {
    $.ajax({
        type: "GET",
        url: "/get_voting_centers",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            loadVcenters(response.data);
            $('#vcTable').DataTable( {
                data: response.data,
                "bDestroy": true,
                columns: [
                    { data: 'center_id' },
                    { data: 'center_name' },
                    { data: 'center_province' },
                    { 
                        data: 'center_id',
                        render: function ( data, type, row ) {
                            return '<div class="flex items-center space-x-4 text-sm">' +
                            '<button onclick="openVcModal('+ data + ')"' +
                              'class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-orange-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"' +
                              'aria-label="Edit">' +
                              '<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">' +
                                '<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"' +
                                '></path>' +
                              '</svg>' +
                            '</button>' +
                            '<button onclick="deleteVc('+ data +')" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Delete">' +
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

$("#userCreate").submit(function(e) {
    e.preventDefault();
    var formData = new FormData($(this)[0]);

    var name = $("#name").val();
    var avatar = $('#avatar').prop('files')[0];
    var type = $("#type").val();
    var uVc = $("#uVcenter").val();
    var province = $("#province").val();
    var username = $("#username").val();
    var password = $("#password").val();

    console.log(formData, "formData")
    
    if(!validateUser_input(name)){
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".nameError").text("Name required !!");
        $(".nameError").show();
    } else if(!validateUser_input(avatar)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".fileError").text("Image required !!");
        $(".fileError").show();
    } else if(!validateFileType(avatar.type)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".fileError").text("Invalid Image !!");
        $(".fileError").show();
    } else if(!validateUser_input(username)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".usernameError").text("Username required !!");
        $(".usernameError").show();
    } else if(!validateUser_input(password)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".passwordError").text("Password required !!");
        $(".passwordError").show();
    } else {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();

        // Encrypt
        var ciphertext = CryptoJS.AES.encrypt(password, 'secret key 123').toString();

        formData.append('name', name);
        formData.append('type', type);
        formData.append('province', province);
        formData.append('uVcenter', uVc);
        formData.append('username', username);
        formData.append('password',ciphertext);
        $.ajax({
            type: "POST",
            url: "/add_user",
            processData: false,
            contentType: false,
            data: formData
        }).done(function(response) {
            $("#userCreate")[0].reset();
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
                loadTable();
                $('#exampleModal').modal('hide'); 
            }
        })
    }
})

function createVotingCenter() {
    var vcname = $("#vcname").val();
    var vcprovince = $("#vcprovince").val();
    
    if(!validateUser_input(vcname)){
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".vcnameError").text("Voting Center Name required !!");
        $(".vcnameError").show();
    } else {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();

        $.ajax({
            type: "POST",
            url: "/add_voting_center",
            data: {
                vcName: vcname,
                vcProvince: vcprovince
            }
        }).done(function(response) {
            $("#votinCenterCreate")[0].reset();
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
                loadVotingCenterTable();
                $('#vcCreateModal').modal('hide'); 
            }
        })
    }
}

function updateVotingCenter() {
    var vcId = $("#vcid2").val();
    var vcname = $("#vcname2").val();
    var vcprovince = $("#vcprovince2").val();
    
    if(!validateUser_input(vcname)){
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".vcnameError2").text("Voting Center Name required !!");
        $(".vcnameError2").show();
    } else {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();

        $.ajax({
            method: "POST",
            url: "/update_voting_center",
            data: {
                vcId: vcId,
                name: vcname,
                province: vcprovince
            }
        }).done(function(response) {
            $("#updatevc")[0].reset();
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
                loadVotingCenterTable();
                $('#vcUpdateModal').modal('hide'); 
            }
        })
    }
}

$("#updateUser").submit(function(e) {
    e.preventDefault();
    var formData2 = new FormData($(this)[0]);

    var name = $("#name2").val();
    var avatar = $('#avatar2').prop('files')[0];
    var type = $("#type2").val();
    var province = $("#province2").val();
    var username = $("#username2").val();
    var password = $("#password2").val();
    var status = $("#status2").val();
    var id = $("#id2").val();
    var updateVcenter = $("#uuVcenter").val();

    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(password, 'secret key 123').toString();

    if(!validateUser_input(name)){
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".nameError2").text("Name required !!");
        $(".nameError2").show();
    } else if(avatar && !validateFileType(avatar.type)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".fileError2").text("Invalid Image !!");
        $(".fileError2").show();
    } else if(!validateUser_input(username)) {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        $(".usernameError2").text("Username required !!");
        $(".usernameError2").show();
    } else {
        $(".ErrorClass").text("");
        $(".ErrorClass").hide();
        formData2.append('id', id);
        formData2.append('name', name);
        formData2.append('type', type);
        formData2.append('province', province);
        formData2.append('username', username);
        formData2.append('password',ciphertext);
        formData2.append('status',status);
        formData2.append('uvoting_center',updateVcenter);

        $.ajax({
            method: "POST",
            url: "/update_user",
            processData: false,
            contentType: false,
            data: formData2
        }).done(function(response) {
            $("#updateUser")[0].reset();
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
                loadTable();
                $('#exampleModal2').modal('hide'); 
            }
        })
    }
})

function closeUpdateUserModal() {
    $('#exampleModal2').modal('hide');
}

function closeCreateVCModal() {
    $('#vcCreateModal').modal('hide');
}

function showCreateVCModal() {
    $('#vcCreateModal').modal('show');
}

function showModal(modalId) {
    $('#'+ modalId).modal('show');
}

function closeModal(modalId) {
    $('#'+ modalId).modal('hide');
}


function validateUser_input(value) {
    if(value == "") {
        return false;
    } else if(value === undefined) {
        return false;
    } else {
        return true;
    }
}

function validateFileType(value) {
    let imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    return imageTypes.includes(value)
}