---
permalink: /projects/
layout: single
author_profile: false
---

 <div class="container">
        <div class="portfolio-section">
            <div class="section-title"><span id="endurance"></span> Athlete</div>
            <div class="portfolio">
                <div class="portfolio-item">
                    <a href="/volume/">
                        <img src="/images/photos/sprocket.jpg" alt="Training Volume">
                        <div class="overlay">Training Volume</div>
                    </a>
                </div>
                <div class="portfolio-item">
                    <a href="/vo2max/">
                        <img src="/images/photos/boston_marathon_2024_mask3.jpg" alt="Coast to Coast">
                        <div class="overlay">VO<sub>2</sub>&nbsp; max</div>
                    </a>
                </div>
                <div class="portfolio-item">
                    <a href="/coast-to-coast/">
                        <img src="/images/photos/river_mountains.jpg" alt="Coast to Coast">
                        <div class="overlay">Coast to Coast</div>
                    </a>
                </div>
            </div>
        </div>
        <div class="portfolio-section">
            <div class="section-title"><span id="photography"></span> Photographer</div>
            <div class="portfolio">
                <div class="portfolio-item">
                    <a href="/photography/#places">
                        <img src="/images/photos/vermont-bench.jpg" alt="Places">
                        <div class="overlay">Places</div>
                    </a>
                </div>
<!--                 <div class="portfolio-item">
                    <a href="/photography/#people">
                        <img src="/images/photos/bonfire.jpg" alt="People">
                        <div class="overlay">People</div>
                    </a>
                </div> -->
                <div class="portfolio-item">
                    <a href="/photography/#things">
                        <img src="/images/photos/firepit.jpg" alt="Things">
                        <div class="overlay">Things</div>
                    </a>
                </div>
                 <div class="portfolio-item">
                    <a href="/photography/#animals">
                        <img src="/images/photos/winter_longhorns.jpg" alt="Animals">
                        <div class="overlay">Animals</div>
                    </a>
                </div>
            </div>
        </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    function typeWriter(elementId, text, delay, startDelay) {
        let element = document.getElementById(elementId);
        let charIndex = 0;

        function type() {
            if (charIndex < text.length) {
                element.innerHTML += text.charAt(charIndex);
                charIndex++;
                setTimeout(type, delay);
            }
        }

        setTimeout(type, startDelay);
    }

    typeWriter("endurance", "Amateur", 100, 2000);
    typeWriter("photography", "Amateur", 100, 3000);
});
</script>