// categories-button-fetching
function getCategories(){
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(res=>res.json())
    .then(data=>displayCategories(data))
}
// remove-active-class-function
const removeStyleClass=()=>{
    const activeBtn = document.getElementsByClassName('btn-category')
    for(let button of activeBtn){
        button.classList.remove('style')
    }
}
//load-category-wise data-function
const loadCategories =(id)=> {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(res=> res.json())
    .then(data=>{
        displayVideos(data.category)
        const activeButton = document.getElementById(`btn-${id}`)
        // remove-active-class-function
        removeStyleClass();
        //add-style-class-in-buttons
        activeButton.classList.add('style')
    })
}
// categories-button-implement
function displayCategories(data){
    const category = document.getElementById('category')
    data.categories.forEach(element => {
        const div = document.createElement('div')
        div.innerHTML = `
        <button id="btn-${element.category_id}"  class = "btn btn-category" onClick ={loadCategories(${element.category_id})}>${element.category}</button>
        `
        category.append(div)
    });
}

//Videos - fetching
function getVideos(searchText =""){
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(res=> res.json())
    .then(data=> displayVideos(data.videos))
}
//getTime-function
function getTime(time){
    const hour = parseInt(time / 3600)
    let remainingSeconds = time % 3600;
    let minutes = parseInt(remainingSeconds / 60)
    remainingSeconds = remainingSeconds % 60;
    return (`${hour} Hrs ${minutes} Mnts and ${remainingSeconds} scs`)
}
// display-modal-data-function
const displayModal=(video)=>{
    document.getElementById('modalData').click();
    document.getElementById('modalContent').innerHTML=
    `
    <img class="w-full object-cover" src=${video.thumbnail}/>
    <h3 class="text-xs">${video.description}</h3>
    `
}
// details-button-clickHandler
const handleClick =async (videoID)=>{
    const res = await fetch(` https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`)
    const data =await res.json();
    displayModal(data.video)
}
//videos-implement
function displayVideos(data){
    const mainContent = document.getElementById('mainContent')
    if(data.length === 0){
        mainContent.classList.remove('grid')
        mainContent.innerHTML=
        `<div class ="w-11/12 mx-auto p-4 flex flex-col items-center justify-center gap-5">
        <div class = "w-[200px] h-[200px] rounded-full">
        <img
        class="h-full w-full rounded-full"
        src="./assests/no-video.avif" alt="">
        </div>
        <h3 class ="text-2xl font-bold text-red-600">No Content Available</h3>
        </div>`;
        return;
    }else{
        mainContent.classList.add('grid')
        mainContent.innerHTML="";
        data.forEach((element)=>{
            const div = document.createElement('div')
            div.classList.add('card','card-compact')
            div.innerHTML =
            `<figure class ="h-[200px] relative">
        <img
            class="h-full object-cover"
            src="${element.thumbnail}"
            alt="Shoes" />
            ${element.others.posted_date?.length== 0 ? '' : `<p class ="absolute right-4 bottom-2 p-3 text-white bg-gray-600 rounded-xl text-xs">${getTime(element.others.posted_date)}</p>`}
        </figure>
        
        <div class="py-3 flex gap-5">
        
        <div class ="w-[50px] h-[50px] rounded-full">
        <img class ="w-full h-full object-cover rounded-full" src = "${element.authors[0].profile_picture}" />
        <p class ="text-xs font-medium">${element.others.views} Views </p>
        </div>
    
        <div class = 'flex flex-col gap-2 justify-center'>
        <h2 class ="text-xl font-bold">${element.title}</h2>
        <h3 class ="text-lg font-semibold">${element.authors[0].profile_name} 
        <span>${element.authors[0].verified === true ? `<i class="fa-solid fa-circle-check text-xl text-blue-500"></i>` :''} <span></h3>
        </div>
        
        <div>
        <button class ="btn btn-error text-white"  onClick={handleClick('${element.video_id}')}>Details</button>
        </div>
        
        </div>`
        console.log(element)
        mainContent.append(div)
        })
    }
}
document.getElementById('searchInput').addEventListener('keyup',(e)=>{
    getVideos(e.target.value)
})

getCategories()
getVideos()