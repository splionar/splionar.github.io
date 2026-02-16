


function main() {
  setupTabs();
  setupVideoSlider(); 
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

function setupVideoSlider() {
  const $slider = $('#results-slider');
  if ($slider.length === 0) return;

  const $slides = $slider.find('.slide');
  const $track  = $slider.find('.track');
  const $prev   = $slider.find('.prev');
  const $next   = $slider.find('.next');
  const $dotsContainer = $slider.find('.dots');

  let current = 0;

  // Build dots
  $dotsContainer.empty();
  $slides.each((i) => {
    const $dot = $('<span class="dot"></span>');
    $dot.on('click', () => showSlide(i));
    $dotsContainer.append($dot);
  });
  const $dots = $dotsContainer.find('.dot');

  function pauseAllExcept(idx) {
    $slides.each((i, el) => {
      const v = $(el).find('video').get(0);
      if (!v) return;
      if (i !== idx) {
        v.pause();
        v.currentTime = 0; // optional
      }
    });
  }

  function playActive(idx) {
    const v = $slides.eq(idx).find('video').get(0);
    if (v) {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  }

  function showSlide(index) {
    const n = $slides.length;
    current = (index + n) % n;

    // Move track
    $track.css('transform', `translateX(${-100 * current}%)`);

    // Update dots
    $dots.removeClass('active');
    $dots.eq(current).addClass('active');

    pauseAllExcept(current);
    playActive(current);
  }

  $prev.on('click', () => showSlide(current - 1));
  $next.on('click', () => showSlide(current + 1));

  // Init
  showSlide(0);
}



function openModal(elem) {
  $(elem).addClass('is-active');
  $('#plot-loading-div').show();
  $('#plot-div').hide();
}


function closeModal(elem) {
  $(elem).removeClass('is-active');
  $('#plot-div').empty();
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