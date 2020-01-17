window.addEventListener("load", () => {
  basicLightbox();
  uncloseableLightbox();
  animatedLightbox();
  draggableLightbox();
  callbackLightbox();
  stackedLightbox();
});

const basicLightbox = () => {
  const basicTrigger = document.getElementById("basic");
  window.basicLightbox = new Lightbox();
  window.basicLightbox.setTitle("Basic Lightbox");
  window.basicLightbox.setContent([
    "<p>This is a basic Lightbox with no options passed.</p>",
    "<p>It can contain everything you can place in HTML such as Iframes, Images, Videos or just plain Text</p>",
    "<p>The lightbox can be closed by clicking outside, pressing the escape key or clicking the X in the top right. All those options can be individually configured</p>"
  ]);
  basicTrigger.onclick = () => window.basicLightbox.open();
};

const uncloseableLightbox = () => {
  const uncloseableTrigger = document.getElementById("uncloseable");
  window.uncloseableLightbox = new Lightbox({
    closeable: false
  });

  const closeButton = document.createElement("button");
  closeButton.onclick = () => window.uncloseableLightbox.close();
  closeButton.innerHTML = "Close";

  window.uncloseableLightbox.setTitle("Uncloseable Lightbox");
  window.uncloseableLightbox.setContent([
    "<p>This box cannot be closed, except with this custom made close button</p>",
    closeButton
  ]);
  uncloseableTrigger.onclick = () => window.uncloseableLightbox.open();
};

const animatedLightbox = () => {
  const animationsTrigger = document.getElementById("animations");
  window.animationsLightbox = new Lightbox({
    openAnimation: "jelly",
    closeAnimation: "collapse"
  });
  window.animationsLightbox.setTitle("Animated Lightbox");
  window.animationsLightbox.setContent([
    "<p>This Lightbox has different opening and closing animations</p>",
    "<p>It uses 'jelly' to open and 'collapse' to close, but there are several more.</p>"
  ]);
  animationsTrigger.onclick = () => window.animationsLightbox.open();
};

const draggableLightbox = () => {
  const draggableTrigger = document.getElementById("draggable");
  window.draggableLightbox = new Lightbox({
    draggable: true
  });
  window.draggableLightbox.setTitle("Draggable Lightbox");
  window.draggableLightbox.setContent([
    "<p>This Lightbox can be dragged around by grabbing the titlebar</p>",
    "<p>If you drag it outside of the pagebounds and let go, it will snap back</p>",
    "<p>With this option enabled, the user can no longer select the text in the title of the lightbox.</p>"
  ]);
  draggableTrigger.onclick = () => window.draggableLightbox.open();
};

const callbackLightbox = () => {
  const callbackTrigger = document.getElementById("callback");
  window.callbackLightbox = new Lightbox({
    animationDuration: 1500,
    close: () => window.callbackLightbox.setContent("<p>Bye Bye</p>"),
    open: () => window.callbackLightbox.setContent("<p>Hello there</p>"),
    opened: () =>
      window.callbackLightbox.setContent(
        "<p>This Lightbox will use callbacks to change the content</p>"
      )
  });
  window.callbackLightbox.setTitle("Callback Lightbox");
  callbackTrigger.onclick = () => window.callbackLightbox.open();
};

const stackedLightbox = () => {
  const stackedTrigger = document.getElementById("stacked");
  window.stackedLightbox = new Lightbox();
  window.secondLightbox = new Lightbox({ draggable: true })
    .setTitle("Another stacked lightbox")
    .setContent("<p>There we go!</p>");

  const closeButton = document.createElement("button");
  closeButton.onclick = () => window.secondLightbox.open();
  closeButton.innerHTML = "We will";

  window.stackedLightbox.setTitle("Stacked lightbox");
  window.stackedLightbox.setContent([
    "<p>We need to go deeper Leo!</p>",
    closeButton
  ]);
  stackedTrigger.onclick = () => window.stackedLightbox.open();
};
