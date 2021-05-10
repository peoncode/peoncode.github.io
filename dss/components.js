/**
 * @description A carousel component using Flickity
 * @class TileCarousel
 */
class TileCarousel {
  constructor(rowTitle = "", refId = "", refType = "") {
    this.container = document.createElement("div");
    this.container.className = "carousel";
    this.refId = refId;
    this.refType = refType;
    
    let titleElement;
    if (refId) {
      titleElement = document.createElement("div");
      titleElement.className = "lds-ellipsis";
      [1,2,3,4].forEach(() => titleElement.appendChild(document.createElement("div")));
    } else {
      titleElement = document.createElement("h4");
      titleElement.className = "carouselTitle";
      titleElement.innerHTML = rowTitle;
    }
    this.container.appendChild(titleElement);
      
    this.tilesDiv = document.createElement("div");
    this.tilesDiv.className = "track";
    this.container.appendChild(this.tilesDiv);
    this.carousel = new Flickity(this.tilesDiv, {
      wrapAround: true,
      draggable: false,
      groupCells: true,
      pageDots: false,
      prevNextButtons: false,
      cellAlign: "left",
      percentPosition: false,
    });
  }

  /**
   * @description Sets the items (VideoTile) inside the carousel
   * @param {VideoTile} [items=[]] A list of VideoTile objects
   * @param {number} [rowIndex=0] The rowIndex to save to data-row-index attribute
   * @memberof TileCarousel
   */
  setItems(items = [], rowIndex = 0) {
    items.forEach((item) => {
      this.carousel.append((new VideoTile(item, this.carousel)).getDOMElement());
    });
    this.carousel.resize();

    this.tilesDiv.tabIndex = "-1";
    this.tilesDiv.firstChild.firstChild.style.left = "10px";
    this.container.dataset.rowIndex = rowIndex;
  }

  /**
   * @description Removes a tile from carousel
   * @param {ELement} tile
   * @memberof TileCarousel
   */
  removeTile(tile) {
    this.carousel.remove(tile);
    this.carousel.resize();
  }

  getDOMElement() {
    return this.container;
  }
}

/**
 * @description A class for the movie tile
 * @class VideoTile
 */
class VideoTile {
  constructor(params, parent) {
    this.parent = parent;
    this.ratio = "1.78";
    this.textSourceEntity = this.__getSourceEntity(params.text.title.full);
    this.imageSourceEntity = this.__getSourceEntity(params.image.tile[this.ratio]);
    this.container = document.createElement("div");
    this.container.className = "tile track-cell";
    this.container.tabIndex = "0";
    
    this.__addTileComponets(params);
  }
  
  getDOMElement() {
    return this.container;
  }
  /**
   * @description Sets the image src. If image doesn't load, we remove this tile
   * @param {object} { text, image } text is the text data, image is image data
   * @memberof VideoTile
   */
  __addTileComponets({ text, image }) {
    const title = text.title.full[this.textSourceEntity].default.content;
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "imageContainer";

    const imgElement = document.createElement("img");
    imgElement.className = "tileImage";
    imgElement.alt = title;
    if (image.tile[this.ratio]) {
      let imageId = image.tile[this.ratio][this.imageSourceEntity].default.masterId;
      imgElement.src = `https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/${imageId}/scale?format=jpeg&quality=90&scalingAlgorithm=lanczos3&width=500`;
    }
    imgElement.onerror = () => {
      this.parent.remove(this.container);
      this.parent.resize();
    };
    buttonContainer.appendChild(imgElement);
    this.container.appendChild(buttonContainer);
  }

  /**
   * @description A hacky function to retrieve the sourceEntity of the data set by getting the first key at paramPath
   * @param {object} paramPath
   * @return {string} the sourceEntity key
   * @memberof VideoTile
   */
  __getSourceEntity(paramPath) {
    for (let key in paramPath) {
      return key;
    }
    return "default";
  }
}
