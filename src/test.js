const URL = 'https://api.themoviedb.org/3/movie/popular?api_key=2c46288716a18fb7aadcc2a801f3fc6b';
const imageURL = 'https://image.tmdb.org/t/p/w500/'

test()

async function test() {
    const response = await fetch(URL);
    console.log(response);
    const data = await response.json();
    console.log(data);
    console.log(data.results[0]);
    const imgURL = imageURL + data.results[0].poster_path;
    const img = document.createElement('img');
    img.src = imgURL;
    document.getElementById('put-here').appendChild(img)
}

