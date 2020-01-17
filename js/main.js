window.addEventListener("load", () => {
  const trigger = document.getElementById("trigger");
  if (trigger) {
    window.lightbox = new Lightbox({
      animationDuration: 500,
      openAnimation: "fadedown", 
      closeAnimation: "shrink"
    }).setTitle("Lightbox Title");

    const text = document.createElement("p");
    text.innerHTML =
      "You can close the box by pressing 'ESC', clicking the X in the top right, press the close button below or click outside of the lightbox";

    const button = document.createElement("button");
    button.innerHTML = "Close";
    button.onclick = () => lightbox.close();

    trigger.onclick = () => {
      lightbox.setContent([text, button]);
      lightbox.open();
    };
  }
});
