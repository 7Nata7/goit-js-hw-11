import Notiflix from "notiflix";
import LoadMoreBtn from "./components/LoadMoreBtn.js";
import PicturesService from "./PicturesService.js";
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  form: document.getElementById("search-form"),
  input: document.querySelector("input[name='searchQuery']"),
  gallery: document.querySelector(".gallery")
};

const picturesService = new PicturesService();
const loadMoreBtn = new LoadMoreBtn({
  selector: ".load-more",
  isHidden: true
});

refs.form.addEventListener("submit", onSubmit);
loadMoreBtn.button.addEventListener("click", nextPics);

async function onSubmit(event) {
  event.preventDefault();
  const value = refs.input.value.trim();

  if (value === "") {
    Notiflix.Notify.failure("The search cannot be empty. Please try again.");

    clearPictureList();
    loadMoreBtn.hideBtn();
    return;
  } else {
    picturesService.searchQuery = value;
    picturesService.resetPage();

    clearPictureList();
    loadMoreBtn.hideBtn();

    nextPics().finally(() => refs.form.reset());
  }
}

async function nextPics() {
  loadMoreBtn.disable();

  try {
    const markup = await getPicturesMarkup();
    updatePicturesList(markup);
    loadMoreBtn.enable();
    picturesService.addPage();
  } catch (error) {
    console.log(error);
  }
}


async function getPicturesMarkup() {
  try {
    const { hits, totalHits } = await picturesService.getPictures();

    if (!hits || hits.length === 0) {
      loadMoreBtn.hideBtn();
      if (totalHits === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      }
      return "";
    }

    if (hits.length < picturesService.per_page) {
      loadMoreBtn.hideBtn();
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      loadMoreBtn.showBtn();
    }

    return hits.reduce((markup, hit) => markup + createMarkup(hit), "");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch pictures");
  }
}

function createMarkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
   return `
     <div class="photo-card">
       <a class="gallery_link" href="${largeImageURL}">
         <img src="${webformatURL}" alt="${tags}" loading="lazy" />
       </a>
       <div class="info">
         <p class="info-item">
           <b>Likes ${likes}</b>
         </p>
         <p class="info-item">
           <b>Views ${views}</b>
         </p>
         <p class="info-item">
           <b>Comments ${comments}</b>
         </p>
         <p class="info-item">
           <b>Downloads ${downloads}</b>
         </p>
       </div>
     </div>
   `;
}

function updatePicturesList(markup) {
  refs.gallery.insertAdjacentHTML("beforeend", markup);
  createLightbox();
} 

function clearPictureList() {
  refs.gallery.innerHTML = "";
}

function createLightbox() {
  const galleryLinks = document.querySelectorAll(".gallery_link");
  const lightbox = new SimpleLightbox(galleryLinks, {
    captionsData: "alt",
    captionDelay: 200,
    caption: true,
  });
}
