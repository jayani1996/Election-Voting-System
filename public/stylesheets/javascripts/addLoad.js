$(document).ready( function () {
    loadpartyCarasoul();
    loadCenterList();
});

function loadpartyCarasoul() {
    $.ajax({
        type: "GET",
        url: "/get_parties",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            var partyList = response.data;
            var inputs = '';
            var listView = '';
            var i =1;
            partyList.forEach(element => {
                inputs += '<div class="carousel-item' + (i==1 ? ' active' : '') + '">' +
                                '<img src="'+ element.pimage_url +'" class="d-block w-100" alt="">'+
                                '<div class="carousel-caption d-none d-md-block">'+
                                '<h5 class="carasoulText">'+ element.pname +' party </h5>'+
                                '</div>'+
                            '</div>';
                listView += '<li class="list-group-item">'+ element.pname +'</li>'
                i++;
            });
            $('.carasoutParty').html(inputs);
            $('.partyList').html(listView);
        }
    })
}

function loadCenterList() {
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
            var centerList = response.data;
            var listView = '';
            var uniqueCenters = _.uniq(_.map(centerList, 'province'));
            uniqueCenters.forEach(element => {
                if(element != 'all'){
                    listView += '<li class="list-group-item">'+ element +' Center</li>'
                }
            });
            $('.centerList').html(listView);
        }
    })
}