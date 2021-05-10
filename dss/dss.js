function init() {
  const appDiv = document.querySelector("#appDiv");
  const homeApp = new HomeApp(appDiv);
}
/**
 * @description An SPA class for showing image tiles
 * @class HomeApp
 */
class HomeApp {
  constructor(anchorElement) {
    this.homeData = {};
    this.appDiv = anchorElement;
    this.carouselList = [];
    this.unloadedCarouselList = [];
    this.__bindEvents();
    fetchJsonData("homeData", null, (response) => this.__initalizePage(response));
  }

__bindEvents() {
    const resizeObserver = new ResizeObserver((entries) => {
      const lastRowRect = this.carouselList[this.carouselList.length-1]?.container.getBoundingClientRect();

      if (window.innerHeight - lastRowRect?.bottom > 30 && this.unloadedCarouselList.length > 0) {
        this.__fetchDataForNextRow();
      }
    });
    resizeObserver.observe(document.body);

    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      
      let currentFocusedElement = document.querySelector("*:focus");
      if (!currentFocusedElement) {
        this.setFocus(0, 0);
        currentFocusedElement = document.querySelector("*:focus");
      }
      const currentRowIndex = +currentFocusedElement.closest(".carousel").dataset.rowIndex;
      const visibleTilesOnRow = this.carouselList[currentRowIndex].carousel.selectedCells;
      let tileIndex = visibleTilesOnRow.findIndex((item) => item.element === currentFocusedElement);

      switch (event.key) {
        case "ArrowLeft":
          this.setFocus(currentRowIndex, tileIndex - 1);
          break;
        case "ArrowRight":
          this.setFocus(currentRowIndex, tileIndex + 1);
          break;
        case "ArrowUp":
          this.setFocus(currentRowIndex - 1, tileIndex);
          break;
        case "ArrowDown":
          this.setFocus(currentRowIndex + 1, tileIndex);
          if (this.carouselList.length - currentRowIndex - 1 < 2 && this.unloadedCarouselList.length > 0) {
            this.__fetchDataForNextRow();
          }
          break;
        case "Enter":
          break;
      }
    });
  }

  __initalizePage(response) {
    this.homeData = response.data?.StandardCollection;
    if (!this.homeData) {
      throw new Error("No data received");
    }
    this.clearPage();
    this.homeData.containers.forEach((container) => this.buildCategoryRow(container.set));
    this.setFocus(0, 0);
  }

  __moveSlide(rowIndex, direction) {
    const carousel = this.carouselList[rowIndex].carousel;
    if (direction < 0) {
      carousel.previous(true);
      const visibleTilesOnRow = carousel.selectedCells;
      visibleTilesOnRow[visibleTilesOnRow.length - 1].element.focus();
    } else {
      carousel.next(true);
      const visibleTilesOnRow = carousel.selectedCells;
      visibleTilesOnRow[0].element.focus();
    }
  }

  __fetchDataForNextRow() {
    const nextRowCarousel = this.unloadedCarouselList.shift();
    const refId = nextRowCarousel.refId;
    const refType = nextRowCarousel.refType;
    console.debug(`fetching ${refType} for ${refId} into row ${this.carouselList.length}`);
    (new Promise((resolve, reject) => {
      fetchJsonData("refData", refId, (response, { refType }) => {
        if (response.data[refType]) {
          this.buildCategoryRow(response.data[refType]);
          resolve();
        } else {
          console.warn(`No '${refType}' data found in response.`);
          reject();
        }
      }, { refType });
    })).then(() => {}, this.__fetchDataForNextRow.bind(this));
  }

  /**
   * @description Sets Focus on a tile
   * @param {number} rowIndex - 0-index row position
   * @param {number} tileIndex - 0-index tile position
   * @memberof HomeApp
   */
  setFocus(rowIndex, tileIndex) {
    if (0 <= rowIndex && rowIndex < this.carouselList.length) {
      const visibleTilesOnRow = this.carouselList[rowIndex].carousel.selectedCells;
      if (0 <= tileIndex && tileIndex < visibleTilesOnRow.length) {
        visibleTilesOnRow[tileIndex].element.focus();
      } else {
        this.__moveSlide(rowIndex, tileIndex);
      }
    }
  }
  /**
   * @description Clears entire SPA
   * @memberof HomeApp
   */
  clearPage() {
    while (this.appDiv.hasChildNodes()) {
      this.appDiv.removeChild(this.appDiv.firstChild);
    }
  }

  /**
   * @description Adds a Category row-carousel with title
   * @param {object} setData - data from API
   * @return {*} 
   * @memberof HomeApp
   */
  buildCategoryRow(setData) {
    const rowTitle = setData.text.title.full.set.default.content;
    const items = setData.items;
    if ((!items || items.length === 0) && !setData.refId) {
      return;
    }

    if (setData.refId) {
      const carousel = new TileCarousel(rowTitle, setData.refId, setData.refType);
      this.unloadedCarouselList.push(carousel);
    } else if (items.length > 0) {
      const carousel = new TileCarousel(rowTitle);
      this.appDiv.appendChild(carousel.container);
      carousel.setItems(items, this.carouselList.length);
      this.carouselList.push(carousel);
    }
  }
}
