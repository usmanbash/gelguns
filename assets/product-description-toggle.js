(function() {
  'use strict';

  function initProductDescriptionToggle() {
    const descriptions = document.querySelectorAll('.product__description[data-description]');
    
    descriptions.forEach((description) => {
      const fullContent = description.querySelector('.product-description__full');
      const shortContent = description.querySelector('.product-description__short-content');
      const shortContainer = description.querySelector('.product-description__short');
      const toggleLinks = description.querySelectorAll('.product-description__toggle');
      
      if (!fullContent || !shortContent) return;
      
      // Get the full HTML content (excluding the toggle link)
      const toggleInFull = fullContent.querySelector('.product-description__toggle');
      const fullHTMLClone = fullContent.cloneNode(true);
      const toggleClone = fullHTMLClone.querySelector('.product-description__toggle');
      if (toggleClone) {
        toggleClone.remove();
      }
      const fullHTML = fullHTMLClone.innerHTML;
      const fullText = fullHTMLClone.textContent.trim();
      
      // Set up truncation
      const maxLength = 150; // Characters to show before "read more"
      
      if (fullText.length > maxLength) {
        // Find a good break point (end of sentence or word)
        let breakPoint = maxLength;
        const lastPeriod = fullText.lastIndexOf('.', maxLength);
        const lastSpace = fullText.lastIndexOf(' ', maxLength);
        
        if (lastPeriod > maxLength * 0.7) {
          breakPoint = lastPeriod + 1;
        } else if (lastSpace > maxLength * 0.7) {
          breakPoint = lastSpace;
        }
        
        // Create truncated version
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullHTML;
        
        // Try to truncate the first paragraph
        const firstParagraph = tempDiv.querySelector('p:first-of-type');
        if (firstParagraph) {
          const paragraphText = firstParagraph.textContent;
          if (paragraphText.length > breakPoint) {
            const truncatedText = paragraphText.substring(0, breakPoint).trim();
            firstParagraph.textContent = truncatedText + '...';
            // Remove all other elements after first paragraph
            const allElements = Array.from(tempDiv.children);
            allElements.forEach((el, index) => {
              if (index > 0) el.remove();
            });
          }
        } else {
          // No paragraph, truncate text content
          const textContent = tempDiv.textContent;
          if (textContent.length > breakPoint) {
            tempDiv.textContent = textContent.substring(0, breakPoint).trim() + '...';
          }
        }
        
        shortContent.innerHTML = tempDiv.innerHTML;
        shortContainer.style.display = 'block';
        fullContent.style.display = 'none';
        
        // Set initial toggle text
        toggleLinks.forEach((link) => {
          link.textContent = link.getAttribute('data-more-text');
        });
        
        // Set up toggle handlers
        toggleLinks.forEach((link) => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDescription(description);
          });
        });
      } else {
        // Description is short enough, show full version only
        shortContainer.style.display = 'none';
        fullContent.style.display = 'block';
        toggleLinks.forEach(link => link.style.display = 'none');
      }
    });
  }

  function toggleDescription(description) {
    const shortContainer = description.querySelector('.product-description__short');
    const fullContainer = description.querySelector('.product-description__full');
    const toggleLinks = description.querySelectorAll('.product-description__toggle');
    
    const isExpanded = fullContainer.style.display !== 'none';
    
    if (isExpanded) {
      // Collapse
      shortContainer.style.display = 'block';
      fullContainer.style.display = 'none';
      toggleLinks.forEach((link) => {
        link.textContent = link.getAttribute('data-more-text');
      });
    } else {
      // Expand
      shortContainer.style.display = 'none';
      fullContainer.style.display = 'block';
      toggleLinks.forEach((link) => {
        link.textContent = link.getAttribute('data-less-text');
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductDescriptionToggle);
  } else {
    initProductDescriptionToggle();
  }
})();

