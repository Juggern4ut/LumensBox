/**
 * Represents a lightbox that can be used to display information
 * to the user by being displayed on the top layer of the page
 *
 * @class Lightbox
 */
class Lightbox {
  /**
   * Sets up the basic structure and DOM of the lightbox
   * @author {Lukas Meier}
   * @param {Object} options The options to configure the lightbox
   *  @param {(String|String[])} options.additionalClasses Additional classes that will be added to the lightbox
   *  @param {Boolean} options.closeable If set to false, all triggers to close the lightbox will be automatically overwritten
   *  @param {Boolean} options.draggable If set to true, the lightbox can be dragged by grabbing the titlebar
   *  @param {Boolean} options.closeHandler If set to false, the lightbox will have no close button in the top right
   *  @param {Boolean} options.closeByEscape If set to false, the lightbox can't be closed by pressing escape
   *  @param {Boolean} options.clickOutsideToClose If set to true, the lightbox can be closed by clicking outside of it
   *  @param {String} options.openAnimation The animation that should be used to open the lightbox. Use: grow, fadein, jelly or fadedown
   *  @param {String} options.closeAnimation The animation that should be used to close the lightbox. Use: shrink, fadeout or fadeup
   *  @param {Number} options.animationDuration The duration of the animation in milliseconds
   *  @param {Number} options.boundsOffset If the lightbox is dragged outside of the page it will snap back with this margin
   *  @param {Boolean} options.keepInBounds If set to true, the lightbox will snap back into bounds if dragged outside
   *  @param {HTMLElement} options.appendingElement The Lightbox will be appended to this element. The body is strongly recommended here, as it is the default anyways.
   *  @param {Function} options.open Callback that gets called when the lightbox starts opening
   *  @param {Function} options.opened Callback that gets called when the lightbox finished opening
   *  @param {Function} options.close Callback that gets called when the lightbox starts closing
   *  @param {Function} options.closed Callback that gets called when the lightbox finished closing
   *  @param {Function} options.destroyed Callback that gets called when the lightbox is destroyed
   * @returns {Lightbox} The created lightbox object.
   */
  constructor(options) {
    options = options ? options : {};

    this.isOpen = false;

    this.setDefaultSettings();
    this.updateSettings(options);

    this.setupDomElements();

    this.setEscapeKeyToCloseLightbox();
    this.draggableLightbox();
    this.clickOutsideToClose();

    return this;
  }

  /**
   * Will create the DOM-Elements and place them at the end of the body
   * @author {Lukas Meier}
   * @returns {void}
   */
  setupDomElements() {
    this.container = document.createElement("div");
    this.container.classList.add("lightbox");
    this.container.style.animationDuration = `${this.options.animationDuration}ms`;

    if (
      this.options.additionalClasses &&
      this.options.additionalClasses.length
    ) {
      if (typeof this.options.additionalClasses === "string") {
        this.container.classList.add(this.options.additionalClasses);
      } else {
        this.options.additionalClasses.forEach(className => {
          this.container.classList.add(className);
        });
      }
    }

    this.inner = document.createElement("div");
    this.inner.classList.add("lightbox__inner");
    this.inner.classList.add(`lightbox__inner--${this.options.openAnimation}`);
    this.inner.style.animationDuration = `${this.options.animationDuration}ms`;

    this.closeHandler = document.createElement("div");
    this.closeHandler.classList.add("lightbox__close-handler");

    this.title = document.createElement("p");
    this.title.classList.add("lightbox__title");

    if (this.options.draggable) {
      this.title.style.cursor = "move";
      this.title.style.WebkitUserSelect = "none";
      this.title.style.MozUserSelect = "none";
      this.title.style.msUserSelect = "none";
      this.title.style.userSelect = "none";
    }

    this.closeHandler.onclick = () => {
      this.close();
    };

    this.data = document.createElement("div");
    this.data.classList.add("lightbox__data");

    if (this.options.closeHandler && this.options.closeable) {
      this.inner.append(this.closeHandler);
    }

    this.inner.append(this.title);
    this.inner.append(this.data);
    this.container.append(this.inner);
    this.options.appendingElement.append(this.container);
  }

  /**
   * Adds an eventlistener to the document to
   * allow the user to close the lightbox
   * by pressing the escape key
   * @author {Lukas Meier}
   * @returns {Boolean} true if eventlistener has been set, false otherwise
   */
  setEscapeKeyToCloseLightbox() {
    if (!this.options.closeByEscape || !this.options.closeable) return false;
    document.addEventListener("keydown", e => {
      if (e.keyCode === 27 && this.isOpen) {
        this.close();
      }
    });
    return true;
  }

  /**
   * Sets a clicklistener to close the lightbox by
   * clicking outside of it.
   * @author {Lukas Meier}
   * @returns {Boolean} true if eventlistener has been set, false otherwise
   */
  clickOutsideToClose() {
    if (!this.options.clickOutsideToClose || !this.options.closeable)
      return false;
    this.container.addEventListener("click", e => {
      if (e.target === this.container) {
        this.close();
      }
    });
    return true;
  }

  /**
   * Will add several eventlisteners that allow
   * the user to drag the lightbox by dragging
   * the title bar.
   * @author {Lukas Meier}
   * @returns {Boolean} true if eventlisteners have been set, false otherwise
   */
  draggableLightbox() {
    if (!this.options.draggable) return false;

    this.isDragging = false;
    this.currentTop = 0;
    this.currentLeft = 0;

    const mouseDown = e => {
      this.isDragging = true;
      this.initialDragX = e.type === "touchmove" ? e.touches[0].pageX : e.pageX;
      this.initialDragY = e.type === "touchmove" ? e.touches[0].pageY : e.pageY;
    };

    const mouseMove = e => {
      if (!this.isDragging) return false;

      e.preventDefault();

      let tmpX = e.type === "touchmove" ? e.touches[0].pageX : e.pageX;
      let tmpY = e.type === "touchmove" ? e.touches[0].pageY : e.pageY;

      const top = tmpY - this.initialDragY + this.currentTop;
      const left = tmpX - this.initialDragX + this.currentLeft;

      this.inner.style.top = `${top}px`;
      this.inner.style.left = `${left}px`;
    };

    const mouseUp = e => {
      if (!this.isDragging) return false;
      this.isDragging = false;
      this.currentTop = parseInt(this.inner.style.top);
      this.currentLeft = parseInt(this.inner.style.left);

      this.currentTop = this.currentTop ? this.currentTop : 0;
      this.currentLeft = this.currentLeft ? this.currentLeft : 0;

      if (this.options.keepInBounds) {
        this.keepInBounds(this.options.boundsOffset);
      }
    };

    this.title.addEventListener("mousedown", e => mouseDown(e));
    this.title.addEventListener("touchstart", e => mouseDown(e), false);

    document
      .querySelector("body")
      .addEventListener("mousemove", e => mouseMove(e));
    document
      .querySelector("body")
      .addEventListener("touchmove", e => mouseMove(e));

    document.querySelector("body").addEventListener("mouseup", e => mouseUp(e));
    document
      .querySelector("body")
      .addEventListener("touchend", e => mouseUp(e));

    return true;
  }

  /**
   * Will reset the draggin position of the lightbox
   * @author {Lukas Meier}
   * @returns {Boolean} true if position has been reset, false otherwise
   */
  resetPosition() {
    if (this.options.draggable) {
      this.inner.style.top = 0;
      this.inner.style.left = 0;
      this.currentLeft = 0;
      this.currentTop = 0;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Will check if the Lightbox is outside of the window
   * and force it back inside. This way, the user cannot
   * drag the handler outsite of the bounds.
   * @author {Lukas Meier}
   * @param {Number} puffer If the lightbox is out of bounds, it will have this number as a margin to the bounds.
   * @returns {Object} Containing which bounds have been crossed
   */
  keepInBounds(puffer) {
    let returnValue = {
      wentAbove: false,
      wentBelow: false,
      wentLeft: false,
      wentRight: false
    };

    //Prevent the box from going above the page bounds
    if (this.inner.offsetTop < 0) {
      const tmp = this.currentTop + Math.abs(this.inner.offsetTop) + puffer;
      this.inner.style.top = `${tmp}px`;
      this.currentTop = tmp;
      returnValue.wentAbove = true;
    }

    //Prevent the box from going below the page bounds
    else if (
      this.inner.offsetTop + this.inner.offsetHeight >
      window.innerHeight
    ) {
      const bottom = this.inner.offsetTop + this.inner.offsetHeight + puffer;
      const diff = window.innerHeight - bottom;
      const tmp = this.currentTop + diff;
      this.inner.style.top = `${tmp}px`;
      this.currentTop = tmp;

      const marginTop = parseInt(
        window.getComputedStyle(this.inner, null).getPropertyValue("margin-top")
      );

      const minTop = (marginTop - puffer) * -1;
      if (this.currentTop < minTop) {
        this.currentTop = minTop;
        this.inner.style.top = `${minTop}px`;
      }

      returnValue.wentBelow = true;
    }

    //Prevent the box from going left of the page bounds
    if (this.inner.offsetLeft < 0) {
      const tmp = this.currentLeft + Math.abs(this.inner.offsetLeft) + puffer;
      this.inner.style.left = `${tmp}px`;
      this.currentLeft = tmp;
      returnValue.wentLeft = true;
    }

    //Prevent the box from going right of the page bounds
    else if (
      this.inner.offsetLeft + this.inner.offsetWidth >
      window.innerWidth
    ) {
      const right = this.inner.offsetLeft + this.inner.offsetWidth + puffer;
      const diff = window.innerWidth - right;
      const tmp = this.currentLeft + diff;
      this.inner.style.left = `${tmp}px`;
      this.currentLeft = tmp;

      const marginLeft = parseInt(
        window
          .getComputedStyle(this.inner, null)
          .getPropertyValue("margin-left")
      );

      const minLeft = (marginLeft - puffer) * -1;
      if (this.currentLeft < minLeft) {
        this.currentLeft = minLeft;
        this.inner.style.left = `${minLeft}px`;
      }

      returnValue.wentRight = true;
    }

    return returnValue;
  }

  /**
   * Sets the settings to the default values. This is called
   * on initialisation and can be used to reset all settings.
   * @author {Lukas Meier}
   * @returns {void}
   */
  setDefaultSettings() {
    this.options = {};
    this.options.additionalClasses = [];
    this.options.closeable = true;
    this.options.draggable = false;
    this.options.closeHandler = true;
    this.options.closeByEscape = true;
    this.options.openAnimation = "fadedown";
    this.options.closeAnimation = "fadeup";
    this.options.clickOutsideToClose = true;
    this.options.animationDuration = 500;
    this.options.boundsOffset = 20;
    this.options.keepInBounds = true;
    this.options.appendingElement = document.querySelector("body");
    this.options.open = () => {};
    this.options.opened = () => {};
    this.options.close = () => {};
    this.options.closed = () => {};
    this.options.destroyed = () => {};
  }

  /**
   * Overrites default settings with custom ones.
   * @author {Lukas Meier}
   * @param {Object} options - Optional settings object.
   * @returns {void}
   */
  updateSettings(options) {
    for (let key in options) {
      if (key === "appendingElement" && !options.appendingElement) {
        console.warn(
          "The Element to append the lightbox to, could not be found. It will be appended to the body instead."
        );
      }

      if (options.hasOwnProperty(key)) {
        if (typeof options[key] === "object") {
          if (
            options[key] instanceof Element ||
            options[key] instanceof HTMLDocument
          ) {
            this.options[key] = options[key];
          } else {
            let suboptions = options[key];
            for (let subkey in suboptions) {
              if (suboptions.hasOwnProperty(subkey)) {
                this.options[key][subkey] = suboptions[subkey];
              }
            }
          }
        } else {
          this.options[key] = options[key];
        }
      }
    }
  }

  /**
   * Will set the content of the lightbox
   * @author {Lukas Meier}
   * @param {(String|Object)} data The data to display. Can be a String, a HTMLObject or an Array of either.
   * @param {String} title The title displayed in the top left of the lightbox
   * @returns {Lightbox} The current Lightbox-Object
   */
  setContent(data) {
    this.data.innerHTML = "";

    if (typeof data === "object") {
      if (data.length) {
        data.forEach(el => {
          if (typeof el === "string") {
            this.data.innerHTML += el;
          } else {
            this.data.append(el);
          }
        });
      } else {
        this.data.append(data);
      }
    } else {
      this.data.innerHTML = data;
    }
    return this;
  }

  /**
   * Will set the Title of the Lightbox
   * @param {String} title The title to set in the lightbox
   * @author {Lukas Meier}
   * @returns {Lightbox} The current Lightbox-Object
   */
  setTitle(title) {
    title = title ? title : "";
    this.title.innerHTML = title;
    return this;
  }

  /**
   * Gives the lightbox the --open modifier which
   * is used by CSS to make the lightbox visible
   * @author {Lukas Meier}
   * @returns {Lightbox} The current Lightbox-Object
   */
  open() {
    this.options.open();
    this.resetPosition();
    this.container.classList.add("lightbox--open");
    this.container.classList.add("lightbox--opening");
    document.querySelector("body, html").style.overflow = "hidden";
    setTimeout(() => {
      this.container.classList.remove("lightbox--opening");
      this.isOpen = true;
      this.options.opened();
    }, this.options.animationDuration);
    return this;
  }

  /**
   * Removes the --open modifier from the lightbox
   * is used by CSS to make the lightbox visible
   * @author {Lukas Meier}
   * @returns {Lightbox} The current Lightbox-Object
   */
  close() {
    this.options.close();
    this.inner.classList.add(`lightbox__inner--${this.options.closeAnimation}`);
    this.container.classList.add("lightbox--closing");
    setTimeout(() => {
      this.container.classList.remove("lightbox--open");
      this.container.classList.remove("lightbox--closing");
      this.isOpen = false;
      document.querySelector("body, html").style.overflow = "auto";
      this.inner.classList.remove(
        `lightbox__inner--${this.options.closeAnimation}`
      );
      this.options.closed();
    }, this.options.animationDuration);
    return this;
  }

  /**
   * Will remove all traces of the lightbox from the DOM
   * and calls the destroyed callback.
   * @author {Lukas Meier}
   * @returns {void}
   */
  destroy() {
    this.container.remove();
    this.inner.remove();
    this.closeHandler.remove();
    this.title.remove();
    this.data.remove();
    this.options.destroyed();
  }
}
