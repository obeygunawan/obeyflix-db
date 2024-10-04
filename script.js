// Menangani klik pada tombol Search
// $('.search-button').on('click', function () {
//     performSearch();
// });

// Menangani penekanan tombol Enter pada kolom pencarian
// $('.input-keyword').on('keypress', function (event) {
//     if (event.which === 13) { // Cek jika tombol Enter ditekan
//         performSearch();
//     }
// });

// Fungsi untuk melakukan pencarian
// function performSearch() {
//     $.ajax({
//         url: 'https://www.omdbapi.com/?apikey=437432c&s=' + $('.input-keyword').val(),
//         success: results => {
//             const movies = results.Search;
//             let cards = ''; 
//             movies.forEach(m => {
//                 cards += showCards(m);
//             });
//             $('.movie-container').html(cards);

//             // Menangani klik pada tombol Show Details
//             $('.show-details').on('click', function (event) {
//                 event.preventDefault(); // Mencegah aksi default tautan
//                 const imdbID = $(this).data('imdbid'); // Perbaiki pengambilan data-imdbid
//                 $.ajax({
//                     url: 'https://www.omdbapi.com/?apikey=437432c&i=' + imdbID,
//                     success: m => {
//                         const movieDetail = showMovieDetail(m);
//                         $('.modal-body').html(movieDetail);
//                         $('#movieDetailModal').modal('show'); // Tampilkan modal
//                     }
//                 });
//             });
//         },
//         error: (e) => {
//             console.log(e.responseText);
//         }
//     });
// }

// Fetch
// Menangani klik pada tombol Search
const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', function () {
    performSearch();
});

// Menangani penekanan tombol Enter pada kolom pencarian
const inputKeyword = document.querySelector('.input-keyword');
inputKeyword.addEventListener('keypress', function (event) {
    if (event.which === 13) { // Cek jika tombol Enter ditekan
        performSearch();
    }
});

// Fungsi untuk melakukan pencarian
function performSearch() {
    const keyword = inputKeyword.value;
    fetch('https://www.omdbapi.com/?apikey=437432c&s=' + keyword)
        .then(response => response.json())
        .then(response => {
            const movies = response.Search;
            if (movies) {
                let cards = '';
                movies.forEach(m => cards += showCards(m));
                const movieContainer = document.querySelector('.movie-container');
                movieContainer.innerHTML = cards;

                // Menangani klik pada tombol Show Details
                const detailButtons = document.querySelectorAll('.show-details');
                detailButtons.forEach(btn => {
                    btn.addEventListener('click', function (event) {
                        event.preventDefault(); // Mencegah aksi default tautan
                        const imdbID = this.dataset.imdbid;
                        fetch('https://www.omdbapi.com/?apikey=437432c&i=' + imdbID)
                            .then(response => response.json())
                            .then(m => {
                                const movieDetail = showMovieDetail(m);
                                const modalBody = document.querySelector('.modal-body');
                                modalBody.innerHTML = movieDetail;
                                $('#movieDetailModal').modal('show'); // Tampilkan modal
                            });
                    });
                });
            } else {
                const movieContainer = document.querySelector('.movie-container');
                movieContainer.innerHTML = '<p>No movies found</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const movieContainer = document.querySelector('.movie-container');
            movieContainer.innerHTML = '<p>Error fetching movies.</p>';
        });
}

// Fungsi untuk menampilkan kartu film
function showCards(m) {
    return `
    <div class="col-md-4 my-3">
        <div class="card">
            <img src="${m.Poster}" class="card-img-top" alt="${m.Title}">
            <div class="card-body">
                <h5 class="card-title">${m.Title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                <a href="#" class="btn btn-primary show-details" data-imdbid="${m.imdbID}">Show Details</a>
            </div>
        </div>
    </div>`;
}

// Fungsi untuk menampilkan detail film
function showMovieDetail(m) {
    return `
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3">
                <img src="${m.Poster}" class="img-fluid">
            </div>
            <div class="col-md">
                <ul class="list-group">
                    <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
                    <li class="list-group-item"><strong>Director: </strong>${m.Director}</li>
                    <li class="list-group-item"><strong>Actors: </strong>${m.Actors}</li>
                    <li class="list-group-item"><strong>Writer: </strong>${m.Writer}</li>
                    <li class="list-group-item"><strong>Plot: </strong><br>${m.Plot}</li>
                </ul>
            </div>
        </div>
    </div>`;
}
