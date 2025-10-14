window.addEventListener('scroll', function() {
          const threshold = window.innerHeight * 0.3;
          if(window.scrollY > threshold) {
            document.body.classList.add('scrolled');
          } else {
            document.body.classList.remove('scrolled');
          }
        });
