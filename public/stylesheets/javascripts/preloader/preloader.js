//enable preloader
function enablepreloader (message) {
    var someBlock = $('.someBlock')
        someBlock.preloader({
            // text: 'Please Wait While We Configure Your Account...',
            text: message,
            percent: '',
            duration: ''
        })
    }

// disable preloader function
function disablePreloader () {
    var someBlock = $('.someBlock')
    someBlock.preloader('remove')
}