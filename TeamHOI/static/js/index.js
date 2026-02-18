
function main() {
  setupTabs();
  setupAllVideoSliders();
  setupTheaterMode();
}

let _loaded_groups = new Set();

// Calling this schedules images in the specified group for loading by copying
// their data-src attribute to src; once all images in the group have loaded
// we call the callback (which defaults to a trivial function).
function loadImages(group, cb = () => {}) {
  // Make sure we don't try to load the same group more than once
  if (_loaded_groups.has(group)) {
    console.log('images in group ' + group + ' have already been scheduled to load');
    return;
  }
  console.log('scheduling images in group ' + group);
  _loaded_groups.add(group);

  // Find all images in the group
  let imgs = $('div[data-content="' + group + '"] img');

  let to_load = new Set();
  imgs.each((idx, img) => {
    const url = $(img).data('src');
    to_load.add(url);
    img.onload = function() {
      to_load.delete(url);
      if (to_load.size === 0) {
        cb();
      }
    }
  });

  imgs.each((idx, img) => {
    const url = $(img).data('src');
    img.src = url;
  });
}
function setupAllVideoSliders() {
  $('.js-video-slider').each(function() {
    const $slider = $(this);
    const $slides = $slider.find('.slide');
    const $track  = $slider.find('.track');
    const $prev   = $slider.find('.prev');
    const $next   = $slider.find('.next');
    const $dotsContainer = $slider.find('.dots');

    let current = 0;

    $dotsContainer.empty();
    $slides.each((i) => {
      const $dot = $('<span class="dot"></span>');
      $dot.on('click', () => showSlide(i));
      $dotsContainer.append($dot);
    });
    const $dots = $dotsContainer.find('.dot');

    function pauseAllExcept(idx) {
      $slides.each((i, el) => {
        const vids = $(el).find('video').toArray();
        vids.forEach((v) => {
          if (i !== idx) {
            v.pause();
            v.currentTime = 0;
          }
        });
      });
    }

    function playActive(idx) {
      // play all videos in active slide
      $slides.eq(idx).find('video').each((_, v) => {
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      });
    }

    function showSlide(index) {
      const n = $slides.length;
      current = (index + n) % n;

      $track.css('transform', `translateX(${-100 * current}%)`);
      $dots.removeClass('active').eq(current).addClass('active');

      pauseAllExcept(current);
      playActive(current);
    }

    $prev.off('click').on('click', () => showSlide(current - 1));
    $next.off('click').on('click', () => showSlide(current + 1));

    showSlide(0);
  });
}


function setupTabs() {
  // Set up click handlers for the tabs
  $('#tabs li').on('click', function() {
    let tab = $(this).data('tab');

    $('#tabs li').removeClass('is-active');
    $(this).addClass('is-active');

    $('#tabs-content div').removeClass('is-active');
    $('div[data-content="' + tab + '"]').addClass('is-active');
  });
}





$(document).ready(main);