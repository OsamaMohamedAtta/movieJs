
let urlPage = window.location.pathname //get page url
let pagePath = urlPage.substring(urlPage.lastIndexOf('/') + 1) //get page path
let cartona = '';
let trendingMoviesData = [];
let trendingTvData = [];
let trendingPeopleData = [];
let mediaData = [];
let trendingMovies; // trending movies element
let trendingTv; // trending tv element
let trendingPeople; // trending people element
let mediaElement; // media element
// check if user login
checkUserLogin()
// check if user in details page
if(pagePath == 'details.html'){
    let id = JSON.parse(localStorage.getItem('id'))
    let mediaType = localStorage.getItem('mediaType')
    getDetails(id,mediaType) // show data details for movies or tv or people in this page
}
// check if user in movies page
if(pagePath == 'movies.html'){
    getMedia('movie', 1) // get movies data
    paginationEvent('movie') // make movie pagination
}
// check if user in tv page
if(pagePath == 'tv.html'){
    getMedia('tv' , 1) // get tv data
    paginationEvent('tv') // make tv pagination
}
// check if user in tv page
if(pagePath == 'people.html'){
    getMedia('person' , 1) // get people data
    paginationEvent('person') // make people pagination
}
// hide page loader hear
$(document).ready(function () {
    $('.loader img').fadeOut(400, () => {
        $('.loader').fadeOut(600)
        $("body").css("overflow", "scroll")
    })
})
// get trending hear
async function getTrending(mediaType, type) {
    const url = `https://api.themoviedb.org/3/trending/${mediaType}/day?api_key=c7a2d60eee80735bbfdf95a69863740e`
    const response = await fetch(url)
    const data = await response.json();
    if(mediaType == 'movie'){
        trendingMoviesData = data.results.splice(0, 10)
        displayTrending(trendingMoviesData, type)
    }else if(mediaType == 'tv'){
        trendingTvData = data.results.splice(0, 10)
        displayTrending(trendingTvData, type)
    }else{
        trendingPeopleData = data.results.splice(0, 10)
        displayTrending(trendingPeopleData, type)
    }
}
if(pagePath == 'index.html' || pagePath == '' || urlPage == 'https://osamamohamedatta.github.io/movieJs/'){  //check if you in index.html
    getTrending('movie', 'Movie') //get trending movie
    getTrending('tv', 'Tv') // get trending tv
    getTrending('person', 'People') // get trending people
}
// display trending data
function displayTrending(data, type) {
    cartona += `<div class="col-lg-4 col-md-6 col-sm-12">
    <div class="section-home-title">
        <h2>Trending</h2>
        <h2>${type}</h2>
        <h2>To Watch Now</h2>
        <p class="text-gray">Most Watched Movies By Days</p>
    </div>
</div>`
    for (let index = 0; index < data.length; index++) {
        let imgUrl = 'https://image.tmdb.org/t/p/w500'
        if(data[index].poster_path == null && data[index].profile_path == undefined){
            data[index].poster_path = './image/default-movie.jpg';
            imgUrl = '';
        }else if(data[index].profile_path == null && data[index].poster_path == undefined){
            data[index].profile_path = './image/default-movie.jpg';
            imgUrl = '';
        }
        cartona += `<div class="col-lg-2 col-md-3 col-sm-12">
        <div class="section-info">
            <div class="img-poster">
                <img src="${imgUrl}${(data[index].poster_path == undefined) ? data[index].profile_path : data[index].poster_path}" class="skeleton skeleton-img" alt="img-poster">
                <p class="rate">${(data[index].vote_average == undefined) ? data[index].popularity : data[index].vote_average}</p>
                <div class="poster-layer trending${type} d-flex justify-content-center align-items-center">
                    show more details
                </div>
            </div>
            <p class="title text-white mt-3 lh-1">${(data[index].title == undefined) ? data[index].name : data[index].title}</p>
        </div>
    </div>`
    }
    document.querySelector('.container-trending-all').innerHTML = cartona
    getTrendingElement() // get trending movies,tv and people element and convert it to array
}

function getTrendingElement(){ 
    trendingMovies = Array.from(document.querySelectorAll('.trendingMovie'))
    trendingTv = Array.from(document.querySelectorAll('.trendingTv'))
    trendingPeople = Array.from(document.querySelectorAll('.trendingPeople'))
    addEvent('trending') // add event to trending movies,tv and people elements
}

async function getMedia(type, pageNumber){  // get media movies or tv or people
    let url = `https://api.themoviedb.org/3/${type}/popular?api_key=c7a2d60eee80735bbfdf95a69863740e&language=en-US&page=${pageNumber}`
    let response = await fetch(url)
    let data = await response.json()
    mediaData = data.results
    displayMedia(mediaData , type)
}

function displayMedia(data, mediaType){
    let cartonaMedia = ''
    document.querySelector('.pagination').classList.replace('d-flex', 'd-none')
    for (let index = 0; index < data.length; index++) {
        let imgUrl = 'https://image.tmdb.org/t/p/w500'
        if(data[index].poster_path == null && data[index].profile_path == undefined){
            data[index].poster_path = './image/default-movie.jpg';
            imgUrl = '';
        }else if(data[index].profile_path == null && data[index].poster_path == undefined){
            data[index].profile_path = './image/default-movie.jpg';
            imgUrl = '';
        }
        cartonaMedia += `<div class="col-lg-2 col-md-3 col-sm-12">
        <div class="section-info">
            <div class="img-poster">
                <img src="${imgUrl}${(data[index].poster_path == undefined) ? data[index].profile_path : data[index].poster_path}" class="skeleton skeleton-img" alt="img-poster">
                <p class="rate">${(data[index].vote_average == undefined) ? data[index].popularity : data[index].vote_average}</p>
                <div class="poster-layer media d-flex justify-content-center align-items-center">
                    show more details
                </div>
            </div>
            <p class="title text-white mt-3 lh-1">${(data[index].title == undefined) ? data[index].name : data[index].title}</p>
        </div>
    </div>` 
    }
    if(cartonaMedia == ''){
        document.querySelector('.pagination').classList.replace('d-flex', 'd-none')
    }else{
        document.querySelector('.media-container').innerHTML = cartonaMedia
        mediaElement = Array.from(document.querySelectorAll('.media'))
        document.querySelector('.pagination').classList.replace('d-none', 'd-flex')
        addEvent(mediaType) // add event to movies or tv or people elements
    }
}

// get search hear
const searchInput = document.querySelector('.serch-form input')
if(pagePath == 'search.html'){ // check if user in search page
    searchInput.addEventListener('keyup' , () => {
        search(searchInput.value) // get data that user search about it
    })       
}
async function search(value){   
    let url = `https://api.themoviedb.org/3/search/multi?api_key=c7a2d60eee80735bbfdf95a69863740e&language=en-US&query=${value}&page=1&include_adult=false`
    let response = await fetch(url)
    let data = await response.json()
    mediaData = data.results
    dispalySearchData(mediaData) // show the data in page
}

function dispalySearchData(data){
    let cartonaSearchData = '';
    for (let index = 0; index < data.length; index++) {
        let imgUrl = 'https://image.tmdb.org/t/p/w500'
        if(data[index].poster_path == null && data[index].profile_path == undefined){
            data[index].poster_path = './image/default-movie.jpg';
            imgUrl = '';
        }else if(data[index].profile_path == null && data[index].poster_path == undefined){
            data[index].profile_path = './image/default-movie.jpg';
            imgUrl = '';
        }
        cartonaSearchData += `<div class="col-lg-3 col-md-4 col-sm-12">
        <div class="section-info">
            <div class="img-poster">
                <img src="${imgUrl}${(data[index].poster_path == undefined) ? data[index].profile_path : data[index].poster_path}" class="skeleton skeleton-img-search" alt="img-poster">
                <p class="rate">${(data[index].vote_average == undefined) ? data[index].popularity : data[index].vote_average}</p>
                <div class="poster-layer media d-flex justify-content-center align-items-center">
                    show more details
                </div>
            </div>
            <p class="title text-white mt-3 lh-1">${(data[index].title == undefined) ? data[index].name : data[index].title}</p>
        </div>
    </div>` 
    }
    if(cartonaSearchData == ''){
        document.querySelector('.serach-section').classList.replace('position-relative', 'position-fixed')
    }else{
        document.querySelector('.search-container').innerHTML = cartonaSearchData
        document.querySelector('.serach-section').classList.replace('position-fixed', 'position-relative')
        mediaElement = Array.from(document.querySelectorAll('.media'))
        addEvent('search') // add event to search data elements
    }
}

function addEvent(typeOf){  
    if(typeOf == 'trending'){
        for (let index = 0; index < trendingMovies.length; index++) {
            trendingMovies[index].addEventListener('click', (e)=> {
                let target = trendingMovies.indexOf(e.target);
                localStorage.setItem('id', trendingMoviesData[target].id)
                localStorage.setItem('mediaType', trendingMoviesData[target].media_type)
                window.location.href = 'details.html'
            })
        }
        for (let index = 0; index < trendingTv.length; index++) {
            trendingTv[index].addEventListener('click', (e)=> {
                let target = trendingTv.indexOf(e.target);
                localStorage.setItem('id', trendingTvData[target].id)
                localStorage.setItem('mediaType', trendingTvData[target].media_type)
                window.location.href = 'details.html'
            })
        }
        for (let index = 0; index < trendingPeople.length; index++) {
            trendingPeople[index].addEventListener('click', (e)=> {
                let target = trendingPeople.indexOf(e.target);
                localStorage.setItem('id', trendingPeopleData[target].id)
                localStorage.setItem('mediaType', trendingPeopleData[target].media_type)
                window.location.href = 'details.html'
            })
        }
    }else if(typeOf == 'movie'){
        for (let index = 0; index < mediaElement.length; index++) {
            mediaElement[index].addEventListener('click', (e)=> {
                let target = mediaElement.indexOf(e.target);
                localStorage.setItem('id', mediaData[target].id)
                localStorage.setItem('mediaType', typeOf)
                window.location.href = 'details.html'
            })
        }
    }else if(typeOf == 'tv'){
        for (let index = 0; index < mediaElement.length; index++) {
            mediaElement[index].addEventListener('click', (e)=> {
                let target = mediaElement.indexOf(e.target);
                localStorage.setItem('id', mediaData[target].id)
                localStorage.setItem('mediaType', typeOf)
                window.location.href = 'details.html'
            })
        }
    }else if(typeOf == 'person'){
        for (let index = 0; index < mediaElement.length; index++) {
            mediaElement[index].addEventListener('click', (e)=> {
                let target = mediaElement.indexOf(e.target);
                localStorage.setItem('id', mediaData[target].id)
                localStorage.setItem('mediaType', typeOf)
                window.location.href = 'details.html'
            })
        }
    }else if(typeOf == 'search'){
        for (let index = 0; index < mediaElement.length; index++) {
            mediaElement[index].addEventListener('click', (e)=> {
                let target = mediaElement.indexOf(e.target);
                localStorage.setItem('id', mediaData[target].id)
                localStorage.setItem('mediaType', mediaData[target].media_type)
                window.location.href = 'details.html'
            })
        }
    }   
}

function paginationEvent(typeOf){
    if(typeOf == 'movie'){
        $(".myPages").pxpaginate({  // make movie pagination
            totalPageCount: 10,
            callback: function(pagenumber){ 
                getMedia('movie', pagenumber); 
            }
        });
    }else if(typeOf == 'tv'){
        $(".myPages").pxpaginate({  // make tv pagination
            totalPageCount: 10,
            callback: function(pagenumber){ 
                getMedia('tv', pagenumber); 
            }
        });
    }else{
        $(".myPages").pxpaginate({  // make people pagination
            totalPageCount: 10,
            callback: function(pagenumber){ 
                getMedia('person', pagenumber); 
            }
        });
    }
}

async function getDetails(id,mediaType){  
    let url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=c7a2d60eee80735bbfdf95a69863740e&language=en-US`
    const response = await fetch(url)
    const data = await response.json();
    let cartonaDetails = ''
    let imgUrl = 'https://image.tmdb.org/t/p/w500'
        if(data.poster_path == null && data.profile_path == undefined){
            data.poster_path = './image/default-movie.jpg';
            imgUrl = '';
        }else if(data.profile_path == null && data.poster_path == undefined){
            data.profile_path = './image/default-movie.jpg';
            imgUrl = '';
        }
        if(mediaType == "person"){
            cartonaDetails = `<div class="col-lg-4 col-md-12">
    <div class="img-details-poster">
        <img src="${imgUrl}${(data.poster_path == undefined) ? data.profile_path : data.poster_path}" alt="poster-img">
    </div>
</div>
<div class="col-lg-8 col-md-12">
    <div class="details-info">
        <h2 class="text-white mt-5 mb-3">${data.name}</h2>
        <p class="text-white my-3 d-block vote-details">Popularity: <span>${data.popularity}</span></p>
        <p class="text-white my-3">${(data.biography != '') ? 'overView' : ''}</p>
        <p class="text-gray my-3 lh-base">${data.biography}</p>
    </div>
</div>`
        }else{
            cartonaDetails = `<div class="col-lg-4 col-md-12">
    <div class="img-details-poster">
        <img src="${imgUrl}${(data.poster_path == undefined) ? data.profile_path : data.poster_path}" alt="poster-img">
    </div>
</div>
<div class="col-lg-8 col-md-12">
    <div class="details-info">
        <h2 class="text-white mt-5">${(data.title == undefined) ? data.name : data.title}</h2>
        <span class="${(data.genres[0] == undefined) ? 'no-genres' : 'genres'} mt-3 fs-5">${(data.genres[0] == undefined) ? '' : data.genres[0].name}</span>
        <span class="${(data.genres[1] == undefined) ? 'no-genres' : 'genres'} mt-3 fs-5 mx-2">${(data.genres[1] == undefined) ? '' : data.genres[1].name}</span>
        <span class="${(data.genres[2] == undefined) ? 'no-genres' : 'genres'} mt-3 fs-5">${(data.genres[2] == undefined) ? '' : data.genres[2].name}</span>
        <p class="language my-3">${data.original_language}</p>
        <p class="text-white my-3 air-released-details">Air Released: <span class="text-gray">${(data.release_date == undefined) ? data.first_air_date : data.release_date}</span></p>
        <p class="text-white my-3 vote-details">Vate: <span>${data.vote_average}</span></p>
        <p class="text-white my-3 vote-count-details">Vote Count: <span>${data.vote_count}</span></p>
        <p class="text-white my-3">overView:</p>
        <p class="text-gray my-3 lh-base">${data.overview}</p>
    </div>
</div>`
        }
    document.querySelector('.container-details').innerHTML = cartonaDetails
}

function displayProfileData(data){
    let profileCartona = `<div class="profile-info">
    <h4 class="text-gray">User_Name: <span>${data.first_name}</span></h4>
    <h4 class="text-gray my-4">User_Age: <span>${data.age}</span></h4>
    <h4 class="text-gray">User_Email: <span>${data.email}</span></h4>
</div>`
    document.querySelector('.profile-container').innerHTML = profileCartona
}

// register validation
const firstName = document.getElementById('first_name')
const lastName = document.getElementById('last_name')
const age = document.getElementById('ageInput')
const emailRegister = document.querySelector('.emailRegisterInput')
const passwordRegister = document.getElementById('passwordRegisterInput')
const registerButton = document.getElementById('registerBtn')

if(pagePath == 'register.html'){  //check if you in register.html
    registerButton.addEventListener('click', function(){
        checkInputs('register') //check to all validation register inputs then sending data to database by register function
    })
}

// login validation
const emailLogin = document.querySelector('.emailLoginInput')
const passwordLogin = document.getElementById('passwordLoginInput')
const emailButton = document.getElementById('loginBtn')

if(pagePath == 'login.html'){  //check if you in login.html
    emailButton.addEventListener('click', function(){
        checkInputs('login') //check to all validation login inputs then sending data to database by login function
    })
}

//check validation inputs
function checkInputs(inputType){
    let isError = false //used to check if checkInputs function return any validation error
    if(inputType == 'register'){
    const firstNameValue = firstName.value
    const lastNameValue = lastName.value
    const ageValue = age.value
    const emailRegisterValue = emailRegister.value
    const passwordRegisterValue = passwordRegister.value

    if(firstNameValue == ''){
        setErrorMassage('.first-name-error','"first_name" is not allowed to be empty')
        isError = true
    }else{
        setSuccess('.first-name-error')
    }
    if(lastNameValue == ''){
        setErrorMassage('.last-name-error','"last_name" is not allowed to be empty')
        isError = true
    }else{
        setSuccess('.last-name-error')
    }
    if(ageValue == ''){
        setErrorMassage('.age-error','"age" is not allowed to be empty')
        isError = true
    }else if(!ageValidation(ageValue)){
        setErrorMassage('.age-error','"age" must be between 16-80')
        isError = true
    }else{
        setSuccess('.age-error')
    }
    if(emailRegisterValue == ''){
        setErrorMassage('.email-register-error','"email" is not allowed to be empty')
        isError = true
    }else if(!emailValidation(emailRegisterValue)){
        setErrorMassage('.email-register-error','"email" is not vaild')
        isError = true
    }else{
        setSuccess('.email-register-error')
    }
    if(passwordRegisterValue == ''){
        setErrorMassage('.password-register-error','"password" is not allowed to be empty')
        isError = true
    }else if(!passwordValidation(passwordRegisterValue)){
        setErrorMassage('.password-register-error','"password" must be between 6 to 15 characters which contain only characters, numeric digits, underscore and first character must be a letter')
        isError = true
    }else{
        setSuccess('.password-register-error')
    }
    if(!isError)
    register()    
    }else{
        const emailLoginValue = emailLogin.value
        const passwordLoginInput = passwordLogin.value

        if(emailLoginValue == ''){
            setErrorMassage('.email-login-error','"email" is not allowed to be empty')
            isError = true
        }else if(!emailValidation(emailLoginValue)){
            setErrorMassage('.email-login-error','"email" is not vaild')
            isError = true
        }else{
            setSuccess('.email-login-error')
        }
        if(passwordLoginInput == ''){
            setErrorMassage('.password-login-error','"password" is not allowed to be empty')
            isError = true
        }else{
            setSuccess('.password-login-error')
        }
        if(!isError)
        login()  
    }
}

function setErrorMassage(inputError,massage){   //set the massage error
    document.querySelector(inputError).innerHTML = massage
}

function setSuccess(inputSucccess){   //remove the massage error
    document.querySelector(inputSucccess).innerHTML = ''
}

function ageValidation(ageValue){  //custom age validation
    return /^(?:1[6-9]|[2-7][0-9]|80)$/.test(ageValue)
}

function emailValidation(emailRegisterValue){  //custom email validation
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailRegisterValue)
}

function passwordValidation(passwordRegisterValue){  //custom password validation
    return /^[A-Za-z]\w{5,14}$/.test(passwordRegisterValue)
}

async function register(){  //send user data to database to register it
    let userData = {
       first_name : firstName.value,
       last_name : lastName.value,
       email : emailRegister.value,
       password : passwordRegister.value,
       age : age.value
    }
    let res = await fetch("https://route-egypt-api.herokuapp.com/signup",{
        method: 'POST',
        headers: {'content-type':'application/json'},
        body:JSON.stringify(userData)
    })
    let finalRes = await res.json()
    if(finalRes.message != 'success'){
        document.querySelector('.alert-danger').classList.replace('d-none', 'd-flex')
        document.querySelector('.alert-danger').innerHTML = finalRes.message
    }else{
        window.location.href = 'login.html'
        document.querySelector('.alert-danger').classList.replace('d-flex', 'd-none')
    }  
}

async function login(){  //send user data to database to login it
    let userData = {
       email : emailLogin.value,
       password : passwordLogin.value,
    }
    let res = await fetch("https://route-egypt-api.herokuapp.com/signin",{
        method: 'POST',
        headers: {'content-type':'application/json'},
        body:JSON.stringify(userData)
    })
    let finalRes = await res.json()
    if(finalRes.message != 'success'){
        document.querySelector('.alert-danger').classList.replace('d-none', 'd-flex')
        document.querySelector('.alert-danger').innerHTML = finalRes.message
    }else{
        localStorage.setItem('userMovieToken', finalRes.token)
        document.querySelector('.alert-danger').classList.replace('d-flex', 'd-none')
        window.location.href = 'index.html'
    }  
}

function checkUserLogin(){ //check if user make login in your website
    const userToken = localStorage.getItem('userMovieToken')  // get user token
    let data = {}
    if(userToken != null){
        if(pagePath == "login.html" || pagePath == "register.html"){
            window.location.href = 'index.html'
        }else{
            data = decodeJwt(userToken) //get user information from user token 
            document.querySelector('.nav-icon li:nth-child(4) span').innerHTML = data.first_name
            document.querySelector('.nav-icon li:nth-child(3)').classList.replace('d-inline-block','d-none')
            document.querySelector('.nav-icon li:nth-child(4)').classList.replace('d-none','d-inline-block')
            if(pagePath == 'profile.html'){ // check if user in profile page
                displayProfileData(data) // show user profile information
            }
        }
    }else{
        if(pagePath != "login.html" && pagePath != "register.html"){
            document.querySelector('.nav-icon li:nth-child(3)').classList.replace('d-none','d-inline-block')
            document.querySelector('.nav-icon li:nth-child(4)').classList.replace('d-inline-block','d-none')
        }
        if(pagePath == 'profile.html'){
            window.location.href = 'login.html'
        }
    }
}

// user logout
const logoutBtn = document.querySelector('.nav-icon li:nth-child(4)')

if(pagePath != "login.html" && pagePath != "register.html"){
    logoutBtn.addEventListener('click', logout)
}

function logout(){ // function to make logout
    localStorage.removeItem('userMovieToken')  //remove user token from local storage
    window.location.href = 'login.html'
}