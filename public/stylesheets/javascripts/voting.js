$(document).ready(function(){
    // call the get data API on load page
    loadElections();
    loadElectionSummery();
});

function loadElections() {
    $.ajax({
        type: "GET",
        url: "/get_elections",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            var electionList = response.data;
            var inputs = '';
            electionList.forEach(element => {
                var sameDate = moment().isBetween(element.startdate, element.enddate);
                inputs += `<button type="button" onclick="window.location.href='/startvote?eid=` + element.eid +`'"` + ( sameDate ? "" : ' disabled ' ) +
                            'class="mb-2 block w-6/12 h-24 rounded bg-[#f08200] hover:bg-[#cb6f03] px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">' +
                                '<span>'+ moment(element.startdate).format("YYYY-MM-DD hh:mm A") +' to '+ moment(element.enddate).format("YYYY-MM-DD hh:mm A") +' </span>' +
                                '</br>' +
                                '<span>' + element.e_name + '</span>' +
                            '</button>'
            });
            $('.contentBtn').html(inputs)
        }
    })
}


function loadElectionSummery() {
    $.ajax({
        type: "GET",
        url: "/get_election_summery",
    }).done(function(response) {
        if(response.error) {
            console.log(response.error)
            Toast.fire({
                icon: 'error',
                title: response.message
            })
        } else {
            var results = response.data.votingData;
            var votingUsers = response.data.votingUsers;
            var groupedElections = _.chain(results).groupBy("election_id").map((value, key) => ({ election_ID: key, data: value })).value();
            console.log(groupedElections)
            var totalEligable = 0
            var totalGiven = 0
            var remaining = 0
            var electionsAvailable = false
            groupedElections.forEach(element => {
                if(moment().isBetween(element.data[0].startdate, element.data[0].enddate)) {
                    electionsAvailable = true;
                    totalGiven = (_.chain(element.data).groupBy("vuser_id").map((value, key) => ({ user: key, votes: value })).value()).length;
                    totalEligable = votingUsers.length
                    remaining = totalEligable - totalGiven;
                }
            });

            if(!electionsAvailable) {
                Toast.fire({
                    icon: 'warning',
                    title: 'There are no active elections for Today !!!'
                })
            }

            $('.tv').html(totalEligable)
            $('.tg').html(totalGiven)
            $('.rm').html(remaining)
        }
    })
}