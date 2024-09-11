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


function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};