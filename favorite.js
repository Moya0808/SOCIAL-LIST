const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
 
const dataPanel = document.querySelector('#data-panel')

// 電影清單載入頁面
function renderMovieList(data) {
  let rawHTML =''
  data.forEach(item =>  
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img class="card-img-top" src="${POSTER_URL + item.image}" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer text-muted">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">更多</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    `
  )
  dataPanel.innerHTML = rawHTML
}

// 詳細資訊互動視窗內容載入
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios
    .get(INDEX_URL + id)
    .then((res) => {
      const data = res.data.results
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release at : ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
    })
}

// 移出收藏清單
function removeFromFavorite(id) {
  const movieIndex = movies.findIndex(movie => movie.id === id)
  movies.splice(movieIndex, 1)

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}


// 觸發指定電影互動視窗資料、else if觸發收藏
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})


renderMovieList(movies)