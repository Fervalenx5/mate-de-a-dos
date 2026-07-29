'use server';

import * as cheerio from 'cheerio';

export async function scrapeProduct(url: string) {
  try {
    // Basic validation
    if (!url || !url.startsWith('http')) {
      return { error: 'URL inválida' };
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return { error: 'No se pudo acceder a la página' };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract Title
    const title = $('h1.product_title').text().trim();
    if (!title) {
      return { error: 'No se pudo encontrar el título del producto. ¿Estás seguro que es un link de producto válido?' };
    }

    // Extract Price (WooCommerce structure usually puts price inside .price)
    let priceText = $('p.price ins .amount bdi').text().trim();
    if (!priceText) {
      priceText = $('p.price .amount bdi').text().trim();
    }
    
    // Clean price string (remove $, spaces, dots, change comma to dot for parsing)
    // E.g. "$ 1.500,00" -> "1500.00"
    const cleanedPrice = priceText.replace(/[^\d,-]/g, '').replace(/\./g, '').replace(',', '.');
    const originalPrice = parseFloat(cleanedPrice);

    if (isNaN(originalPrice) || originalPrice === 0) {
      return { error: 'No se pudo extraer el precio original' };
    }

    // Extract main image
    let imageUrl = $('.woocommerce-product-gallery__image a').attr('href');
    if (!imageUrl) {
      imageUrl = $('.woocommerce-product-gallery__image img').attr('src');
    }
    if (!imageUrl) {
      imageUrl = $('.wp-post-image').attr('src');
    }

    // Extract Description (short or long)
    let description = $('.woocommerce-product-details__short-description').text().trim();
    if (!description) {
      description = $('#tab-description').text().trim();
    }

    return {
      success: true,
      data: {
        title,
        originalPrice,
        imageUrl,
        description
      }
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return { error: 'Hubo un error al intentar extraer los datos' };
  }
}
