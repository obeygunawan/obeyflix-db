// $('.search-button').on('click', function () {

//     $.ajax({
//         url: 'https://www.omdbapi.com/?apikey=437432c&s=' + $('.input-keyword').val(),
//         success: results => {
//             const movies = results.Search;
//             let cards ='';
//             movies.forEach(m => {
//                 cards += showCards(m);
//             });
//             $('.movie-container').html(cards);
    
//         // ketika tombol detail di-klik
//         $('.modal-detail-btn').on('click', function () {
//             $.ajax({
//                 url: 'https://www.omdbapi.com/?apikey=437432c&i=' + $(this).data('imdbid'),
//                 success: m => {
//                     const movieDetail = showMovieDetail(m);
//                     $('.modal-body').html(movieDetail);
//                 },
//                 error: (e) => {
//                     console.log(e.responseText);
//                 }
//             });
//         });
    
//         },
//         error: (e) => {
//             console.log(e.responseText);
//         }
//     });

// });


// fetch

// const searchButton = document.querySelector('.search-button');
// searchButton.addEventListener('click', function () {

//     const inputKeyword = document.querySelector('.input-keyword');
//     fetch('https://www.omdbapi.com/?apikey=437432c&s=' + inputKeyword.value)
//         .then(response => response.json())
//         .then(response => {
//             const movies = response.Search;
//             let cards = '';
//             movies.forEach(m => cards += showCards(m));
//             const movieContainer = document.querySelector('.movie-container');
//             movieContainer.innerHTML = cards;

//             // ketika tombol detail di-klik
//             const modalDetailButton = document.querySelectorAll('.modal-detail-button');
//             modalDetailButton.forEach(btn => {
//                 btn.addEventListener('click', function () {
//                     const imdbid = this.dataset.imdbid;
//                     fetch('https://www.omdbapi.com/?apikey=437432c&i=' + imdbid)
//                         .then(response => response.json())
//                         .then(m => {
//                             const movieDetail = showMovieDetail(m);
//                             const modalBody = document.querySelector('.modal-body');
//                             modalBody.innerHTML = movieDetail;
//                         });
//                 });
//             });

//         });

// });



const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', async function () {
    const inputKeyword = document.querySelector('.input-keyword').value;

    // Error handling untuk kolom pencarian kosong
    if (!inputKeyword.trim()) {
        displayError('Please enter a movie title.');
        return;
    }

    try {
        const movies = await getMovies(inputKeyword);
        updateUI(movies);
    } catch (err) {
        displayError(err.message); // Menampilkan pesan error di UI
    }
});

function getMovies(keyword) {
    return fetch('https://www.omdbapi.com/?apikey=437432c&s=' + keyword)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(response => {
            if (response.Response === "False") {
                throw new Error(response.Error); // Menampilkan error dari OMDB API jika tidak ada hasil
            }
            return response.Search;
        });
}

function updateUI(movies) {
    let cards = '';
    movies.forEach(m => cards += showCards(m));
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = cards;
}

// Menangani event modal untuk detail film
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('modal-detail-btn')) {
        const imdbid = e.target.dataset.imdbid;
        try {
            const movieDetail = await getMovieDetail(imdbid);
            updateUIDetail(movieDetail);
        } catch (err) {
            displayError('Failed to load movie details.');
        }
    }
});

function getMovieDetail(imdbid) {
    return fetch('https://www.omdbapi.com/?apikey=437432c&i=' + imdbid)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network error: Failed to fetch movie details.');
            }
            return response.json();
        });
}

function updateUIDetail(m) {
    const movieDetail = showMovieDetail(m);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = movieDetail;
}

// Fungsi untuk menampilkan error di UI
function displayError(message) {
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = `
        <div class="col">
            <h3 class="text-center text-danger">${message}</h3>
        </div>
    `;
}

function showCards(m) {
    return `<div class="col-md-4 my-3">
                <div class="card">
                    <img src="${m.Poster}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${m.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                        <a href="#" class="btn btn-primary modal-detail-btn" data-toggle="modal" data-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Details</a>
                    </div>
                </div>
            </div>`;
}

function showMovieDetail(m) {
    return `
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3">
                    <img src="${m.Poster}" class="img-fluid" alt="Movie Poster">
                </div>
                <div class="col-md">
                    <ul class="list-group">
                        <li class="list-group-item">
                            <h4>${m.Title} (${m.Year})</h4>
                        </li>
                        <li class="list-group-item"><strong>Director:</strong> ${m.Director}</li>
                        <li class="list-group-item"><strong>Actors:</strong> ${m.Actors}</li>
                        <li class="list-group-item"><strong>Writer:</strong> ${m.Writer}</li>
                        <li class="list-group-item"><strong>Plot:</strong> <br> ${m.Plot}</li>
                    </ul>
                </div>
            </div>
        </div>`;
}
