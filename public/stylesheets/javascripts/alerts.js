const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

function deactivateUser(userId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You are going to deactivate this user!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Deactivate user!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        data: {
          userID: userId
        },
        url: "/deactivate_user",
      }).done(function(response) {
        if(response.error) {
          console.log(response.error)
          Toast.fire({
              icon: 'error',
              title: response.message
          })
        } else {
          loadTable();
          Swal.fire(
            'Deactivated!',
            'User has been deactivated.',
            'success'
          )
        }
      })
    }
  })
}

function deleteParty(partyId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You are going to delete this party !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delete party!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        data: {
          pid: partyId
        },
        url: "/delete_party",
      }).done(function(response) {
        if(response.error) {
          Toast.fire({
              icon: 'error',
              title: response.message
          })
        } else {
          loadPartyTable();
          Swal.fire(
            'Deleted!',
            'Party has been deleted.',
            'success'
          )
        }
      })
    }
  })
}

function deleteCandidate(cId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You are going to delete this candidate !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delete!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        data: {
          cid: cId
        },
        url: "/delete_candidate",
      }).done(function(response) {
        if(response.error) {
          Toast.fire({
              icon: 'error',
              title: response.message
          })
        } else {
          loadCandidateTable();
          Swal.fire(
            'Deleted!',
            'Candidate has been deleted.',
            'success'
          )
        }
      })
    }
  })
}

function deleteElection(eId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You are going to delete this !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delete!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        data: {
          eid: eId
        },
        url: "/delete_election",
      }).done(function(response) {
        if(response.error) {
          Toast.fire({
              icon: 'error',
              title: response.message
          })
        } else {
          loadElectionTable();
          Swal.fire(
            'Deleted!',
            'Election has been deleted.',
            'success'
          )
        }
      })
    }
  })
}

function deleteVc(vcId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You are going to delete this !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delete!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        data: {
          vcID: vcId
        },
        url: "/delete_voting_center",
      }).done(function(response) {
        if(response.error) {
          Toast.fire({
              icon: 'error',
              title: response.message
          })
        } else {
          loadVotingCenterTable();
          Swal.fire(
            'Deleted!',
            'Voting Center has been deleted.',
            'success'
          )
        }
      })
    }
  })
}