//Funksioni per preloaderin e websitit qe te shfaqet sa hapim websitin dhe per disa sekonda te zhduket

(function(loader) {

    window.addEventListener('beforeunload', function(e) {
      activateLoader();
    });
    
    window.addEventListener('load', function(e) {
      deactivateLoader();
    });
    
    function activateLoader() {
      loader.style.display = 'block';
      loader.style.opacity = 1;
    }
    
    function deactivateLoader() {
      setTimeout(function() {
        deactivate();
      }, 1000);
    
      function deactivate() {
        loader.style.opacity = 0;
        loader.addEventListener('transitionend', function() {
          loader.style.display = 'none';
        }, false);
      }
    }
    
    })(document.querySelector('.loader-container'));