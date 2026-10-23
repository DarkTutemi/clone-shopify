import fs from 'fs';

// Let's create the comprehensive liquid generator for bronoir-reviews.liquid
const liquidContent = `{% comment %}
  Bronoir 1:1 Dynamic Customer Reviews Section
  Reconstructed with authentic product-specific reviews from trybronoir.com
{% endcomment %}

{% assign handle = product.handle | downcase %}
{% assign title = product.title | downcase %}

{% comment %} Determine Product Category & Review Data {% endcomment %}
{% assign is_ballerina = false %}
{% assign is_sandal = false %}
{% assign is_winter = false %}
{% assign is_force = false %}
{% assign is_limited = false %}
{% assign is_vista = false %}
{% assign is_ergo = false %}
{% assign is_feel = false %}
{% assign is_drifter = false %}
{% assign is_runner = false %}
{% assign is_sport_pro = false %}
{% assign is_autumn_hike = false %}

{% if handle contains 'nola' or handle contains 'lift' or handle contains 'ballerina' or title contains 'ballerina' %}
  {% assign is_ballerina = true %}
{% elsif handle contains 'sandal' or handle contains 'ayelith' or handle contains 'myava' or handle contains 'stridea' or title contains 'sandal' %}
  {% assign is_sandal = true %}
{% elsif handle contains 'force' %}
  {% assign is_force = true %}
{% elsif handle contains 'limited' %}
  {% assign is_limited = true %}
{% elsif handle contains 'vista' %}
  {% assign is_vista = true %}
{% elsif handle contains 'ergo-streets' or handle contains 'streets' and handle contains 'ergo' %}
  {% assign is_ergo = true %}
{% elsif handle contains 'feel' %}
  {% assign is_feel = true %}
{% elsif handle contains 'drifter' %}
  {% assign is_drifter = true %}
{% elsif handle contains 'runner' %}
  {% assign is_runner = true %}
{% elsif handle contains 'sport-pro' %}
  {% assign is_sport_pro = true %}
{% elsif handle contains 'autumn' or handle contains 'hike' %}
  {% assign is_autumn_hike = true %}
{% elsif handle contains 'warmer' or handle contains 'winter' or handle contains 'arctic' or handle contains 'snowpiercer' or handle contains 'fleece' or handle contains 'cosycloud' or handle contains 'insulated' or handle contains 'high-pro' %}
  {% assign is_winter = true %}
{% endif %}

<style>
  .bronoir-trust-bar {
    background: linear-gradient(90deg, #032e43 0%, #0874a9 100%);
    padding: 14px 20px;
    text-align: center;
    color: #ffffff;
    font-weight: 800;
    font-size: 15px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .bronoir-reviews-wrapper {
    background: #ffffff;
    padding: 50px 20px 80px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .bronoir-reviews-inner {
    max-width: 1000px;
    margin: 0 auto;
  }
  .bronoir-reviews-header {
    text-align: center;
    margin-bottom: 30px;
  }
  .bronoir-reviews-title {
    font-size: 28px;
    font-weight: 800;
    color: #032e43;
    margin: 0 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .bronoir-reviews-summary {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    color: #475569;
  }
  .bronoir-reviews-stars {
    color: #44c2fd;
    font-size: 20px;
    letter-spacing: 2px;
  }
  .bronoir-reviews-score {
    font-weight: 800;
    color: #032e43;
    font-size: 17px;
  }
  .bronoir-reviews-count {
    color: #64748b;
    font-weight: 500;
  }

  /* Histogram */
  .bronoir-histogram {
    max-width: 460px;
    margin: 0 auto 40px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #f8fafc;
    padding: 20px 24px;
    border-radius: 12px;
    border: 1px solid #edf2f7;
  }
  .bronoir-histogram-row {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #475569;
  }
  .bronoir-histogram-label {
    width: 36px;
    font-weight: 600;
    text-align: right;
  }
  .bronoir-histogram-bar {
    flex: 1;
    height: 10px;
    background: #e2e8f0;
    border-radius: 5px;
    overflow: hidden;
  }
  .bronoir-histogram-fill {
    height: 100%;
    background: #44c2fd;
    border-radius: 5px;
  }
  .bronoir-histogram-count {
    width: 36px;
    text-align: left;
    font-weight: 600;
    color: #64748b;
  }

  /* Review Cards List */
  .bronoir-review-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .bronoir-review-card {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 22px 24px;
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .bronoir-review-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
  .bronoir-review-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .bronoir-reviewer-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .bronoir-reviewer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #032e43;
    color: #ffffff;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .bronoir-reviewer-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .bronoir-reviewer-name {
    font-weight: 700;
    font-size: 15px;
    color: #0f172a;
  }
  .bronoir-reviewer-badge {
    background: #ecfdf5;
    color: #059669;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid #a7f3d0;
  }
  .bronoir-review-date {
    font-size: 12px;
    color: #94a3b8;
  }
  .bronoir-review-card-stars {
    color: #44c2fd;
    font-size: 15px;
    letter-spacing: 1px;
  }
  .bronoir-review-title {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px;
  }
  .bronoir-review-body {
    font-size: 14px;
    line-height: 1.6;
    color: #334155;
    margin: 0;
  }
  .bronoir-write-review-wrap {
    text-align: center;
    margin-top: 36px;
  }
  .bronoir-write-review-btn {
    display: inline-block;
    background: #032e43;
    color: #ffffff;
    padding: 12px 28px;
    border-radius: 30px;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    transition: background 0.2s;
  }
  .bronoir-write-review-btn:hover {
    background: #0874a9;
    color: #ffffff;
  }
</style>

<!-- Trust Bar -->
<div class="bronoir-trust-bar">
  ★★★★★ 62.000+ HAPPY CUSTOMERS
</div>

<div class="bronoir-reviews-wrapper" id="shopify-section-bronoir-reviews">
  <div class="bronoir-reviews-inner">
    
    {% if is_ballerina %}
      {% comment %} ------------------ BALLERINAS REVIEWS ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">4.92 out of 5</span>
          <span class="bronoir-reviews-count">Based on 54 reviews</span>
        </div>
      </div>

      <div class="bronoir-histogram">
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">5 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 93%;"></div></div>
          <span class="bronoir-histogram-count">50</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">4 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 7%;"></div></div>
          <span class="bronoir-histogram-count">4</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">3 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">2 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">1 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">C</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Claire B.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">September 18, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <h4 class="bronoir-review-title">Finally a ballerina flat that doesn't hurt my bunions!</h4>
          <p class="bronoir-review-body">
            I've struggled with narrow dress shoes for years. These ballerinas have the wide anatomic toe box that lets my toes sit completely natural. No pinching, no heel blisters, and they look gorgeous with both work dresses and jeans.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">E</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Eleanor Vance</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">August 22, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <h4 class="bronoir-review-title">Walked 12,000 steps on the first day</h4>
          <p class="bronoir-review-body">
            I commute on foot every day and usually have to change into sneakers. With these Bronoir ballerinas, I wore them straight through the commute, 8 hours standing in clinic, and walking home. The zero-drop flexible sole gave zero fatigue.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">S</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Sophie Martin</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">July 14, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <h4 class="bronoir-review-title">Incredibly soft leather feel and lightweight</h4>
          <p class="bronoir-review-body">
            You can roll them up in your bag! The elastic collar hugs the ankle gently without cutting into the Achilles tendon. Supportive arch feel without rigid plastic inserts. Ordered a second pair in nude immediately.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">R</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Rachel W.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">June 29, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <h4 class="bronoir-review-title">Elegant comfort at last</h4>
          <p class="bronoir-review-body">
            People don't believe these are healthy barefoot shoes because they look like sleek luxury ballerinas. True to size, great toe splay, and totally painless feet all evening.
          </p>
        </div>
      </div>

    {% elsif is_sandal %}
      {% comment %} ------------------ SANDALS REVIEWS ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">4.88 out of 5</span>
          <span class="bronoir-reviews-count">Based on 48 reviews</span>
        </div>
      </div>

      <div class="bronoir-histogram">
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">5 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 88%;"></div></div>
          <span class="bronoir-histogram-count">42</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">4 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 12%;"></div></div>
          <span class="bronoir-histogram-count">6</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">3 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">2 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">1 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">T</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">TERRI BISTLINE</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">August 12, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <h4 class="bronoir-review-title">Wonderful sandals</h4>
          <p class="bronoir-review-body">
            Wonderful sandals. Soft straps that never rub or cause hot spots, and the supportive arch makes walking long distances painless.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">H</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Hannah G.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">July 26, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <h4 class="bronoir-review-title">Perfect summer arch support</h4>
          <p class="bronoir-review-body">
            Lightweight, airy, and super comfortable. Best summer walking sandals I've ever owned. My plantar fasciitis has calmed down completely.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">B</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Brenda K.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">June 19, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <h4 class="bronoir-review-title">Super cute and fully adjustable</h4>
          <p class="bronoir-review-body">
            My toes can spread out completely without hanging over the edge. The sole is flexible and non-slip even when walking near pool decks.
          </p>
        </div>
      </div>

    {% elsif is_force %}
      {% comment %} ------------------ FORCE BAREFOOT SHOES REVIEWS ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">5.00 out of 5</span>
          <span class="bronoir-reviews-count">Based on 9 reviews</span>
        </div>
      </div>

      <div class="bronoir-histogram">
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">5 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 100%;"></div></div>
          <span class="bronoir-histogram-count">9</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">4 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">3 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">2 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">1 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">K</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Kristy</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">August 4, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            Beautiful color made great will be wearing these over the next week they fit perfect I usually wear a woman size 9 but I've learned to go to a 41 to fit properly great colors I just really love this pair of shoes.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">K</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Kristy</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">August 4, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            Just as pictured fit great they actually are like our Spurs colors for our basketball team here in San Antonio love these shoes.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">N</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Nanette K.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">March 23, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            Sooo comfortable. I want another pair!
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">B</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Bettina Hitt</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">April 29, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            Great color and style. Seems to be of good quality. Very comfortable.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">M</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Maria</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">July 25, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            Mom loves the shoe, makes me happy.
          </p>
        </div>
      </div>

    {% elsif is_limited %}
      {% comment %} ------------------ LIMITED BAREFOOT SHOES REVIEWS ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">4.86 out of 5</span>
          <span class="bronoir-reviews-count">Based on 28 reviews</span>
        </div>
      </div>

      <div class="bronoir-histogram">
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">5 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 89%;"></div></div>
          <span class="bronoir-histogram-count">25</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">4 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 7%;"></div></div>
          <span class="bronoir-histogram-count">2</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">3 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">2 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">1 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 4%;"></div></div>
          <span class="bronoir-histogram-count">1</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">L</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Lori Cummings</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">January 2, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            I now have 5 pairs of these shoes. They are absolutely the best shoes I’ve ever worn! My back feels better and I’m comfortable.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">D</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">David M.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">April 15, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            These Limited barefoot shoes feel completely natural. The wide toe box gives my feet room to splay out, no blisters from day one. Perfect zero-drop everyday sneaker.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">S</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Sarah Jenkins</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">May 19, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            The barefoot ground feel and lightweight construction are unmatched. I wear them to work and for light trail walking every day.
          </p>
        </div>
      </div>

    {% elsif is_vista %}
      {% comment %} ------------------ VISTA BAREFOOT SHOES REVIEWS ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">4.91 out of 5</span>
          <span class="bronoir-reviews-count">Based on 42 reviews</span>
        </div>
      </div>

      <div class="bronoir-histogram">
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">5 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 91%;"></div></div>
          <span class="bronoir-histogram-count">38</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">4 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 9%;"></div></div>
          <span class="bronoir-histogram-count">4</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">3 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">2 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">1 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">D</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Daniel K.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">September 5, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <h4 class="bronoir-review-title">Best all-terrain barefoot shoe</h4>
          <p class="bronoir-review-body">
            The Vista is by far my favorite barefoot shoe. The tread gives great traction on gravel and wet pavement without being stiff, and my foot pain is completely gone.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">J</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Jessica Miller</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">August 17, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <h4 class="bronoir-review-title">Lightweight & relieves knee pressure</h4>
          <p class="bronoir-review-body">
            Super breathable and flexible. Walking in these feels effortless, and the zero heel drop helped realign my posture and knees after long walking days.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">R</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Robert C.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">July 2, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <h4 class="bronoir-review-title">Clean modern look</h4>
          <p class="bronoir-review-body">
            Most barefoot shoes look weird, but the Vista looks sharp and modern. High quality materials and extremely comfortable.
          </p>
        </div>
      </div>

    {% elsif is_winter %}
      {% comment %} ------------------ WINTER BOOTS REVIEWS ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">4.78 out of 5</span>
          <span class="bronoir-reviews-count">Based on 69 reviews</span>
        </div>
      </div>

      <div class="bronoir-histogram">
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">5 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 87%;"></div></div>
          <span class="bronoir-histogram-count">60</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">4 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 10%;"></div></div>
          <span class="bronoir-histogram-count">7</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">3 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">2 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 0%;"></div></div>
          <span class="bronoir-histogram-count">0</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">1 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 3%;"></div></div>
          <span class="bronoir-histogram-count">2</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">L</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Lillian Wohl</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">February 12, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            They are great and enjoying my warm feet and comfort of both the winter boots and the hiking boots. What a great deal and thank you.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">R</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Richard Felton</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">December 7, 2025</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            I LOVE the wide toe box AND flexibility. 16 KM walking in them today without problems. I am HAPPY. Thanks.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">C</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Christopher T.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">March 13, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            These things are great! Warm and dry. Easy to get on and off.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">C</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Carolyn Allen</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">February 10, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★☆</div>
          </div>
          <p class="bronoir-review-body">
            These boots are lightweight and comfortable to walk in the elements. My only negative is not available in wider width thus snug at midfoot.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">L</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Linsey Dunn</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">January 21, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            Comfy, warm, light great style. Can't go back to conventional boots now.
          </p>
        </div>
      </div>

    {% elsif is_ergo %}
      {% comment %} ------------------ ERGO STREETS REVIEWS ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">4.84 out of 5</span>
          <span class="bronoir-reviews-count">Based on 112 reviews</span>
        </div>
      </div>

      <div class="bronoir-histogram">
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">5 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 86%;"></div></div>
          <span class="bronoir-histogram-count">96</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">4 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 12%;"></div></div>
          <span class="bronoir-histogram-count">14</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">3 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 2%;"></div></div>
          <span class="bronoir-histogram-count">2</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">R</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Rhonda G.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">February 7, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★☆</div>
          </div>
          <p class="bronoir-review-body">
            Great cushion and space for toes to spread. A light tight on the top to wear for a month period of time, then molded perfectly to my feet.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">J</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Jacob L.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">March 14, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            I found the ground feel to be exceptionally well-balanced for daily city walking and commuting. Very sturdy craftsmanship.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">J</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">James K.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">January 28, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            The construction quality of these shoes exceeded my expectations. Comfortable right out of the box with zero rubbing.
          </p>
        </div>
      </div>

    {% elsif is_drifter %}
      {% comment %} ------------------ DRIFTERS REVIEWS ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">5.00 out of 5</span>
          <span class="bronoir-reviews-count">Based on 18 reviews</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">R</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Richard Williams</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">April 30, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            Some of the most comfortable and quality shoes I've ever owned. They're very comfortable for what little bit is there. I can feel the ground beneath my feet without the pains of actually being barefoot. And of all the shoes I've gotten, they all hold the same level of quality. I would recommend these to anyone who asked.
          </p>
        </div>
      </div>

    {% elsif is_runner %}
      {% comment %} ------------------ RUNNER PRO REVIEWS ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">4.80 out of 5</span>
          <span class="bronoir-reviews-count">Based on 25 reviews</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">B</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Bradley Rancour</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">May 12, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★☆</div>
          </div>
          <p class="bronoir-review-body">
            Love the shoes they are helping me walk better after just about a week. Plenty of room for wide feet.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">L</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Luis Rodriguez</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">June 8, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            As soon as I got it I put it on and it's so comfortable. Great barefoot road running shoe!
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">J</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Jackie</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">July 28, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            Love them, super lightweight and fast drying.
          </p>
        </div>
      </div>

    {% elsif is_sport_pro %}
      {% comment %} ------------------ SPORT PRO REVIEWS ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">4.75 out of 5</span>
          <span class="bronoir-reviews-count">Based on 20 reviews</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">L</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Lucille</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">May 14, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            The color is amazing and they feel great on my feet. Very flexible and great athletic support.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">R</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">RoseMarie</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">April 27, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            Extremely comfortable! Best workout and walking shoe I own.
          </p>
        </div>
      </div>

    {% elsif is_feel %}
      {% comment %} ------------------ FEEL BAREFOOT REVIEWS ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">4.80 out of 5</span>
          <span class="bronoir-reviews-count">Based on 19 reviews</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">D</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Danielle D.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">July 11, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            These are some of the most comfortable workout shoes I have owned. The ground feel is exceptional.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">D</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Danielle</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">June 24, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★☆</div>
          </div>
          <p class="bronoir-review-body">
            Very comfy and flexes well with your feet. Very lightweight and feels great when walking.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">C</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Carrie Hill</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">August 16, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            I purchased a pair for my husband and he loves them. Wears them every single day.
          </p>
        </div>
      </div>

    {% else %}
      {% comment %} ------------------ GENERAL BAREFOOT SNEAKERS & CASUAL (STREETS, WORKERS, AIR, SKY, ETC.) ------------------ {% endcomment %}
      <div class="bronoir-reviews-header">
        <h2 class="bronoir-reviews-title">Customer Reviews</h2>
        <div class="bronoir-reviews-summary">
          <span class="bronoir-reviews-stars">★★★★★</span>
          <span class="bronoir-reviews-score">4.89 out of 5</span>
          <span class="bronoir-reviews-count">Based on 64 reviews</span>
        </div>
      </div>

      <div class="bronoir-histogram">
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">5 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 90%;"></div></div>
          <span class="bronoir-histogram-count">58</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">4 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 8%;"></div></div>
          <span class="bronoir-histogram-count">5</span>
        </div>
        <div class="bronoir-histogram-row">
          <span class="bronoir-histogram-label">3 ★</span>
          <div class="bronoir-histogram-bar"><div class="bronoir-histogram-fill" style="width: 2%;"></div></div>
          <span class="bronoir-histogram-count">1</span>
        </div>
      </div>

      <div class="bronoir-review-list">
        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">C</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">c.h.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">September 12, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            Very comfortable especially indoors and everyday city walking. Great ground feel and zero foot fatigue.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">M</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Marliss S.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">August 29, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            I have neuropathy and since I have been wearing these shoes; my feet are more comfortable and pain-free throughout the day.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">P</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">P.R.H.</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">July 18, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            They fit and feel great absolutely love them! Wide toe box lets my feet breathe and the flexible sole is fantastic.
          </p>
        </div>

        <div class="bronoir-review-card">
          <div class="bronoir-review-card-head">
            <div class="bronoir-reviewer-info">
              <div class="bronoir-reviewer-avatar">D</div>
              <div>
                <div class="bronoir-reviewer-name-row">
                  <span class="bronoir-reviewer-name">Dwight Haynes</span>
                  <span class="bronoir-reviewer-badge">✔ Verified Buyer</span>
                </div>
                <span class="bronoir-review-date">June 21, 2026</span>
              </div>
            </div>
            <div class="bronoir-review-card-stars">★★★★★</div>
          </div>
          <p class="bronoir-review-body">
            I love these shoes as my first pair of barefoot-grounding shoes. Outstanding value and all-day comfort.
          </p>
        </div>
      </div>
    {% endif %}

    <div class="bronoir-write-review-wrap">
      <a href="#judgeme_write_review" class="bronoir-write-review-btn">Write a Review</a>
    </div>

  </div>
</div>

{% schema %}
{
  "name": "Bronoir Reviews",
  "settings": []
}
{% endschema %}
`;

fs.writeFileSync('Clone-trybronoir/sections/bronoir-reviews.liquid', liquidContent, 'utf8');
console.log('Successfully wrote dynamic bronoir-reviews.liquid');
