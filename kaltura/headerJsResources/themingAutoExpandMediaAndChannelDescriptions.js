document.addEventListener("DOMContentLoaded", () => {
  (function () {
    const BUTTON_SELECTOR =
      'button.kms-ds-media-page-description-show-more, button.category-page-desc-more';
    function tryClick() {
      if (document.querySelector("#tab-learn-more")) {
        return;
      }
      const buttons = document.querySelectorAll(BUTTON_SELECTOR);
      if (buttons.length) {
        buttons.forEach(btn => btn.click());
        observer.disconnect();
      }
    }
    tryClick();
    const observer = new MutationObserver(() => {
      tryClick();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  })();
});