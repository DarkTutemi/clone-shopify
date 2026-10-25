import fs from 'fs';
import path from 'path';

const SRC_THEME = 'sample-theme-2.0';
const DEST_THEME = 'Clone-sakerplus/theme';

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function main() {
  console.log('Setting up Clone-sakerplus/theme...');
  copyDirSync(SRC_THEME, DEST_THEME);
  console.log('✔ Base theme copied cleanly from sample-theme-2.0');

  // Copy custom sections into Clone-sakerplus/theme/sections/
  const customSections = [
    'sections/fence-post-advertorial.liquid',
    'sections/saker-homepage-hero.liquid',
    'sections/saker-trust-badges.liquid',
    'sections/saker-reviews-widget.liquid'
  ];

  // Also write the updated templates/product.json and index.json
  const productJson = {
    sections: {
      main: {
        type: "main-product",
        settings: {
          show_vendor: true,
          show_sku: false,
          show_tax_note: false
        }
      },
      reviews: {
        type: "saker-reviews-widget",
        settings: {}
      },
      related: {
        type: "related-products",
        settings: {}
      }
    },
    order: [
      "main",
      "reviews",
      "related"
    ]
  };

  const indexJson = {
    sections: {
      hero: {
        type: "saker-homepage-hero",
        settings: {}
      },
      featured_collection: {
        type: "featured-collection",
        settings: {
          title: "Popular Best Sellers",
          heading_size: "h2",
          products_to_show: 8,
          columns_desktop: 4,
          columns_mobile: "2"
        }
      },
      trust_badges: {
        type: "saker-trust-badges",
        settings: {}
      },
      reviews: {
        type: "saker-reviews-widget",
        settings: {}
      }
    },
    order: [
      "hero",
      "featured_collection",
      "trust_badges",
      "reviews"
    ]
  };

  fs.writeFileSync(path.join(DEST_THEME, 'templates/product.json'), JSON.stringify(productJson, null, 2));
  fs.writeFileSync(path.join(DEST_THEME, 'templates/index.json'), JSON.stringify(indexJson, null, 2));
  fs.writeFileSync(path.join(DEST_THEME, 'templates/page.fence-funnel.liquid'), `{% section 'fence-post-advertorial' %}`);

  console.log('✔ Sakerplus theme files configured in Clone-sakerplus/theme');
}

main();
