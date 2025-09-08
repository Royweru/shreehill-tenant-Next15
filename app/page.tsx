'use client'
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  CreditCard, 
  Wrench, 
  Bell, 
  User, 
  ArrowRight, 
  Shield, 
  Smartphone, 
  Clock,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const ShreehillLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Instant Payments",
      description: "Pay rent seamlessly with M-Pesa integration. Quick, secure, and hassle-free."
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Maintenance Requests",
      description: "Report issues instantly with photo attachments. Track progress in real-time."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Notifications",
      description: "Stay updated with property announcements, payment reminders, and updates."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy controls."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Wanjiku",
      unit: "Garden View Apartments, Unit 2B",
      content: "Shreehill has completely transformed my renting experience. Paying rent is now as easy as sending a text message!",
      rating: 5
    },
    {
      name: "James Kimani",
      unit: "Riverside Heights, Unit 4A",
      content: "The maintenance request system is incredible. I reported a plumbing issue and it was fixed within 24 hours.",
      rating: 5
    },
    {
      name: "Grace Achieng",
      unit: "Sunset Towers, Unit 1C",
      content: "I love receiving updates about property improvements. It makes me feel valued as a tenant.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream font-body">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-elegant border-b border-border' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-cream" />
              </div>
              <span className="text-xl font-heading font-bold text-brand-primary">
                Shreehill
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-charcoal hover:text-brand-primary transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-charcoal hover:text-brand-primary transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-charcoal hover:text-brand-primary transition-colors">
                Contact
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-charcoal hover:text-brand-primary transition-colors font-medium">
                Sign In
              </button>
              <button className="bg-brand-primary text-cream px-6 py-2 rounded-lg hover:bg-trust-blue transition-colors font-medium shadow-elegant">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-charcoal" />
              ) : (
                <Menu className="w-6 h-6 text-charcoal" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-border">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-charcoal hover:text-brand-primary transition-colors">
                Features
              </a>
              <a href="#testimonials" className="block text-charcoal hover:text-brand-primary transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="block text-charcoal hover:text-brand-primary transition-colors">
                Contact
              </a>
              <div className="pt-4 border-t border-border space-y-3">
                <button className="block w-full text-left text-charcoal hover:text-brand-primary transition-colors font-medium">
                  Sign In
                </button>
                <button className="block w-full bg-brand-primary text-cream px-6 py-3 rounded-lg hover:bg-trust-blue transition-colors font-medium text-center">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-brand-secondary/20 text-brand-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4" />
                  <span>Trusted by 500+ Happy Tenants</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-heading font-bold text-charcoal leading-tight">
                  Your Home,
                  <br />
                  <span className="text-brand-primary">Simplified</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Experience premium property living with seamless rent payments, instant maintenance requests, and real-time updates—all in one elegant platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-brand text-cream px-8 py-4 rounded-xl font-semibold text-lg shadow-elegant-hover hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>Access Your Portal</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-primary hover:text-cream transition-all duration-300">
                  Create Account
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Instant M-Pesa Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-primary/10 to-trust-blue/10 rounded-3xl p-8 shadow-elegant-hover">
                <div className="bg-white rounded-2xl p-6 shadow-elegant">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading font-semibold text-lg text-charcoal">Tenant Dashboard</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-warm/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Next Payment</span>
                        <span className="text-sm font-medium text-brand-primary">Due in 5 days</span>
                      </div>
                      <div className="text-2xl font-bold text-charcoal">KES 45,000</div>
                      <button className="mt-3 bg-brand-primary text-cream px-4 py-2 rounded-lg text-sm font-medium w-full">
                        Pay Now
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <Wrench className="w-5 h-5 text-brand-primary mx-auto mb-1" />
                        <div className="text-xs text-gray-600">Maintenance</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <Bell className="w-5 h-5 text-brand-primary mx-auto mb-1" />
                        <div className="text-xs text-gray-600">Notifications</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <User className="w-5 h-5 text-brand-primary mx-auto mb-1" />
                        <div className="text-xs text-gray-600">Profile</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-full p-4 shadow-elegant">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-full p-4 shadow-elegant">
                <Smartphone className="w-8 h-8 text-brand-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-charcoal mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Shreehill transforms your rental experience with powerful tools designed for modern living.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-elegant hover:shadow-elegant-hover transition-all duration-300 border border-gray-100 group-hover:border-brand-primary/20">
                  <div className="bg-gradient-brand rounded-xl p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-cream">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-charcoal mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cream mb-2">500+</div>
              <div className="text-cream/80">Happy Tenants</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cream mb-2">98%</div>
              <div className="text-cream/80">Payment Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cream mb-2">24hrs</div>
              <div className="text-cream/80">Avg. Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cream mb-2">4.9★</div>
              <div className="text-cream/80">Tenant Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-cream/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-charcoal mb-4">
              What Our Tenants Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real people who call Shreehill home
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-elegant hover:shadow-elegant-hover transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-charcoal">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-heading font-bold text-charcoal mb-6">
            Ready to Transform Your Rental Experience?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of satisfied tenants who've already made the switch to smarter living.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-gradient-brand text-cream px-8 py-4 rounded-xl font-semibold text-lg shadow-elegant-hover hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2">
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-primary hover:text-cream transition-all duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-cream" />
                </div>
                <span className="text-xl font-heading font-bold">Shreehill</span>
              </div>
              <p className="text-cream/70">
                Premium property management for modern living in Nairobi.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-cream/70">
                <li><a href="#" className="hover:text-cream transition-colors">Tenant Portal</a></li>
                <li><a href="#" className="hover:text-cream transition-colors">Payment Guide</a></li>
                <li><a href="#" className="hover:text-cream transition-colors">Maintenance</a></li>
                <li><a href="#" className="hover:text-cream transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-cream/70">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+254 700 000 000</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@shreehill.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Nairobi, Kenya</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <p className="text-cream/70 mb-4">
                Stay connected for updates and property news.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/ShreeHillEstates/" target="_blank" rel="noopener noreferrer" className="text-cream/70 hover:text-cream transition-colors">
                  Facebook
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-cream/20 mt-12 pt-8 text-center text-cream/70">
            <p>&copy; 2024 Shreehill Estates. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShreehillLanding;