import axios from "axios";

const URL = "https://pixabay.com/api/";
const key = "36535246-034277b0f5c12969743e82132";

export default class PicturesService {
  constructor() {
    this.per_page = 40;
    this.page = 1;
    this.searchQuery = "";
  }

  async getPictures() {
    const parameters = {
      key: key,
      q: this.searchQuery,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      per_page: this.per_page,
      page: this.page,
    };

    try {
      const response = await axios.get(URL, { params: parameters });
      const { hits, totalHits } = response.data;
      return { hits, totalHits };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch pictures");
    }
  }

  resetPage() {
    this.page = 1;
  }

  addPage() {
    this.page += 1;
  }
}
