import BasePage from './base-page';

class TechStore extends BasePage {
    onReady() {
        this.initTechAnimations();
        this.initProductComparison();
        this.initPerformanceBadges();
        this.initGlassEffects();
    }

    initTechAnimations() {
        if (!document.body.classList.contains('animations-enabled')) return;

        // Stagger animation for tech cards
        const techCards = document.querySelectorAll('.tech-categories__card, .gaming-setup__card');
        
        if (techCards.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });
            }, { threshold: 0.1 });

            techCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                observer.observe(card);
            });
        }

        // Parallax effect for hero section
        this.initParallaxEffect();
    }

    initParallaxEffect() {
        const heroElements = document.querySelectorAll('[data-parallax]');
        
        if (heroElements.length) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                heroElements.forEach(element => {
                    const speed = element.dataset.parallax || 0.5;
                    element.style.transform = `translateY(${rate * speed}px)`;
                });
            });
        }
    }

    initProductComparison() {
        const compareButtons = document.querySelectorAll('.btn--compare');
        const comparisonPanel = document.querySelector('#comparison-panel');
        let comparedProducts = JSON.parse(localStorage.getItem('compared_products') || '[]');

        compareButtons.forEach(button => {
            const productId = button.dataset.productId;
            
            // Update button state based on stored comparison
            if (comparedProducts.includes(productId)) {
                button.classList.add('active');
                button.innerHTML = '<i class="sicon-check"></i> مُضاف للمقارنة';
            }

            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleProductComparison(productId, button);
            });
        });

        this.updateComparisonCounter();
    }

    toggleProductComparison(productId, button) {
        let comparedProducts = JSON.parse(localStorage.getItem('compared_products') || '[]');
        
        if (comparedProducts.includes(productId)) {
            // Remove from comparison
            comparedProducts = comparedProducts.filter(id => id !== productId);
            button.classList.remove('active');
            button.innerHTML = '<i class="sicon-compare"></i> مقارنة';
            
            this.showNotification('تم إزالة المنتج من المقارنة', 'info');
        } else {
            // Add to comparison (max 4 products)
            if (comparedProducts.length >= 4) {
                this.showNotification('يمكنك مقارنة 4 منتجات كحد أقصى', 'warning');
                return;
            }
            
            comparedProducts.push(productId);
            button.classList.add('active');
            button.innerHTML = '<i class="sicon-check"></i> مُضاف للمقارنة';
            
            this.showNotification('تم إضافة المنتج للمقارنة', 'success');
        }
        
        localStorage.setItem('compared_products', JSON.stringify(comparedProducts));
        this.updateComparisonCounter();
    }

    updateComparisonCounter() {
        const comparedProducts = JSON.parse(localStorage.getItem('compared_products') || '[]');
        const counter = document.querySelector('#comparison-counter');
        
        if (counter) {
            counter.textContent = comparedProducts.length;
            counter.style.display = comparedProducts.length > 0 ? 'block' : 'none';
        }
    }

    initPerformanceBadges() {
        const products = document.querySelectorAll('[data-product-type]');
        
        products.forEach(product => {
            const type = product.dataset.productType;
            const badgeContainer = product.querySelector('.performance-badge-container');
            
            if (badgeContainer && type) {
                const badge = this.createPerformanceBadge(type);
                if (badge) {
                    badgeContainer.appendChild(badge);
                }
            }
        });
    }

    createPerformanceBadge(type) {
        const badges = {
            'gaming': {
                text: 'Gaming',
                class: 'performance-badge--gaming',
                icon: 'sicon-game-controller'
            },
            'professional': {
                text: 'Pro',
                class: 'performance-badge--professional',
                icon: 'sicon-briefcase'
            },
            'budget': {
                text: 'Budget',
                class: 'performance-badge--budget',
                icon: 'sicon-dollar'
            },
            'premium': {
                text: 'Premium',
                class: 'performance-badge--premium',
                icon: 'sicon-crown'
            }
        };

        const badgeConfig = badges[type];
        if (!badgeConfig) return null;

        const badge = document.createElement('span');
        badge.className = `performance-badge ${badgeConfig.class}`;
        badge.innerHTML = `
            <i class="${badgeConfig.icon}"></i>
            <span>${badgeConfig.text}</span>
        `;

        return badge;
    }

    initGlassEffects() {
        if (!document.body.classList.contains('glass-effects-enabled')) return;

        // Add glass effect to cards on scroll
        const cards = document.querySelectorAll('.s-product-card-entry, .product-entry');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('glass-card');
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => observer.observe(card));
    }

    showNotification(message, type = 'info') {
        // Use Salla's notification system
        const iconMap = {
            'success': 'success',
            'warning': 'warning', 
            'info': 'info',
            'error': 'error'
        };

        salla.notify[type] ? salla.notify[type](message) : salla.notify.info(message);
    }

    registerEvents() {
        // Tech-specific search filters
        this.initTechFilters();
        
        // Advanced product interactions
        this.initAdvancedProductFeatures();
    }

    initTechFilters() {
        const filterButtons = document.querySelectorAll('.tech-filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filterType = button.dataset.filter;
                const filterValue = button.dataset.value;
                
                this.applyTechFilter(filterType, filterValue);
            });
        });
    }

    applyTechFilter(type, value) {
        // Implementation for applying tech-specific filters
        const productsList = document.querySelector('salla-products-list');
        if (productsList) {
            const currentFilters = JSON.parse(productsList.getAttribute('filters') || '{}');
            currentFilters[type] = value;
            productsList.setAttribute('filters', JSON.stringify(currentFilters));
            productsList.reload();
        }
    }

    initAdvancedProductFeatures() {
        // 360-degree product view
        this.init360ProductView();
        
        // Tech specs modal
        this.initTechSpecsModal();
    }

    init360ProductView() {
        const view360Buttons = document.querySelectorAll('.btn--360-view');
        
        view360Buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.dataset.productId;
                this.open360View(productId);
            });
        });
    }

    open360View(productId) {
        // Implementation for 360-degree product view
        console.log('Opening 360 view for product:', productId);
        // This would integrate with a 360-degree viewer library
    }

    initTechSpecsModal() {
        const specsButtons = document.querySelectorAll('.btn--tech-specs');
        
        specsButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.dataset.productId;
                this.openTechSpecsModal(productId);
            });
        });
    }

    openTechSpecsModal(productId) {
        // Implementation for tech specs modal
        console.log('Opening tech specs for product:', productId);
        // This would fetch and display detailed technical specifications
    }
}

TechStore.initiateWhenReady();