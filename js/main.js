window.addEventListener("load", () => {
  const trigger = document.getElementById("trigger");
  if (trigger) {
    
    const lightbox = new LumensBox({
      animationDuration: 500,
      openAnimation: "jelly",
      closeAnimation: "shrink"
    });

    lightbox.setTitle("Lightbox Title");

    const text = document.createElement("p");
    text.innerHTML =
      "You can close the box by pressing 'ESC', clicking the X in the top right or press the close button below.";

    const button = document.createElement("button");
    button.innerHTML = "Close";
    button.onclick = () => lightbox.close();

    trigger.onclick = () => {
      lightbox.setContent([text, button]);
      lightbox.open();
    };
  }
});
