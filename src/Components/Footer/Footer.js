import React, { useState } from 'react';

import './Footer.css';

function Footer() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const sectionDescriptions = {
    'Furniture': 'Discover pre-loved furniture that brings character and sustainability to your home. From vintage chairs to modern tables, give quality pieces a second life while reducing environmental waste.',
    'Clothing': 'Shop sustainable fashion with our curated collection of second-hand clothing and accessories. Reduce textile waste while finding unique, affordable styles that express your personality and values.',
    'Electronics': 'Find reliable pre-owned electronics that extend device lifespans and reduce e-waste. From smartphones to laptops, discover quality tech at affordable prices while supporting the circular economy.',
    'Books': 'Explore a vast collection of pre-owned books that promote knowledge sharing and reduce paper waste. Find your next great read while giving books a second chance to inspire new readers.',
    'Our Mission': 'We\'re building a sustainable future through conscious consumption and waste reduction. Every transaction on our platform contributes to a circular economy that benefits both people and the planet.',
    'Careers': 'Join our mission-driven team working to revolutionize how people buy and sell second-hand goods. Help us build innovative solutions that make sustainable living accessible and rewarding for everyone.',
    'Contact Us': 'Get in touch with our dedicated support team for any questions or assistance you need. We\'re here to help you make the most of your sustainable shopping and selling experience.',
    'Eco Impact': 'Track your environmental footprint with detailed impact reports on every purchase and sale. See how your choices contribute to waste reduction, carbon footprint reduction, and resource conservation.',
    'Help Center': 'Access comprehensive guides, FAQs, and tutorials to maximize your Echo-Finds experience. Find answers to common questions about buying, selling, and our eco-friendly marketplace features.',
    'Eco Guidelines': 'Learn about our sustainability standards and best practices for eco-conscious trading. Discover how to maximize your environmental impact while buying and selling responsibly on our platform.',
    'Privacy Policy': 'We protect your personal information with industry-leading security measures and transparent data practices. Your privacy matters to us, and we\'re committed to keeping your data safe and secure.',
    'Terms of Service': 'Understand your rights and responsibilities when using our eco-friendly marketplace platform. Our terms ensure fair, transparent, and sustainable trading practices for all community members.'
  };

  return (
    <div className="footerParentDiv">
      <div className="content">
        <div>
          <div className="heading">
            <p>ECO CATEGORIES</p>
          </div>
          <div className="list">
            <ul>
              <li 
                onMouseEnter={() => setHoveredItem('Furniture')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Furniture
              </li>
              <li 
                onMouseEnter={() => setHoveredItem('Clothing')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Clothing
              </li>
              <li 
                onMouseEnter={() => setHoveredItem('Electronics')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Electronics
              </li>
              <li 
                onMouseEnter={() => setHoveredItem('Books')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Books
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="heading">
            <p>ABOUT ECOFINDS</p>
          </div>
          <div className="list">
            <ul>
              <li 
                onMouseEnter={() => setHoveredItem('Our Mission')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Our Mission
              </li>
              <li 
                onMouseEnter={() => setHoveredItem('Careers')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Careers
              </li>
              <li 
                onMouseEnter={() => setHoveredItem('Contact Us')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Contact Us
              </li>
              <li 
                onMouseEnter={() => setHoveredItem('Eco Impact')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Eco Impact
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="heading">
            <p>SUSTAINABILITY</p>
          </div>
          <div className="list">
            <ul>
              <li 
                onMouseEnter={() => setHoveredItem('Help Center')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Help Center
              </li>
              <li 
                onMouseEnter={() => setHoveredItem('Eco Guidelines')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Eco Guidelines
              </li>
              <li 
                onMouseEnter={() => setHoveredItem('Privacy Policy')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Privacy Policy
              </li>
              <li 
                onMouseEnter={() => setHoveredItem('Terms of Service')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                Terms of Service
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {hoveredItem && (
        <div className="description-tooltip">
          <h4>{hoveredItem}</h4>
          <p>{sectionDescriptions[hoveredItem]}</p>
        </div>
      )}
      
      <div className="footer">
        <p>🌱 Join the sustainable shopping revolution worldwide</p>
        <p>EcoFinds - Sustainable Marketplace. © 2024 EcoFinds. Making the world greener, one purchase at a time.</p>
      </div>
    </div>
  );
}

export default Footer;
