// capture login form submit
$("#loginBtn").click(function(){
    var username = $(".username").val();
    var password = $(".userpassword").val();

    // user input validation
    if(!validateUser_input(username)) {
        $(".usernameError").text("Username required !!");
        $(".usernameError").show();
        $(".username").addClass("border-2 border-rose-600");
    } else if (!validateUser_input(password)) {
        $(".usernameError").hide();
        $(".pwError").text("Password required !!");
        $(".pwError").show();
        $(".username").removeClass("border-2 border-rose-600");
        $(".userpassword").addClass("border-2 border-rose-600");
    } else { // if user data is valid then proceed to login function
        $(".usernameError").hide();
        $(".pwError").hide();

        $(".username").removeClass("border-2 border-rose-600");
        $(".userpassword").removeClass("border-2 border-rose-600");

        // Encrypt
        var ciphertext = CryptoJS.AES.encrypt(password, 'secret key 123').toString();

        // Decrypt
        // var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
        // var plaintext = bytes.toString(CryptoJS.enc.Utf8);

        $.ajax({
            type: "POST",
            url: "/loginUser",
            data: {
                username,
                password,
            }
        }).done(function(response) {
            if(response.error) {
                console.log(response.error)
                Toast.fire({
                    icon: 'error',
                    title: response.message
                })
            } else {
                console.log(response)
                Toast.fire({
                    icon: 'success',
                    title: 'Logged successfully'
                })
                setTimeout(
                    function() 
                    {
                        if(response.data[0].type == 'provincial_admin') {
                            location.href = '/scan';
                        } else {
                            location.href = '/';
                        }
                    }, 1500);
            }
        })
    }
})

function validateUser_input(value) {
    if(value == "") {
        return false;
    } else if(value === undefined) {
        return false;
    } else {
        return true;
    }
}