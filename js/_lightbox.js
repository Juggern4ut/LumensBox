/**
 * Represents a lightbox
 */
class LumensBox {
  /**
   * Sets up the basic structure and DOM of the lightbox
   * @author {Lukas Meier}
   * @param {Object} options The options to configure the lightbox
   * @returns {void}
   */
  constructor(options) {
    options = options ? options : {};

    this.setDefaultSettings();
    this.updateSettings(options);

    this.container = document.createElement("div");
    this.container.classList.add("lightbox");

    if (options.additionalClasses && options.additionalClasses.length) {
      options.additionalClasses.forEach(className => {
        this.container.classList.add(className);
      });
    }

    this.inner = document.createElement("div");
    this.inner.classList.add("lightbox__inner");
    this.inner.classList.add(`lightbox__inner--${this.options.openAnimation}`);
    this.inner.style.animationDuration = this.options.animationDuration + "ms";

    this.closeHandler = document.createElement("div");
    this.closeHandler.classList.add("lightbox__close-handler");

    this.title = document.createElement("p");
    this.title.classList.add("lightbox__title");

    if (this.options.draggable) {
      this.title.style.cursor = "move";
    }

    this.closeHandler.onclick = () => {
      this.close();
    };

    this.data = document.createElement("div");
    this.data.classList.add("lightbox__data");

    if (!this.options.noCloseHandler) {
      this.inner.append(this.closeHandler);
    }
    this.inner.append(this.title);
    this.inner.append(this.data);
    this.container.append(this.inner);
    document.querySelector("body").append(this.container);
    if (!this.options.noCloseByEscape) {
      this.setEscapeKeyToCloseLightbox();
    }
    if (this.options.draggable) {
      this.draggableLightbox();
    }
  }

  /**
   * Adds an eventlistener to the document to
   * allow the user to close the lightbox
   * by pressing the escape key
   * @author {Lukas Meier}
   * @returns {void}
   */
  setEscapeKeyToCloseLightbox() {
    document.addEventListener("keydown", e => {
      if (e.keyCode === 27) {
        this.close();
      }
    });
  }

  /**
   * Will add several eventlisteners that allow
   * the user to drag the lightbox by dragging
   * the title bar.
   * @author {Lukas Meier}
   * @returns {void}
   */
  draggableLightbox() {
    this.isDragging = false;
    this.currentTop = 0;
    this.currentLeft = 0;

    this.title.addEventListener("mousedown", e => {
      this.isDragging = true;
      this.initialDragX = e.pageX;
      this.initialDragY = e.pageY;
    });

    document.querySelector("body").addEventListener("mousemove", e => {
      if (!this.isDragging) return false;

      const top = e.pageY - this.initialDragY + this.currentTop;
      const left = e.pageX - this.initialDragX + this.currentLeft;

      this.inner.style.top = `${top}px`;
      this.inner.style.left = `${left}px`;
    });

    document.querySelector("body").addEventListener("mouseup", () => {
      if (!this.isDragging) return false;
      this.isDragging = false;
      this.currentTop = parseInt(this.inner.style.top);
      this.currentLeft = parseInt(this.inner.style.left);

      this.currentTop = this.currentTop ? this.currentTop : 0;
      this.currentLeft = this.currentLeft ? this.currentLeft : 0;

      this.keepInBounds(20);
    });
  }

  /**
   * Will reset the draggin position of the lightbox
   * @author {Lukas Meier}
   * @returns {void}
   */
  resetPosition() {
    if (this.options.draggable) {
      this.inner.style.top = 0;
      this.inner.style.left = 0;
      this.currentLeft = 0;
      this.currentTop = 0;
    }
  }

  /**
   * Gives the lightbox the --open modifier which
   * is used by CSS to make the lightbox visible
   * @author {Lukas Meier}
   * @returns {void}
   */
  open() {
    this.options.open();
    this.resetPosition();
    this.container.classList.add("lightbox--open");
    document.querySelector("body, html").style.overflow = "hidden";
    setTimeout(() => {
      this.options.opened();
    }, this.options.animationDuration);
  }

  /**
   * Removes the --open modifier from the lightbox
   * is used by CSS to make the lightbox visible
   * @author {Lukas Meier}
   * @returns {void}
   */
  close() {
    this.options.close();
    this.inner.classList.add(`lightbox__inner--${this.options.closeAnimation}`);
    setTimeout(() => {
      this.container.classList.remove("lightbox--open");
      document.querySelector("body, html").style.overflow = "auto";
      this.inner.classList.remove(
        `lightbox__inner--${this.options.closeAnimation}`
      );
      this.options.closed();
    }, this.options.animationDuration);
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
      this.inner.style.top = tmp + "px";
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
      this.inner.style.top = tmp + "px";
      this.currentTop = tmp;

      const marginTop = parseInt(
        window.getComputedStyle(this.inner, null).getPropertyValue("margin-top")
      );

      const minTop = (marginTop - puffer) * -1;
      if (this.currentTop < minTop) {
        this.currentTop = minTop;
        this.inner.style.top = minTop + "px";
      }

      returnValue.wentBelow = true;
    }

    //Prevent the box from going left of the page bounds
    if (this.inner.offsetLeft < 0) {
      const tmp = this.currentLeft + Math.abs(this.inner.offsetLeft) + puffer;
      this.inner.style.left = tmp + "px";
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
      this.inner.style.left = tmp + "px";
      this.currentLeft = tmp;

      const marginLeft = parseInt(
        window
          .getComputedStyle(this.inner, null)
          .getPropertyValue("margin-left")
      );

      const minLeft = (marginLeft - puffer) * -1;
      if (this.currentLeft < minLeft) {
        this.currentLeft = minLeft;
        this.inner.style.left = minLeft + "px";
      }

      returnValue.wentRight = true;
    }

    return returnValue;
  }

  /**
   * Will set the content of the lightbox
   * @author {Lukas Meier}
   * @param {String | Object} data The data to display. Can be a String, a HTMLObject or an Array of either.
   * @param {String} title The title displayed in the top left of the lightbox
   * @returns {void}
   */
  setContent(data) {
    this.data.innerHTML = "";

    if (typeof data === "object") {
      if (data.length) {
        data.forEach(el => {
          this.data.append(el);
        });
      } else {
        this.data.append(data);
      }
    } else {
      this.data.innerHTML = data;
    }
  }

  /**
   * Will set the Title of the Lightbox
   * @param {String} title The title to set in the lightbox
   * @author {Lukas Meier}
   */
  setTitle(title) {
    title = title ? title : "";
    this.title.innerHTML = title;
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
    this.options.draggable = true;
    this.options.noCloseHandler = false;
    this.options.noCloseByEscape = false;
    this.options.openAnimation = "fadein";
    this.options.closeAnimation = "fadeout";
    this.options.animationDuration = 500;
    this.options.open = () => {};
    this.options.opened = () => {};
    this.options.close = () => {};
    this.options.closed = () => {};
  }

  /**
   * Overrites default settings with custom ones.
   * @author {Lukas Meier}
   * @param {Object} options - Optional settings object.
   * @returns {void}
   */
  updateSettings(options) {
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        if (typeof options[key] === "object") {
          var suboptions = options[key];
          for (var subkey in suboptions) {
            if (suboptions.hasOwnProperty(subkey)) {
              this.options[key][subkey] = suboptions[subkey];
            }
          }
        } else {
          this.options[key] = options[key];
        }
      }
    }
  }
}
